<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Blotter extends Model
{
    use HasFactory;

    protected $fillable = [
        'case_number', 'complainant_id', 'respondent_name',
        'respondent_address', 'incident_type', 'incident_date',
        'incident_location', 'narrative', 'status', 'resolution',
        'handled_by',
    ];

    protected $casts = [
        'incident_date' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $year  = now()->year;
            $count = static::whereYear('created_at', $year)->count() + 1;
            $model->case_number = 'BLT-' . $year . '-' . str_pad($count, 5, '0', STR_PAD_LEFT);
        });
    }

    public function complainant()
    {
        return $this->belongsTo(Resident::class, 'complainant_id');
    }

    public function handledBy()
    {
        return $this->belongsTo(User::class, 'handled_by');
    }
}