<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('residents', function (Blueprint $table) {
            $table->id();

            // Personal Info
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->string('suffix')->nullable(); // Jr, Sr, III
            $table->date('birthdate');
            $table->enum('gender', ['Male', 'Female']);
            $table->enum('civil_status', ['Single', 'Married', 'Widowed', 'Separated']);
            $table->string('nationality')->default('Filipino');
            $table->string('religion')->nullable();
            $table->string('occupation')->nullable();

            // Contact
            $table->string('contact_number')->nullable();
            $table->string('email')->nullable();

            // Address
            $table->string('purok')->nullable(); // Purok 1, 2, etc.
            $table->string('street')->nullable();
            $table->string('address'); // Full address

            // Classification
            $table->boolean('is_voter')->default(false);
            $table->boolean('is_senior_citizen')->default(false);
            $table->boolean('is_pwd')->default(false);
            $table->boolean('is_4ps')->default(false); // Pantawid Pamilya
            $table->boolean('is_active')->default(true);

            // Photo
            $table->string('photo')->nullable();

            // Timestamps + Soft Delete
            $table->softDeletes();
            $table->timestamps();

            // Indexes for fast search
            $table->index('last_name');
            $table->index('first_name');
            $table->index(['last_name', 'first_name']);
            $table->index('purok');
            $table->index('is_voter');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('residents');
    }
};
