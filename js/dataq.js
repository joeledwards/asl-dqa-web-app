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

var month_map = {
     1 : "January",
     2 : "February",
     3 : "March",
     4 : "April",
     5 : "May",
     6 : "June",
     7 : "July",
     8 : "August",
     9 : "September",
    10 : "October",
    11 : "November",
    12 : "December",
    "January"   :  1,
    "February"  :  2,
    "March"     :  3,
    "April"     :  4,
    "May"       :  5,
    "June"      :  6,
    "July"      :  7,
    "August"    :  8,
    "September" :  9,
    "October"   : 10,
    "November"  : 11,
    "December"  : 12
}

var filters = {
    'filter-network'  : null,
    'filter-station'  : null,
    'filter-location' : null,
    'filter-channel'  : null};

var subsets = {
    'CU_ANWB' : ['ALL', 'GSN', 'CU', 'CARIBBEAN', 'MPINT'],
    'CU_BBGH' : ['ALL', 'GSN', 'CU', 'CARIBBEAN', 'MPINT'], 
    'CU_BCIP' : ['ALL', 'GSN', 'CU', 'CARIBBEAN', 'MPINT', 'CAMERICA'], 
    'CU_GRGR' : ['ALL', 'GSN', 'CU', 'CARIBBEAN', 'MPINT'], 
    'CU_GRTK' : ['ALL', 'GSN', 'CU', 'CARIBBEAN', 'MPINT'], 
    'CU_GTBY' : ['ALL', 'GSN', 'CU', 'CARIBBEAN', 'MPINT'], 
    'CU_MTDJ' : ['ALL', 'GSN', 'CU', 'CARIBBEAN', 'MPINT'], 
    'CU_SDDR' : ['ALL', 'GSN', 'CU', 'CARIBBEAN', 'MPINT'], 
    'CU_TGUH' : ['ALL', 'GSN', 'CU', 'CARIBBEAN', 'MPINT', 'CAMERICA'],
    'IC_BJT'  : ['ALL', 'GSN', 'IC', 'CDSN', 'CHINA', 'ASIA'],
    'IC_ENH'  : ['ALL', 'GSN', 'IC', 'CDSN', 'CHINA', 'ASIA'],
    'IC_HIA'  : ['ALL', 'GSN', 'IC', 'CDSN', 'CHINA', 'ASIA'],
    'IC_KMI'  : ['ALL', 'GSN', 'IC', 'CDSN', 'CHINA', 'ASIA'],
    'IC_LSA'  : ['ALL', 'GSN', 'IC', 'CDSN', 'CHINA', 'ASIA'],
    'IC_MDJ'  : ['ALL', 'GSN', 'IC', 'CDSN', 'CHINA', 'ASIA'],
    'IC_QIZ'  : ['ALL', 'GSN', 'IC', 'CDSN', 'CHINA', 'ASIA'],
    'IC_SSE'  : ['ALL', 'GSN', 'IC', 'CDSN', 'CHINA', 'ASIA'],
    'IC_WMQ'  : ['ALL', 'GSN', 'IC', 'CDSN', 'CHINA', 'ASIA'],
    'IC_XAN'  : ['ALL', 'GSN', 'IC', 'CDSN', 'CHINA', 'ASIA'],
    'IU_ADK'  : ['ALL', 'GSN', 'IU', 'ADK'], 
    'IU_AFI'  : ['ALL', 'GSN', 'IU', 'PTWC', 'PACIFIC'],
    'IU_ANMO' : ['ALL', 'GSN', 'IU', 'USA', 'NAMERICA'],
    'IU_ANTO' : ['ALL', 'GSN', 'IU', 'EUROPE'],
    'IU_BBSR' : ['ALL', 'GSN', 'IU', 'ATLANTIC'],
    'IU_BILL' : ['ALL', 'GSN', 'IU', 'GSRAS', 'RUSSIA', 'ASIA'],
    'IU_CASY' : ['ALL', 'GSN', 'IU', 'ANTARCTIC'],
    'IU_CCM'  : ['ALL', 'GSN', 'IU', 'ANSS', 'USA', 'NAMERICA'],
    'IU_CHTO' : ['ALL', 'GSN', 'IU', 'ASIA'],
    'IU_COLA' : ['ALL', 'GSN', 'IU', 'USA', 'NAMERICA'],
    'IU_COR'  : ['ALL', 'GSN', 'IU', 'ANSS', 'USA', 'NAMERICA'],
    'IU_CTAO' : ['ALL', 'GSN', 'IU', 'AUSTRALIA'],
    'IU_DAV'  : ['ALL', 'GSN', 'IU', 'GCI'],
    'IU_DWPF' : ['ALL', 'GSN', 'IU', 'ANSS', 'USA', 'NAMERICA'],
    'IU_FUNA' : ['ALL', 'GSN', 'IU', 'PTWC', 'PACIFIC'],
    'IU_FURI' : ['ALL', 'GSN', 'IU', 'AFRICA'],
    'IU_GRFO' : ['ALL', 'GSN', 'IU', 'EUROPE'],
    'IU_GNI'  : ['ALL', 'GSN', 'IU', 'GCI', 'ASIA'],
    'IU_GUMO' : ['ALL', 'GSN', 'IU', 'PACIFIC'],
    'IU_HKT'  : ['ALL', 'GSN', 'IU', 'ANSS', 'USA', 'NAMERICA'],
    'IU_HNR'  : ['ALL', 'GSN', 'IU', 'GCI'],
    'IU_HRV'  : ['ALL', 'GSN', 'IU', 'USA', 'NAMERICA'],
    'IU_INCN' : ['ALL', 'GSN', 'IU', 'ASIA'],
    'IU_JOHN' : ['ALL', 'GSN', 'IU', 'PTWC', 'PACIFIC'],
    'IU_KBL'  : ['ALL', 'GSN', 'IU', 'ASIA'],
    'IU_KBS'  : ['ALL', 'GSN', 'IU'],
    'IU_KEV'  : ['ALL', 'GSN', 'IU', 'EUROPE'],
    'IU_KIEV' : ['ALL', 'GSN', 'IU', 'EUROPE'],
    'IU_KIP'  : ['ALL', 'GSN', 'IU', 'PTWC', 'USA', 'PACIFIC'],
    'IU_KMBO' : ['ALL', 'GSN', 'IU', 'GCI', 'AFRICA'],
    'IU_KNTN' : ['ALL', 'GSN', 'IU', 'PTWC', 'PACIFIC'],
    'IU_KONO' : ['ALL', 'GSN', 'IU', 'EUROPE'],
    'IU_KOWA' : ['ALL', 'GSN', 'IU', 'AFRICA'],
    'IU_LCO'  : ['ALL', 'GSN', 'IU', 'SAMERICA'],
    'IU_LSZ'  : ['ALL', 'GSN', 'IU', 'GCI', 'AFRICA'],
    'IU_LVC'  : ['ALL', 'GSN', 'IU', 'GCI', 'SAMERICA'],
    'IU_MA2'  : ['ALL', 'GSN', 'IU', 'GSRAS', 'RUSSIA', 'ASIA'],
    'IU_MACI' : ['ALL', 'GSN', 'IU', 'AFRICA'],
    'IU_MAJO' : ['ALL', 'GSN', 'IU', 'ASIA'],
    'IU_MAKZ' : ['ALL', 'GSN', 'IU', 'ASIA'],
    'IU_MBWA' : ['ALL', 'GSN', 'IU', 'AUSTRALIA'],
    'IU_MIDW' : ['ALL', 'GSN', 'IU', 'PTWC', 'PACIFIC'],
    'IU_MSKU' : ['ALL', 'GSN', 'IU', 'GCI', 'AFRICA'],
    'IU_NWAO' : ['ALL', 'GSN', 'IU', 'AUSTRALIA'],
    'IU_OTAV' : ['ALL', 'GSN', 'IU', 'SAMERICA', 'MPINT'],
    'IU_PAB'  : ['ALL', 'GSN', 'IU', 'EUROPE'],
    'IU_PAYG' : ['ALL', 'GSN', 'IU', 'PACIFIC', 'MPINT'],
    'IU_PET'  : ['ALL', 'GSN', 'IU', 'GSRAS', 'RUSSIA', 'ASIA'],
    'IU_PMG'  : ['ALL', 'GSN', 'IU', 'PTWC'],
    'IU_PMSA' : ['ALL', 'GSN', 'IU', 'ANTARCTIC'],
    'IU_POHA' : ['ALL', 'GSN', 'IU', 'PTWC', 'USA', 'PACIFIC'],
    'IU_PTCN' : ['ALL', 'GSN', 'IU', 'PACIFIC'],
    'IU_PTGA' : ['ALL', 'GSN', 'IU', 'GCI', 'SAMERICA'],
    'IU_QSPA' : ['ALL', 'GSN', 'IU', 'ANTARCTIC'],
    'IU_RAO'  : ['ALL', 'GSN', 'IU', 'GCI', 'PACIFIC'],
    'IU_RAR'  : ['ALL', 'GSN', 'IU', 'GCI', 'PACIFIC'],
    'IU_RCBR' : ['ALL', 'GSN', 'IU', 'GCI', 'SAMERICA'],
    'IU_RSSD' : ['ALL', 'GSN', 'IU', 'ANSS', 'USA', 'NAMERICA'],
    'IU_SAML' : ['ALL', 'GSN', 'IU', 'SAMERICA', 'MPINT'],
    'IU_SBA'  : ['ALL', 'GSN', 'IU', 'ANTARCTIC'],
    'IU_SDV'  : ['ALL', 'GSN', 'IU', 'GCI', 'SAMERICA'],
    'IU_SFJD' : ['ALL', 'GSN', 'IU', 'GCI'],
    'IU_SJG'  : ['ALL', 'GSN', 'IU', 'CARIBBEAN'],
    'IU_SLBS' : ['ALL', 'GSN', 'IU', 'CAMERICA', 'MPINT'],
    'IU_SNZO' : ['ALL', 'GSN', 'IU'],
    'IU_SSPA' : ['ALL', 'GSN', 'IU', 'ANSS', 'USA', 'NAMERICA'],
    'IU_TARA' : ['ALL', 'GSN', 'IU', 'PTWC', 'PACIFIC'],
    'IU_TATO' : ['ALL', 'GSN', 'IU', 'ASIA'],
    'IU_TEIG' : ['ALL', 'GSN', 'IU', 'GCI', 'CAMERICA'],
    'IU_TIXI' : ['ALL', 'GSN', 'IU', 'GSRAS', 'RUSSIA', 'ASIA'],
    'IU_TRIS' : ['ALL', 'GSN', 'IU', 'GCI', 'ATLANTIC'],
    'IU_TRQA' : ['ALL', 'GSN', 'IU', 'SAMERICA', 'MPINT'],
    'IU_TSUM' : ['ALL', 'GSN', 'IU', 'GCI', 'AFRICA'],
    'IU_TUC'  : ['ALL', 'GSN', 'IU', 'USA', 'NAMERICA'],
    'IU_ULN'  : ['ALL', 'GSN', 'IU', 'ASIA'],
    'IU_WAKE' : ['ALL', 'GSN', 'IU', 'PTWC', 'PACIFIC'],
    'IU_WCI'  : ['ALL', 'GSN', 'IU', 'ANSS', 'USA', 'NAMERICA'],
    'IU_WVT'  : ['ALL', 'GSN', 'IU', 'ANSS', 'USA', 'NAMERICA'],
    'IU_XMAS' : ['ALL', 'GSN', 'IU', 'PTWC', 'PACIFIC'],
    'IU_YAK'  : ['ALL', 'GSN', 'IU', 'GSRAS', 'RUSSIA', 'ASIA'],
    'IU_YSS'  : ['ALL', 'GSN', 'IU', 'GSRAS', 'RUSSIA', 'ASIA'],
    'GT_BOSA' : ['ALL', 'GT'],
    'GT_CPUP' : ['ALL', 'GT'],
    'GT_DBIC' : ['ALL', 'GT'],
    'GT_LBTB' : ['ALL', 'GT'],
    'GT_LPAZ' : ['ALL', 'GT'],
    'GT_PLCA' : ['ALL', 'GT'],
    'GT_VNDA' : ['ALL', 'GT'],
    'IW_DLMT' : ['ALL', 'IW'],
    'IW_FLWY' : ['ALL', 'IW'],
    'IW_FXWY' : ['ALL', 'IW'],
    'IW_IMW'  : ['ALL', 'IW'],
    'IW_LOHW' : ['ALL', 'IW'],
    'IW_MFID' : ['ALL', 'IW'],
    'IW_MOOW' : ['ALL', 'IW'],
    'IW_PHWY' : ['ALL', 'IW'],
    'IW_PLID' : ['ALL', 'IW'],
    'IW_REDW' : ['ALL', 'IW'],
    'IW_RWWY' : ['ALL', 'IW'],
    'IW_SMCO' : ['ALL', 'IW'],
    'IW_SNOW' : ['ALL', 'IW'],
    'IW_TPAW' : ['ALL', 'IW'],
    'US_AAM'  : ['ALL', 'US'],
    'US_ACSO' : ['ALL', 'US'],
    'US_AGMN' : ['ALL', 'US'],
    'US_AMTX' : ['ALL', 'US'],
    'US_BINY' : ['ALL', 'US'],
    'US_BLA'  : ['ALL', 'US'],
    'US_BMO'  : ['ALL', 'US'],
    'US_BOZ'  : ['ALL', 'US'],
    'US_BRAL' : ['ALL', 'US'],
    'US_BW06' : ['ALL', 'US'],
    'US_CBKS' : ['ALL', 'US'],
    'US_CBN'  : ['ALL', 'US'],
    'US_CNNC' : ['ALL', 'US'],
    'US_COWI' : ['ALL', 'US'],
    'US_DGMT' : ['ALL', 'US'],
    'US_DUG'  : ['ALL', 'US'],
    'US_ECSD' : ['ALL', 'US'],
    'US_EGAK' : ['ALL', 'US'],
    'US_EGMT' : ['ALL', 'US'],
    'US_ERPA' : ['ALL', 'US'],
    'US_EYMN' : ['ALL', 'US'],
    'US_GLMI' : ['ALL', 'US'],
    'US_GOGA' : ['ALL', 'US'],
    'US_HAWA' : ['ALL', 'US'],
    'US_HDIL' : ['ALL', 'US'],
    'US_HLID' : ['ALL', 'US'],
    'US_ISCO' : ['ALL', 'US'],
    'US_JCT'  : ['ALL', 'US'],
    'US_JFWS' : ['ALL', 'US'],
    'US_KSU1' : ['ALL', 'US'],
    'US_KVTX' : ['ALL', 'US'],
    'US_LAO'  : ['ALL', 'US'],
    'US_LBNH' : ['ALL', 'US'],
    'US_LONY' : ['ALL', 'US'],
    'US_LRAL' : ['ALL', 'US'],
    'US_MCWV' : ['ALL', 'US'],
    'US_MIAR' : ['ALL', 'US'],
    'US_MNTX' : ['ALL', 'US'],
    'US_MSO'  : ['ALL', 'US'],
    'US_MVCO' : ['ALL', 'US'],
    'US_NATX' : ['ALL', 'US'],
    'US_NEW'  : ['ALL', 'US'],
    'US_NHSC' : ['ALL', 'US'],
    'US_NLWA' : ['ALL', 'US'],
    'US_OGNE' : ['ALL', 'US'],
    'US_OXF'  : ['ALL', 'US'],
    'US_PKME' : ['ALL', 'US'],
    'US_RLMT' : ['ALL', 'US'],
    'US_SCIA' : ['ALL', 'US'],
    'US_SDCO' : ['ALL', 'US'],
    'US_TPNV' : ['ALL', 'US'],
    'US_TZTN' : ['ALL', 'US'],
    'US_VBMS' : ['ALL', 'US'],
    'US_WMOK' : ['ALL', 'US'],
    'US_WRAK' : ['ALL', 'US'],
    'US_WUAZ' : ['ALL', 'US'],
    'US_WVOR' : ['ALL', 'US'],
    'XX_ANMX' : ['ALL', 'XX'],
    'XX_ASPX' : ['ALL', 'XX'],
    'XX_CMGX' : ['ALL', 'XX'],
    'XX_FBA2' : ['ALL', 'XX'],
    'XX_ST1X' : ['ALL', 'XX'],
    'XX_ST2X' : ['ALL', 'XX'],
    'XX_TST1' : ['ALL', 'XX'],
    'XX_TST2' : ['ALL', 'XX'],
    'XX_TST3' : ['ALL', 'XX']
    };


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
    $.tablesorter.addWidget({
        id: "callback",
        format: function (table) {
            filter();
        }
    });
    /* Doesn't play well with all the "magic" we are doing already
    $.tablesorter.addParser({
        id: "metrics",
        is: function(s) {
            return false;
        },
        format: function (s) {

        },
        type: 'hybrid'
    });
    */

    $("#control-table").slideUp(1.0);
    $("#control-toggle").click(function(){
        toggle_controls();
    });
    $("#apply-weights").click(function(){
        load_data();
    });
    $("#clear-filters").click(function(event){
        clear_filters();
    });
    text_restore('filter');
    $("input.filter").blur(function(){
        input_blur($(this));
    });
    $("input.filter").focus(function(){
        input_focus($(this));
    });
    $("input.filter").bind('keyup', null, function(){
        update_filter($(this));
    });
    $("input.filter").map(function(element, index){
        input_blur($(this));
    });
    $('#filter-subset').change(function(event) {
        subset_changed();
    });
    $(window).hashchange(function(){
        load_data(); // Load data fro the new context
    });
    load_controls();
    init_table();
    $(window).hashchange(); // force load of data on initial page load
}

function init_table() {
    if ($('#table-ready').val() == "FALSE") {
        $('#table').append('\
            <table id="metrics" class="tablesorter">\
            <thead>\
            <tr>\
                <th class="cat" colspan="3">Identity</th>\
                <th class="cat" colspan="3">State-of-Health</th>\
                <th class="cat" colspan="4">Coherence</th>\
                <th class="cat" colspan="4">Power Difference</th>\
                <th class="cat" colspan="4">Noise</th>\
                <th class="cat" colspan="2">Summary</th>\
            </tr>\
            <tr>\
                <th class="sub"><span id="col_1_header"></span></th>\
                <th class="sub"><span id="col_2_header"></span></th>\
                <th class="sub"><span id="col_3_header"></span></th>\
                <th class="sub"><span>Availability</span></th>\
                <th class="sub"><span>Gap Count</span></th>\
                <th class="sub"><span>Reversals</span></th>\
                <th class="sub"><span>4-8</span></th>\
                <th class="sub"><span>18-22</span></th>\
                <th class="sub"><span>90-110</span></th>\
                <th class="sub"><span>200-500</span></th>\
                <th class="sub"><span>4-8</span></th>\
                <th class="sub"><span>18-22</span></th>\
                <th class="sub"><span>90-110</span></th>\
                <th class="sub"><span>200-500</span></th>\
                <th class="sub"><span>4-8</span></th>\
                <th class="sub"><span>18-22</span></th>\
                <th class="sub"><span>90-110</span></th>\
                <th class="sub"><span>200-500</span></th>\
                <th class="sub"><span>Aggregate</span></th>\
                <th></th>\
            </tr>\
            </thead>\
            <tbody id="metrics-body">\
            <tr id="type-map-row">\
                <td>--</td>\
                <td>--</td>\
                <td>0.0</td>\
                <td>0.0</td>\
                <td>0.0</td>\
                <td>0.0</td>\
                <td>0.0</td>\
                <td>0.0</td>\
                <td>0.0</td>\
                <td>0.0</td>\
                <td>0.0</td>\
                <td>0.0</td>\
                <td>0.0</td>\
                <td>0.0</td>\
                <td>0.0</td>\
                <td>0.0</td>\
                <td>0.0</td>\
                <td>0.0</td>\
                <td>0.0</td>\
                <td><a href="#">.</a></td>\
            </tr>\
            </tbody>\
            </table>');

        $("#type-map-row").hide();
        $("#metrics").tablesorter({
            headers: {
                19: { sorter: false }
            },
            widgets: ["callback"]
        });
        /*
        $("#metrics").fixedHeaderTable({
            footer: false,
            cloneHeadToFoot: false,
            fixedColumn: false
        });
        */

        $('#table-ready').val("TRUE");
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

// Check the status of stations
function load_data()
{
    store_table_controls(); // Store controls from last context before updating
    $('#apply-weights').attr('disabled', 'disabled');
    $('#table').hide();
    $('#plots').hide();
    $('#up').hide();
    show_progress();
    // Summary of All Stations
    "metrics.py?cmd=ALL"
    // Summary of One Station (Each Channel)
    "metrics.py?cmd=STATION"
    // Station Plots
    "metrics.py?cmd=PLOT-STATION"
    // Channel Plots
    "metrics.py?cmd=PLOT-CHANNEL"
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
        var parts = command.split("-");
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
            place = parts[0]+ '-' +parts[1];
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
                $('#up a').attr('href', '#STATION-'+st_network+'-'+st_station);
                $('#up').show();
                if (parts.length == 6) {
                    st_location = parts[4];
                    st_channel  = parts[5];
                }
                else if ((parts[4] == "") && (parts[5] == "") && (parts[6] == "")) {
                    st_location = "--";
                    st_channel  = parts[7];
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
    if (command == "") {
        $.get($('#data-url').val()+'?cmd=ALL', {cache:"false"}, function(data, status, request){
            load(data, status, request);
            filter();
        }); 
    } 
    else {
        $.get($('#data-url').val()+'?cmd='+command, {cache:"false"}, function(data, status, request){
            load(data, status, request);
            filter();
        }); 
    }
}

var control_map = { "ALL" : {
                      "slider-availability"     : [0,101],
                      "slider-gaps"             : [0,101],
                      "slider-reversals"        : [0,101],
                      "slider-coherence"        : [0,101],
                      "slider-powerdifference"  : [0,101],
                      "slider-noise"            : [0,101]},
                    "STATION" : {
                      "slider-availability"     : [0,101],
                      "slider-gaps"             : [0,101],
                      "slider-reversals"        : [0,101],
                      "slider-coherence"        : [0,101],
                      "slider-powerdifference"  : [0,101],
                      "slider-noise"            : [0,101]}
               };

function store_table_controls()
{
    $("#control-table div.slider").each( function () {
        if (show_all) {
            //log("ALL-" +$(this).attr('id'));
            control_map["ALL"][$(this).attr('id')] = $(this).slider("values");
        }
        else {
            //log("STATION-" +$(this).attr('id'));
            control_map["STATION"][$(this).attr('id')] = $(this).slider("values");
        }
    });
}

function load_table_controls()
{
    $("#control-table div.slider").each( function () {
        if (show_all) {
            //log("ALL-" +$(this).attr('id'));
            $(this).slider("values", control_map["ALL"][$(this).id])
        }
        else {
            //log("STATION-" +$(this).attr('id'));
            $(this).slider("values", control_map["STATION"][$(this).id])
        }
    });
    slide_stop(undefined, undefined);
}

function load_controls()
{
    $("#control-table div.slider").slider({
        range: true,
        values: [0,101],
        min: 0,
        max: 101,
        step: 0.1,
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

function show_progress() {
    $("#progress").show();
}

function hide_progress() {
    $("#progress").hide();
}

var slider_total;
function slide_start(event, ui) {
}

function slide_change(event, ui) {
}

function slide_stop(event, ui) {
    slider_total = 0;
    $("#control-table div.slider").each(function () {
        slider_total += $(this).slider("values")[0];
    });
    if (slider_total > 100) {
        return false;
    }
    
    $("#control-table div.slider").each(function() {
        var max = 101 - slider_total + $(this).slider("values")[0];
        if (slider_total == 0) {
            max = 101;
        }
        var value = $(this).slider("values")[0];
        $(this).slider("values", 1, max);
        $(this).slider("values", 0, value);
        var label_id = "#label-" + $(this).attr("id").split("-")[1];
        var label = $(label_id);
        label.text(label.text().substr(0, label.text().lastIndexOf(" ")) + " " +value.toFixed(1)+ "%");
    });
    $("#slider-remaining").text((100 - slider_total).toFixed(1) + "%");
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

function capitalize(str)
{
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Load the data
function load(data, status, request)
{
    var rows = data.split('\n')//.sort(row_sort);

// === Display Plots ===========================================
    if (gen_plots) {
        $('#plots').show();
        var groups = {};
        var first_time = undefined;
        var last_time  = undefined;
        var low_value  = undefined;
        var high_value = undefined;
        for (var i in rows) {
            if (rows[i].trim() == "") {
                continue;
            }
            var parts = rows[i].split(',');
            var title = capitalize(new String(parts[0]))+ ": " +capitalize(new String(parts[1]));
            var timestamp = zeroPad(parts[2],4)+ "-" +zeroPad(parts[3],2)+ "-" +zeroPad(parts[4],2)+ " 12:00:00";
            last_time = timestamp;
            if (first_time == undefined) {
                first_time = timestamp;
            }
            //var timestamp = "%04d/%02d/%02d".sprintf(parts[2], parts[3], parts[4]);
            if (groups[title] == undefined) {
                groups[title] = {
                    "data"  : [],
                    "start" : undefined,
                    "end"   : undefined,
                    "min"   : undefined,
                    "max"   : undefined
                };
            }

            var value = parts[5] * 1.0;
            if (low_value == undefined) {
                low_value = value;
            }
            else if (low_value > value) {
                low_value = value;
            }
            if (high_value == undefined) {
                high_value = value
            }
            else if (high_value < value) {
                high_value = value;
            }
            groups[title]["data"].push([timestamp,value])
            groups[title]["start"] = first_time;
            groups[title]["end"] = last_time;
            groups[title]["min"] = low_value;
            groups[title]["max"] = high_value;
        }
        $("#plots div").remove();
        var j = 0;
        plots = {};
        for (var title in groups) { 
            j++;
            var container_id = "plot-" +j+ "-container";
            var plot_id      = "plot-" +j;
            var button_id    = "plot-" +j+ "-button";
            $("#plots").append('<div id="' +container_id+ '"/></div>');
            $("#"+container_id).append('<div class="plot" id="' +plot_id+ '"/></div>');
            $("#"+container_id).append('<button class="zoom" id="' +button_id+ '">Zoom Out</button>');
            $("#"+button_id).val(plot_id);
            var min = groups[title]["min"]; 
            var max = groups[title]["max"];
            var disp_min = min - ((max - min) / 10)
            var disp_max = max + ((max - min) / 10)
            if (min == max) {
                disp_min = min - 1.0;
                disp_max = max + 1.0;
            } 
            plots[plot_id] = $.jqplot(plot_id, [groups[title]["data"]], {
                title: title,
                cursor:{
                    show: true,
                    zoom: true,
                    showTooltip: false
                },
                /*
                axesDefaults: {
                    labelRenderer: $.jqplot.CanvasAxisLabelRenderer
                },
                */
                highlighter: {
                    show: true,
                    sizeAdjust: 7.5
                },
                axes: {
                    xaxis: {
                        min: groups[title]["start"],
                        max: groups[title]["end"],
                        renderer: $.jqplot.DateAxisRenderer
                    },
                    yaxis: {
                        //tickInterval: (high_value - low_value) / 10,
                        min: disp_min,
                        max: disp_max
                    }
                }
            });
            //log("Plot-" +j+ " Values: " +groups[title]["start"]+ " " +groups[title]["end"]+ " " +disp_min+ " " +disp_max);
            $("#"+button_id).click(function () {
                plots[$(this).val()].resetZoom();
            });
        }

        hide_progress();
        $('#apply-weights').removeAttr('disabled');
        return;
    }

// === Display Metrics =========================================
    var weights = [
        [false, "",     0, 0],
        [false, "",     0, 0],
        [true,  "mul",  1, 100.0 / $("#slider-availability").slider("values")[0]],
        [true,  "mul",  1, 100.0 / $("#slider-gaps").slider("values")[0]],
        [true,  "mul",  1, 100.0 / $("#slider-reversals").slider("values")[0]]];

    var weight_total = 1;
    for (var i in weights) {
        if (weights[i][0] && weights[i][2]) {
            weight_total *= weights[i][3];
        }
    }

    for (var i in rows) {
        // Skip this row if it is empty.
        if ((rows[i] == undefined) || (rows[i].trim() == '') || (rows[i].trim() == 'None')) {
            //alert("skipping index " + i);
            continue;
        }

        var items = rows[i].split(",");
        if (items == undefined) {
            continue;
        }

        var line_id = items[0] + '-' + items[1]
        $('#metrics-body').append('<tr class="metrics" id="' + line_id + '"></tr>');
        var row = $('#'+line_id);

        var display_id = 'display-' + line_id;
        var plot_id = 'plot-' + line_id;

        var aggregate = 1.0;
        var link = items[1];
        if (place == "") {
            link = '<a id="' +display_id+ '" href="#STATION-' +items[0]+ '-' + items[1]+ '">' +items[1]+ '</a>';
        }
        for (var j in items) {
            if (j == 0) {
                value = items[j];
                if ((value == undefined) || (value.trim() == "")) {
                    value = "--";
                }
                row.append('<td>' +value+ '</td>');
            }
            else if (j == 1) {
                row.append('<td>' +link+ '</td>');
            }
            else if ((j == 2) && (col_3_title == "")) {
                row.append('<td></td>');
            }
            else {
                value = items[j];
                if ((value == undefined) || (value == "NaN")) {
                    row.append('<td></td>');
                } else {
                    row.append('<td>' +(value * 1.0).toFixed(2)+ '</td>');
                    if (j != 2) {
                        aggregate += (value * 1.0);
                    }
                }
            }
            /*
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
            */
        }
        //row.append('<td>' + (aggregate / weight_total).toFixed(2) + '</td>');
        aggregate *= 1.0;
        aggregate_class = "level1";
        if (aggregate < 0.0) {
            aggregate_class = "level3";
        } 
        else if (aggregate < 110.0) {
            aggregate_class = "level2";
        }
        row.append('<td class="' +aggregate_class+ '">' + aggregate.toFixed(2) + '</td>');
        var cmd_hash = ""
        if (place == "") {
            cmd_hash = "PLOT-STATION-" +items[0]+ "-" +items[1];
        }
        else {
            cmd_hash = "PLOT-CHANNEL-" +st_network+ "-" +st_station+ "-" +items[0]+ "-" +items[1];
        }
        row.append('<td><a id="' +plot_id+ '" href="#'+cmd_hash+'">Plot</a></td>');
    }
    // Clean up our column header styles as tablesorter will not.
    // Only we know that the tabe data has been replaced.
    $("#metrics thead th").removeClass("headerSortUp");
    $("#metrics thead th").removeClass("headerSortDown");
    $("#metrics").trigger("update");
    hide_progress();
    $('#table').show();
    $('#apply-weights').removeAttr('disabled');
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

function zeroPad(number, length) 
{
    var str = number + "";
    while (str.length < length) {
        str = "0" + str;
    }
    return str;
}

/************************
 ***** FILTER LOGIC *****
 ************************/

function subset_changed() {
    filter();
}

function clear_filters() {
    $('#filter-subset').val('ALL');
    $("input.filter").map(function(element, index){
        $(this).val('');
        input_blur($(this));
        update_filter($(this));
    });
}

function update_filter(item)
{
    id = item.attr('id');
    var text = $('#'+id).attr('value');
    var alt  = $('#'+id).attr('alt');
    var value = '';
    if ((text === null) || (text === undefined) || (text.trim().length < 1) || (text == alt)) {
        value = 'NOTHING';
    } else {
        value = $.base64Encode(text);
    }
    $.jStore.set(id, value);
    if ((text === undefined) || (text === null) || (text === '') || (text == alt)) {
        filters[id] = null;
    } else {
        filters[id] = new RegExp(text, 'i');
    }
    filter();
}

function filter()
{
    row_index = 0;
    $('tr.metrics').map(function(element, index){
        apply_filters($(this));
    });
}

function apply_filters(item)
{
    var parts = item.attr('id').split('-');
    if (show_all && ((filters['filter-network'] != undefined) && (!filters['filter-network'].test(parts[0])))) {
        item.hide();
    }
    else if (show_all && ((filters['filter-station'] != undefined) && (!filters['filter-station'].test(parts[1])))) {
        item.hide();
    }
    else if (!show_all && ((filters['filter-location'] != undefined) && (!filters['filter-location'].test(parts[0])))) {
        item.hide();
    }
    else if (!show_all && ((filters['filter-channel'] != undefined) && (!filters['filter-channel'].test(parts[1])))) {
        item.hide();
    }
    else if (show_all && ((subsets[parts[0] +'_'+ parts[1]].indexOf($('#filter-subset').val())) == -1)) {
        item.hide();
    }
    else {
        item.show();
        if (row_index % 2) {
            item.addClass('odd');
        } else {
            item.removeClass('odd');
        }
        row_index++;
    }
}

function input_blur(item)
{
    if ((item.attr('value') == '') || (item.attr('value') == item.attr('alt'))) {
        item.attr('value', item.attr('alt'));
        item.addClass('watermark');
    }
}

function input_focus(item)
{
    if (item.attr('value') == item.attr('alt')) {
        item.attr('value', '');
        item.removeClass('watermark');
    }
}

function radio_toggle(item)
{
    //$('#debug').append('<pre>toggle</pre>');
    $.jStore.set(item.attr('name'), item.val());
    filter()
}

function checkbox_toggle(id)
{
    if ($('#'+id).attr('checked') == true) {
        $.jStore.set(id, 'TRUE');
    } else {
        $.jStore.set(id, 'FALSE');
    }
}

function text_restore(class_name)
{
    $('input.'+class_name).map(function(element, index){
        var text = $.jStore.get($(this).attr('id'));
        if ((text == 'NOTHING') || (text === null) || (text === undefined)) {
            $(this).val('');
        } else {
            $(this).val($.base64Decode(text));
        }
        update_filter($(this));
    });
    return;
}

function radio_restore(name)
{
    var value = $.jStore.get(name);
    if (value == undefined) {
        value = 0;
    }
    //$('input[name='+name+']', $('input[value='+value+']')).attr('checked', true);
    $('input[name='+name+']').map(function(){
        if ($(this).val() == value) {
            $(this).attr('checked', true);
        }
    });
}

function checkbox_restore(id)
{
    var checked = false;
    if ($.jStore.get(id) == 'TRUE') {
        checked = true;
    }
    $('#'+id).attr('checked', checked);
}

