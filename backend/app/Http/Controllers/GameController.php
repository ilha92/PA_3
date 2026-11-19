<?php

namespace App\Http\Controllers;

use App\Http\Resources\GameResource;
use App\Models\Game;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class GameController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $games = Game::query()
            ->withAvg('ratings', 'score')
            ->withCount('ratings')
            ->orderBy('id')
            ->get();

        return GameResource::collection($games);
    }

    public function show(string $slug): GameResource
    {
        $game = Game::query()
            ->withAvg('ratings', 'score')
            ->withCount('ratings')
            ->where('slug', $slug)
            ->firstOrFail();

        return new GameResource($game);
    }
}
