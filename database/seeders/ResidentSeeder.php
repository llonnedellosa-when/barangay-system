<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Resident;
class ResidentSeeder extends Seeder
{

    public function run(): void
    {
        Resident::factory()->count(1000)->create();
    }
}
