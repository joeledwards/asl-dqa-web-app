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
function agg_cal_days(value) {
    return 100.0 - Math.min(20 * log10(value+1), 100.0);
}
function agg_cal_mae(value, adjust) {
    return 100.0 - Math.min(adjust * (log10(Math.abs(value) + 1)), 100.0);
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
                <th class="cat" colspan="3">Calibration</th>\
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
                <th class="sub"><span>Days Since</span></th>\
                <th class="sub"><span>Corner MAE</span></th>\
                <th class="sub"><span>Flat MAE</span></th>\
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
                 6: { sorter: "metrics" },
                 7: { sorter: "metrics" },
                 8: { sorter: "metrics" },
                 9: { sorter: "metrics" },
                10: { sorter: "metrics" },
                11: { sorter: "metrics" },
                12: { sorter: "metrics" },
                13: { sorter: "metrics" },
                14: { sorter: "metrics" },
                15: { sorter: "metrics" },
                16: { sorter: "metrics" },
                17: { sorter: "metrics" },
                18: { sorter: "metrics" },
                19: { sorter: "metrics" },
                20: { sorter: "metrics" },
                29: { sorter: false }
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

// Populate the table
function table(data, status, request) {
    var rows = data.split('\n')//.sort(row_sort);

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

        var line_id = items[0] + '-' + items[1];
        $('#metrics-body').append('<tr class="metrics" id="' + line_id + '"></tr>');
        var row = $('#'+line_id);

        var display_id = 'display-' + line_id;
        var plot_id = 'plot-' + line_id;

        var aggregate = 0.0;
        var total_adjustment = 0.0;
        var link = items[1];
        if (place == "") {
            link = '<a id="' +display_id+ '" href="#STATION.' +items[0]+ '.' + items[1]+ '">' +items[1]+ '</a>';
        }
        for (var j in items) {
            var value = undefined;
            if (j == 0) {
                value = items[j];
                if ((value == undefined) || (value.trim() == "")) {
                    value = "";
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
                } else if (j == 18) {
                    row.append('<td>' +Math.floor(value)+ '</td>');
                } else if ((j == 19) || (j == 20)) {
                    row.append('<td>' +(value * 1.0).toFixed(3)+ '</td>');
                } else {
                    row.append('<td>' +(value * 1.0).toFixed(2)+ '</td>');
                }
            }

            var xform = agg_xform[j];
            if (xform[0] == "ignore") {
                ;
            }
            else {
                var apply = true;
                var agg_value = 0.0;
                if ((value == undefined) || isNaN(value) || (value == 'NaN') || (value == '')) {
                    apply = false;
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
                    } else if (xform[0] == "cal-days") {
                        agg_value = (xform.length > 3) ? agg_cal_days(agg_value, xform[3]) : agg_cal_days(agg_value);
                    } else if (xform[0] == "cal-mae") {
                        agg_value = (xform.length > 3) ? agg_cal_mae(agg_value, xform[3]): agg_cal_mae(agg_value);
                    }
                }

                var weight = xform[1];
                if ((typeof weight) != "number") {
                    weight = get_weight(weight);
                }
                if ((weight == undefined) || isNaN(weight)) {
                    continue;
                }
                weight = weight / 100.0;

                var portion = xform[2];
                if ((typeof portion) != "number") {
                    weight = get_weight(portion);
                }
                if ((portion == undefined) || (isNaN(portion))) {
                    continue;
                }
                portion = portion / 100.0;

                //log(items[0]+ "." +items[1]+ " [" +j+ "] agg_value = " +agg_value);
                if (apply) {
                    aggregate += agg_value * weight * portion;
                }
                else {
                    total_adjustment += weight * portion;
                }
                //log("aggregate=" +aggregate+ " value=" +agg_value+ " weight=" +weight+ " portion=" +portion);
            }
        }
        aggregate /= (1.0 - total_adjustment);
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

