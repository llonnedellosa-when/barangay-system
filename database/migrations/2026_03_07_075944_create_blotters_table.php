<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blotters', function (Blueprint $table) {
            $table->id();
            $table->string('case_number')->unique(); // BLT-2024-00001
            $table->foreignId('complainant_id')->constrained('residents');
            $table->string('respondent_name'); // May not be a resident
            $table->string('respondent_address')->nullable();
            $table->enum('incident_type', [
                'Physical Assault',
                'Verbal Abuse',
                'Theft',
                'Trespassing',
                'Noise Complaint',
                'Domestic Violence',
                'Vandalism',
                'Others',
            ]);
            $table->dateTime('incident_date');
            $table->string('incident_location');
            $table->text('narrative'); // Full story
            $table->enum('status', ['Filed', 'Under Investigation', 'For Mediation', 'Settled', 'Dismissed', 'Escalated'])
                  ->default('Filed');
            $table->text('resolution')->nullable();
            $table->foreignId('handled_by')->nullable()->constrained('users');
            $table->timestamps();

            $table->index('status');
            $table->index('incident_type');
            $table->index('complainant_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blotters');
    }
};