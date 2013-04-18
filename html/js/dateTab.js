/*
dateTab.js
Author: James Holland jholland@usgs.gov
dateTab.js contains functions related to the date tab.
License: Public Domain
*/

//setupDateTab is passed the jquery object to append needed objects to.
function setupDateTab(jTabs) {
    var dateTab = $("<div id='tDate'></div>");
    
    //Custom Date Range
    dateTab.append("<h3>Date Range</h3>");
    var dateRangeDiv = $("<div></div>");
    dateRangeDiv.append(createDateRangeSpan("tab"));
    dateTab.append(dateRangeDiv);

    //Year Month Combos
    dateTab.append("<h3>Year-Month</h3>");
    var yearMonthDiv = $("<div></div>");
    dateTab.append(yearMonthDiv);
    
    //Finalize and bind to tab control
    jTabs.append(dateTab);
    jTabs.tabs("add", "#tDate", "Dates");
    
    
    //Bind controls as appropriate jqueryui controls
    $("#tDate").accordion();
    bindDateRangeSpan("tab");
}


//Called in header.js and setupDateTab()
function createDateRangeSpan(id){
    var dateSpan = $("<span id='dateRange"+id+"' class='ui-widget'></span>");
    dateSpan.append(
        "<label for='dpStartDate"+id+"'>  From</label>"+
            "<input type='text' id='dpStartDate"+id+"' name='dpStartDate"+id+"' class='ddl'/>"
    );
    dateSpan.append(
        "<label for='dpEndDate"+id+"'>  To</label>"+
            "<input type='text' id='dpEndDate"+id+"' name='dpEndDate"+id+"' class='ddl'/>"
    );

    //if (id =="tab"){
    dateSpan.append(
        "<label for='dpFormat"+id+"'>     Date Format:   </label>"+
            "<select id='dpFormat"+id+"'>"+
            "   <option value='yy-mm-dd'>Date: YYYY-MM-DD</option>"+
            "   <option value='yy-oo'>Ordinal date: YYYY-DDD</option>"+
            "</select>"
            );
      //      }
    return dateSpan;
}

//Called in header.js and setupDateTab()
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
    //Update date pickers
    $("[id^=dpStartDate]").each(function(){
        $(this).val(newStartDate);
    });
    $("[id^=dpEndDate]").each(function(){
        $(this).datepicker("option", "minDate", newStartDate);
    });

    //Update Year-Day
}

function selectEndDate(newEndDate){
    //Update date pickers
    $("[id^=dpEndDate]").each(function(){
        $(this).val(newEndDate);
    });
    $("[id^=dpStartDate]").each(function(){
        $(this).datepicker("option", "maxDate", newEndDate);
    });
    //Update Year-Day
}

function datetoYearDay(strdate, delimiter){
    var date = new Date(strdate.split(delimiter));
    var dayOne = new Date(date.getFullYear(), 0, 1); //creates Jan 1st
    var dayDiff = Math.round((date.getTime() - dayOne.getTime())/86400000)+1;  //86400000 is 1000*60*60*24 it converts the millisecond difference to days.
    return ""+date.getFullYear()+delimiter+dayDiff;
}

function yearDaytoDate(yearDay, delimiter){
    var ydSplit = yearDay.split(delimiter);
    var date = new Date(new Date(ydSplit[0], 0).setDate(ydSplit[1])); //Creates date with correct year, but with 0th day
    return ""+date.getFullYear()+delimiter+(date.getMonth()+1)+delimiter+date.getDate();
}


