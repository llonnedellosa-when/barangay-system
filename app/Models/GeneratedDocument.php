<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GeneratedDocument extends Model
{
    protected $fillable = [
        'doc_number',
        'doc_type',
        'doc_type_label',
        'resident_id',
        'scope',
        'purpose',
        'or_number',
        'fee',
        'purok_filter',
        'year_filter',
        'generated_by',
    ];

    protected $casts = [
        'fee' => 'decimal:2',
    ];

    // Auto-generate document number on create
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $prefixes = [
                'clearance'        => 'BCL',
                'indigency'        => 'IND',
                'residency'        => 'RES',
                'good_moral'       => 'GMC',
                'business'         => 'BUS',
                'solo_parent'      => 'SPC',
                'guardianship'     => 'GRD',
                'cohabitation'     => 'COH',
                'census_summary'   => 'CEN',
                'voter_list'       => 'VTR',
                'senior_list'      => 'SNR',
                'pwd_list'         => 'PWD',
                'fourps_list'      => 'FPS',
                'youth_report'     => 'YTH',
                'hazard_list'      => 'HAZ',
                'purok_summary'    => 'PRK',
                'masterlist'       => 'MST',
                'new_residents'    => 'NEW',
                'purok_roster'     => 'PRS',
                'education_report' => 'EDU',
                'gender_report'    => 'GEN',
                'civil_status'     => 'CVL',
            ];

            $prefix = $prefixes[$model->doc_type] ?? 'DOC';
            $year = now()->year;

            $count = static::where('doc_type', $model->doc_type)
                ->whereYear('created_at', $year)
                ->count() + 1;

            $model->doc_number = "{$prefix}-{$year}-" . str_pad($count, 5, '0', STR_PAD_LEFT);
        });
    }

    public function resident()
    {
        return $this->belongsTo(Resident::class);
    }

    public function generatedBy()
    {
        return $this->belongsTo(User::class, 'generated_by');
    }
}