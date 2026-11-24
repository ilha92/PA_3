<?php

namespace App\Console\Commands;

use App\Models\Game;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class ImportGames extends Command
{
    protected $signature = 'games:import {--limit=5000 : Nombre maximum de jeux à copier}';

    protected $description = 'Copie des jeux IGDB dans la base locale';

    public function handle(): int
    {
        $clientId = (string) config('services.igdb.client_id');
        $clientSecret = (string) config('services.igdb.client_secret');

        if ($clientId === '' || $clientSecret === '') {
            $this->error('Ajoute TWITCH_CLIENT_ID et TWITCH_CLIENT_SECRET dans le .env racine.');

            return self::FAILURE;
        }

        $token = $this->token($clientId, $clientSecret);

        if ($token === null) {
            $this->error('IGDB a refusé la connexion. Vérifie les identifiants Twitch.');

            return self::FAILURE;
        }

        $limit = max(1, (int) $this->option('limit'));
        $imported = 0;
        $offset = 0;

        while ($imported < $limit) {
            $rows = $this->page($clientId, $token, $offset);

            if ($rows === []) {
                break;
            }

            foreach ($rows as $row) {
                if ($imported < $limit && $this->import($row)) {
                    $imported++;
                }
            }

            $offset += count($rows);
            usleep(300_000);
        }

        if ($imported === 0) {
            $this->error('Aucun jeu n\'a pu être copié. La base n\'a pas été modifiée.');

            return self::FAILURE;
        }

        $removed = Game::query()
            ->whereDoesntHave('ratings')
            ->where('cover_url', 'not like', '%images.igdb.com%')
            ->delete();

        $this->info("{$imported} jeux IGDB sont dans la base. {$removed} anciens jeux sans note ont été retirés.");

        return self::SUCCESS;
    }

    private function token(string $clientId, string $clientSecret): ?string
    {
        $response = Http::timeout(20)->asForm()->post('https://id.twitch.tv/oauth2/token', [
            'client_id' => $clientId,
            'client_secret' => $clientSecret,
            'grant_type' => 'client_credentials',
        ]);

        $token = $response->json('access_token');

        return is_string($token) && $token !== '' ? $token : null;
    }

    /**
     * Jeux principaux, remakes, remasters et éditions enrichies (Kingdom Hearts y est classé)
     * avec une jaquette, les plus notés d'abord.
     *
     * @return list<array<string, mixed>>
     */
    private function page(string $clientId, string $token, int $offset): array
    {
        $query = 'fields name,slug,summary,first_release_date,rating,cover.image_id,artworks.image_id,'
            .'screenshots.image_id,genres.name,involved_companies.developer,involved_companies.company.name;'
            .' where cover != null & first_release_date != null & version_parent = null & game_type = (0,8,9,10);'
            ." sort total_rating_count desc; limit 500; offset {$offset};";

        $response = Http::timeout(30)
            ->withHeaders(['Client-ID' => $clientId, 'Authorization' => 'Bearer '.$token])
            ->withBody($query, 'text/plain')
            ->post('https://api.igdb.com/v4/games');

        return $response->successful() ? array_values(array_filter($response->json() ?? [], 'is_array')) : [];
    }

    /** @param array<string, mixed> $row */
    private function import(array $row): bool
    {
        $cover = $row['cover']['image_id'] ?? null;
        $slug = $row['slug'] ?? null;
        $timestamp = $row['first_release_date'] ?? null;

        if (! is_string($cover) || ! is_string($slug) || $slug === '' || ! is_numeric($timestamp)) {
            return false;
        }

        $background = $row['artworks'][0]['image_id'] ?? $row['screenshots'][0]['image_id'] ?? null;

        Game::updateOrCreate(
            ['slug' => $slug],
            [
                'title' => mb_substr((string) ($row['name'] ?? $slug), 0, 255),
                'release_year' => (int) gmdate('Y', (int) $timestamp),
                'developer' => $this->developer($row),
                'genres' => collect($row['genres'] ?? [])->pluck('name')->filter()->values()->all(),
                'cover_url' => $this->image($cover, 'cover_big_2x'),
                'background_url' => is_string($background) ? $this->image($background, '1080p') : null,
                'rating' => isset($row['rating']) ? round((float) $row['rating'] / 20, 1) : null,
                'summary' => $row['summary'] ?? null,
            ],
        );

        return true;
    }

    private function image(string $imageId, string $size): string
    {
        return "https://images.igdb.com/igdb/image/upload/t_{$size}/{$imageId}.jpg";
    }

    /** @param array<string, mixed> $row */
    private function developer(array $row): string
    {
        foreach ($row['involved_companies'] ?? [] as $company) {
            if (! empty($company['developer']) && ! empty($company['company']['name'])) {
                return (string) $company['company']['name'];
            }
        }

        return 'Inconnu';
    }
}
