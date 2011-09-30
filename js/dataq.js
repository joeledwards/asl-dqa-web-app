var st_network  = undefined;
var st_station  = undefined;
var st_location = undefined;
var st_channel  = undefined;
var col_1_title = "";
var col_2_title = "";
var col_3_title = "";
var place = "";
var show_all = true;
var gen_plots = false;
var plots = undefined;
var channel_plot = false;
var controls_hidden = true;
var row_index = 0;
var selected_year = 2011;
var selected_month = 8;

// Setup event bindings
$(document).ready(function() {
    $('#engine-up').val('FALSE');
    $('#table-ready').val('FALSE');
    $.ajax({cache:"false"});
    set_prototypes();
    set_control_defaults();
    $.extend($.jStore.defaults);
    $.jStore.load();
});

// Confirm that jStore Engine is Ready
$.jStore.ready(function(engine){
    engine.connect();
    engine.ready(function(){
        if ($('#engine-up').val() != 'TRUE') {
            $('#engine-up').val('TRUE');
            jstore_onload();
        }
    });
});

// We wait to load most features until jStore is online
function jstore_onload()
{
    try {
        $.jStore.set('TEST', 'SUCCESS');
    } catch (e) {
        alert("Wow, a little behind the times are we?! Please update your web browser.");
    }
    $.tablesorter.addWidget({
        id: "callback",
        format: function (table) {
            filter();
        }
    });
    $.tablesorter.addParser({
        id: "metrics",
        is: function(s) {
            return false;
        },
        format: function(s) {
            //var order = $(this).order;
            //if ($(this).lockedOrder) {
            //    order = $(this).lockedOrder;
            //}
            if (isNaN(s) || (s == "") || (s == undefined) || (s == null)) {
                /*
                if (order == 0) {
                    return "" + (Math.pow(2,32) - 1);
                }
                else {
                    return "" + (-1.0 * (Math.pow(2,32) - 1));
                }
                */
                log("parser triggered on '" +s+ "'");
                return null;
            }
            return s;
        },
        type: 'numeric'
    });

    $("#control-table").slideUp(1.0);
    $("#control-toggle").click(function(){
        toggle_controls();
    });
    $("#apply-weights").click(function(){
        load_data();
    });
    $(window).hashchange(function(){
        load_data(); // Load data fro the new context
    });
    init_filters();
    load_controls();
    load_table_controls();
    init_table();
    $(window).hashchange(); // force load of data on initial page load
}

function init_table() {
    if ($('#table-ready').val() == "FALSE") {
        $('#table').append('\
            <table id="metrics" class="tablesorter">\
            <thead>\
            <tr>\
                <th class="cat" colspan="3">Identity</th>\
                <th class="cat" colspan="3">State-of-Health</th>\
                <th class="cat" colspan="4">Coherence</th>\
                <th class="cat" colspan="4">Power Difference</th>\
                <th class="cat" colspan="4">Noise</th>\
                <th class="cat" colspan="2">Summary</th>\
            </tr>\
            <tr>\
                <th class="sub"><span id="col_1_header"></span></th>\
                <th class="sub"><span id="col_2_header"></span></th>\
                <th class="sub"><span id="col_3_header"></span></th>\
                <th class="sub"><span>Availability</span></th>\
                <th class="sub"><span>Gap Count</span></th>\
                <th class="sub"><span>Reversals</span></th>\
                <th class="sub"><span>4-8</span></th>\
                <th class="sub"><span>18-22</span></th>\
                <th class="sub"><span>90-110</span></th>\
                <th class="sub"><span>200-500</span></th>\
                <th class="sub"><span>4-8</span></th>\
                <th class="sub"><span>18-22</span></th>\
                <th class="sub"><span>90-110</span></th>\
                <th class="sub"><span>200-500</span></th>\
                <th class="sub"><span>4-8</span></th>\
                <th class="sub"><span>18-22</span></th>\
                <th class="sub"><span>90-110</span></th>\
                <th class="sub"><span>200-500</span></th>\
                <th class="sub"><span>Aggregate</span></th>\
                <th></th>\
            </tr>\
            </thead>\
            <tbody id="metrics-body">\
            <tr id="type-map-row">\
                <td>--</td>\
                <td>--</td>\
                <td>0.0</td>\
                <td>0.0</td>\
                <td>0.0</td>\
                <td>0.0</td>\
                <td>0.0</td>\
                <td>0.0</td>\
                <td>0.0</td>\
                <td>0.0</td>\
                <td>0.0</td>\
                <td>0.0</td>\
                <td>0.0</td>\
                <td>0.0</td>\
                <td>0.0</td>\
                <td>0.0</td>\
                <td>0.0</td>\
                <td>0.0</td>\
                <td>0.0</td>\
                <td><a href="#">.</a></td>\
            </tr>\
            </tbody>\
            </table>');

        $("#type-map-row").hide();
        $("#metrics").tablesorter({
            headers: {
                10: { sorter: "metrics" },
                11: { sorter: "metrics" },
                12: { sorter: "metrics" },
                13: { sorter: "metrics" },
                14: { sorter: "metrics" },
                15: { sorter: "metrics" },
                16: { sorter: "metrics" },
                17: { sorter: "metrics" },
                25: { sorter: false }
            },
            widgets: ["callback"]
        });
        /* Doesn't play well with all the "magic" we are doing already
        $("#metrics").fixedHeaderTable({
            footer: false,
            cloneHeadToFoot: false,
            fixedColumn: false
        });
        // */

        $('#metrics thead th:contains(Aggregate)').click();
        $('#table-ready').val("TRUE");
    }
}

// Check the status of stations
function load_data()
{
    reset_log();
    store_table_controls(); // Store controls from last context before updating

    $('#apply-weights').attr('disabled', 'disabled');
    $('#table').hide();
    $('#plots').hide();
    $('#up').hide();
    show_progress();
    st_network  = undefined;
    st_station  = undefined;
    st_location = undefined;
    st_channel  = undefined;
    col_1_title = "";
    col_2_title = "";
    col_3_title = "";
    place = ""
    gen_plots = false;
    channel_plot = false;

    var command = window.location.hash.replace("#", "");

    if (command == "") {
        show_all = true;
        col_1_title = "Network"
        col_2_title = "Station"
        col_3_title = ""
        $('#filter-subset').show();
        $('#filter-network').show();
        $('#filter-station').show();
        $('#filter-location').hide();
        $('#filter-channel').hide();
        $('#displaying > span.display-info').text("");
        load_table_controls();
    }
    else {
        show_all = false;
        var parts = command.split(".");
        if (parts.length < 3) {
            $('#main').append('<h1>Page Load Error!</h1>');
            $('#main').append('<h2>Invalid Command.</h2>');
            return;
        }

        place = parts[0];
        if (parts[0] == "STATION") {
            if (parts.length != 3) {
                $('#main').append('<h1>Page Load Error!</h1>');
                $('#main').append('<h2>Invalid Command.</h2>');
                return;
            }
            col_1_title = "Location";
            col_2_title = "Channel";
            col_3_title = "Rate";
            st_network = parts[1];
            st_station = parts[2];
            $('#filter-subset').hide();
            $('#filter-network').hide();
            $('#filter-station').hide();
            $('#filter-location').show();
            $('#filter-channel').show();
            $('#displaying > span.display-info').text(" (" +st_network+ "_" +st_station + ")");
            load_table_controls();
        }
        else if (parts[0] == "PLOT") {
            if (parts.length < 4) {
                $('#main').append('<h1>Page Load Error!</h1>');
                $('#main').append('<h2>Invalid Command.</h2>');
                return;
            }
            gen_plots = true;
            place = parts[0]+ '.' +parts[1];
            st_network = parts[2];
            st_station = parts[3];
            if (parts[1] == "STATION") {
                $('#up').attr('href', '#');
                $('#up').show();
                if (parts.length != 4) {
                    $('#main').append('<h1>Page Load Error!</h1>');
                    $('#main').append('<h2>Invalid Command.</h2>');
                    return;
                }
                $('#displaying > span.display-info').text(" (" +st_network+ "_" +st_station+ ")");
            }
            else if (parts[1] == "CHANNEL") {
                $('#up a').attr('href', '#STATION.'+st_network+'.'+st_station);
                $('#up').show();
                if (parts.length == 6) {
                    st_location = parts[4];
                    st_channel  = parts[5];
                }
                else {
                    $('#main').append('<h1>Page Load Error!</h1>');
                    $('#main').append('<h2>Invalid Command.</h2>');
                    return;
                }
                $('#displaying > span.display-info').text(" (" +st_network+ "_" +st_station+ " " +st_location+ "-" +st_channel+ ")");
            }
            else {
                $('#main').append('<h1>Page Load Error!</h1>');
                $('#main').append('<h2>Invalid Command.</h2>');
                return;
            }
            $('#filter-subset').hide();
            $('#filter-network').hide();
            $('#filter-station').hide();
            $('#filter-location').hide();
            $('#filter-channel').hide();
        }
        else {
            $('#main').append('<h1>Page Load Error!</h1>');
            $('#main').append('<h2>Invalid Command.</h2>');
            return;
        }
    }
    $('#displaying > span.display-month').text(month_map[selected_month]+ " " +selected_year);

    $('#col_1_header').text(col_1_title);
    $('#col_2_header').text(col_2_title);
    $('#col_3_header').text(col_3_title);

    $('#main h1').remove();
    $('#main h2').remove();
    $('#table table tbody tr.metrics').remove();
    $("#plots div").remove();
    if (command == "") {
        $.get($('#data-url').val()+'?cmd=ALL', {cache:"false"}, function(data, status, request){
            load(data, status, request);
            filter();
        }); 
    } 
    else {
        $.get($('#data-url').val()+'?cmd='+command, {cache:"false"}, function(data, status, request){
            load(data, status, request);
            filter();
        }); 
    }
}


function show_progress() {
    $("#progress").show();
}

function hide_progress() {
    $("#progress").hide();
}

// Appends log information to the end of the page.
function log(text) {
    $("#log").append("<div>" +text+ "</div>");
}

// Removes all logs.
function reset_log() {
    $("#log div").remove();
}

function log10(value) {
    return Math.log(value) / Math.LN10;
}

function agg_count(value) {
    return 100.0 - Math.min(20 * log10(value+1), 100.0);
}
function agg_coherence(value, power) {
    return 100.0 * Math.pow(value, power);
}
function agg_power(value, adjust) {
    return 100.0 - Math.min(adjust * log10(Math.abs(value) + 1), 100.0);
}
function agg_noise(value, adjust) {
    return 100.0 - Math.min(adjust * (log10(Math.abs(value) + 1)), 100.0);
}


// =============================================================
// === Populate the Table ======================================
// =============================================================
function load(data, status, request)
{
    var rows = data.split('\n')//.sort(row_sort);

 // === Display Plots ===========================================
    if (gen_plots) {
        $('#plots').show();
        var groups = {};
        var first_time = undefined;
        var last_time  = undefined;
        var low_value  = undefined;
        var high_value = undefined;
        for (var i in rows) {
            if (rows[i].trim() == "") {
                continue;
            }
            var parts = rows[i].split(',');
            var title = capitalize(new String(parts[0]))+ ": " +capitalize(new String(parts[1]));
            var timestamp = zeroPad(parts[2],4)+ "-" +zeroPad(parts[3],2)+ "-" +zeroPad(parts[4],2)+ " 12:00:00";
            last_time = timestamp;
            if (first_time == undefined) {
                first_time = timestamp;
            }
            //var timestamp = "%04d/%02d/%02d".sprintf(parts[2], parts[3], parts[4]);
            if (groups[title] == undefined) {
                groups[title] = {
                    "data"  : [],
                    "start" : undefined,
                    "end"   : undefined,
                    "min"   : undefined,
                    "max"   : undefined
                };
            }

            var value = parts[5] * 1.0;
            if (low_value == undefined) {
                low_value = value;
            }
            else if (low_value > value) {
                low_value = value;
            }
            if (high_value == undefined) {
                high_value = value
            }
            else if (high_value < value) {
                high_value = value;
            }
            groups[title]["data"].push([timestamp,value])
            groups[title]["start"] = first_time;
            groups[title]["end"] = last_time;
            groups[title]["min"] = low_value;
            groups[title]["max"] = high_value;
        }
        var j = 0;
        plots = {};
        for (var title in groups) { 
            j++;
            var container_id = "plot-" +j+ "-container";
            var plot_id      = "plot-" +j;
            var button_id    = "plot-" +j+ "-button";
            $("#plots").append('<div id="' +container_id+ '"/></div>');
            $("#"+container_id).append('<div class="plot" id="' +plot_id+ '"/></div>');
            $("#"+container_id).append('<button class="zoom" id="' +button_id+ '">Zoom Out</button>');
            $("#"+button_id).val(plot_id);
            var min = groups[title]["min"]; 
            var max = groups[title]["max"];
            var disp_min = min - ((max - min) / 10)
            var disp_max = max + ((max - min) / 10)
            if (min == max) {
                disp_min = min - 1.0;
                disp_max = max + 1.0;
            } 
            plots[plot_id] = $.jqplot(plot_id, [groups[title]["data"]], {
                title: title,
                cursor:{
                    show: true,
                    zoom: true,
                    showTooltip: false
                },
                /*
                axesDefaults: {
                    labelRenderer: $.jqplot.CanvasAxisLabelRenderer
                },
                */
                highlighter: {
                    show: true,
                    sizeAdjust: 7.5
                },
                axes: {
                    xaxis: {
                        min: groups[title]["start"],
                        max: groups[title]["end"],
                        renderer: $.jqplot.DateAxisRenderer
                    },
                    yaxis: {
                        //tickInterval: (high_value - low_value) / 10,
                        min: disp_min,
                        max: disp_max
                    }
                }
            });
            //log("Plot-" +j+ " Values: " +groups[title]["start"]+ " " +groups[title]["end"]+ " " +disp_min+ " " +disp_max);
            $("#"+button_id).click(function () {
                plots[$(this).val()].resetZoom();
            });
        }

        hide_progress();
        $('#apply-weights').removeAttr('disabled');
        return;
    }

 // === Generate Each Row Calculating Aggregate =================
    for (var i in rows) {
        // Skip this row if it is empty.
        if ((rows[i] == undefined) || (rows[i].trim() == '') || (rows[i].trim() == 'None')) {
            //alert("skipping index " + i);
            continue;
        }

        var items = rows[i].split(",");
        if (items == undefined) {
            continue;
        }

        var line_id = items[0] + '-' + items[1]
        $('#metrics-body').append('<tr class="metrics" id="' + line_id + '"></tr>');
        var row = $('#'+line_id);

        var display_id = 'display-' + line_id;
        var plot_id = 'plot-' + line_id;

        var aggregate = 0.0;
        var link = items[1];
        if (place == "") {
            link = '<a id="' +display_id+ '" href="#STATION.' +items[0]+ '.' + items[1]+ '">' +items[1]+ '</a>';
        }
        for (var j in items) {
            if (j == 0) {
                value = items[j];
                if ((value == undefined) || (value.trim() == "")) {
                    value = "--";
                }
                row.append('<td>' +value+ '</td>');
            }
            else if (j == 1) {
                row.append('<td>' +link+ '</td>');
            }
            else if ((j == 2) && (col_3_title == "")) {
                row.append('<td></td>');
            }
            else {
                value = items[j];
                if ((value == undefined) || (value == "NaN")) {
                    row.append('<td></td>');
                } else {
                    row.append('<td>' +(value * 1.0).toFixed(2)+ '</td>');
                }
            }
            xform = agg_xform[j];
            if (xform[0] == "ignore") {
                ;
            }
            else {
                var agg_value = 0.0;
                if ((value == undefined) || isNaN(value) || (value == 'NaN') || (value == '')) {
                    agg_value = 100.0;
                }
                else {
                    agg_value = value * 1.0;
                    if (xform[0] == "count") {
                        agg_value = (xform.length > 3) ? agg_count(agg_value, xform[3]) : agg_count(agg_value);
                    } else if (xform[0] == "coherence") {
                        agg_value = (xform.length > 3) ? agg_coherence(agg_value, xform[3]) : agg_coherence(agg_value);
                    } else if (xform[0] == "power") {
                        agg_value = (xform.length > 3) ? agg_power(agg_value, xform[3]) : agg_power(agg_value);
                    } else if (xform[0] == "noise") {
                        agg_value = (xform.length > 3) ? agg_noise(agg_value, xform[3]) : agg_noise(agg_value);
                    }
                }

                var weight = xform[1];
                if ((typeof weight) != "number") {
                    weight = get_weight(weight);
                }
                if (weight == undefined) {
                    continue;
                }
                weight = weight / 100.0;

                var portion = xform[2];
                if ((typeof portion) != "number") {
                    weight = get_weight(portion);
                }
                if (portion == undefined) {
                    continue;
                }
                portion = portion / 100.0;

                //log(items[0]+ "." +items[1]+ " [" +j+ "] agg_value = " +agg_value);
                aggregate += agg_value * weight * portion;
                //log("aggregate=" +aggregate+ " value=" +agg_value+ " weight=" +weight+ " portion=" +portion);
            }
        }
        aggregate_class = "level1";
        if (aggregate < 70.0) {
            aggregate_class = "level4";
        } 
        else if (aggregate < 80.0) {
            aggregate_class = "level3";
        }
        else if (aggregate < 90.0) {
            aggregate_class = "level2";
        }
        else if (aggregate > 100.0) {
            aggregate = 100.0;
        }
        row.append('<td class="' +aggregate_class+ '">' + aggregate.toFixed(2) + '</td>');
        var cmd_hash = ""
        if (place == "") {
            cmd_hash = "PLOT.STATION." +items[0]+ "." +items[1];
        }
        else {
            cmd_hash = "PLOT.CHANNEL." +st_network+ "." +st_station+ "." +items[0]+ "." +items[1];
        }
        row.append('<td><a id="' +plot_id+ '" href="#'+cmd_hash+'">Plot</a></td>');
    }
    // Clean up our column header styles as tablesorter will not.
    // Only we know that the table data has been replaced.
    $("#metrics thead th").removeClass("headerSortUp");
    $("#metrics thead th").removeClass("headerSortDown");
    $("#metrics").trigger("update");
    hide_progress();
    $('#table').show();
    $('#metrics thead th:contains(Aggregate)').click();
    $('#metrics thead th:contains(Aggregate)').click();
    $('#apply-weights').removeAttr('disabled');
}

