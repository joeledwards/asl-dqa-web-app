/*
dateTab.js
Author: James Holland jholland@usgs.gov
dateTab.js contains functions related to the date tab.
License: Public Domain
*/
/* No longer in use Remove after no one requests year-month
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
*/

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
    $("#dpFormat"+id).change(function(){
        $("#dpStartDate"+id).datepicker("option", "dateFormat", $(this).val());
        $("#dpEndDate"+id).datepicker("option", "dateFormat", $(this).val());
    });

}

function setupFirstDate(firstDate){
    $("[id^=dpStartDate]").each(function(){
        $(this).datepicker("option", "minDate", firstDate);
    });
}

function setupLastDate(lastDate){
    $("[id^=dpEndDate]").each(function(){
        $(this).datepicker("option", "maxDate", lastDate);
    });
    var firstDate = lastDate.split("-");
    setStartDate(firstDate[0]+"-"+firstDate[1]+"-01");
    setEndDate(lastDate);
}

function setStartDate(newStartDate){
    $("[id^=dpStartDate]").each(function(){
        $(this).val(newStartDate);
    });
    $("[id^=dpEndDate]").each(function(){
        $(this).datepicker("option", "minDate", newStartDate);
    });
}

function setEndDate(newEndDate){
    $("[id^=dpEndDate]").each(function(){
        $(this).val(newEndDate);
    });
    $("[id^=dpStartDate]").each(function(){
        $(this).datepicker("option", "maxDate", newEndDate);
    });
}

function selectStartDate(newStartDate){
    $("[id^=dpEndDate]").each(function(){
        $(this).datepicker("option", "minDate", newStartDate);
    });

}

function selectEndDate(newEndDate){
    $("[id^=dpStartDate]").each(function(){
        $(this).datepicker("option", "maxDate", newEndDate);
    });
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

function getQueryDates(){
    var startDate = getStartDate('object'); 
    var endDate = getEndDate('object');
    var dates = getStartDate('query')+"."+getEndDate('query');
    return dates;
}

function getStartDate(complex){
    if (complex == 'simple')
        return $("[id^=dpStartDate]").first().val();
    else if (complex == 'object')
        return $("[id^=dpStartDate]").first().datepicker("getDate");
    else if (complex == 'query'){
        var odate = $("[id^=dpStartDate]").first().datepicker("getDate");
        return ""
        +odate.getUTCFullYear()
        +prepad((odate.getUTCMonth()+1),2,"0")
        +prepad(odate.getUTCDate(),2,"0");
    }
    else
        return $("#dpStartDate").val();
}

function getEndDate(complex){
    if (complex == 'simple')
        return $("[id^=dpEndDate]").first().val();
    else if (complex == 'object')
        return $("[id^=dpEndDate]").first().datepicker("getDate");
    else if (complex == 'query'){
        var odate = $("[id^=dpEndDate]").first().datepicker("getDate");
        return "" 
        +odate.getUTCFullYear()
        +prepad((odate.getUTCMonth()+1),2,"0")
        +prepad(odate.getUTCDate(),2,"0");
    }
    else
        return $("#dpEndDate").val();
}
