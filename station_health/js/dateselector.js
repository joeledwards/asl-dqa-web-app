/*
   dateselector.js
   Author: James Holland jholland@usgs.gov
   dateselector.js contains functions and objects connected to only the date controls
   License: Public Domain
 */
var mapYearstoMonths = {}; //Available months for each year
var mapMonthtoNum = {
    1 : "January",
    2 : "February",
    3 : "March",
    4 : "April",
    5 : "May",
    6 : "June",
    7 : "July",
    8 : "August",
    9 : "September",
    10 : "October",
    11 : "November",
    12 : "December",
    "January"   :  1,
    "February"  :  2,
    "March"     :  3,
    "April"     :  4,
    "May"       :  5,
    "June"      :  6,
    "July"      :  7,
    "August"    :  8,
    "September" :  9,
    "October"   : 10,
    "November"  : 11,
    "December"  : 12
};

//Max and Min dates for datepickers
var dpMaxDate = undefined;
var dpMinDate = undefined;

function initDates(year){
    if(getQueryString("year") != undefined)
        $("#ddlYear").val(getQueryString("year"));
    else
        $("#ddlYear").val(year);

    year_selected();

    if(getQueryString("month") != undefined)
        $("#ddlMonth").val(getQueryString("month"));

    yearMonthToStartDate();
    yearMonthToEndDate();
    $("#dpEndDate").datepicker( "option", "maxDate", dpMaxDate);
    $("#dpStartDate").datepicker( "option", "minDate", dpMinDate);
}

function getQueryDates(){
    var startDate = new Date($("#dpStartDate").val());
    var endDate = new Date($("#dpEndDate").val());
    var dates = ""  +startDate.getUTCFullYear()
        +prepad((startDate.getUTCMonth()+1),2,"0")
        +prepad(startDate.getUTCDate(),2,"0")
        +"."
        +endDate.getUTCFullYear()
        +prepad((endDate.getUTCMonth()+1),2,"0")
        +prepad(endDate.getUTCDate(),2,"0");
    return dates;
}
function yearMonthToStartDate(){
    var startDate = new Date($("#ddlYear").val(), parseInt($("#ddlMonth").val()-1),1);

    $("#dpStartDate").val(
            startDate.getUTCFullYear()+"-"+
            (startDate.getUTCMonth()+1)+"-"+
            prepad(startDate.getUTCDate(),2,"0")
            );
}

function yearMonthToEndDate(){
    var endDate = new Date($("#ddlYear").val(), parseInt($("#ddlMonth").val()),0);

    $("#dpEndDate").val(
            endDate.getUTCFullYear()+"-"+
            (endDate.getUTCMonth()+1)+"-"+
            prepad(endDate.getUTCDate(),2,"0")
            );
}


function addMonthYear(year, month){

    if ((year == undefined) || (month == undefined)) {
        return null;
    }
    if (dpMaxDate == undefined || dpMaxDate < new Date(year, parseInt(month), 0))
        dpMaxDate = new Date(year, parseInt(month), 0);
    if (dpMinDate == undefined || dpMinDate > new Date(year, parseInt(month-1), 1))
        dpMinDate =  new Date(year, parseInt(month-1), 1);

    if (mapYearstoMonths[year] == undefined) {
        mapYearstoMonths[year] = new Array();
        $("#ddlYear").append('<option value="' +year+ '">' +year+ '</option>');
    }
    mapYearstoMonths[year].push(month);
}

function year_selected()
{
    var year = $("#ddlYear").val();
    var month_list = $("#ddlMonth");
    $("#ddlMonth option").remove();
    var selected = month_list.val();
    var match = false;
    var last;
    var months = mapYearstoMonths[year];
    var month;
    for (var i in months) {
        if (months.hasOwnProperty(i)){
            month = months[i];
            month_list.append('<option value="' +month+ '">' +mapMonthtoNum[month]+ '</option>');
            last = month;
            if (month == selected) {
                match = true;
            }
        }
    }

    if (match) {
        month_list.val(selected);
    } else {
        month_list.val(last);
    }
}
