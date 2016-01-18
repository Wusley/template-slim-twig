<?php
error_reporting(E_ERROR | E_PARSE);
ini_set( "display_errors", 1 );

//Internet Explorer X-UA FIX
if (isset($_SERVER['HTTP_USER_AGENT']) && (strpos($_SERVER['HTTP_USER_AGENT'], 'MSIE') !== false))
    header('X-UA-Compatible: IE=edge,chrome=1');

//Load App
require 'app/app.php';
