<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('residents', function (Blueprint $table) {
            // Educational & Classification
            $table->string('educational_attainment')->nullable()->after('occupation');
            $table->string('youth_classification')->nullable()->after('educational_attainment');

            // Household
            $table->string('house_ownership')->nullable()->after('address');
            $table->string('house_type')->nullable()->after('house_ownership');
            $table->json('hazards')->nullable()->after('house_type'); // stores array like ["Fire Prone","Flood Prone"]
        });
    }

    public function down(): void
    {
        Schema::table('residents', function (Blueprint $table) {
            $table->dropColumn([
                'educational_attainment',
                'youth_classification',
                'house_ownership',
                'house_type',
                'hazards',
            ]);
        });
    }
};