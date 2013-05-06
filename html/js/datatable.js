/*
datatable.js
Author: James Holland jholland@usgs.gov
datatable.js contains functions functions for the datatable found on both summary and station pages 
License: Public Domain
*/

function bindDatatableActions(datatable) {
    datatable.find('tbody td').click(function(){
        var id = $(this).attr('id');
        if(id != undefined){
            if(id != undefined && id.charAt(0) == 'd')
                createDialog(id);
            else if(id.charAt(0) == 'l'){
                window.location = 'station.html?station='+id.split('_')[1]
                +'&sdate='+getStartDate('simple')
                +'&edate='+getEndDate('simple');
            }
        }
    });
}

function clearDataTable(datatable){
    var rows = datatable.fnGetNodes();
    for( var i = 0; i<rows.length; i++){
        $(rows[i]).find("td").each(function(){
            var pos = datatable.fnGetPosition(this);
            if(String($(this).attr("id")).charAt(0) == "d"){ //only clear data cells 
                datatable.fnUpdate("", pos[0], pos[2], false, false); 
            }
            if(String($(this).attr("id")).charAt(0) == "a"){
                datatable.fnUpdate(parseFloat(0), pos[0],pos[2], false, false);
            }

        });
    }
}

function buildTable(){
    var dataGrid = document.getElementById("grid");
    var metricsSorted = new Array();
    var metrics = new Array();
    var $gridhead = $("#grid thead tr");
        for(header in mapMNametoMID) {
            if(mapMNametoMID.hasOwnProperty(header)) {
                metrics.push(header);
            }
        }
        metricsSorted = metrics.sort(naturalSort);
    if(pageType =="summary"){

        $gridhead.append('<th id="network">Network</th>');
        $gridhead.append('<th id="Station">Station</th>');
        $gridhead.append('<th id="groups">Groups</th>');
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
    else if(pageType == "station"){
        $gridhead.append('<th id="location">Location</th>');
        $gridhead.append('<th id="channel">Channel</th>');
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
}
