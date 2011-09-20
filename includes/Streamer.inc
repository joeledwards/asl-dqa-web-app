<?php

class Streamer {

    protected $streams = array();
    protected $success = array();
    protected $prios   = array(); // Priorities associated with each stream
    protected $docs    = array();
    protected $stream_manager;

    protected $num_high_prio  = 0;
    protected $master_timeout = 20.0;
    protected $timeout        = 5.0;
    protected $next_key       = 0;
    protected $print_info     = 0;

    function Streamer ( $timeout, $print_info ) {
        $this->timeout = $timeout;
        $this->stream_manager = curl_multi_init();
        $this->print_info = $print_info;
    }

    function add_to_streamer ( $url, $cgi, $priority, $use_post = false ) {
        $key = $this->next_key++;
        $this->prios[$key] = $priority;
        $this->docs[$key]  = "";
        $this->success[$key] = 0;
        $this->streams[$key] = curl_init();

        if ( !$use_post )
            $url .= "?{$cgi}";

        if ( $priority )
            $timeout = $this->master_timeout;
        else
            $timeout = $this->timeout;

        curl_setopt($this->streams[$key], CURLOPT_URL, $url);
        curl_setopt($this->streams[$key], CURLOPT_HEADER, 0);
        curl_setopt($this->streams[$key], CURLOPT_TIMEOUT, $timeout);
        curl_setopt($this->streams[$key], CURLOPT_MAXREDIRS, 3);
        curl_setopt($this->streams[$key], CURLOPT_RETURNTRANSFER, 1);
        if ( $use_post ) {
            curl_setopt($this->streams[$key], CURLOPT_POSTFIELDS, $cgi);
            curl_setopt($this->streams[$key], CURLOPT_POST, true);
        }

        curl_multi_add_handle($this->stream_manager, $this->streams[$key]);

        return $key;
    }

    function get_doc ( $key, &$doc ) {
        $doc = $this->docs[$key];
        return $this->success[$key];
    }

    function process_streams () {

        $running = NULL;
        // start performing the request
        do {
            $mrc = curl_multi_exec($this->stream_manager, $running);
        } while ($mrc == CURLM_CALL_MULTI_PERFORM);

        while ($running and ($mrc == CURLM_OK)) {
            // wait for network
            if (curl_multi_select($this->stream_manager) != -1) {
                // pull in any new data, or at least handle timeouts
                do {
                    $mrc = curl_multi_exec($this->stream_manager, $running);
                } while ($mrc == CURLM_CALL_MULTI_PERFORM);
            }
        }

        if ($mrc != CURLM_OK) {
            logError("Streamer.inc curl multi read error $mrc");
        }

        // retrieve data
        foreach ($this->streams as $key => $stream) {
            if (($err = curl_error($stream)) == '') {
                $info = curl_getinfo($stream);
                $this->docs[$key] = curl_multi_getcontent($stream);
                $this->success[$key] = $info['http_code'];

                if ( $this->print_info ) {
                    echo "<!-- stats for key $key\n";
                    foreach ( $info as $key => $value ) {
                        echo "$key: $value\n";
                    }
                    echo "-->\n\n";
                }
            } else {
                logError("curl error on handle $key: $err");
            }

            curl_multi_remove_handle($this->stream_manager,$stream);
            curl_close($stream);
            $stream = NULL;
            $this->streams[$key] = NULL;
        }

        curl_multi_close($this->stream_manager); 
        $this->stream_manager = NULL;
    }

}

?>
