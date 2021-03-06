/*
 station.js
 Author: James Holland jholland@usgs.gov
 station.js contains functions, objects and calls needed for using station.html.
 License: Public Domain
 */


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
    var $gridhead = $("#grid thead tr");
    $gridhead.append('<th id="location">Location</th>');
    $gridhead.append('<th id="channel">Channel</th>');
    for(header in mapMNametoMID) {
        if(mapMNametoMID.hasOwnProperty(header)) {
            metrics.push(header);
        }
    }
    metricsSorted = metrics.sort(naturalSort);
    for( var i = 0; i<metricsSorted.length; i++){
        $gridhead.append('<th id="'+mapMNametoMID[metricsSorted[i]]+'">'+metricsSorted[i]+'</th>');
    }
    $gridhead.append('<th id="aggregate">Aggregate</th>');

    for(channel in mapCIDtoCName){
        if(mapCIDtoCName.hasOwnProperty(channel)){
            var $row = $('<tr id = "'+channel+'"><td>'+mapCIDtoLoc[channel]+'</td>'
                +'<td>'+mapCIDtoCName[channel]+'</a></td></tr>');
            //Adding 1.01 causes datatables to automatically set the column types to numeric
            for( var i = 0; i<metricsSorted.length; i++){
                $row.append('<td id="d_'+mapMNametoMID[metricsSorted[i]]+'_'+channel+'">1.01</td>');
            }
            //Add Aggregate column
            $row.append('<td id="a_'+channel+'">1.01</td>');

            $("#grid tbody").append($row);
        }
    }

}


function initializeDataGrid(datatable){

    //Hide group Column
    //datatable.fnSetColumnVis(2, false);
    datatable.fnSort([[0,'asc'],[1,'asc']]);
}

function populateGrid(datatable){
    numCols = 0;
    var dates = getQueryDates();
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
                                    processAllAggr();
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

