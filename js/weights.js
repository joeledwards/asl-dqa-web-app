// Common weight data and functions

var weights_all = 0;
var agg_xform = [
    ['ignore'],
    ['ignore'],
    ['ignore'],
    ['keep', 'weight-availability', 100.0],
    ['count', 'weight-gaps', 100.0],
    ['count', 'weight-reversals', 100.0],
    //['count', 'weight-cal', 100.0],
    ['coherence', 'weight-coherence', 25.0, 2.0],
    ['coherence', 'weight-coherence', 25.0, 0.708],
    ['coherence', 'weight-coherence', 25.0, 0.146],
    ['coherence', 'weight-coherence', 25.0, 0.107],
    ['power', 'weight-power', 25.0, 12.85],
    ['power', 'weight-power', 25.0, 7.09],
    ['power', 'weight-power', 25.0, 5.5],
    ['power', 'weight-power', 25.0, 5.07],
    ['noise', 'weight-noise', 25.0, 12.85],
    ['noise', 'weight-noise', 25.0, 8.94],
    ['noise', 'weight-noise', 25.0, 7.56],
    ['noise', 'weight-noise', 25.0, 7.21]
];

function toggle_controls()
{
    if (controls_hidden) {
        $("#control-table").slideDown(500);
        controls_hidden = false;
        $("#control-toggle").text("Hide Controls");
    }
    else {
        $("#control-table").slideUp(500);
        controls_hidden = true;
        $("#control-toggle").text("Show Controls");
    }
}

/*
function weight_total()
{
    weights_all = 0;
    $("#control-table div.weight").each(function() {
        weights_all += get_raw_weight($(this).attr("id"));
    });
    return weights_all;
}
*/

