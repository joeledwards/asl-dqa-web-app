/*
   plot.js
   Author: James Holland jholland@usgs.gov
   plot.js contains functions for creating plot windows and actual plotting
   License: Public Domain
 */

function plotTemplate(id, title){
    var dialog = $("<div id='dia"+id+"' title='"+title+"'></div>").dialog({
        close: function(event, ui){
            $("#dia"+id).remove();
        }
    });
    var plotTarget = $("<div id='plot"+id+"'></div>");

    dialog.append(plotTarget);
    dialog.append("<button class='button' id='btn"+id+"' value='"+id+"'>Zoom out</button>");

    return dialog;
}

function createDialog(id){
    var ids = id.split("_");
    var pid = ids[1]+"_"+ids[2]; //removes the "d_" from the front of the id
    var title = undefined;

    if (pageType == "summary")
        title = mapSIDtoSName[ids[2]]+" "+mapMIDtoMName[ids[1]];
    else if (pageType == "station")
        title = mapCIDtoCName[ids[2]]+" "+mapMIDtoMName[ids[1]];
    else
        title = "ERROR page type not defined";

    //We may want the ability to have multiple of the same plot up to compare different date ranges.
    //If we do try to implement this, there is a bug. When the last dialog is closed, the first disapears, but doesn't get removed. Same with Second to last and second.
    if($("#dia"+pid).length) //If dialog exists, close it.
        $("#dia"+pid).dialog("close");
    $('#html').append(plotTemplate(pid, title));
    getPlotData(ids, pid);
}

function bindPlot(pid){
    //    plots[pid] = $.jqplot('plot'+pid, [plotdata[pid]]);
    plots[pid] = $.jqplot('plot'+pid, [plotdata[pid]], {
        //title: title,
        cursor:{
            show: true,
    zoom: true,
    showTooltip: false
        },
    
       axesDefaults: {
            pad: 1.2
           //labelRenderer: $.jqplot.CanvasAxisLabelRenderer
       },
     
    highlighter: {
        show: true,
    sizeAdjust: 7.5
    },
    axes: {
        xaxis: {
            min: (getStartDate()+1), //groups[title]["start"],
    max: (getEndDate()+1), //groups[title]["end"],
    renderer: $.jqplot.DateAxisRenderer,
    pad: 1.2
        },
        yaxis: {
            //tickInterval: (high_value - low_value) / 10,
            min: (parseFloat(plotdata["ymin"+pid])-5), //groups[title]["start"],
    max: (parseFloat(plotdata["ymax"+pid])+5),
    pad: 1.2
        }
    }
    });

//Bind the zoom out button
        $("#btn"+pid).click(function () {
            plots[$(this).val()].resetZoom();
        });
    
}

function getPlotData(ids, pid){
    var daterange = getQueryDates();
    if (pageType == "station"){
        $.get("/cgi-bin/metrics.py", 
                {cmd: "channelplot", param: "channel."+ids[2]+"_metric."+ids[1]+"_dates."+daterange},
                function(data){
                    parsePlotReturn(data, pid);
                }
             ).done(function(){
        bindPlot(pid);
    });

    }
}

function parsePlotReturn(data,pid){
    plotdata["xmax"+pid] = undefined;
    plotdata["xmin"+pid] = undefined;
    plotdata["ymax"+pid] = undefined;
    plotdata["ymin"+pid] = undefined;
    plotdata[pid] = new Array();
    var rows = new Array();
    rows = data.split("\n");
    for(var i = 0; i <rows.length; i++){
        row = rows[i].split(",");   //row[0] is date, row[1] is value
        if(row[1] && row[0]){
            plotdata[pid].push([row[0],parseFloat(row[1]).toFixed(2)]);
            if(plotdata["xmax"+pid] == undefined ||row[0] > plotdata["xmax"+pid])
                plotdata["xmax"+pid] = row[0];
            if(plotdata["xmin"+pid] == undefined ||row[0] < plotdata["xmin"+pid])
                plotdata["xmin"+pid] = row[0];
            if(plotdata["ymax"+pid] == undefined ||row[1] > plotdata["ymax"+pid])
                plotdata["ymax"+pid] = parseFloat(row[1]).toFixed(2);
            if(plotdata["ymin"+pid] == undefined ||row[1] < plotdata["ymin"+pid])
                plotdata["ymin"+pid] = parseFloat(row[1]).toFixed(2);
        }
    }
}
