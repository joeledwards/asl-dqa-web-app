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
var dataGrid; //Datatables object initialized in getSetupData()
var numCols = 0;
var plots = {};
var plotdata = {};
var pageType = undefined; //Allows rest of functions to check page type without passing type around. It is only changed in getSetupData.

function getSetupData(type){
    pageType = type;
    var setupParams = {
        setYear:undefined //Set to max year and month if not a station query
    };
    if (pageType == "station"){
        var station = getQueryString("station");
        $.get("/cgi-bin/metrics.py", 
            {cmd: "groups_dates_stations_metrics_channels", param: "station."+station},
            function(data){
                parseSetupResponse(data, setupParams);
                initDates(setupParams.setYear);

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
                        ,"oTableTools": {
                            "aButtons": [ 
                                {
                                    "sExtends":"copy",
                                    "fnInit": function(node){formatTableTools(node, 'ui-icon-clipboard');}
                                },
                                {
                                    "sExtends":"print",
                                    "fnInit": function(node){formatTableTools(node, 'ui-icon-print');}
                                },
                                {
                                    "sExtends":"csv",
                                    "fnInit": function(node){formatTableTools(node, 'ui-icon-calculator');}
                                },
                                {
                                    "sExtends":"pdf",
                                    "fnInit": function(node){formatTableTools(node, 'ui-icon-copy');}
                                }
                            ]
                        }
                    });
                initializeDataGrid(dataGrid);
                populateGrid(dataGrid);
                bindDatatableActions(dataGrid)
            }
        );
    }
    else if (pageType == "summary"){
        $.get("/cgi-bin/metrics.py", 
            {cmd: "groups_dates_stations_metrics"},
            function(data){
                parseSetupResponse(data, setupParams);
                initDates(setupParams.setYear);
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
                        ,"oTableTools": {
                            "aButtons": [ 
                                {
                                    "sExtends":"copy",
                                    "fnInit": function(node){formatTableTools(node, 'ui-icon-clipboard');}
                                },
                                {
                                    "sExtends":"print",
                                    "fnInit": function(node){formatTableTools(node, 'ui-icon-print');}
                                },
                                {
                                    "sExtends":"csv",
                                    "fnInit": function(node){formatTableTools(node, 'ui-icon-calculator');}
                                },
                                {
                                    "sExtends":"pdf",
                                    "fnInit": function(node){formatTableTools(node, 'ui-icon-copy');}
                                }
                            ]
                        }
                    });
                initializeDataGrid(dataGrid);
                populateGrid(dataGrid);
                bindDatatableActions(dataGrid)
            }
        );

    }

}

function formatTableTools(button, icon){
    $(button).removeClass('DTTT_button');
    $(button).button({icons: {primary: icon}});
    $('.DTTT_container').buttonset();
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
function parseSetupResponse(response, params){
    var rows = response.split(/\n/);
    for (var i =0; i< rows.length; i++){
        var parts = rows[i].split(',');
        switch(parts[0]){
        case 'D':
            if (parts.length != 3) {
                continue;
            }
            var year = parseInt(parts[1]);
            var month = parseInt(parts[2]);
            addMonthYear(year,month);
            if ((params.setYear == undefined) || (year > params.setYear)) {
                params.setYear = year;
            }
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
        case 'C':
            mapCIDtoCName[parts[1]] = parts[2];
            mapCNametoCID[parts[2]] = parts[1];
            mapCIDtoLoc[parts[1]] = parts[3];
            break;
        case 'M':
            mapMIDtoMName[parts[1]]=parts[2];
            mapMNametoMID[parts[2]]=parts[1];
            break;
        }
    }
}

