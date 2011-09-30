// Percentage based weight controls

var weight_total = 0;
var control_map = {
    "ALL" : {
        "weight-availability" : [0,101],
        "weight-gaps"         : [0,101],
        "weight-reversals"    : [0,101],
        "weight-coherence"    : [0,101],
        "weight-power"        : [0,101],
        "weight-noise"        : [0,101]
    },
    "STATION" : {
        "weight-availability" : [0,101],
        "weight-gaps"         : [0,101],
        "weight-reversals"    : [0,101],
        "weight-coherence"    : [0,101],
        "weight-power"        : [0,101],
        "weight-noise"        : [0,101]
    }
};

var control_defaults = {
    "ALL" : {
        "weight-availability" :  20,
        "weight-gaps"         :  20,
        "weight-reversals"    :   0,
        "weight-coherence"    :  20,
        "weight-power"        :  20,
        "weight-noise"        :  20
    },
    "STATION" : {
        "weight-availability" :  20,
        "weight-gaps"         :  20,
        "weight-reversals"    :   0,
        "weight-coherence"    :  20,
        "weight-power"        :  20,
        "weight-noise"        :  20
    }
};

function get_raw_weight(id)
{
    return $('#'+id).slider('values')[0];
}

function get_weight(id)
{
    return get_raw_weight(id);
}

function set_control_defaults()
{
    for (var j in control_map) {
        var remaining = 100.0;
        for (var k in control_map[j]) {
            val = control_defaults[j][k];
            if (val > remaining) {
                val = remaining;
            }
            remaining -= val;
            if (remaining <= 0.0) {
                remaining = 0.0;
                break;
            }
        }
        for (var k in control_map[j]) {
            val = control_defaults[j][k];
            control_map[j][k] = [val,Math.min(val+1.0+remaining, 101.0)];
        }
    }
}

function store_table_controls()
{
    $("#control-table div.weight").each( function () {
        var cat = show_all ? "ALL" : "STATION";
        control_map[cat][$(this).attr('id')] = $(this).slider("values");
    });
}

function load_table_controls()
{
    $("#control-table div.weight").each( function () {
        var cat = show_all ? "ALL" : "STATION";
        $(this).slider("values", control_map[cat][$(this).attr('id')])
    });
    slide_stop(undefined, undefined);
}

function refresh_controls()
{
    $("#control-table div.weight").slider();
}

function load_controls()
{
    $("#control-table div.weight").slider({
        range: true,
        values: [0,101],
        min: 0,
        max: 101,
        step: 0.1,
        slide: function(event, ui) {
            return slide_event(event, ui);
        },
        stop: function(event, ui) {
            return slide_stop(event, ui);
        }
    });
}

function slide_event(event, ui) {
    if (ui.value == ui.values[1]) {
        return false;
    }

    if (ui.values[0] >= ui.values[1]) {
        return false;
    }
    slide_stop(event, ui);
}

function slide_stop(event, ui) {
    weight_total = 0;
    $("#control-table div.weight").each(function() {
        weight_total += $(this).slider("values")[0];
    });

    if (weight_total > 100) {
        log("Weight Total: " + weight_total);
        return false;
    }
    
    $("#control-table div.weight").each(function() {
        var max = 101 - weight_total + $(this).slider("values")[0];
        if (weight_total == 0) {
            max = 101;
        }
        var value = $(this).slider("values")[0];
        $(this).slider("values", 1, max);
        $(this).slider("values", 0, value);
        var label_id = "#label-" + $(this).attr("id").split("-")[1];
        var label = $(label_id);
        label.text(label.text().substr(0, label.text().lastIndexOf(" ")) + " " +value.toFixed(1)+ "%");
    });
    $("#weight-total").text(weight_total.toFixed(1) + "%");

    return true;
}

