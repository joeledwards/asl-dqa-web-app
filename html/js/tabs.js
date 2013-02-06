/*
tabs.js
Author: James Holland jholland@usgs.gov
tabs.js contains functions related to the tab control.
License: Public Domain
*/


function setupTabs() {
    var jtab = $("#tabs");
    jtab.append("<ul></ul>");
    jtab.tabs({
        collapsible: true
    });
    setupDateTab(jtab);
}
