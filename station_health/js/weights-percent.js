// Percentage based weight controls

var control_map = {
    "ALL" : {
        "weight-availability" : [0,101],
        "weight-gaps"         : [0,101],
        "weight-timing"       : [0,101],
        "weight-coherence"    : [0,101],
        "weight-power"        : [0,101],
        "weight-noise"        : [0,101],
        "weight-calibration"  : [0,101]
    },
    "STATION" : {
        "weight-availability" : [0,101],
        "weight-gaps"         : [0,101],
        "weight-timing"       : [0,101],
        "weight-coherence"    : [0,101],
        "weight-power"        : [0,101],
        "weight-noise"        : [0,101],
        "weight-calibration"  : [0,101]
    }
};

var control_defaults = {
    "ALL" : {
        "weight-availability" :  14.3,
        "weight-gaps"         :  14.3,
        "weight-timing"       :  14.3,
        "weight-coherence"    :  14.3,
        "weight-power"        :  14.3,
        "weight-noise"        :  14.3,
        "weight-calibration"  :  14.3
    },
    "STATION" : {
        "weight-availability" :  14.3,
        "weight-gaps"         :  14.3,
        "weight-timing"       :  14.3,
        "weight-coherence"    :  14.3,
        "weight-power"        :  14.3,
        "weight-noise"        :  14.3,
        "weight-calibration"  :  14.3
    }
};

function get_control_map(){return control_map;}

function get_raw_weight(id)
{
    return $('#'+id).slider('values')[0];
}

function get_weight(id)
{
    return get_raw_weight(id);
}

function get_stored_weight(group, id)
{
    return $.jStore.get(group+ '-' +id+ '-percent');
}

function restore_weights(group, to_defaults)
{
    var remaining = 100.0;
    for (var i in control_map[group]) {
        var val = get_stored_weight(group,i);
        var value = (to_defaults || (!val)) ? control_defaults[group][i] : val;
        if (value > remaining) {
            value = remaining;
        }
        remaining -= value;
        if (remaining <= 0.0) {
            remaining = 0.0;
            break;
        }
    }
    for (var i in control_map[group]) {
        var val = get_stored_ewight(group,i);
        var value = (to_defaults || (val == false)) ? control_defaults[group][i] : val;
        control_map[group][i] = [value,Math.min(value+1.0+remaining, 101.0)];
    }
}

function store_table_controls()
{
    $("#control-table div.weight").each( function () {
        control_map[show_all ? "ALL" : "STATION"][$(this).attr('id')] = $(this).slider("values");
    });
}

function load_table_controls()
{
    $("#control-table div.weight").each( function () {
        $(this).slider("values", control_map[show_all ? "ALL" : "STATION"][$(this).attr('id')])
    });
    slide_stop(undefined, undefined);
}

function zero_table_controls()
{
    $("#control-table div.weight").each( function () {
        $(this).slider("values", control_map[show_all ? "ALL" : "STATION"][0, 101])
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
    var total = weight_total("weight");

    if (total > 100) {
        return false;
    }
    
    $("#control-table div.weight").each(function() {
        var max = 101 - total + $(this).slider("values")[0];
        if (total == 0) {
            max = 101;
        }
        var value = $(this).slider("values")[0];
        $(this).slider("values", 1, max);
        $(this).slider("values", 0, value);
        var label_id = "#label-" + $(this).attr("id").split("-")[1];
        var label = $(label_id);
        label.text(label.text().substr(0, label.text().lastIndexOf(" ")) + " " +value.toFixed(1)+ "%");
    });
    $("#weight-total").text(total.toFixed(1) + "%");

    return true;
}

function store_weights(group) {
    var group_name = group;
    $("#control-table div.weight").each(function() {
        var key = group_name+ '-' +$(this).attr('id')+ '-percent';
        var values = $(this).slider("values");
        $.jStore.set(key, values[0]);
    });
}

