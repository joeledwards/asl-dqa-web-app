/*
utils.js
Author: James Holland jholland@usgs.gov
utils.js contains generic functions that are not tied to a specific project.
License: Public Domain
*/
function pad(input, size) {
    var output = input+"";
    while (output.length<size){
        output = "0"+output;
    }
    return output;
}

function pad(input, size, padder) {
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
