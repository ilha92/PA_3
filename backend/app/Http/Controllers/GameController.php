<?php

namespace App\Http\Controllers;

use App\Http\Resources\GameResource;
use App\Models\Game;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class GameController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $validated = $request->validate([
            'genres' => ['array'],
            'genres.*' => ['string', 'max:100'],
        ]);

        $games = Game::query()
            ->withAvg('ratings', 'score')
            ->withCount('ratings')
            ->when($validated['genres'] ?? [], fn ($query, $genres) => $query->where(function ($query) use ($genres) {
                foreach ($genres as $genre) {
                    $query->orWhereJsonContains('genres', $genre);
                }
            }))
            ->orderBy('id')
            ->paginate(20);

        return GameResource::collection($games);
    }

    public function genres(): JsonResponse
    {
        $genres = Game::query()->pluck('genres')->flatten()->unique()->sort()->values();

        return response()->json(['data' => $genres]);
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
