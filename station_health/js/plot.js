/*
   plot.js
   Author: James Holland jholland@usgs.gov
   plot.js contains functions for creating plot windows and actual plotting
   License: Public Domain
 */

function createStationDialog(id){
    var ids = id.split("_");
    //We may want the ability to have multiple of the same plot up to compare different date ranges.
    //If we do try to implement this, there is a bug. When the last dialog is closed, the first disapears, but doesn't get removed. Same with Second to last and second.
    if($("#div"+id).length) //If dialog exists, close it.
        $("#div"+id).dialog("close");

    var dialog = $("<div id='div"+id+
            "' title='"+mapCIDtoCName[ids[2]]+" "+mapMIDtoMName[ids[1]]+
            "'></div>").dialog({
                close: function(event, ui){
                    $("#div"+id).remove();
                }
            });
    $('#html').append(dialog);
}

function createSummaryDialog(id){
    var ids = id.split("_");
    //We may want the ability to have multiple of the same plot up to compare different date ranges.
    //If we do try to implement this, there is a bug. When the last dialog is closed, the first disapears, but doesn't get removed. Same with Second to last and second.
    if($("#div"+id).length) //If dialog exists, close it.
        $("#div"+id).dialog("close");

    var dialog = $("<div id='div"+id+
            "' title='"+mapSIDtoSName[ids[2]]+" "+mapMIDtoMName[ids[1]]+
            "'></div>").dialog({
                close: function(event, ui){
                    $("#div"+id).remove();
                }
            });
    $('#html').append(dialog);
}

