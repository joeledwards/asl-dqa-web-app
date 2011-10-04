function plot(data, status, request)
{
    var rows = data.split('\n')//.sort(row_sort);

 // === Display Plots ===========================================
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
        var category = new String(parts[0].trim());
        var title = new String(parts[1].trim());
        if (category == "calibration") {
            continue;
        }

        var title = capitalize(category)+ ": " +capitalize(title);
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
