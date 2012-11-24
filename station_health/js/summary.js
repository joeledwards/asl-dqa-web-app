Array.prototype.foo = "foo!";
var mapYearstoMonths = {}; //Available months for each year
var mapTIDtoGIDs = {}; //TID = Group type ID, GID = Group ID
var mapTIDtoTName = {}; //TName = Group Type name
var mapTNametoTID = {}; //Allows for reverse lookups
var mapGIDtoGName = {}; // GName = Group Name
var mapSIDtoSName = {}; //SID = Station ID, SName = Station Name
var mapGIDtoSIDs = {};
var mapSIDtoNID = {}; //NID = Network ID
var mapMIDtoMName = {}; //MID = Metric ID, MName = Metric Name
var mapMNametoMID = {};
var mapSIDtoGIDs = {};
var mapMonthtoNum = {
    1 : "January",
    2 : "February",
    3 : "March",
    4 : "April",
    5 : "May",
    6 : "June",
    7 : "July",
    8 : "August",
    9 : "September",
    10 : "October",
    11 : "November",
    12 : "December",
    "January"   :  1,
    "February"  :  2,
    "March"     :  3,
    "April"     :  4,
    "May"       :  5,
    "June"      :  6,
    "July"      :  7,
    "August"    :  8,
    "September" :  9,
    "October"   : 10,
    "November"  : 11,
    "December"  : 12
};
var groups = new Array();
var dataGrid; //Datatables object initialized in getSetupData()
var dataFC;
var numCols = 0;

$("#btnUpdate").click(function(){
    filterGroups(dataGrid);
    clearDataTable(dataGrid);
    populateGrid(dataGrid);
});

$("#ddlGroup").change(function(){
    filterGroups(dataGrid);
    clearDataTable(dataGrid);
    populateGrid(dataGrid);
});

$(document).ready(function(){
    getSetupData();

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

function getSetupData(){

    var max_year  = undefined;
    var max_month = undefined;
    var yearList = $("#ddlYear");
    var last;
    var request = new XMLHttpRequest();

    request.open('GET','/cgi-bin/metrics.py?cmd=dates_groups_stations_metrics',false);
    // request.setRequestHeader('User-Agent',navigator.userAgent);
    request.send(null);
    var rows = request.responseText.split(/\n/);
    for (var i =0; i< rows.length; i++){
        var parts = rows[i].split(',');
        switch(parts[0]){
            case 'D':
                if (parts.length != 3) {
                    continue;
                }
                year = parseInt(parts[1]);
                month = parseInt(parts[2]);
                if ((year == undefined) || (month == undefined)) {
                    continue;
                }

                if (mapYearstoMonths[year] == undefined) {
                    mapYearstoMonths[year] = new Array();
                    yearList.append('<option value="' +year+ '">' +year+ '</option>');
                }
                mapYearstoMonths[year].push(month);

                if ((max_year == undefined) || (year > max_year)) {
                    max_year = year;
                }
                last = year;
                break;
            case 'T':
                mapTNametoTID[parts[2]] = parts[1]; //Allows lookup by TName
                mapTIDtoTName[parts[1]] = parts[2];
                if (mapTIDtoGIDs[parts[1]] == undefined){
                    mapTIDtoGIDs[parts[1]] = new Array();
                }
                for (var t = 3; t<parts.length; t++){
                    mapTIDtoGIDs[parts[1]].push( parts[t]);
                }
                break;
            case 'G':
                mapGIDtoGName[parts[1]] = parts[2];
                break;
            case 'S':
                mapSIDtoSName[parts[1]] = parts[3];
                mapSIDtoNID[parts[1]] = parts[2];
                for(var t=4; t<parts.length; t++){
                    if(mapGIDtoSIDs[parts[t]] == undefined){
                        mapGIDtoSIDs[parts[t]] = new Array();
                    }
                    mapGIDtoSIDs[parts[t]].push(parts[1]);
                    if(mapSIDtoGIDs[parts[1]] == undefined){
                        mapSIDtoGIDs[parts[1]] = new Array();
                    }
                    mapSIDtoGIDs[parts[1]].push(parts[t]);
                }
                break;
            case 'M':
                mapMIDtoMName[parts[1]]=parts[2];
                mapMNametoMID[parts[2]]=parts[1];
                break;
        }
    }

    yearList.val(last);
    year_selected();
    populateGroups();
    buildGrid();
    dataGrid = $('#grid').dataTable( {

        "bJQueryUI":true
        ,"bPaginate":false
        //        ,"sScrollY":"300px"
        ,"sScrollY": (window.innerHeight - 220)+"px"
        // ,"sScrollYInner": "110%"
        ,"sScrollX": "100%"
        //,"sScrollXInner": "5200px"
        ,"bScrollCollapse": true
        ,"sDom": 'TC<"clear">lfrtip'
        //,"oTableTools": {
        //    "aButtons": [ "copy", "print", "csv", "pdf"]
        //}
    });
    /*new FixedHeader( dataGrid/*,{

      "left":true
      ,"zleft":"106"
      ,"right":true
      ,"zright":"105"
      });*/
    //    new FixedColumns(dataGrid);
    /*    dataFC = new FixedColumns( dataGrid,{
          "iLeftColumns":2
    //   ,"sLeftWidth":"fixed"
    //   ,"iLeftWidth":450
    });
     */
    initializeDataGrid(dataGrid);
    populateGrid(dataGrid);

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
                $row.append('<td id="'+mapMNametoMID[metricsSorted[i]]+'_'+station+'"></td>');
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
            var cell = document.getElementById(mid+"_"+row[0]);
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
    var year = document.getElementById("ddlYear");
    var month = document.getElementById("ddlMonth");
    var startDate = new Date(year.options[year.selectedIndex].value, parseInt(month.options[month.selectedIndex].value)-1, 1);
    var endDate = new Date(year.options[year.selectedIndex].value, parseInt(month.options[month.selectedIndex].value), 0);
    var dates = ""+startDate.getUTCFullYear()+pad((startDate.getUTCMonth()+1),2)+pad(startDate.getUTCDate(),2)+"."+endDate.getUTCFullYear()+pad((endDate.getUTCMonth()+1),2)+pad(endDate.getUTCDate(),2);
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
function year_selected()
{
    var year = $("#ddlYear").val();
    var month_list = $("#ddlMonth");
    $("#ddlMonth option").remove();
    var selected = month_list.val();
    var match = false;
    var last;
    var months = mapYearstoMonths[year];
    var month;
    for (var i in months) {
        if (months.hasOwnProperty(i)){
            month = months[i];
            month_list.append('<option value="' +month+ '">' +mapMonthtoNum[month]+ '</option>');
            last = month;
            if (month == selected) {
                match = true;
            }
        }
    }

    if (match) {
        month_list.val(selected);
    } else {
        month_list.val(last);
    }
}

function pad(input, size) {
    var output = input+"";
    while (output.length<size){
        output = "0"+output;
    }
    return output;
}

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
