var st_network  = undefined;
var st_station  = undefined;
var st_location = undefined;
var st_channel  = undefined;
var col_1_title = "";
var col_2_title = "";
var col_3_title = "";
var place = "";
var show_all = true;
var gen_plots = false;
var plots = undefined;
var channel_plot = false;
var controls_hidden = true;
var row_index = 0;
var selected_year = 2011;
var selected_month = 8;

// Setup event bindings
$(document).ready(function() {
    $('#engine-up').val('FALSE');
    $('#table-ready').val('FALSE');
    $.ajax({cache:"false"});
    set_prototypes();
    set_control_defaults();
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
    $.tablesorter.addWidget({
        id: "callback",
        format: function (table) {
            filter();
        }
    });
    $.tablesorter.addParser({
        id: "metrics",
        is: function(s) {
            return false;
        },
        format: function(s) {
            if (isNaN(s) || (s == "") || (s == undefined) || (s == null)) {
                return null;
            }
            return s;
        },
        type: 'numeric'
    });

    $("#control-table").slideUp(1.0);
    $("#control-toggle").click(function(){
        toggle_controls();
    });
    $("#apply-weights").click(function(){
        close_controls();
        load_data();
    });
    $(window).hashchange(function(){
        close_controls();
        load_data(); // Load data fro the new context
    });
    init_filters();
    load_controls();
    load_table_controls();
    init_table();
    $(window).hashchange(); // force load of data on initial page load
}

// Check the status of stations
function load_data()
{
    reset_log();
    store_table_controls(); // Store controls from last context before updating

    $('#apply-weights').attr('disabled', 'disabled');
    $('#table').hide();
    $('#plots').hide();
    $('#up').hide();
    show_progress();
    st_network  = undefined;
    st_station  = undefined;
    st_location = undefined;
    st_channel  = undefined;
    col_1_title = "";
    col_2_title = "";
    col_3_title = "";
    place = ""
    gen_plots = false;
    channel_plot = false;

    var command = window.location.hash.replace("#", "");

    if (command == "") {
        show_all = true;
        col_1_title = "Network"
        col_2_title = "Station"
        col_3_title = ""
        $('#filter-subset').show();
        $('#filter-network').show();
        $('#filter-station').show();
        $('#filter-location').hide();
        $('#filter-channel').hide();
        $('#displaying > span.display-info').text("");
        load_table_controls();
    }
    else {
        show_all = false;
        var parts = command.split(".");
        if (parts.length < 3) {
            $('#main').append('<h1>Page Load Error!</h1>');
            $('#main').append('<h2>Invalid Command.</h2>');
            return;
        }

        place = parts[0];
        if (parts[0] == "STATION") {
            if (parts.length != 3) {
                $('#main').append('<h1>Page Load Error!</h1>');
                $('#main').append('<h2>Invalid Command.</h2>');
                return;
            }
            col_1_title = "Location";
            col_2_title = "Channel";
            col_3_title = "Rate";
            st_network = parts[1];
            st_station = parts[2];
            $('#filter-subset').hide();
            $('#filter-network').hide();
            $('#filter-station').hide();
            $('#filter-location').show();
            $('#filter-channel').show();
            $('#displaying > span.display-info').text(" (" +st_network+ "_" +st_station + ")");
            load_table_controls();
        }
        else if (parts[0] == "PLOT") {
            if (parts.length < 4) {
                $('#main').append('<h1>Page Load Error!</h1>');
                $('#main').append('<h2>Invalid Command.</h2>');
                return;
            }
            gen_plots = true;
            place = parts[0]+ '.' +parts[1];
            st_network = parts[2];
            st_station = parts[3];
            if (parts[1] == "STATION") {
                $('#up').attr('href', '#');
                $('#up').show();
                if (parts.length != 4) {
                    $('#main').append('<h1>Page Load Error!</h1>');
                    $('#main').append('<h2>Invalid Command.</h2>');
                    return;
                }
                $('#displaying > span.display-info').text(" (" +st_network+ "_" +st_station+ ")");
            }
            else if (parts[1] == "CHANNEL") {
                $('#up a').attr('href', '#STATION.'+st_network+'.'+st_station);
                $('#up').show();
                if (parts.length == 6) {
                    st_location = parts[4];
                    st_channel  = parts[5];
                }
                else {
                    $('#main').append('<h1>Page Load Error!</h1>');
                    $('#main').append('<h2>Invalid Command.</h2>');
                    return;
                }
                $('#displaying > span.display-info').text(" (" +st_network+ "_" +st_station+ " " +st_location+ "-" +st_channel+ ")");
            }
            else {
                $('#main').append('<h1>Page Load Error!</h1>');
                $('#main').append('<h2>Invalid Command.</h2>');
                return;
            }
            $('#filter-subset').hide();
            $('#filter-network').hide();
            $('#filter-station').hide();
            $('#filter-location').hide();
            $('#filter-channel').hide();
        }
        else {
            $('#main').append('<h1>Page Load Error!</h1>');
            $('#main').append('<h2>Invalid Command.</h2>');
            return;
        }
    }
    $('#displaying > span.display-month').text(month_map[selected_month]+ " " +selected_year);

    $('#col_1_header').text(col_1_title);
    $('#col_2_header').text(col_2_title);
    $('#col_3_header').text(col_3_title);

    $('#main h1').remove();
    $('#main h2').remove();
    $('#table table tbody tr.metrics').remove();
    $("#plots div").remove();

    var command_string = command;
    if (show_all) {
        command_string = "ALL";
    }
    $.get($('#data-url').val()+'?cmd='+command_string, {cache:"false"}, function(data, status, request){
        if (gen_plots) {
            plot(data, status, request);
        } else {
            table(data, status, request);
            filter();
        }
    }); 
}

