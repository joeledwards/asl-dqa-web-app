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

sys.path.insert(0, "/dataq/bin/")
import Database

queries = {
    "dates" : """
SELECT fnsclGetDates()
""",
    "channelgrid" : """
SELECT fnsclGetChannelData(%s, %s, %s, %s)
""",
    "stationgrid" : """
SELECT fnsclGetStationData(%s, %s, %s, %s)
""",
    "stationplot" : """
SELECT fnsclGetStationPlotData(%s, %s, %s, %s)
""",
    "channelplot" : """
SELECT fnsclGetChannelPlotData(%s, %s, %s, %s)
""",
    "stations" : """
SELECT fnsclGetStations()
""",
    "channels" : """
SELECT fnsclGetChannels(%s)
""",
    "metrics" : """
SELECT fnsclGetMetrics()
""",
    "groups" : """
SELECT fnsclGetGroups()
""",
    "grouptypes" : """
SELECT fnsclGetGroupTypes()
"""
}

#database_conString = 'localhost,dev,asldev,dataq_dev,5433'
database_conString = '136.177.121.210,dev,asldev,dataq_dev,5432'
database = Database.Database(database_conString)

def error(message=None):
    if message is None:
        print "ERROR"
    else:
        print "ERROR:", message
    sys.exit(0)

print "Content-Type: text/plain"
print ""

form = cgi.FieldStorage()
if "cmd" not in form:
    error("No command string supplied")
cmd_str = form["cmd"].value
if len(cmd_str) < 1:
    error("No command string provided")
cmd_parts = map(str.lower, cmd_str.split('_'))

if "param" in form:
    param_str = form["param"].value
    if len(param_str) < 1:
        error("No parameters provided")
    parts = []
    i = 0
    for part in param_str.split('_')[0:]:

        parts = part.split('.')
        i=i+1
        if parts[0].lower() == "dates":
            startDate = parts[1]
            endDate = parts[2]
        elif parts[0].lower() == "station":
            stationID = parts[1]
            stationIDs = "{"+ parts[1].replace("-", ",")+"}"   
        elif parts[0].lower() == "channel":
            channelID = parts[1]
            channelIDs = "{"+ parts[1].replace("-", ",")+"}"
        elif parts[0].lower() == "metric":
            metricID = parts[1]
        else:
            error("Improper command string:" + parts[0])
    #Parameter based queries
    if "stationgrid" in cmd_parts:
        db_args = (stationIDs, metricID, startDate, endDate)
        print database.select(queries['stationgrid'], db_args)[0][0]
    if "channelgrid" in cmd_parts:
        db_args = (channelIDs, metricID, startDate, endDate)
        print database.select(queries['channelgrid'], db_args)[0][0]
    if "stationplot" in cmd_parts:
        db_args = (stationID, metricID, startDate, endDate)
        print database.select(queries['stationplot'], (db_args))[0][0]
    if "channelplot" in cmd_parts:
        db_args = (channelID, metricID, startDate, endDate)
        print database.select(queries['channelplot'], (db_args))[0][0]
    if "channels" in cmd_parts:
        db_args = (stationIDs,)
        print database.select(queries['channels'], (db_args))[0][0]
if "dates" in cmd_parts:
    print database.select(queries['dates'])[0][0]
if "stations" in cmd_parts:
    print database.select(queries['stations'])[0][0]
if "metrics" in cmd_parts:
    print database.select(queries['metrics'])[0][0]
if "groups" in cmd_parts: #Changing the order of the below prints will affect js/dataq.js population of ddlGroups
    print database.select(queries['grouptypes'])[0][0]
    print database.select(queries['groups'])[0][0]
