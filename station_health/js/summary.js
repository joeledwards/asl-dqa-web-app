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
    var $gridhead = $("#grid thead tr");
    $gridhead.append('<th id="network">Network</th>');
    $gridhead.append('<th id="Station">Station</th>');
    $gridhead.append('<th id="groups">Groups</th>');
    for(header in mapMNametoMID) {
        if(mapMNametoMID.hasOwnProperty(header)) {
            metrics.push(header);
        }
    }
    metricsSorted = metrics.sort(naturalSort);
    for( var i = 0; i<metricsSorted.length; i++){
        $gridhead. append('<th id="'+mapMNametoMID[metricsSorted[i]]+'">'+metricsSorted[i]+'</th>');
    }
    $gridhead.append('<th id="aggregate">Aggregate</th>');

    for(station in mapSIDtoNID){
        if(mapSIDtoNID.hasOwnProperty(station)){
            var $row = $('<tr id = "'+station+'"><td>'+mapGIDtoGName[mapSIDtoNID[station]]+'</td>'
                +'<td id="l_'+station+'" class="ltd">'+mapSIDtoSName[station]+'</td>'
                +'<td>,'+mapSIDtoGIDs[station]+',</td></tr>');
            //Adding 1.01 causes datatables to automatically set the column types to numeric
            for( var i = 0; i<metricsSorted.length; i++){
                $row.append('<td id="d_'+mapMNametoMID[metricsSorted[i]]+'_'+station+'">1.01</td>');
            }
            //Append aggregate cell here
            $row.append('<td id="a_'+station+'">1.01</td>');

            $("#grid tbody").append($row);
        }
    }

}

function initializeDataGrid(datatable){

    datatable.fnSetColumnVis(2, false);
    datatable.fnSort([[0,'asc'],[1,'asc']]);
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
                                parseDataReturn(data, metricID, datatable);
                                numCols--;
                                if(numCols <= 0){
                                    datatable.fnDraw();
                                    //compute aggregate This is called twice during the first load
                                    processAllAggr();
                                }
                            }
                        );
                    }
                }
            });
    }
