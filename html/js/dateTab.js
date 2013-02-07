/*
dateTab.js
Author: James Holland jholland@usgs.gov
dateTab.js contains functions related to the date tab.
License: Public Domain
*/

//setupDateTab is passed the jquery object to append needed objects to.
function setupDateTab(jTabs) {
    var dateTab = $("<span id='tDate'></span>");
    dateTab.append(createDateRangeSpan("tab","Custom Date Range"));
    jTabs.append(dateTab);
    jTabs.tabs("add", "#tDate", "Dates");
    bindDateRangeSpan("tab");
}

function createDateRangeSpan(id, label){
    var dateSpan = $("<span id='dateRang"+id+"e' class='ui-widget'></span>");
    if(label != undefined){
    dateSpan.append("<h class='tabSubHeader'>"+label+"</h><br/>");
        }
    dateSpan.append(
        "<label for='dpStartDate"+id+"'>  From</label>"+
            "<input type='text' id='dpStartDate"+id+"' name='dpStartDate"+id+"' class='ddl'/>"
    );
    dateSpan.append(
        "<label for='dpEndDate"+id+"'>  To</label>"+
            "<input type='text' id='dpEndDate"+id+"' name='dpEndDate"+id+"' class='ddl'/>"
    );
    return dateSpan;
}

function bindDateRangeSpan(id){
    //Make startDate and endDate datepickers
    $("#dpStartDate"+id).datepicker({
            changeMonth: true,
            changeYear: true,
            numberOfMonths: 2,
            dateFormat: "yy-mm-dd",
            onClose: function(selectedDate){
                selectStartDate(selectedDate);
            }
        });
    $("#dpEndDate"+id).datepicker({
            changeMonth: true,
            changeYear: true,
            numberOfMonths: 2,
            dateFormat: "yy-mm-dd",
            onClose: function(selectedDate){
                selectEndDate(selectedDate);
            }
        });
}

function selectStartDate(newStartDate){
    $("[id^=dpStartDate]").each(function(){
        $(this).val(newStartDate);
    });
    $("[id^=dpEndDate]").each(function(){
        $(this).datepicker("option", "minDate", newStartDate);
    });
}

function selectEndDate(newEndDate){
    $("[id^=dpEndDate]").each(function(){
        $(this).val(newEndDate);
    });
    $("[id^=dpStartDate]").each(function(){
        $(this).datepicker("option", "maxDate", newEndDate);
    });
}
