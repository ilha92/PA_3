<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class GameSeeder extends Seeder
{
    public function run(): void
    {
        $this->command?->warn('Le catalogue ne se remplit plus ici. Lance : php artisan games:import');
    }
}
