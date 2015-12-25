<?php
    /* Escape to html safe characters */
    function escape_html($val){
        return htmlspecialchars($val, ENT_QUOTES);
    }

?>
