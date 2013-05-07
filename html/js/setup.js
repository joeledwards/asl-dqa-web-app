/*
setup.js
Author: James Holland jholland@usgs.gov
Setup.js contains the base objects and  calls for creating a menu, grid, and plotting.
License: Public Domain
*/

//Mappings
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
var mapCNametoCID = {};
var mapCIDtoCName = {};
var mapCIDtoLoc = {};
var groups = new Array();
var plots = {};
var plotdata = {};
var pageType = undefined; //Allows rest of functions to check page type without passing type around. It is only changed in getSetupData.

$(document).ready(function(){
    //Detect which type of page we are loading. If a stationID was passed in the query string it is station.
    var stationID;
    if (stationID = getQueryString("station")){
        pageType = "station";
    }
    else {
        pageType = "summary";
    }
    setupPage();
    getSetupData();
});

$(document).ajaxStop(function(){
    resetWeights();
    processAllAggr();
});

function getSetupData(){
    if (pageType == "station"){
        var station = getQueryString("station");
        $.get("/cgi-bin/metrics.py", 
            {cmd: "groups_dates_stations_metrics_channels", param: "station."+station},
            function(data){
                parseSetupResponse(data);
                buildTable();
                initializeTable();
                clearTable(); //Clears 1.01 values before populating with proper values
                fillTable();
                bindTableActions();
            }
        ); 
    }
    else if (pageType == "summary"){
        $.get("/cgi-bin/metrics.py", 
            {cmd: "groups_dates_stations_metrics"},
            function(data){
                parseSetupResponse(data);
                //populateGroups(); //We need to implement tabbing for this now
                buildTable();
                initializeTable();
                clearTable(); //Clears 1.01 values before populating with real values
                fillTable();
                bindTableActions();
            }
        );
    }

}

function setupPage(){
    setupHeader();
    setupTabs();


    //Make all buttons jqueryui buttons
    $("button").button();
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


function parseSetupResponse(response){
    var rows = response.split(/\n/);
    for (var i =0; i< rows.length; i++){
        var parts = rows[i].split(',');  //Typical return like Type, TypeID, Values
        switch(parts[0]){
            case 'DE': //DE, YYYY-MM-DD End date
                if (parts.length != 2) {
                    continue;
                }
                setupLastDate(parts[1]);
                break;
            case 'DS': //DS YYYY-MM-DD  start Date
                if (parts.length != 2) {
                    continue;
                }
                setupFirstDate(parts[1]);
                break;
            case 'T': //T, GroupTypeID, GroupTypeName (Network, Country, etc), Groups associated with Type
                mapTNametoTID[parts[2]] = parts[1]; //Allows lookup by TName
                mapTIDtoTName[parts[1]] = parts[2];
                if (mapTIDtoGIDs[parts[1]] == undefined){
                    mapTIDtoGIDs[parts[1]] = new Array();
                }
                for (var t = 3; t<parts.length; t++){
                    mapTIDtoGIDs[parts[1]].push( parts[t]);
                }
                break;
            case 'G': //G, GroupID, GroupName (IU, CU, Asia, etc), GroupTypeID
                mapGIDtoGName[parts[1]] = parts[2];
                break;
            case 'S': //S, StationID, NetworkID, StationName, groupIDs
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
            case 'C': //C, ChannelID, ChannelName, LocationName, StationID
                mapCIDtoCName[parts[1]] = parts[2];
                mapCNametoCID[parts[2]] = parts[1];
                mapCIDtoLoc[parts[1]] = parts[3];
                break;
            case 'M': //M, MetricID, MetricName
                mapMIDtoMName[parts[1]]=parts[2];
                mapMNametoMID[parts[2]]=parts[1];
                break;
        }
    }
}

