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
        var stationID = getQueryString("station");
        header.append(
            "<button type='button' id='btnSummary'>Summary</button>"
        );
        $("#btnSummary").on("click",function(){
            window.location = "dataq.html?&sdate="+getStartDate("simple")+"&edate="+getEndDate("simple");
        });

        header.append(
            "<span class='headerTitle'>"
            +mapGIDtoGName[mapSIDtoNID[stationID]]
            +"-"
            +mapSIDtoSName[stationID]
            +"</span>"
        );
    }
    else if(pageType == "summary"){
        header.append("<span class='headerTitle'>Station Summary</span>");

    }
    //Adding span for dateRange now, but the dates and their controls will be added in the dateselection code.
    var rightSide = $("<span class='right'></span>");
    var dateSpan = $("<span id='headerDateRange' class='ui-widget'></span>");

    dateSpan.append(
        "<label for='dpStartDate'>  From</label>"+
            "<input type='text' id='dpStartDate' name='dpStartDate' class='ddl'/>"
    );
    dateSpan.append(
        "<label for='dpEndDate'>  To</label>"+
            "<input type='text' id='dpEndDate' name='dpEndDate' class='ddl'/>"
    );
    
    rightSide.append(dateSpan);
    rightSide.append(
        "<button type='button' id='btnRefresh'>Refresh</button>"
    );
    header.append(rightSide);
    $("#btnRefresh").on("click",function(){
        clearDataTable(dataGrid);
        populateGrid(dataGrid);
    });
    //Make all buttons jqueryui buttons
    $("button").button()
}
