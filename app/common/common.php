<?php

function cURLing( $service, $uri ) {

  $urlDomain = "";

  $urlService = $urlDomain . "/service";

  // Consome o servico
  // $ch = curl_init( $urlService . '/' . $service );
  // curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
  // $r = curl_exec( $ch );
  // $r = json_decode( $r, TRUE );

  $r['urlDomain'] = $urlDomain;
  $r['urlService'] = $urlService;

  return $r;

}

function siteDados() {

  $array = array(
             "ogDescription"=>"",
             "siteName"=>"",
             "ogImagem"=>"",
             "ogTitle"=>"",
             // dados
             "dados"=>""
           );

  return $array;

}