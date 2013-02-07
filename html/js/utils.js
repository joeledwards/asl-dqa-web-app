/*
 utils.js
 Author: James Holland jholland@usgs.gov
 utils.js contains generic functions that are not tied to a specific project.
 License: Public Domain
 */

function prepad(input, size, padder) {
    var output = input+"";
    while (output.length<size){
        output = ""+padder+output;
    }
    return output;
}

function getQueryString(key) {
    var queryStrings = window.location.search.substring(1).split('&');
    for(var i = 0; i < queryStrings.length; i++){
        var queryString = queryStrings[i].split('=');
        if(queryString[0] == key)
            return queryString[1];
    }
    return null;
}

function parseDate(datein, delimiter){
    var datea = datein.split(""+delimiter);
    return new Date(datea[0],(datea[1]-1),datea[2]);
}

function getDayofYear(datein, delimiter){
    var datea = datein.split(""+delimiter);
    var jDate = new Date(datea[0],(datea[1]-1),datea[2]);
    var dayOne = new Date(datea[0], 0);
    return ""+datea[0]+delimiter+((jDate.valueOf()-dayOne.valueOf())/1000/60/60/24 + 1);
    
}
