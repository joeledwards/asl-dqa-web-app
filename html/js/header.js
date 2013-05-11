/*
header.js
Author: James Holland jholland@usgs.gov
header.js contains functions for creating the page's header
License: Public Domain
*/

function setupHeader(){
    var header = $("#header");
    header.append(
        "<button type='button' id='btnLegend'>Legend</button>"
    );

    $("#btnLegend").on("click",function(){
        alert("Legend is not done yet");
    });
    if(pageType == "station"){
        header.append(
            "<button type='button' id='btnSummary'>Summary</button>"
        );
        $("#btnSummary").on("click",function(){
            window.location = "dataq.html?&sdate="+getStartDate("simple")+"&edate="+getEndDate("simple");
        });

        header.append(
            "<span id='spnTitle' class='headerTitle'></span>"
        );
    }
    else if(pageType == "summary"){
        header.append("<span class='headerTitle'>Station Summary</span>");

    }
    //Adding span for dateRange now, but the dates and their controls will be added in the dateselection code.
    var rightSide = $("<span class='right'></span>");

    rightSide.append(createDateRangeSpan("header"));
    rightSide.append(
        "<button type='button' id='btnRefresh'>Update</button>"
    );
    header.append(rightSide);
    $("#btnRefresh").on("click",function(){
        refreshTable();
    });
    //Adds the actual jqueryui datepicker controls and theme
    bindDateRangeSpan("header");
}

//Must be called after setup data is parsed to get the station name
function setStationTitle(){
    var stationID = getQueryString("station");
    var newTitle = mapGIDtoGName[mapSIDtoNID[stationID]]+"-"+mapSIDtoSName[stationID];
    $("#spnTitle").text(newTitle);
    document.title = "DQA "+newTitle;
}
