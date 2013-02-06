/*
dateTab.js
Author: James Holland jholland@usgs.gov
dateTab.js contains functions related to the date tab.
License: Public Domain
*/

//setupDateTab is passed the jquery object to append needed objects to.
function setupDateTab(jTabs) {
    var dateTab = $("<span id='tDate'>YAY</span>");
    jTabs.append(dateTab);
    jTabs.tabs("add", "#tDate", "Dates");
}
