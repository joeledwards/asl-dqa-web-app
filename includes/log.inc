<?php

function logMessage ($str, $prefix) {
    // Verify that the logs directory exists before trying to write to it
    // We may have to remove the two lines below, due to permission issues.
    if(!file_exists('log'))
        mkdir('log');
    // Open Logging File
    $fd = fopen("log/$prefix-".date('Y_m_d').".log", 'a');
    if(!$fd)
        return;
    // Append time to error string
    $str = date('G:i:s') . ' ' . $str . "\n";
    // Write new string to file
    fwrite($fd, $str);
    // Close the file, because we're done	
    fclose($fd);
}

function logError($str) {
    logMessage ($str, "error");
}

function log500($str) {
    logMessage ($str, "500"); 
}

function logBot($str) {
    logMessage ($str, "bot"); 
}

function logDebug($str) {
    if (file_exists("nodebug"))
        return;
    logMessage ($str, "debug");
}

?>
