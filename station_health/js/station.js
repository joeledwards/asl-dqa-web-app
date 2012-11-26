/*
station.js
Author: James Holland jholland@usgs.gov
station.js contains functions, objects and calls needed for using station.html.
License: Public Domain
*/


/*$("#ddlGroup").change(function(){
    filterGroups(dataGrid);
    clearDataTable(dataGrid);
    populateGrid(dataGrid);
});*/


$(document).ready(function(){
    initForm("station");
    getSetupData("station");

});

function filterGroups(datatable){
    var group = document.getElementById("ddlGroup");
    var groupID =  parseInt(group.options[group.selectedIndex].value);
    if(groupID != 0){
        datatable.fnFilter(","+groupID+",", 2);
    }
    else{
        datatable.fnFilter("",2);
    }

}


function buildGrid(){
    var dataGrid = document.getElementById("grid");
    var metricsSorted = new Array();
    var metrics = new Array();
    //$("#grid thead tr"). append('<th id="network">Network</th>');
    //$("#grid thead tr"). append('<th id="Station">Station</th>');
    $("#grid thead tr"). append('<th id="location">Location</th>');
    $("#grid thead tr"). append('<th id="channel">Channel</th>');
    //$("#grid thead tr"). append('<th id="groups">Groups</th>');
    for(header in mapMNametoMID) {
        if(mapMNametoMID.hasOwnProperty(header)) {
            //       $("#grid thead tr").append('<th id='
            metrics.push(header);
        }
    }
    metricsSorted = metrics.sort();
    for( var i = 0; i<metricsSorted.length; i++){
        $("#grid thead tr"). append('<th id="'+mapMNametoMID[metricsSorted[i]]+'">'+metricsSorted[i]+'</th>');
    }

    for(channel in mapCIDtoCName){
        if(mapCIDtoCName.hasOwnProperty(channel)){
            var $row = $('<tr id = "'+channel+'"><td>'+mapCIDtoLoc[channel]+'</td>'
                    +'<td>'+mapCIDtoCName[channel]+'</a></td></tr>');
            $("#grid tbody").append($row);
            for( var i = 0; i<metricsSorted.length; i++){
                $row.append('<td id="'+mapMNametoMID[metricsSorted[i]]+'_'+channel+'"></td>');
            }
        }
    }

}

function parseDataReturn(data,mid, pDatatable){
    var rows = new Array();
    rows = data.split("\n");
    for(var i = 0; i <rows.length; i++){
        row = rows[i].split(",");
        if(row[1] && row[0] && mid){
            var cell = document.getElementById(mid+"_"+row[0]);
            if(cell){
                var pos = pDatatable.fnGetPosition(cell);
                pDatatable.fnUpdate(row[1], pos[0], pos[2], false, false );
            }
        }
    }
}

function initializeDataGrid(datatable){

    //Hide group Column
    //datatable.fnSetColumnVis(2, false);
}

function populateGrid(datatable){
    numCols = 0;
    var channelss = new String();
    channels = "";
    var visibleRows = $('tbody tr', datatable.fnSettings().nTable);
    $.each(visibleRows, function(c){
        channels = channels+"-"+$(visibleRows[c]).closest('tr').attr('id');
    });
    channels = channels.substr(1); //trims initial - from the string
    $.each(datatable.fnSettings().aoColumns, function(c){
        if(datatable.fnSettings().aoColumns[c].bVisible == true){
            if(mapMNametoMID[datatable.fnSettings().aoColumns[c].sTitle]){
                numCols++; 
                var metricID = mapMNametoMID[datatable.fnSettings().aoColumns[c].sTitle];
                $.get("/cgi-bin/metrics.py", {cmd: "channelgrid", param: "channel."+channels+
                    "_metric."+metricID+"_dates."+dates},
                    function(data){
                        parseDataReturn(data, metricID, datatable);
                        numCols--;
                        if(numCols <= 0){
                            datatable.fnDraw();
                        }
                    }
                    );
            }
        }
    });
}

function populateGroups(){
    var groupList = document.getElementById("ddlGroup");
    var typesSorted = new Array();
    var types = new Array();
    for(var groupType in mapTNametoTID){ //puts the group types into an array that can be sorted
        if(mapTNametoTID.hasOwnProperty(groupType)){
            types.push(groupType);
        }
    }
    typesSorted = types.sort();
    for(var i = 0; i < typesSorted.length; i++){
        var optGroup = document.createElement('optgroup');
        optGroup.label = typesSorted[i];
        groupList.appendChild(optGroup);
        for(var t = 0; t<mapTIDtoGIDs[mapTNametoTID[typesSorted[i]]].length;t++){
            var option = document.createElement("option")
                option.value = mapTIDtoGIDs[mapTNametoTID[typesSorted[i]]][t];
            option.innerHTML = mapGIDtoGName[mapTIDtoGIDs[mapTNametoTID[typesSorted[i]]][t]];
            optGroup.appendChild(option);
        }
    }
}

/*function pad(input, size) {
    var output = input+"";
    while (output.length<size){
        output = "0"+output;
    }
    return output;
}*/

function clearDataTable(datatable){
    for(var sid in mapSIDtoSName){
        if(mapSIDtoSName.hasOwnProperty(sid)){
            for(var mid in mapMIDtoMName){
                if(mapMIDtoMName.hasOwnProperty(mid)){
                    var cell = document.getElementById(mid+"_"+sid);
                    if(cell){
                        var pos = datatable.fnGetPosition(cell);
                        datatable.fnUpdate("", pos[0], pos[2], false, false );
                    }
                }
            }
        }
    }
}
