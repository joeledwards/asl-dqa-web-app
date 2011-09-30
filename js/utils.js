// A collection of utility functions and data structures

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

function capitalize(str)
{
    return str.charAt(0).toUpperCase() + str.slice(1);
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
