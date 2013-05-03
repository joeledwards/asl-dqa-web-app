/*
form.js
Author: James Holland jholland@usgs.gov
form.js contains functions for controls across multiple pages
License: Public Domain
*/

//Creates the selector controls for dates and groups
function initForm(type){
    var form = $("#frmSelector");
    if (type == "summary"){
        form.append("<select id='ddlGroup' class='ui-state-default ui-corner-all'><option value='0'>All</option></select>");
    }

    if (type == "station"){
        form.append(
            "<button type='button' id='btnSummary' class='ui-state-default ui-corner-all'>"+
                "Summary"+
                "</button>"
        );
    }

    //Create YearMonth form for easier displaying/hiding
    var spanYearMonth = $("<span id='spanYearMonth'/>");
    spanYearMonth.append(
        "<select id='ddlYear' class='ui-state-default ui-corner-all'></select>"
    );
    spanYearMonth.append("<select id='ddlMonth' class='ui-state-default ui-corner-all'></select>");

    //Create daterange from for easy displaying/hiding
    var spanDateRange = $("<span id='spanDateRange'/>");
    spanDateRange.append(
        "<label for='dpStartDate'>  From</label>"+
            "<input type='text' id='dpStartDate' name='dpStartDate' class='ddl'/>"
    );
    spanDateRange.append(
        "<label for='dpEndDate'>  To</label>"+
            "<input type='text' id='dpEndDate' name='dpEndDate' class='ddl'/>"
    );
    //Add both spans to the form, then hide daterange
    form.append(spanYearMonth);
    form.append(spanDateRange);
    spanDateRange.hide();

    //Add switch between month and date range
    form.append(
        "<button type='button' id='btnToggleDate' class='ui-state-default ui-corner-all'>"+
            "Toggle Date Range"+
            "</button>"
    );


    //Add update button
    form.append(
        "<button type='button' id='btnUpdate' class='ui-state-default ui-corner-all'>"+
            "Update"+
            "</button>"
    );
    //Make startDate and endDate datepickers
    $("#dpStartDate").datepicker({
        changeMonth: true,
        changeYear: true,
        numberOfMonths: 2,
        dateFormat: "yy-mm-dd",
        onClose: function(selectedDate){
            $("#dpEndDate").datepicker( "option", "minDate", selectedDate);
        }
    });
    $("#dpEndDate").datepicker({
        changeMonth: true,
        changeYear: true,
        numberOfMonths: 2,
        dateFormat: "yy-mm-dd",
        onClose: function(selectedDate){
            $("#dpStartDate").datepicker( "option", "maxDate", selectedDate);
        }
    });


    //Bind all form actions now that they controls are created
    bindFormActions(type);
}

function bindFormActions(type){
    if (type == "summary"){
        $('#btnUpdate').on('click',function(){
            filterGroups(dataGrid);
            clearDataTable(dataGrid);
            populateGrid(dataGrid);
        });
    }
    else if(type == "station") {
        $('#btnUpdate').on('click',function(){
            clearDataTable(dataGrid);
            populateGrid(dataGrid);
        });
    }

    $("#btnToggleDate").on('click',function(){
        $("#spanYearMonth").toggle();
        $("#spanDateRange").toggle();
        if($("#spanYearMonth").is(":visible")){ //If switching back to YearMonthView, take year and month from startDate
            $("#ddlYear").val(getStartDate('object').getUTCFullYear());
            yearSelected();
            $("#ddlMonth").val(getStartDate('object').getUTCMonth() +1); 
            yearMonthToStartDate(); //push yearmonth back to startend date fields
            yearMonthToEndDate();
        }
    });

    $("#ddlYear").change(function(){
        yearSelected();
        yearMonthToStartDate();
        yearMonthToEndDate();
    });
    $("#ddlMonth").change(function(){
        yearMonthToStartDate();
        yearMonthToEndDate();
    });

}
