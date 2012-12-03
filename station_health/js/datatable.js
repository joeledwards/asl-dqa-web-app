/*
    datatable.js
    Author: James Holland jholland@usgs.gov
    datatable.js contains functions functions for the datatable found on both summary and station pages 
    License: Public Domain
 */

function bindDatatableActions(datatable, type) {
    if(type == 'summary'){
    datatable.find('tbody td').click(function(){
        var id = $(this).attr('id');
        if(id != undefined && id.charAt(0) == 'd')
            createSummaryDialog(id);
    });
    }
    else if(type == 'station')
    {
    datatable.find('tbody td').click(function(){
        var id = $(this).attr('id');
        if(id != undefined && id.charAt(0) == 'd')
            createStationDialog(id);
    });
    }
}
