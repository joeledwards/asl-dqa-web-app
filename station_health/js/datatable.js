/*
    datatable.js
    Author: James Holland jholland@usgs.gov
    datatable.js contains functions functions for the datatable found on both summary and station pages 
    License: Public Domain
 */

function bindDatatableActions(datatable) {
    datatable.find('tbody td').click(function(){
        var id = $(this).attr('id');
        if(id != undefined && id.charAt(0) == 'd')
            createDialog(id);
    });
}
