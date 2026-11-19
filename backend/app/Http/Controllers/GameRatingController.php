<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class GameRatingController extends Controller
{
    public function show(Request $request, string $slug): JsonResponse
    {
        $game = Game::query()->where('slug', $slug)->firstOrFail();
        $score = $game->ratings()->where('user_id', $request->user()->id)->value('score');

        return response()->json(['rating' => $score === null ? null : (int) $score]);
    }

    public function update(Request $request, string $slug): JsonResponse
    {
        $validated = $request->validate([
            'score' => ['required', 'integer', 'between:1,5'],
        ]);

        $game = Game::query()->where('slug', $slug)->firstOrFail();
        $rating = $game->ratings()->updateOrCreate(
            ['user_id' => $request->user()->id],
            ['score' => $validated['score']],
        );

        return response()->json(['rating' => $rating->score]);
    }

    public function destroy(Request $request, string $slug): Response
    {
        $game = Game::query()->where('slug', $slug)->firstOrFail();
        $game->ratings()->where('user_id', $request->user()->id)->delete();

        return response()->noContent();
    }
}
