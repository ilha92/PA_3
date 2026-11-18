<?php

namespace Tests\Feature;

use App\Models\Game;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class GameSearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_searches_game_titles_without_case_sensitivity(): void
    {
        $this->assertSame('sqlite', DB::connection()->getDriverName());

        Game::create([
            'slug' => 'elden-ring',
            'title' => 'Elden Ring',
            'release_year' => 2022,
            'developer' => 'FromSoftware',
            'genres' => ['Action RPG'],
            'cover_url' => '/covers/elden-ring.jpg',
        ]);

        Game::create([
            'slug' => 'hades',
            'title' => 'Hades',
            'release_year' => 2020,
            'developer' => 'Supergiant Games',
            'genres' => ['Roguelike'],
            'cover_url' => '/covers/hades.jpg',
        ]);

        $this->getJson('/api/games/search?q=elden')
            ->assertOk()
            ->assertJsonPath('data.0.title', 'Elden Ring')
            ->assertJsonPath('data.0.releaseYear', 2022)
            ->assertJsonCount(1, 'data');
    }

    public function test_it_validates_the_search_query(): void
    {
        $this->getJson('/api/games/search')
            ->assertUnprocessable()
            ->assertJsonValidationErrors('q');

        $this->getJson('/api/games/search?q='.str_repeat('a', 101))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('q');
    }

    public function test_it_lists_games_and_returns_a_game_by_slug(): void
    {
        Game::create([
            'slug' => 'elden-ring',
            'title' => 'Elden Ring',
            'release_year' => 2022,
            'developer' => 'FromSoftware',
            'genres' => ['Action RPG'],
            'cover_url' => '/covers/elden-ring.jpg',
            'rating' => 4.8,
        ]);

        $this->getJson('/api/games')
            ->assertOk()
            ->assertJsonPath('data.0.slug', 'elden-ring')
            ->assertJsonPath('data.0.rating', 4.8);

        $this->getJson('/api/games/elden-ring')
            ->assertOk()
            ->assertJsonPath('data.slug', 'elden-ring')
            ->assertJsonPath('data.rating', 4.8);
    }
}
