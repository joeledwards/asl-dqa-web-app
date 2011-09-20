var st_network  = undefined;
var st_station  = undefined;
var st_location = undefined;
var st_channel  = undefined;
var col_1_title = "";
var col_2_title = "";
var place = ""
var gen_plots = false;
var channel_plot = false;
var controls_hidden = true;

// Setup event bindings
$(document).ready(function() {
    $.ajax({cache:"false"});
    set_prototypes();
    $.extend($.jStore.defaults);
    $.jStore.load();
});

// Confirm that jStore Engine is Ready
$.jStore.ready(function(engine){
    engine.connect();
    engine.ready(function(){
        if ($('#engine-up').val() != 'TRUE') {
            $('#engine-up').val('TRUE');
            jstore_onload();
        }
    });
});

// We wait to load most features until jStore is online
function jstore_onload()
{
    try {
        $.jStore.set('TEST', 'SUCCESS');
    } catch (e) {
        alert("Wow, a little behind the times are we?! Please update your web browser.");
    }
    $("#control-edit").slideUp(1.0);
    $("#control-toggle").click(function(){
        toggle_controls();
    });
    $(window).hashchange(function(){
        load_data();
    });
    $(window).hashchange(); // force load of data on initial page load
}

function toggle_controls()
{
    if (controls_hidden) {
        $("#control-edit").slideDown(500);
        controls_hidden = false;
        $("#control-toggle").text("Hide Controls");
    }
    else {
        $("#control-edit").slideUp(500);
        controls_hidden = true;
        $("#control-toggle").text("Show Controls");
    }
}

// Check the status of stations
function load_data()
{
    // Summary of All Stations
    "/"
    // Summary of One Station (Each Channel)
    "/station/[NN_]SSSSS/"
    // Station Plots
    "/plots/[NN_]SSSSS/"
    // Channel Plots
    "/plots/[NN_]SSSSS/[LL-]CCC/"
    st_network  = undefined;
    st_station  = undefined;
    st_location = undefined;
    st_channel  = undefined;
    col_1_title = "";
    col_2_title = "";
    place = ""
    gen_plots = false;
    channel_plot = false;

    var command = window.location.hash.replace("#", "");

    if (command == "") {
        col_1_title = "Network"
        col_2_title = "Station"
    }
    else {
        var parts = command.split("-");
        if ((parts.length < 3) || (parts.length > 6)) {
            $('#main').append('<h1>Page Load Error!</h1>');
            $('#main').append('<h2>Invalid Command.</h2>');
            return;
        }

        place = parts[0];
        if (parts[0] == "station") {
            if (parts.length != 3) {
                $('#main').append('<h1>Page Load Error!</h1>');
                $('#main').append('<h2>Invalid Command.</h2>');
                return;
            }
            col_1_title = "Location"
            col_2_title = "Channel"
            st_network = parts[1];
            st_station = parts[2];
        }
        else if (parts[0] == "plot") {
            if (parts.length < 4) {
                $('#main').append('<h1>Page Load Error!</h1>');
                $('#main').append('<h2>Invalid Command.</h2>');
                return;
            }
            gen_plots = true;
            place = parts[0]+ '-' +parts[1];
            st_network = parts[2];
            st_station = parts[3];
            if (parts[1] == "station") {
                if (parts.length != 4) {
                    $('#main').append('<h1>Page Load Error!</h1>');
                    $('#main').append('<h2>Invalid Command.</h2>');
                    return;
                }
            }
            else if (parts[1] == "channel") {
                if (parts.length != 6) {
                    $('#main').append('<h1>Page Load Error!</h1>');
                    $('#main').append('<h2>Invalid Command.</h2>');
                    return;
                }
                st_location = parts[4];
                st_channel  = parts[5];
            }
            else {
                $('#main').append('<h1>Page Load Error!</h1>');
                $('#main').append('<h2>Invalid Command.</h2>');
                return;
            }
        }
        else {
            $('#main').append('<h1>Page Load Error!</h1>');
            $('#main').append('<h2>Invalid Command.</h2>');
            return;
        }
    }

    $('#main > h1').remove();
    $('#main > h2').remove();
    $('#metrics').remove();
    if (command == "") {
        $.get($('#data-url').val(), {cache:"false"}, function(data, status, request){
            load(data, status, request);
        }); 
    } 
    else {
        $.get($('#data-url').val()+'?cmd='+command, {cache:"false"}, function(data, status, request){
            load(data, status, request);
        }); 
    }

    load_controls();
}

function load_controls()
{
    $("div.slider").slider({
        range: true,
        values: [0,101],
        min: 0,
        max: 101,
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

function log(text) {
    $("#log").val(text);
}

var slider_total;
function slide_start(event, ui) {
}

function slide_change(event, ui) {
}

function slide_stop(event, ui) {
    slider_total = 0;
    $("div.slider").each(function () {
        slider_total += $(this).slider("values")[0];
    });
    if (slider_total > 100) {
        return false;
    }
    
    $("div.slider").each(function() {
        var max = 101 - slider_total + $(this).slider("values")[0];
        if (slider_total == 0) {
            max = 101;
        }
        var value = $(this).slider("values")[0];
        $(this).slider("values", 1, max);
        $(this).slider("values", 0, value);
        var label_id = "#label-" + $(this).attr("id").split("-")[1]
        var label = $(label_id);
        label.text(label.text().split(" ")[0]+ " " +value+ "%")
    });
    $("#slider-remaining").text((100 - slider_total) + "%");
    return true;
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

// Load the data
function load(data, status, request)
{

    var rows = data.split('\n')//.sort(row_sort);

// === Display Plots ===========================================
    if (gen_plots) {
        if (channel_plot) {
            $('#main').append('<h1>Station Metric Plotting not Implemented!</h1>');
        }
        else {
            $('#main').append('<h1>Channel Metric Plotting not Implemented!</h1>');
        }
        return;
    }

// === Display Metrics =========================================
    $('#table').append('\
        <table id="metrics" class="tablesorter">\
        <thead>\
        <tr>\
            <th>' +col_1_title+ '</th>\
            <th>' +col_2_title+ '</th>\
            <th>Availability</th>\
            <th>Gap Count</th>\
            <th>Reversals</th>\
            <th>Aggregate</th>\
            <th></th>\
        </tr>\
        </thead>\
        <tbody id="metrics-body">\
        </tbody>\
        </table>');

    var weights = [
        [false, "",     0, 0],
        [false, "",     0, 0],
        [true,  "mul",  1, 500],
        [true,  "div",  1, 100],
        [true,  "div",  1, 25]];

    var weight_total = 1;
    for (var i in weights) {
        if (weights[i][0] && weights[i][2]) {
            weight_total *= weights[i][3];
        }
    }

    for (var i in rows) {
        // Skip this row if it is empty.
        if ((rows[i] == undefined) || (rows[i].trim() == '')) {
            //alert("skipping index " + i);
            continue;
        }

        var items = rows[i].split(",");
        var line_id = items[0] + '-' + items[1]
        $('#metrics-body').append('<tr class="metrics" id="' + line_id + '"></tr>');
        var row = $('#'+line_id);

        var display_id = 'display-' + line_id;
        var plot_id = 'plot-' + line_id;

        var aggregate = 0;
        var link = items[1];
        if (place == "") {
            link = '<a id="' +display_id+ '" href="#station-' +items[0]+ '-' + items[1]+ '">' +items[1]+ '</a>';
        }
        for (var j in items) {
            if (j == 1) {
                row.append('<td>' + link + '</td>');
            }
            else {
                row.append('<td>' + items[j] + '</td>');
            }
            var weight = weights[j];
            if (weight[0]) {
                if (weight[1] == "mul") {
                    aggregate += items[j] * weight[2] * weight[3];
                }
                else if (weight[1] == "div") {
                    if (items[j] == 0) {
                        aggregate *= weight[2] * weight[3];
                    } else {
                        partial = weight[2] / items[j];
                        if (partial < 0.1) {
                            partial = 0.1;
                        }
                        aggregate *= partial * weight[3];
                    }
                }
                else if (weight[1] == "root") {
                    if (items[j] == 0) {
                        aggregate *= 1.0 * weight[3];
                    } else {
                        aggregate *= nthroot(items[j], weight[2]) * weight[3];
                    }
                }
                else {
                    aggregate *= items[j] * weight[3];
                }
            }
        }
        row.append('<td>' + (aggregate / weight_total).toFixed(2) + '</td>');
        var cmd_hash = ""
        if (place == "") {
            cmd_hash = "plot-station-" +items[0]+ "-" +items[1];
        }
        else {
            cmd_hash = "plot-channel-" +st_network+ "-" +st_station+ "-" +items[0]+ "-" +items[1];
        }
        row.append('<td><a id="' +plot_id+ '" href="#'+cmd_hash+'">Plot</a></td>');
    }

    $("#metrics").tablesorter({
        headers: {
            6: {
                sorter: false
            }
        }
    });
}

function nthroot(x, n) {
    try {
        var negate = n % 2 == 1 && x < 0;
        if (negate) {
            x = -x;
        }
        var possible = Math.pow(x, 1 / n);
        n = Math.pow(possible, n);
        if (Math.abs(x - n) < 1 && (x > 0 == n > 0))
            return negate ? -possible : possible;
    } catch(e) {}
}

function stamp_to_string(time_string) {
    var d = $.datepicker.parseDate("yy oo", time_string.substring(0, 8));
    var yday = Math.ceil($.datepicker.formatDate("oo", d));
    var result = $.datepicker.formatDate("yy/mm/dd", d) + ' (' + pad_digits(yday, 3) + ')' + time_string.substring(8);
    return result;
}

function pad_digits(number, total_digits) {
    number = number.toString();
    var pad = '';
    if (total_digits > number.length) {
        for (i=0; i < (total_digits - number.length); i++) {
            pad += '0';
        }
    }
    return pad + number.toString();
}

function time_to_string(milliseconds) {
    var d = new Date(milliseconds);
    var year   = lzpad(d.getUTCFullYear(), 4);
    var month  = lzpad(d.getUTCMonth()+1 , 2);
    var day    = lzpad(d.getUTCDate()    , 2);
    var hour   = lzpad(d.getUTCHours()   , 2);
    var minute = lzpad(d.getUTCMinutes() , 2);
    var second = lzpad(d.getUTCSeconds() , 2);
    var s = ''+year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second+' UTC';
    return s;
}

function stamp_to_time(time_string) {
    var d = $.datepicker.parseDate("yy oo", time_string.substring(0, 8));
    var s = $.datepicker.formatDate("yy/mm/dd ", d) + time_string.substring(8) + ' UTC';
    return Date.parse(s);
}

function lzpad(value, total) {
    var v = value.toString();
    var pad = '';
    if (total > v.length) {
        for (var i=0; i < (total - v.length); i++) {
            pad += '0';
        }
    }
    return pad + value.toString();
}

// Custom prototypes for existing Javascript objects
function set_prototypes()
{
    /**
     * sprintf(format, argument_list)
     *
     * The string function like one in C/C++, PHP, Perl
     * Each conversion specification is defined as below:
     *
     * %[index][alignment][padding][width][precision]type
     *
     * index        An optional index specifier that changes the order of the 
     *              arguments in the list to be displayed.
     * alignment    An optional alignment specifier that says if the result should be 
     *              left-justified or right-justified. The default is 
     *              right-justified; a "-" character here will make it left-justified.
     * padding      An optional padding specifier that says what character will be 
     *              used for padding the results to the right string size. This may 
     *              be a space character or a "0" (zero character). The default is to 
     *              pad with spaces. An alternate padding character can be specified 
     *              by prefixing it with a single quote ('). See the examples below.
     * width        An optional number, a width specifier that says how many 
     *              characters (minimum) this conversion should result in.
     * precision    An optional precision specifier that says how many decimal digits 
     *              should be displayed for floating-point numbers. This option has 
     *              no effect for other types than float.
     * type         A type specifier that says what type the argument data should be 
     *              treated as. Possible types:
     *
     * % - a literal percent character. No argument is required.  
     * b - the argument is treated as an integer, and presented as a binary number.
     * c - the argument is treated as an integer, and presented as the character 
     *      with that ASCII value.
     * d - the argument is treated as an integer, and presented as a decimal number.
     * u - the same as "d".
     * f - the argument is treated as a float, and presented as a floating-point.
     * o - the argument is treated as an integer, and presented as an octal number.
     * s - the argument is treated as and presented as a string.
     * x - the argument is treated as an integer and presented as a hexadecimal 
     *       number (with lowercase letters).
     * X - the argument is treated as an integer and presented as a hexadecimal 
     *       number (with uppercase letters).
     */
    String.prototype.sprintf = function()
    {
        var args = arguments;
        var index = 0;

        var x;
        var ins;
        var fn;

        /*
         * The callback function accepts the following properties
         *      x.index contains the substring position found at the origin string
         *      x[0] contains the found substring
         *      x[1] contains the index specifier (as \d+\$ or \d+#)
         *      x[2] contains the alignment specifier ("+" or "-" or empty)
         *      x[3] contains the padding specifier (space char, "0" or defined as '.)
         *      x[4] contains the width specifier (as \d*)
         *      x[5] contains the floating-point precision specifier (as \.\d*)
         *      x[6] contains the type specifier (as [bcdfosuxX])
         */
        return this.replace(String.prototype.sprintf.re, function()
        {
            if ( arguments[0] == "%%" ) {
                return "%";
            }

            x = [];
            for (var i = 0; i < arguments.length; i++) {
                x[i] = arguments[i] === undefined 
                     ? "" 
                     : arguments[i];
            }

            //index++;
            ins = (x[1]) 
                ? args[x[1].substring(0, x[1].length - 1) - 1] 
                : args[index];
            index++;

            switch (x[6]) {
            case "b":
                //ins = Number(ins).bin();
                ins = Number(ins);
                fn = Number.prototype.bin;
                break;
            case "c":
                ins = String.fromCharCode(ins);
                fn = String.prototype.padding;
                break;
            case "d":
            case "u":
                //ins = Number(ins).dec();
                ins = Number(ins);
                fn = Number.prototype.dec;
                break;
            case "f":
                ins = Number(ins);
                fn = String.prototype.padding;
                if (x[5]) {
                    ins = ins.toFixed(x[5].substr(1));
                } else if (x[4]) {
                    ins = ins.toExponential(x[4]);
                } else {
                    ins = ins.toExponential();
                }
                // Invert sign because this is not number but string
                x[2] = x[2] == "-" ? "+" : "-";
                break;
            case "o":
                //ins = Number(ins).oct();
                ins = Number(ins);
                fn = Number.prototype.oct;
                break;
            case "s":
                ins = String(ins);
                fn = String.prototype.padding;
                break;
            case "x":
                //ins = Number(ins).hexl();
                ins = Number(ins);
                fn = Number.prototype.hexl;
                break;
            case "X":
                //ins = Number(ins).hex();
                ins = Number(ins);
                fn = Number.prototype.hex;
                break;
            }

            return fn.call(ins, 
                x[2] + x[4], 
                x[3].substr(x[3].length - 1) || " ");
        });
    };
    String.prototype.sprintf.re = /%%|%(\d+[\$#])?([+-])?('.|0| )?(\d*)(\.\d*)?([bcdfosuxX])/g;
    //'
    String.prototype.trim = function() {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
    Date.prototype.getDOY = function() {
        var onejan = new Date(this.getFullYear(),0,1);
        return Math.ceil((this - onejan) / 86400000);
    };
}

