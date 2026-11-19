<?php

namespace App\Http\Controllers;

use App\Http\Resources\GameResource;
use App\Models\Game;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class GameSearchController extends Controller
{
    public function __invoke(Request $request): AnonymousResourceCollection
    {
        $validated = $request->validate([
            'q' => ['required', 'string', 'min:1', 'max:100'],
        ]);

        $query = mb_strtolower(trim($validated['q']));

        $games = Game::query()
            ->withAvg('ratings', 'score')
            ->withCount('ratings')
            ->whereRaw('LOWER(title) LIKE ?', ["%{$query}%"])
            ->orderBy('title')
            ->limit(50)
            ->get();

        return GameResource::collection($games);
    }
}
