<?php

$app->get( '/', function() use ( $app ) {

    $array = siteDados();

    $app->render( "index.twig", $array );

} );
