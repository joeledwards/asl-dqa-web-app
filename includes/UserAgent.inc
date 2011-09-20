<?php

class UserAgent {

    protected $user_agent;

    function UserAgent( $server_vars )
    {
        
        $this->user_agent = array();
        $agent = $server_vars['HTTP_USER_AGENT'];
        $products = array();
    
        $pattern  = "([^/[:space:]]*)" . "(/([^[:space:]]*))?"
            ."([[:space:]]*\[[a-zA-Z][a-zA-Z]\])?" . "[[:space:]]*"
            ."(\\((([^()]|(\\([^()]*\\)))*)\\))?" . "[[:space:]]*";
    
        while( strlen($agent) > 0 )
        {
            if ($l = ereg($pattern, $agent, $a))
            {
                // product, version, comment
                array_push($products, array($a[1],    // Product
                            $a[3],    // Version
                            $a[6]));  // Comment
                $agent = substr($agent, $l);
            }
            else
            {
                $agent = "";
            }
        }
    
        // Directly catch these
        foreach($products as $product)
        {
            switch($product[0])
            {
                case 'Firefox':
                case 'Netscape':
                case 'Safari':
                case 'Camino':
                case 'Mosaic':
                case 'Galeon':
                case 'Chrome':
                case 'Opera':
                    $this->user_agent[0] = $product[0];
                    $this->user_agent[1] = $product[1];
                    break;
            }
        }
    
        if (count($this->user_agent) == 0)
        {
            // Mozilla compatible (MSIE, konqueror, etc)
            if ($products[0][0] == 'Mozilla' &&
                    !strncmp($products[0][2], 'compatible;', 11))
            {
                $this->user_agent = array();
                if ($cl = ereg("compatible; ([^ ]*)[ /]([^;]*).*",
                            $products[0][2], $ca))
                {
                    $this->user_agent[0] = $ca[1];
                    $this->user_agent[1] = $ca[2];
                }
                else
                {
                    $this->user_agent[0] = $products[0][0];
                    $this->user_agent[1] = $products[0][1];
                }
            }
            else
            {
                $this->user_agent = array();
                $this->user_agent[0] = $products[0][0];
                $this->user_agent[1] = $products[0][1];
            }
        }

    }

    function getBrowserClassification () {
        if ( $this->is_mobile_device() )
            return "mobile";

        $browser_name    = $this->user_agent[0];
        $browser_version = $this->user_agent[1];
        if ( ($browser_name == "MSIE") && ($browser_version < 7.0) )
            return "legacy";
        //if ( ($browser_name == "Firefox") ) return "legacy";
        //if ( ($browser_name == "Opera") ) return "legacy";
        return "standard";
    }

    function detectMobileType( &$specialized ) {
        if( preg_match("/iPhone/", $_SERVER['HTTP_USER_AGENT']) )
            $specialized = "iPhone";
        if( preg_match("/iPod/", $_SERVER['HTTP_USER_AGENT']) )
            $specialized = "iPod";

        if( preg_match("/\/[^,\/]*?xhtml($|[,])/",$_SERVER['HTTP_ACCEPT']))
            return "XHTML_TYPE";
        if( preg_match("/\/[^,\/]*?wml($|[,])/",$_SERVER['HTTP_ACCEPT']))
            return "WML_TYPE";
        else 
            return "XHTML_TYPE";
    }

    function is_mobile_device() {
        // if certain HTTP headers are present we can be sure
        // we are dealing with a mobile device 
       if ( isset($_SERVER['HTTP_PROFILE'])       ||
                isset($_SERVER['HTTP_X_WAP_PROFILE']) ||
                isset($_SERVER['X-OperaMini-Features']) ) return true;
        // if the HTTP_ACCEPT header has WAP related stuff in it,
        // we are most likely dealing with a mobile device
        if ( stristr($_SERVER['HTTP_ACCEPT'],'text/vnd.wap.wml') ||
                stristr($_SERVER['HTTP_ACCEPT'],'application/vnd.wap.xhtml+xml') ) return true;
        // most user agents for mobile devices 
        // will match this regular expression
        // based on list at http://www.zytrax.com/tech/web/mobile_ids.html
        $regEx = 'docomo|vodafone|astel|pdxgw|palm|avantgo|minimo'  .
            '|opwv-sdk|plucker|netfront|wm[0-9] pie'   .
            '|xiino|blackberry|mot-v|mot-a|mot-e'     .
            '|portalmmm|nokia|blazer|sagem|wireless'   .
            '|up.browser|up.link|windows ce|iemobile'  .
            '|mini|mmp|symbian|midp|wap|phone|pocket'  . 
            '|mobile|pda|psp|phs|ipaq|j2me|[0-9]{3}x[0-9]{3}';
        if(eregi($regEx, $_SERVER['HTTP_USER_AGENT'])) return true;
        return false;
    }

}

?>
