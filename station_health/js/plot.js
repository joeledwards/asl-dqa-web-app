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
    dialog.append("<div id='plot"+id+"'></div>");
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
}


