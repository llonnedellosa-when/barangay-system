<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DocumentRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'request_number', 'resident_id', 'document_type',
        'purpose', 'fee', 'status', 'remarks',
        'processed_by', 'released_at',
    ];

    protected $casts = [
        'released_at' => 'datetime',
        'fee'         => 'decimal:2',
    ];

    // Auto-generate request number on creation
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $year  = now()->year;
            $count = static::whereYear('created_at', $year)->count() + 1;
            $model->request_number = 'BRG-' . $year . '-' . str_pad($count, 5, '0', STR_PAD_LEFT);
        });
    }

    public function resident()
    {
        return $this->belongsTo(Resident::class);
    }

    public function processedBy()
    {
        return $this->belongsTo(User::class, 'processed_by');
    }
}