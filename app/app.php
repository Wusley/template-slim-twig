<?php
namespace app;
date_default_timezone_set("UTC");

chdir(__DIR__);

//Register lib autoloader
require '../vendor/autoload.php';

$app = new \Slim\Slim(array(
  'templates.path' => __DIR__.'/views/',
  'view' => new \Slim\Views\Twig()
));

//Loads all needed subfiles
require 'bootstrap.php';

// Prepare view
$app->view->parserOptions = array(
  'debug' => true
);
$app->view->parserExtensions = array(
    new \Slim\Views\TwigExtension()
);

//Load 404 Route
$app->notFound(function () use ($app) {
  // $array = siteDados( $app->dados );

	$request = $app->request();
	$requesturi = 'http://'.$_SERVER["HTTP_HOST"].$request->getRootUri().$request->getResourceUri();

  $app->render( 'errors/404.twig' );
});

//Run
$app->run();
