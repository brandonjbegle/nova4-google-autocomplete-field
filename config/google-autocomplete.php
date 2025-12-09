<?php

return [
    // Get your key from https://console.developers.google.com

    'api_key' => env('ADDRESS_AUTOCOMPLETE_API_KEY', ''),
    'translation_path' => resource_path('lang/vendor/google-autocomplete/'.app()->getLocale().'.json'),
    'load_maps_api' => true,
];
