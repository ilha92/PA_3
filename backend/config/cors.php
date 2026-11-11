<?php

return [

    'paths' => ['api/*'],

    'allowed_methods' => ['*'],

    /*
     * Seul le frontend du projet peut appeler l'API.
     * L'URL de production sera ajoutee le jour du deploiement.
     */
    'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:5173')],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
