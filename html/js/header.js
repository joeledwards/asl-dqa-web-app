/*
header.js
Author: James Holland jholland@usgs.gov
header.js contains functions for creating the page's header
License: Public Domain
*/

function setupHeader(){
    var header = $("#header");
    //Add return link
    if(pageType == "station"){
        var stationID = getQueryString("station");
        header.append(
            "<button type='button' id='btnSummary' class='ui-state-default ui-corner-all'>Summary</button>"
        );
        $("#btnSummary").on("click",function(){
            window.location = "dataq.html?&sdate="+getStartDate("simple")+"&edate="+getEndDate("simple");
        });

        header.append("<span class='dataqHeader'>"+mapGIDtoGName[mapSIDtoNID[stationID]]+"-"+mapSIDtoSName[stationID]+"</span>");
    }
    else if(pageType == "summary"){
        header.append("<span class='dataqHeader'>Station Summary</span>");

    }
}
