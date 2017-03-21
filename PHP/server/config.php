<?php

if ( is_session_started() === FALSE ) session_start();
error_reporting(1);

define('DB_SERVER','localhost');
define('DB_USER','root');
define('DB_PASS','root');
define('DB_NAME','alok');

define('COMMON_TOKEN','c4ca4238a0b923820dcc509a6f75849b21232f297a57a5a743894a0e4a801fc3');
function is_session_started()
{
    if ( php_sapi_name() !== 'cli' ) {
        if ( version_compare(phpversion(), '5.4.0', '>=') ) {
            return session_status() === PHP_SESSION_ACTIVE ? TRUE : FALSE;
        } else {
            return session_id() === '' ? FALSE : TRUE;
        }
    }
    return FALSE;
}


?>
