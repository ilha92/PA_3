<?php

use App\Http\Controllers\GameController;
use App\Http\Controllers\GameSearchController;
use Illuminate\Support\Facades\Route;

/*
 * Routes de l'API REST, prefixees par /api.
 * Les endpoints metier (jeux, notes, journal) seront ajoutes par l'equipe.
 */

Route::get('/health', fn () => response()->json(['status' => 'ok']));
Route::get('/games/search', GameSearchController::class);
Route::get('/games', [GameController::class, 'index']);
Route::get('/games/{slug}', [GameController::class, 'show']);
