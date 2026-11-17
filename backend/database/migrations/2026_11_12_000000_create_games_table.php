<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title')->index();
            $table->unsignedSmallInteger('release_year');
            $table->string('developer');
            $table->json('genres');
            $table->string('cover_url');
            $table->string('background_url')->nullable();
            $table->decimal('rating', 2, 1)->nullable();
            $table->text('summary')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('games');
    }
};
