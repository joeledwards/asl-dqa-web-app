/*
 weight.js
 Author: James Holland jholland@usgs.gov
 weight.js contains functions related to weighting and aggregate calculation
 License: Public Domain
 */
var percents = {}; //Contains list of objects for each metric
/* Format is like so:
 percents = {
 "station1ID" = {
 metric1ID = 100,
 metric2ID = 85
        },
        "station2ID" = ...
        OR
        "channel1ID" = {
        metric1ID = ...
    }

}
*/
var weightableMetrics = {}; //Contains available metrics and weight setting (.50) 

function addPercent(rowID, metricID, value){
    if(!isNaN(row[2])){ //Uncomputable values are sent as "n"
        /* Overlaps in percents could occur if both station 
         averages and channel averages are loaded on the same
         page. */
        if(percents[rowID] == undefined){ 
            percents[rowID] = {};
        }
        percents[rowID][metricID] = value;
        if(weightableMetrics[metricID] == undefined){
            alert(metricID);
            weightableMetrics[metricID] = 0; //Placeholder value
        }

    }
}
