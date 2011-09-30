// Controls for weights

var control_map = {
    "ALL" : {
        "weight-availability" : 0,
        "weight-gaps"         : 0,
        "weight-reversals"    : 0,
        "weight-coherence"    : 0,
        "weight-power"        : 0,
        "weight-noise"        : 0
    },
    "STATION" : {
        "weight-availability" : 0,
        "weight-gaps"         : 0,
        "weight-reversals"    : 0,
        "weight-coherence"    : 0,
        "weight-power"        : 0,
        "weight-noise"        : 0
    }
};

var control_defaults = {
    "ALL" : {
        "weight-availability" : 20,
        "weight-gaps"         : 20,
        "weight-reversals"    :  0,
        "weight-coherence"    : 20,
        "weight-power"        : 20,
        "weight-noise"        : 20
    },
    "STATION" : {
        "weight-availability" : 20,
        "weight-gaps"         : 20,
        "weight-reversals"    :  0,
        "weight-coherence"    : 20,
        "weight-power"        : 20,
        "weight-noise"        : 20
    }
};

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

function get_weight(id)
{
    return $('#'+id).slider('value') / weight_total() * 100.0; 
}

var weights_all = 0;
function weight_total()
{
    weights_all = 0;
    $("#control-table div.weight").each(function() {
        weight_all += $(this).slider("value");
    });
}

function set_control_defaults()
{
    for (var j in control_map) {
        for (var k in control_map[j]) {
            control_map[j][k] = control_defaults[j][k];
        }
    }
}

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

function store_table_controls()
{
    $("#control-table div.weight").each( function () {
        control_map[show_all ? "ALL" : "STATIONS"][$(this).attr('id')] = $(this).slider("value");
    });
}

function load_table_controls()
{
    $("#control-table div.weight").each( function () {
        $(this).slider("value", control_map[show_all ? "ALL" : "STATIONS"][$(this).attr('id')])
    });
    slide_stop(undefined, undefined);
}

function load_controls()
{
    $("#control-table div.weight").slider({
        range: false,
        value: 0,
        min: 0,
        max: 100,
        step: 1,
        start: function(event, ui) {
            return slide_start(event, ui);
        },
        stop: function(event, ui) {
            return slide_stop(event, ui);
        },
        change: function(event, ui) {
            return slide_change(event, ui);
        },
        slide: function(event, ui) {
            return slide_event(event, ui);
        }
    });
}

function slide_start(event, ui) {}
function slide_change(event, ui) {}

function slide_stop(event, ui) {
    $("#control-table div.weight").each(function() {
        var value = $(this).slider("value");
        var percent = value / weight_total() * 100.0;
        var label_id = "#label-" + $(this).attr("id").split("-")[1];
        $(label_id).text(label.text().substr(0, label.text().lastIndexOf(" ")) + " " +value.toFixed(1));
    });
    $("#weight-remaining").text(weight_total().toFixed(1));

    return true;
}

function slide_event(event, ui) {
    // Incremental changes should dynamically update everything
    // in order to improve the user experience
    slide_stop(event, ui); 
}

