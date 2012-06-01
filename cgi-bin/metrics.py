#!/usr/bin/env python
import base64
import calendar
import os
import re
import resource
import shutil
import stat
import sys
import time
from datetime import datetime
import cgi
import cgitb
cgitb.enable()

sys.path.insert(0, "/home/jholland/dev/asl/pytools")
import MetricDatabase

queries = {
    "dates" : """
    SELECT DISTINCT year, month FROM Metrics
UNION
    SELECT DISTINCT year, month FROM Calibrations
ORDER BY year, month
    """,
    "all" : """
    SELECT  Station.network             AS m_network,
            Station.name                AS m_station,
            Metrics.category            AS m_category,
            Metrics.key                 AS m_key,
            COUNT(distinct Metrics.day) AS m_days,
            COUNT(distinct Channel.id)  AS m_channels,
            SUM(Metrics.value)          AS m_value
    FROM Metrics
    INNER JOIN Channel
       ON Channel.id = Metrics.channel_id
    INNER JOIN Sensor
       ON Sensor.id = Channel.sensor_id
    INNER JOIN Station
       ON Station.id = Sensor.station_id
    WHERE  Metrics.year    = %s
      AND  Metrics.month   = %s
      AND  Station.network != 'XX'
      AND NOT Sensor.location LIKE '9%%'
      AND NOT Channel.name LIKE 'VM%%'
      AND NOT Channel.name LIKE 'HN%%'
      AND NOT Channel.name LIKE 'EH%%'
      AND ( NOT Channel.name LIKE 'HH%%'    
            OR  Sensor.location = '85')
    GROUP BY  Station.network,
              Station.name,
              Metrics.category,
              Metrics.key

UNION

    SELECT  Station.network AS m_network,
            Station.name    AS m_station,
            "calibration"   AS m_category,
            "last-cal"      AS m_key,
            1               AS m_days,
            1               AS m_channels,
            (Calibrations.date - Calibrations.cal_date) AS  m_value
    FROM Calibrations
    INNER JOIN Channel
       ON Channel.id = Calibrations.channel_id
    INNER JOIN Sensor
       ON Sensor.id = Channel.sensor_id
    INNER JOIN Station
       ON Station.id = Sensor.station_id
    WHERE Calibrations.id
    IN (
        SELECT cal_id
        FROM
            (
            SELECT  Station.network,
                    Station.name,
                    Calibrations.date,
                    Calibrations.id AS cal_id,
                    MAX(Calibrations.cal_date)
            FROM Calibrations
            INNER JOIN Channel
               ON Channel.id = Calibrations.channel_id
            INNER JOIN Sensor
               ON Sensor.id = Channel.sensor_id
            INNER JOIN Station
               ON Station.id = Sensor.station_id
            WHERE   Calibrations.year     = %s
              AND   Calibrations.month    = %s
              AND   Station.network != 'XX'
            GROUP BY  Station.network,
                      Station.name,
                      Calibrations.date
            ) AS cal2
        )

UNION

    SELECT  Station.network  AS m_network,
            Station.name     AS m_station,
            "calibration"    AS m_category,
            Calibrations.key AS m_key,
            1                AS m_days,
            1                AS m_channels,
            avg(Calibrations.value) AS m_value
    FROM Station 
    INNER JOIN Sensor
        ON Station.id = Sensor.station_id
    INNER JOIN Channel
        ON Sensor.id = Channel.sensor_id
    INNER JOIN Calibrations
        ON Channel.id = Calibrations.channel_id
    WHERE  Calibrations.year  = %s
      AND  Calibrations.month = %s
      AND  Station.network != 'XX'
      AND  ( Calibrations.key = 'mean-corner-amp-error' OR
             Calibrations.key = 'mean-flat-amp-error' )
    GROUP BY Station.network,
             Station.name,
             Calibrations.key

ORDER BY  m_network,
          m_station,
          m_category,
          m_key
    """,
    "station" : """
    SELECT  Sensor.location     AS m_location,
            Channel.name        AS m_channel,
            Metrics.category    AS m_category,
            Metrics.key         AS m_key,
            count(distinct Metrics.day) AS m_days,
            1                   AS m_channels,
            sum(Metrics.value)  AS m_value
    FROM Metrics
    INNER JOIN Channel
       ON Channel.id = Metrics.channel_id
    INNER JOIN Sensor
       ON Sensor.id = Channel.sensor_id
    INNER JOIN Station
       ON Station.id = Sensor.station_id
    WHERE   Station.network = %s
      AND   Station.name    = %s
      AND   Metrics.year    = %s
      AND   Metrics.month   = %s
    GROUP BY    Station.network,
                Station.name,
                Sensor.location,
                Channel.name,
                Metrics.category,
                Metrics.key

UNION

    SELECT  Sensor.location AS m_location,
            Channel.name    AS m_channel,
            "calibration"   AS m_category,
            "last-cal"      AS m_key,
            1               AS m_days,
            1               AS m_channels,
            (Calibrations.date - Calibrations.cal_date) AS m_value
    FROM Station 
    INNER JOIN Sensor
        ON Station.id = Sensor.station_id
    INNER JOIN Channel
        ON Sensor.id = Channel.sensor_id
    INNER JOIN Calibrations
        ON Channel.id = Calibrations.channel_id
    WHERE Calibrations.id
    IN (
        SELECT  cal_id 
        FROM (
            SELECT  Station.network,
                    Station.name,
                    Calibrations.date,
                    Calibrations.id AS cal_id,
                    MAX(Calibrations.cal_date)
            FROM Calibrations
            INNER JOIN Channel
                ON Channel.id = Calibrations.channel_id
            INNER JOIN Sensor
                ON Sensor.id = Channel.sensor_id
            INNER JOIN Station
                ON Station.id = Sensor.station_id
            WHERE  Station.network    = %s
              AND  Station.name       = %s
              AND  Calibrations.year  = %s
              AND  Calibrations.month = %s
            GROUP BY Station.network,
                     Station.name,
                     Sensor.location,
                     Channel.name,
                     Calibrations.date
            ) AS cal3
        )

UNION

    SELECT  Sensor.location  AS m_network,
            Channel.name     AS m_channel,
            "calibration"    AS m_category,
            Calibrations.key AS m_key,
            1                AS m_days,
            1                AS m_channels,
            avg(Calibrations.value) AS m_value
    FROM Station 
    INNER JOIN Sensor
        ON Station.id = Sensor.station_id
    INNER JOIN Channel
        ON Sensor.id = Channel.sensor_id
    INNER JOIN Calibrations
        ON Channel.id = Calibrations.channel_id
    WHERE  Station.network    = %s
      AND  Station.name       = %s
      AND  Calibrations.year  = %s
      AND  Calibrations.month = %s
      AND  ( Calibrations.key = 'mean-corner-amp-error' OR
             Calibrations.key = 'mean-flat-amp-error' )
    GROUP BY Station.network,
             Station.name,
             Sensor.location,
             Channel.name,
             Calibrations.key

ORDER BY  m_location,
          m_channel,
          m_category,
          m_key
    """,
    "plot-station" : """
SELECT  Metrics.year,
        Metrics.month,
        Metrics.day,
        Metrics.category,
        Metrics.key,
        count(distinct Channel.id),
        sum(Metrics.value)
FROM Metrics
INNER JOIN Channel
   ON Channel.id = Metrics.channel_id
INNER JOIN Sensor
   ON Sensor.id = Channel.sensor_id
INNER JOIN Station
   ON Station.id = Sensor.station_id
WHERE   Station.network = %s
  AND   Station.name    = %s
  AND   Metrics.year    = %s
  AND   Metrics.month   = %s
  AND   Metrics.category != 'calibration'
GROUP BY    Metrics.year,
            Metrics.month,
            Metrics.day,
            Metrics.category,
            Metrics.key
    """,
    "plot-channel" : """
SELECT  Metrics.year,
        Metrics.month,
        Metrics.day,
        Metrics.category,
        Metrics.key,
        Metrics.value
FROM Metrics
INNER JOIN Channel
   ON Channel.id = Metrics.channel_id
INNER JOIN Sensor
   ON Sensor.id = Channel.sensor_id
INNER JOIN Station
   ON Station.id = Sensor.station_id
WHERE   Station.network = %s
  AND   Station.name    = %s
  AND   Sensor.location = %s
  AND   Channel.name    = %s
  AND   Metrics.year    = %s
  AND   Metrics.month   = %s
    """,
}

metric_order = [
    ("SOH", "sample-rate"),
    ("SOH", "availability"),
    ("SOH", "gap-count"),
    ("SOH", "timing-quality"),
    ("coherence", "4-to-8"),
    ("coherence", "18-to-22"),
    ("coherence", "90-to-110"),
    ("coherence", "200-to-500"),
    ("power-difference", "4-to-8"),
    ("power-difference", "18-to-22"),
    ("power-difference", "90-to-110"),
    ("power-difference", "200-to-500"),
    ("noise", "4-to-8"),
    ("noise", "18-to-22"),
    ("noise", "90-to-110"),
    ("noise", "200-to-500"),
    ("calibration", "last-cal"),
    ("calibration", "mean-corner-amp-error"),
    ("calibration", "mean-flat-amp-error"),
]

plot_order = [
    ("SOH", "sample-rate"),
    ("SOH", "availability"),
    ("SOH", "gap-count"),
    ("SOH", "timing-quality"),
    ("coherence", "4-to-8"),
    ("coherence", "18-to-22"),
    ("coherence", "90-to-110"),
    ("coherence", "200-to-500"),
    ("power-difference", "4-to-8"),
    ("power-difference", "18-to-22"),
    ("power-difference", "90-to-110"),
    ("power-difference", "200-to-500"),
    ("noise", "4-to-8"),
    ("noise", "18-to-22"),
    ("noise", "90-to-110"),
    ("noise", "200-to-500"),
]

def format_dates(values):
    record = ""
    for parts in values:
        if len(parts) != 2:
            continue
        record += "%s,%s\n" % tuple(map(str, parts))
    return record

def format_plot_values(values):
    record = ""
    metric_db = {}
    for line in values:
        category = line[3]
        key = line[4]
        line_key = line[3:5]
        date = line[0:3]
        divider = None
        if len(line) == 7:
            divider = float(line[5])
            temp_value = float(line[6])
        else:
            try:
                temp_value = float(line[5])
            except ValueError, e:
                continue
        if not metric_db.has_key(line_key):
            metric_db[line_key] = {}
        if category == "SOH":
            if key == "sample-rate":
                continue
            elif key in ("availability", "timing-quality"):
                if divider is not None:
                    value = temp_value / divider
                else:
                    value = temp_value
            else:
                value = temp_value
        else:
            value = temp_value
        metric_db[line_key][date] = value

    for line_key in plot_order:
        if not metric_db.has_key(line_key):
            continue
        line = metric_db[line_key]
        for key in sorted(line.keys()):
            line_str = ",".join(line_key)
            line_str += ","
            value = line[key]
            line_str += ",".join(map(str,key))
            line_str += ","
            line_str += str(value)
            record += line_str + "\n"

    return record


def format_metrics(metrics):
    record = ""
    metric_db = {}
    for line in metrics:
        #if line is None:
        #    continue
        #print ','.join(map(str, line))
        #continue

        line_key = (line[0], line[1])
        category = line[2]
        key = line[3]

        if not metric_db.has_key(line_key):
            metric_db[line_key] = {}
        if category == "SOH":
            if key == "sample-rate":
                value = float(line[6]) / float(line[4]);
            elif key in ("availability", "timing-quality"):
                value = float(line[6]) / float(line[5]) / float(line[4])
            else:
                value = float(line[6])
        elif category == "calibration":
            value = float(line[6])
        else:
            value = float(line[6]) / float(line[5]) / float(line[4])
        metric_db[line_key][(category,key)] = value
    #return

    for line_key in sorted(metric_db.keys()):
        line_str = line_key[0] + "," + line_key[1]
        line = metric_db[line_key]
        for key in metric_order:
            if line.has_key(key):
                line_str += "," + str(line[key])
            else:
                line_str += ",NaN"
        record += line_str + "\n"
    return record

def error(message=None):
    if message is None:
        print "ERROR"
    else:
        print "ERROR:", message
    sys.exit(0)

def file_m_time(file):
    return int(os.stat(file).st_mtime)

cgi_path  = "/dataq/cgi-bin/metrics.py"
cache_dir = "/dataq/metrics/cache"
def get_cached(cmd):
    record = None
    cache_path = cache_dir + "/" + cmd + ".cache"
    try:
        fh = open(cache_path, 'r')
        cache = {}
        for line in fh:
            key,value = map(lambda s: s.strip(), line.split(':',1))
            cache[key] = value
        contents = fh.read()
        db_path = cache['Database-Path']
        db_time = int(cache['Database-Timestamp'])
        cgi_path = cache['CGI-Path']
        cgi_time = int(cache['CGI-Timestamp'])
        if (db_time  == file_m_time(db_path) ) and \
           (cgi_time == file_m_time(cgi_path)) and \
           cache.has_key('Record'):
            record = base64.standard_b64decode(cache['Record'])
    except Exception, e:
        #print "Exception:", str(e)
        pass
    return record

def cache(cmd, dbfile, record, timestamp):
    if record is None:
        return
    cache_path = cache_dir + "/" + cmd + ".cache"
    try:
        # prepare the file
        fh = open(cache_path, 'w+')
        mode = os.stat(cache_path)[stat.ST_MODE]
        mode |= stat.S_IRUSR | stat.S_IWUSR | stat.S_IXUSR
        mode |= stat.S_IRGRP | stat.S_IWGRP | stat.S_IXGRP
        mode |= stat.S_IROTH | stat.S_IWOTH | stat.S_IXOTH
        new_mode = stat.S_IMODE(mode)
        os.chmod(cache_path, new_mode)

        # build file contents
        contents  = "Database-Path: %s\n" % dbfile
        contents += "Database-Timestamp: %d\n" % timestamp
        contents += "CGI-Path: %s\n" % cgi_path
        contents += "CGI-Timestamp: %d\n" % file_m_time(cgi_path)
        contents += "Record: " + base64.standard_b64encode(record) + "\n"
        fh.write(contents)
        fh.close()
    except Exception, e:
        #print "Exception:", str(e)
        pass

print "Content-Type: text/plain"
print ""

form = cgi.FieldStorage()
if "cmd" not in form:
    error("no command string supplied")

cmd_str = form["cmd"].value
if len(cmd_str) < 1:
    error("empty command string")

record = None #get_cached(cmd_str)
if record is not None:
    print record
    sys.exit(0)

# This is the default for GSNSC meeting, so just in case...
year  = 2011
month = 8

cmd_parts = cmd_str.split('_')
parts = cmd_parts[0].split('.')
extensions = []
if len(cmd_parts) > 1:
    extensions = cmd_parts[1:]
for extension in extensions:
    if len(extension) < 1:
        error("bad extension format")
    pieces = extension.split('.')
    if pieces[0] == 'DATE':
        if len(pieces) != 3:
            error("bad date format")
        try:
            year  = int(pieces[1])
            month = int(pieces[2])
            if (year < 0) or (1 > month > 12):
                raise ValueError("bad year or month value")
        except:
            error("bad date values")

command = parts[0].lower()

database_conString = '10.1.10.3,dev,asldev,Metrics'
database = MetricDatabase.MetricDatabase(database_conString)
if command == "dates":
    start = time.time()
    timestamp = datetime.now()  #broken
    dates = database.select(queries['dates'])
    record = format_dates(dates)
    #cache(cmd_str, database_conString, record, timestamp) #broken
    end = time.time()
    print record
elif command == "all":
    start = time.time()
    timestamp = datetime.now()  #broken
    db_args = (year, month,
               year, month,
               year, month)
    metrics = database.select(queries['all'], db_args)
    record = format_metrics(metrics)
    #cache(cmd_str, database_file, record, timestamp) #broken
    end = time.time()
    #print "Summarize all stations"
    #print "  %d records" % len(metrics)
    #print "  took %f seconds" % (end - start,)
    print record
elif command == "station":
    if len(parts) < 3:
        error("no station specified for summary")
    network = parts[1]
    station = parts[2]
    start = time.time()
    timestamp = datetime.now()  #broken
    db_args = (network, station, year, month,
               network, station, year, month,
               network, station, year, month)
    metrics = database.select(queries['station'], db_args)
    record = format_metrics(metrics)
    #cache(cmd_str, database_file, record, timestamp) #broken
    end = time.time()
    #print "Summarize all channels for a station"
    #print "  %d records" % len(metrics)
    #print "  took %f seconds" % (end - start,)
    print record
elif command == "plot":
    if len(parts) < 2:
        error("no plot option specified")
    if len(parts) < 4:
        error("no source station specified for plot")
    sub_cmd = parts[1].lower()
    network = parts[2]
    station = parts[3]
    if sub_cmd == "station":
        start = time.time()
        timestamp = datetime.now()  #broken
        metrics = database.select(queries['plot-station'], (network, station, year, month))
        record = format_plot_values(metrics)
        #cache(cmd_str, database_file, record, timestamp)
        end = time.time()
        #print "Plot station metrics [%s_%s]" % (network,station)
        #print "  %d records" % len(metrics)
        #print "  took %f seconds" % (end - start,)
        print record
    elif sub_cmd == "channel":
        if len(parts) < 6:
            error("no source channel specified for plot")
        location = parts[4]
        channel = parts[5]

        start = time.time()
        timestamp = datetime.now()  #broken
        metrics = database.select(queries['plot-channel'], (network, station, location, channel, year, month))
        record = format_plot_values(metrics)
        #cache(cmd_str, database_file, record, timestamp)
        end = time.time()
        #print "Plot channel metrics [%s_%s %s-%s]" % (network,station,location,channel)
        #print "  %d records" % len(metrics)
        #print "  took %f seconds" % (end - start,)
        print record
    else:
        error("invalid plot option '%s'" % sub_cmd)
else:
    error("unrecognized command '%s'" % command)

