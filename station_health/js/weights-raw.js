// Raw weight controls

var control_map = {
    "ALL" : {
        "weight-availability" : 0,
        "weight-gaps"         : 0,
        "weight-timing"       : 0,
        "weight-coherence"    : 0,
        "weight-power"        : 0,
        "weight-noise"        : 0,
        "weight-calibration"  : 0
    },
    "STATION" : {
        "weight-availability" : 0,
        "weight-gaps"         : 0,
        "weight-timing"       : 0,
        "weight-coherence"    : 0,
        "weight-power"        : 0,
        "weight-noise"        : 0,
        "weight-calibration"  : 0
    }
};

var control_defaults = {
    "ALL" : {
        "weight-availability" : 50,
        "weight-gaps"         : 50,
        "weight-timing"       : 50,
        "weight-coherence"    : 50,
        "weight-power"        : 50,
        "weight-noise"        : 50,
        "weight-calibration"  : 50
    },
    "STATION" : {
        "weight-availability" : 50,
        "weight-gaps"         : 50,
        "weight-timing"       : 50,
        "weight-coherence"    : 50,
        "weight-power"        : 50,
        "weight-noise"        : 50,
        "weight-calibration"  : 50
    }
};

function get_raw_weight(id)
{
    return $('#'+id).slider('value');
}

function get_weight(id)
{
    return get_raw_weight(id) / weight_total(id.split('-')[0]) * 100.0; 
}

function set_control_defaults()
{
    for (var j in control_map) {
        for (var k in control_map[j]) {
            control_map[j][k] = control_defaults[j][k];
        }
    }
}

function store_table_controls()
{
    $("#control-table div.weight").each( function () {
        control_map[show_all ? "ALL" : "STATION"][$(this).attr('id')] = $(this).slider("value");
    });
}

function load_table_controls()
{
    $("#control-table div.weight").each( function () {
        $(this).slider("value", control_map[show_all ? "ALL" : "STATION"][$(this).attr('id')])
    });
    slide_stop(undefined, undefined);
}

function load_controls()
{
    $("#control-table div.weight").slider({
        range: "min",
        value: 0,
        min: 0,
        max: 100,
        step: 1,
        slide: function(event, ui) {
            return slide_event(event, ui);
        },
        stop: function(event, ui) {
            return slide_stop(event, ui);
        }
    });
}

function slide_event(event, ui) {
    return slide_stop(event, ui);
}

function slide_stop(event, ui) {
    var total = weight_total("weight");
    $("#control-table div.weight").each(function() {
        var value = $(this).slider("value") / total * 100.0;
        var percent = value / total * 100.0;
        var label_id = "#label-" + $(this).attr("id").split("-")[1];
        var label = $(label_id);
        label.text(label.text().substr(0, label.text().lastIndexOf(" ")) + " " +value.toFixed(1) +"%");
    });
    $("#weight-total").text(total.toFixed(1));

    return true;
}

