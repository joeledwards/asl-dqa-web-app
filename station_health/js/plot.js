/*
   plot.js
   Author: James Holland jholland@usgs.gov
   plot.js contains functions for creating plot windows and actual plotting
   License: Public Domain
 */

function createDialog(id){
    var ids = id.split("_");
    var dialog = $("<div id='div"+id+"' title='"+mapSIDtoSName[ids[1]]+" "+mapMIDtoMName[ids[0]]+"'></div>").dialog({
        close: function(event, ui){
            $("#div"+id).remove();
        }
    });
    $('#html').append(dialog);
}


