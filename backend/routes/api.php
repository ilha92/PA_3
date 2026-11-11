<?php

use Illuminate\Support\Facades\Route;

/*
 * Routes de l'API REST, prefixees par /api.
 * Les endpoints metier (jeux, notes, journal) seront ajoutes par l'equipe.
 */

Route::get('/health', fn () => response()->json(['status' => 'ok']));
