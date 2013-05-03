/*
dateselector.js
Author: James Holland jholland@usgs.gov
dateselector.js contains functions and objects connected to only the date controls
License: Public Domain
*/

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


function initDates(){
    if(getQueryString("sdate") != undefined && getQueryString("edate") != undefined){
        $("#dpStartDate").val(getQueryString("sdate"));
        $("#dpEndDate").val(getQueryString("edate"));
    }
    //Set Minimums and maximums
    $("#dpStartDate").datepicker("option", "minDate", dpMinDate);
    $("#dpStartDate").datepicker("option", "maxDate", getEndDate('simple'));
    $("#dpEndDate").datepicker("option", "maxDate", dpMaxDate);
    $("#dpEndDate").datepicker("option", "minDate", getStartDate('simple'));
}

function getQueryDates(){
    var startDate = getStartDate('object'); 
    var endDate = getEndDate('object');
    var dates = getStartDate('query')+"."+getEndDate('query');
    return dates;
}

function getStartDate(complex){
    if (complex == 'simple')
        return $("#dpStartDate").val();
    else if (complex == 'object')
        return new Date($("#dpStartDate").val());
    else if (complex == 'query'){
        var odate = new Date($("#dpStartDate").val());
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
        return $("#dpEndDate").val();
    else if (complex == 'object')
        return new Date($("#dpEndDate").val());
    else if (complex == 'query'){
        var odate = new Date($("#dpEndDate").val());
        return "" 
        +odate.getUTCFullYear()
        +prepad((odate.getUTCMonth()+1),2,"0")
        +prepad(odate.getUTCDate(),2,"0");
    }
    else
        return $("#dpEndDate").val();
}


//Year Month functions. Delete once sure no longer needed.
/*function yearMonthToStartDate(){
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

function yearSelected()
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

*/


