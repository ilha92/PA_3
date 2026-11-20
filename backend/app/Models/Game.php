<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'slug',
    'title',
    'release_year',
    'developer',
    'genres',
    'cover_url',
    'background_url',
    'rating',
    'summary',
])]
class Game extends Model
{
    public function ratings(): HasMany
    {
        return $this->hasMany(GameRating::class);
    }

    protected function casts(): array
    {
        return [
            'release_year' => 'integer',
            'genres' => 'array',
            'rating' => 'float',
        ];
    }
}
