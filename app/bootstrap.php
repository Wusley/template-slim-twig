<?php

namespace app;

//Load app autoloader
require 'autoload.php';
require 'common/common.php';

use Cocur\Slugify\Slugify;
use Urodoz\Truncate\TruncateService;

$app->slug = new Slugify();
$app->truncate = new TruncateService();

// Consome servico basico
// $app->dados = cURLing( "/dados", $_SERVER[ "REQUEST_URI" ] );

//Load routes
foreach ( glob( "routes/*.php" ) as $filename )
{
  require $filename;
}
