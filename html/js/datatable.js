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
