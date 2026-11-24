<?php

use App\Http\Controllers\GameController;
use App\Http\Controllers\GameRatingController;
use App\Http\Controllers\GameSearchController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => response()->json(['status' => 'ok']));
Route::get('/games/search', GameSearchController::class);
Route::get('/games', [GameController::class, 'index']);
Route::get('/genres', [GameController::class, 'genres']);
Route::get('/games/{slug}', [GameController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/games/{slug}/rating', [GameRatingController::class, 'show']);
    Route::put('/games/{slug}/rating', [GameRatingController::class, 'update']);
    Route::delete('/games/{slug}/rating', [GameRatingController::class, 'destroy']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
