/*
 weight.js
 Author: James Holland jholland@usgs.gov
 weight.js contains variables and functions related to weighting and aggregate calculation
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
var weights = {}; //Contains available metrics and weight setting (.50) 

function addPercent(rowID, metricID, value){
    if(!isNaN(row[2])){ //Uncomputable values are sent as "n"
        /* Overlaps in percents could occur if both station 
         averages and channel averages are loaded on the same
         page. */
        if(percents[rowID] == undefined){ 
            percents[rowID] = {};
        }
        percents[rowID][metricID] = value;
        if(weights[metricID] == undefined){
            weights[metricID] = 0; //Placeholder value
        }

    }
}

function resetWeights(){
    var numMetrics = 0
    for (var wMetric in weights ){ //
        if(weights.hasOwnProperty(wMetric)){;
            numMetrics++;
        }
    }
    
    for (var mWeight in weights ){ //
        if(weights.hasOwnProperty(mWeight)){;
            weights[mWeight] = 100/numMetrics;
        }
    }
    return 100/numMetrics;
}

function calcAggr(rowID){
    var numMetrics = 0;
    var weightSum = 0;
    var aggr = 0;
    //Build sums and counts before computing aggregates
    for (var metric in percents[rowID] ){ //
        if(percents[rowID].hasOwnProperty(metric)){
            weightSum += weights[metric];
            numMetrics++;
        }
    }

    for (var metric in percents[rowID] ){ //
        if(percents[rowID].hasOwnProperty(metric)){
            //Doesn't need to be multiplied by 100 because the weight already is
            var trueWeight = weights[metric] / weightSum;
            aggr += percents[rowID][metric] * trueWeight; 
        }
    }
    return aggr;

}

function processAllAggr(){
    var rows = dataGrid.fnGetNodes();
    for(var i = 0; i<rows.length; i++){
        var rowID = $(rows[i]).attr("id");
        
            var cell = document.getElementById("a_"+rowID);
            if(cell){
                var pos = dataGrid.fnGetPosition(cell);
                dataGrid.fnUpdate(parseFloat(parseFloat(calcAggr(rowID)).toFixed(2)), pos[0], pos[2], false, false );
            }
    }
}
