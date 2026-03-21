<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('document_requests', function (Blueprint $table) {
            $table->id();
            $table->string('request_number')->unique(); // BRG-2024-00001
            $table->foreignId('resident_id')->constrained()->onDelete('cascade');
            $table->enum('document_type', [
                'Barangay Clearance',
                'Certificate of Indigency',
                'Certificate of Residency',
                'Business Clearance',
                'Certificate of Good Moral Character',
            ]);
            $table->string('purpose');
            $table->decimal('fee', 8, 2)->default(0);
            $table->enum('status', ['Pending', 'Processing', 'Approved', 'Released', 'Rejected'])
                ->default('Pending');
            $table->text('remarks')->nullable();
            $table->foreignId('processed_by')->nullable()->constrained('users');
            $table->timestamp('released_at')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('document_type');
            $table->index('resident_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_requests');
    }
};
