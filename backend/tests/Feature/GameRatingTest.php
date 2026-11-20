<?php

namespace Tests\Feature;

use App\Models\Game;
use App\Models\GameRating;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GameRatingTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_guest_cannot_read_or_change_a_personal_rating(): void
    {
        $game = $this->createGame();

        $this->getJson("/api/games/{$game->slug}/rating")->assertUnauthorized();
        $this->putJson("/api/games/{$game->slug}/rating", ['score' => 4])->assertUnauthorized();
        $this->deleteJson("/api/games/{$game->slug}/rating")->assertUnauthorized();
    }

    public function test_a_user_can_create_and_update_one_rating_for_a_game(): void
    {
        $user = User::factory()->create();
        $game = $this->createGame();

        $this->actingAs($user)
            ->putJson("/api/games/{$game->slug}/rating", ['score' => 4])
            ->assertOk()
            ->assertJsonPath('rating', 4);

        $this->actingAs($user)
            ->putJson("/api/games/{$game->slug}/rating", ['score' => 2])
            ->assertOk()
            ->assertJsonPath('rating', 2);

        $this->assertDatabaseCount('game_ratings', 1);
        $this->assertDatabaseHas('game_ratings', [
            'user_id' => $user->id,
            'game_id' => $game->id,
            'score' => 2,
        ]);
    }

    public function test_a_user_can_read_and_remove_only_their_own_rating(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $game = $this->createGame();

        GameRating::create([
            'user_id' => $owner->id,
            'game_id' => $game->id,
            'score' => 5,
        ]);

        $this->actingAs($owner)
            ->getJson("/api/games/{$game->slug}/rating")
            ->assertOk()
            ->assertJsonPath('rating', 5);

        $this->actingAs($otherUser)
            ->deleteJson("/api/games/{$game->slug}/rating")
            ->assertNoContent();

        $this->assertDatabaseHas('game_ratings', [
            'user_id' => $owner->id,
            'game_id' => $game->id,
            'score' => 5,
        ]);

        $this->actingAs($owner)
            ->deleteJson("/api/games/{$game->slug}/rating")
            ->assertNoContent();

        $this->assertDatabaseCount('game_ratings', 0);
    }

    public function test_a_rating_must_be_an_integer_between_one_and_five(): void
    {
        $user = User::factory()->create();
        $game = $this->createGame();

        foreach ([0, 6, '3.5'] as $score) {
            $this->actingAs($user)
                ->putJson("/api/games/{$game->slug}/rating", ['score' => $score])
                ->assertUnprocessable()
                ->assertJsonValidationErrors('score');
        }
    }

    public function test_game_endpoints_return_the_average_and_count_of_user_ratings(): void
    {
        $game = $this->createGame();
        $firstUser = User::factory()->create();
        $secondUser = User::factory()->create();

        GameRating::create(['user_id' => $firstUser->id, 'game_id' => $game->id, 'score' => 3]);
        GameRating::create(['user_id' => $secondUser->id, 'game_id' => $game->id, 'score' => 5]);

        $this->getJson('/api/games')
            ->assertOk()
            ->assertJsonPath('data.0.rating', null)
            ->assertJsonPath('data.0.communityRating', 4)
            ->assertJsonPath('data.0.communityRatingCount', 2);

        $this->getJson('/api/games/search?q=elden')
            ->assertOk()
            ->assertJsonPath('data.0.communityRating', 4)
            ->assertJsonPath('data.0.communityRatingCount', 2);

        $this->getJson('/api/games/elden-ring')
            ->assertOk()
            ->assertJsonPath('data.communityRating', 4)
            ->assertJsonPath('data.communityRatingCount', 2);
    }

    private function createGame(): Game
    {
        return Game::create([
            'slug' => 'elden-ring',
            'title' => 'Elden Ring',
            'release_year' => 2022,
            'developer' => 'FromSoftware',
            'genres' => ['Action RPG'],
            'cover_url' => '/covers/elden-ring.jpg',
        ]);
    }
}
