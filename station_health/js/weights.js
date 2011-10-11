// Common weight data and functions
var controls_hidden = true;

var weights_all = 0;
var agg_xform = [
    ['ignore'], // Network/Location
    ['ignore'], // Station/Channel
    ['ignore'], // --/Rate
    ['keep', 'weight-availability', 100.0], // Availability
    ['count', 'weight-gaps', 100.0], // Gap Count
    ['keep', 'weight-timing', 100.0], // Timing Quality
    ['coherence', 'weight-coherence', 25.0, 2.0],   // Coherence 4 - 8
    ['coherence', 'weight-coherence', 25.0, 0.708], // Coherence 18 - 22
    ['coherence', 'weight-coherence', 25.0, 0.146], // Coherence 90 - 110
    ['coherence', 'weight-coherence', 25.0, 0.107], // Coherence 200 - 500
    ['power', 'weight-power', 25.0, 12.85], // Power Difference 4 - 8
    ['power', 'weight-power', 25.0, 7.09],  // Power Difference 18 - 22
    ['power', 'weight-power', 25.0, 5.5],   // Power Difference 90 - 110
    ['power', 'weight-power', 25.0, 5.07],  // Power Difference 200 - 500
    ['noise', 'weight-noise', 25.0, 12.85], // Noise 4 - 8
    ['noise', 'weight-noise', 25.0, 8.94],  // Noise 18 - 22
    ['noise', 'weight-noise', 25.0, 7.56],  // Noise 90 - 110
    ['noise', 'weight-noise', 25.0, 7.21],  // Noise 200 - 500
    ['cal-days', 'weight-calibration', 33.4], // Days since last calibration
    ['cal-mae',  'weight-calibration', 33.3], // Mean corner amplitude error
    ['cal-mae',  'weight-calibration', 33.3] // Mean flat amplitude error
];

function toggle_controls()
{
    if (controls_hidden) {
        show_controls();
    }
    else {
        hide_controls();
    }
}

function close_controls()
{
    if (!controls_hidden) {
        $("#control-table").hide();
        controls_hidden = true;
        $("#control-toggle").text("Show Controls");
    }
}

function hide_controls()
{
    if (!controls_hidden) {
        $("#control-table").slideUp(500);
        controls_hidden = true;
        $("#control-toggle").text("Show Controls");
    }
}

function show_controls() {
    if (controls_hidden) {
        $("#control-table").slideDown(500);
        controls_hidden = false;
        $("#control-toggle").text("Hide Controls");
    }
}

function weight_total(class_name)
{
    weights_all = 0;
    $("#control-table div." + class_name).each(function() {
        weights_all += get_raw_weight($(this).attr("id"));
    });
    return weights_all;
}

function reset_all_weights(to_defaults)
{
    init_weights(to_defaults);
    load_table_controls();
}

function reset_weights(to_defaults)
{
    restore_weights(show_all ? "ALL" : "STATION", to_defaults);
    load_table_controls();
}

function save_weights(group)
{
    store_weights(show_all ? "ALL" : "STATION");
}

function init_weights(to_defaults)
{
    var map = get_control_map();
    for (var g in map) {
        restore_weights(g, to_defaults);
    }
}

function save_all_weights()
{
    var map = get_control_map();
    for (var g in map) {
        save_weights(g);
    }
}

