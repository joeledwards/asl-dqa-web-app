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
