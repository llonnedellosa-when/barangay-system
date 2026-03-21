<?php

namespace Database\Factories;

use App\Models\Resident;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Resident>
 */
class ResidentFactory extends Factory
{
    public function definition(): array
    {
        $gender = $this->faker->randomElement(['Male', 'Female']);

        $birthdate = $this->faker->dateTimeBetween('-90 years', '-1 years');
        $age = $birthdate->diff(new \DateTime())->y;

        return [
            'first_name' => $this->faker->firstName($gender),
            'middle_name' => $this->faker->lastName,
            'last_name' => $this->faker->lastName,
            'suffix' => null,

            'birthdate' => $birthdate->format('Y-m-d'),

            'gender' => $gender,
            'civil_status' => $age < 18 
                ? 'Single' 
                : $this->faker->randomElement(['Single', 'Married', 'Widowed']),

            'nationality' => 'Filipino',
            'religion' => $this->faker->randomElement(['Roman Catholic', 'Christian', 'Iglesia ni Cristo']),

            'occupation' => $age < 18 
                ? 'Student' 
                : $this->faker->randomElement(['Farmer', 'Teacher', 'Driver', 'Vendor', 'Unemployed']),

            'educational_attainment' => $this->faker->randomElement(['Elementary', 'High School', 'College Level', 'Graduate']),
            'youth_classification' => $age <= 30 
                ? $this->faker->randomElement(['In-School Youth', 'Out-of-School Youth']) 
                : null,

            'contact_number' => '09' . $this->faker->numberBetween(100000000, 999999999),
            'email' => $this->faker->unique()->safeEmail(),

            'purok' => 'Purok ' . $this->faker->numberBetween(1, 10),
            'street' => $this->faker->streetName(),
            'address' => $this->faker->address(),

            'house_ownership' => $this->faker->randomElement(['Owned', 'Rented']),
            'house_type' => $this->faker->randomElement(['Single Family', 'Apartment / Unit']),

            'hazards' => json_encode(
                $this->faker->randomElements(['Flood Prone', 'Landslide'], rand(0, 2))
            ),

            'is_voter' => $age >= 18 ? 1 : 0,
            'is_senior_citizen' => $age >= 60 ? 1 : 0,
            'is_pwd' => $this->faker->boolean(5),
            'is_4ps' => $this->faker->boolean(20),
            'is_active' => 1,

            'photo' => null,
            'deleted_at' => null,

            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
