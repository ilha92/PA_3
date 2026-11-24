<?php

namespace Tests\Feature;

use App\Models\Game;
use App\Models\GameRating;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ImportGamesTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_copies_igdb_games_and_keeps_rated_games(): void
    {
        config([
            'services.igdb.client_id' => 'test-id',
            'services.igdb.client_secret' => 'test-secret',
        ]);

        $rated = Game::create([
            'slug' => 'jeu-note',
            'title' => 'Jeu noté',
            'release_year' => 2001,
            'developer' => 'Studio',
            'genres' => ['Test'],
            'cover_url' => '/covers/placeholder.svg',
        ]);

        GameRating::create([
            'user_id' => User::factory()->create()->id,
            'game_id' => $rated->id,
            'score' => 5,
        ]);

        Game::create([
            'slug' => 'ancien-jeu',
            'title' => 'Ancien jeu',
            'release_year' => 2018,
            'developer' => 'Studio',
            'genres' => ['Action'],
            'cover_url' => 'https://cdn.akamai.steamstatic.com/steam/apps/1/library_600x900.jpg',
        ]);

        Http::fake([
            'id.twitch.tv/*' => Http::response(['access_token' => 'token']),
            'api.igdb.com/*' => Http::sequence()
                ->push([[
                    'name' => 'Kingdom Hearts',
                    'slug' => 'kingdom-hearts',
                    'summary' => 'Sora part à la recherche de ses amis.',
                    'first_release_date' => 1017014400,
                    'rating' => 80,
                    'cover' => ['image_id' => 'co1abc'],
                    'artworks' => [['image_id' => 'ar123']],
                    'genres' => [['name' => 'Adventure']],
                    'involved_companies' => [['developer' => true, 'company' => ['name' => 'Square']]],
                ]])
                ->push([]),
        ]);

        $this->artisan('games:import')->assertSuccessful();

        $this->assertDatabaseHas('games', [
            'slug' => 'kingdom-hearts',
            'release_year' => 2002,
            'developer' => 'Square',
            'cover_url' => 'https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co1abc.jpg',
            'background_url' => 'https://images.igdb.com/igdb/image/upload/t_1080p/ar123.jpg',
            'rating' => 4.0,
        ]);

        $this->assertDatabaseMissing('games', ['slug' => 'ancien-jeu']);
        $this->assertDatabaseHas('game_ratings', ['game_id' => $rated->id, 'score' => 5]);

        $this->getJson('/api/games/kingdom-hearts')
            ->assertOk()
            ->assertJsonPath('data.summary', 'Sora part à la recherche de ses amis.');
    }
}
