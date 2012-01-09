// Filter logic

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
    'II_AAK'  : ['ALL', 'GSN', 'II', 'IDA'],
    'II_ABKT' : ['ALL', 'GSN', 'II', 'IDA'],
    'II_ABPO' : ['ALL', 'GSN', 'II', 'IDA'],
    'II_ALE'  : ['ALL', 'GSN', 'II', 'IDA'],
    'II_ARU'  : ['ALL', 'GSN', 'II', 'IDA'],
    'II_ASCN' : ['ALL', 'GSN', 'II', 'IDA'],
    'II_BFO'  : ['ALL', 'GSN', 'II', 'IDA'],
    'II_BORG' : ['ALL', 'GSN', 'II', 'IDA'],
    'II_BRVK' : ['ALL', 'GSN', 'II', 'IDA'],
    'II_CMLA' : ['ALL', 'GSN', 'II', 'IDA'],
    'II_COCO' : ['ALL', 'GSN', 'II', 'IDA'],
    'II_DGAR' : ['ALL', 'GSN', 'II', 'IDA'],
    'II_EFI'  : ['ALL', 'GSN', 'II', 'IDA'],
    'II_ERM'  : ['ALL', 'GSN', 'II', 'IDA'],
    'II_ESK'  : ['ALL', 'GSN', 'II', 'IDA'],
    'II_FFC'  : ['ALL', 'GSN', 'II', 'IDA'],
    'II_HOPE' : ['ALL', 'GSN', 'II', 'IDA'],
    'II_JTS'  : ['ALL', 'GSN', 'II', 'IDA'],
    'II_KAPI' : ['ALL', 'GSN', 'II', 'IDA'],
    'II_KDAK' : ['ALL', 'GSN', 'II', 'IDA'],
    'II_KIV'  : ['ALL', 'GSN', 'II', 'IDA'],
    'II_KURK' : ['ALL', 'GSN', 'II', 'IDA'],
    'II_KWAJ' : ['ALL', 'GSN', 'II', 'IDA'],
    'II_LVZ'  : ['ALL', 'GSN', 'II', 'IDA'],
    'II_MBAR' : ['ALL', 'GSN', 'II', 'IDA'],
    'II_MSEY' : ['ALL', 'GSN', 'II', 'IDA'],
    'II_MSVF' : ['ALL', 'GSN', 'II', 'IDA'],
    'II_NIL'  : ['ALL', 'GSN', 'II', 'IDA'],
    'II_NNA'  : ['ALL', 'GSN', 'II', 'IDA'],
    'II_NRIL' : ['ALL', 'GSN', 'II', 'IDA'],
    'II_OBN'  : ['ALL', 'GSN', 'II', 'IDA'],
    'II_PALK' : ['ALL', 'GSN', 'II', 'IDA'],
    'II_PFO'  : ['ALL', 'GSN', 'II', 'IDA'],
    'II_RAYN' : ['ALL', 'GSN', 'II', 'IDA'],
    'II_RPN'  : ['ALL', 'GSN', 'II', 'IDA'],
    'II_SACV' : ['ALL', 'GSN', 'II', 'IDA'],
    'II_SHEL' : ['ALL', 'GSN', 'II', 'IDA'],
    'II_SUR'  : ['ALL', 'GSN', 'II', 'IDA'],
    'II_TAU'  : ['ALL', 'GSN', 'II', 'IDA'],
    'II_TLY'  : ['ALL', 'GSN', 'II', 'IDA'],
    'II_WRAB' : ['ALL', 'GSN', 'II', 'IDA'],
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
    'IW_RRI2' : ['ALL', 'IW'],
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

function init_filters()
{
    $("#clear-filters").click(function(event){
        clear_filters();
    });
    text_restore('filter');
    $("#control-display input.filter").blur(function(){
        input_blur($(this));
    });
    $("#control-display input.filter").focus(function(){
        input_focus($(this));
    });
    $("#control-display input.filter").bind('keyup', null, function(){
        update_filter($(this), true);
    });
    $("#control-display input.filter").map(function(element, index){
        input_blur($(this));
    });
    selection_restore('filter-subset');
    $('#filter-subset').change(function(event) {
        subset_changed(true);
    });
}

function subset_changed(re_filter) {
    var id = "filter-subset";
    $.jStore.set(id, $("#"+id).val());
    if (re_filter) {
        filter();
    }
}

function clear_filters() {
    $('#filter-subset').val('ALL');
    subset_changed(false);
    $("#control-display input.filter").map(function(element, index){
        $(this).val('');
        input_blur($(this));
        update_filter($(this), false);
    });
    filter();
}

function update_filter(item, re_filter)
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
    $('#metrics-body tr.metrics').map(function(element, index){
        apply_filters($(this));
    });
}

function apply_filters(item)
{
    var parts = item.attr('id').split('-');
    //log(parts[0]+ "." +parts[1]);
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
    else if (show_all && ($.inArray($('#filter-subset').val(), subsets[parts[0] +'_'+ parts[1]]) == -1)) {
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

function text_restore(class_name)
{
    $('input.'+class_name).map(function(element, index){
        var text = $.jStore.get($(this).attr('id'));
        if ((text == 'NOTHING') || (text === null) || (text === undefined)) {
            $(this).val('');
        } else {
            $(this).val($.base64Decode(text));
        }
        update_filter($(this), false);
    });
    return;
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
    $.jStore.set(item.attr('name'), item.val());
}

function checkbox_toggle(id)
{
    if ($('#'+id).attr('checked') == true) {
        $.jStore.set(id, 'TRUE');
    } else {
        $.jStore.set(id, 'FALSE');
    }
}

function radio_restore(name)
{
    var value = $.jStore.get(name);
    if (value == undefined) {
        value = 0;
    }
    //$('input[name='+name+']', $('input[value='+value+']')).attr('checked', true);
    $('#control-display input[name='+name+']').map(function(){
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

function selection_restore(id)
{
    var value = $.jStore.get(id);
    if (value != undefined) {
        $('#'+id).val(value);
    }
}

