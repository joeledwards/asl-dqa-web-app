//Written 9-17-2012
function pad(input, size) {
    var output = input+"";
    while (output.length<size){
        output = "0"+output;
    }
    return output;
}

function pad(input, size, padder) {
    var output = input+"";
    while (output.length<size){
        output = ""+padder+output;
    }
    return output;
}


