<?php

namespace App\Http\Controllers;

use App\Http\Resources\GameResource;
use App\Models\Game;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class GameController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return GameResource::collection(Game::query()->orderBy('id')->get());
    }

    public function show(string $slug): GameResource
    {
        $game = Game::query()->where('slug', $slug)->firstOrFail();

        return new GameResource($game);
    }
}
