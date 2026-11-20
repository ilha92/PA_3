<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GameResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'releaseYear' => $this->release_year,
            'developer' => $this->developer,
            'genres' => $this->genres,
            'coverUrl' => $this->cover_url,
            'backgroundUrl' => $this->background_url,
            'rating' => $this->rating,
            'communityRating' => $this->ratings_avg_score === null
                ? null
                : round((float) $this->ratings_avg_score, 1),
            'communityRatingCount' => (int) ($this->ratings_count ?? 0),
            'summary' => $this->summary,
        ];
    }
}
