/*
 summary.js
 Author: James Holland jholland@usgs.gov
 summary.js contains functions, objects and calls needed for using summary.html.
 License: Public Domain
 */

$(document).ready(function(){
        initForm("summary");
        getSetupData("summary");

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
    $("#grid thead tr"). append('<th id="network">Network</th>');
    $("#grid thead tr"). append('<th id="Station">Station</th>');
    $("#grid thead tr"). append('<th id="groups">Groups</th>');
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

    for(station in mapSIDtoNID){
        if(mapSIDtoNID.hasOwnProperty(station)){
            var $row = $('<tr id = "'+station+'"><td>'+mapGIDtoGName[mapSIDtoNID[station]]+'</td>'
                +'<td><a href=\"station.html?station='+station+'\">'+mapSIDtoSName[station]+'</a></td>'
                +'<td>,'+mapSIDtoGIDs[station]+',</td></tr>');
            $("#grid tbody").append($row);
            for( var i = 0; i<metricsSorted.length; i++){
                $row.append('<td id="d_'+mapMNametoMID[metricsSorted[i]]+'_'+station+'"></td>');
            }
        }
    }

}

function parseStationGrid(data,mid, pDatatable){
    var rows = new Array();
    rows = data.split("\n");
    for(var i = 0; i <rows.length; i++){
        row = rows[i].split(",");
        if(row[1] && row[0] && mid){
            var cell = document.getElementById("d_"+mid+"_"+row[0]);
            if(cell){
                var pos = pDatatable.fnGetPosition(cell);
                pDatatable.fnUpdate(row[1], pos[0], pos[2], false, false );
            }
        }
    }
}

function initializeDataGrid(datatable){

    datatable.fnSetColumnVis(2, false);
}

function populateGrid(datatable){
    numCols = 0;
    var stations = new String();
    stations = "";
    var dates = getQueryDates();
    var visibleRows = $('tbody tr', datatable.fnSettings().nTable);
    $.each(visibleRows, function(c){
            stations= stations+"-"+$(visibleRows[c]).closest('tr').attr('id');
            // alert(dataGrid.fnGetData(visibleRows[c])[0]);
        });
    stations = stations.substr(1); //trims initial - from the string
    $.each(datatable.fnSettings().aoColumns, function(c){
            if(datatable.fnSettings().aoColumns[c].bVisible == true){
                if(mapMNametoMID[datatable.fnSettings().aoColumns[c].sTitle]){
                    numCols++; 
                    var metricID = mapMNametoMID[datatable.fnSettings().aoColumns[c].sTitle];
                    $.get("/cgi-bin/metrics.py", {cmd: "stationgrid", param: "station."+stations+
                                "_metric."+metricID+"_dates."+dates},
                            function(data){
                                parseStationGrid(data, metricID, datatable);
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

    function clearDataTable(datatable){
        for(var sid in mapSIDtoSName){
            if(mapSIDtoSName.hasOwnProperty(sid)){
                for(var mid in mapMIDtoMName){
                    if(mapMIDtoMName.hasOwnProperty(mid)){
                        var cell = document.getElementById("d_"+mid+"_"+sid);
                        if(cell){
                            var pos = datatable.fnGetPosition(cell);
                            datatable.fnUpdate("", pos[0], pos[2], false, false );
                        }
                    }
                }
            }
        }
    }
