use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
 
return new class extends Migration {
    public function up(): void
    {
        Schema::create('generated_documents', function (Blueprint $table) {
            $table->id();
            $table->string('doc_number')->unique();      // e.g. BCL-2024-00001
            $table->string('doc_type');                  // e.g. 'clearance', 'census_summary'
            $table->string('doc_type_label');            // e.g. 'Barangay Clearance'
            $table->foreignId('resident_id')->nullable()->constrained()->onDelete('set null');
            $table->string('scope')->nullable();         // for reports: 'All Residents', etc.
            $table->string('purpose')->nullable();
            $table->string('or_number')->nullable();
            $table->decimal('fee', 8, 2)->default(0);
            $table->string('purok_filter')->nullable();
            $table->string('year_filter')->nullable();
            $table->foreignId('generated_by')->nullable()->constrained('users');
            $table->timestamps();
 
            $table->index('doc_type');
            $table->index('resident_id');
        });
    }
 
    public function down(): void
    {
        Schema::dropIfExists('generated_documents');
    }
};