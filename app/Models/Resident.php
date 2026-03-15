<?php

namespace App\Models;
 
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;
 
class Resident extends Model
{
    use HasFactory, SoftDeletes;
 
    protected $fillable = [
        'first_name', 'middle_name', 'last_name', 'suffix',
        'birthdate', 'gender', 'civil_status', 'nationality',
        'religion', 'occupation',
        'educational_attainment',   // NEW
        'youth_classification',     // NEW
        'contact_number', 'email',
        'purok', 'street', 'address',
        'house_ownership',          // NEW
        'house_type',               // NEW
        'hazards',                  // NEW (json array)
        'is_voter', 'is_senior_citizen', 'is_pwd', 'is_4ps',
        'is_active', 'photo',
    ];
 
    protected $casts = [
        'birthdate'         => 'date',
        'is_voter'          => 'boolean',
        'is_senior_citizen' => 'boolean',
        'is_pwd'            => 'boolean',
        'is_4ps'            => 'boolean',
        'is_active'         => 'boolean',
        'hazards'           => 'array',  // auto cast JSON to/from array
    ];
 
    // ── Accessors ─────────────────────────────────────────────
 
    public function getFullNameAttribute(): string
    {
        $name = $this->first_name;
        if ($this->middle_name) $name .= ' ' . $this->middle_name[0] . '.';
        $name .= ' ' . $this->last_name;
        if ($this->suffix) $name .= ' ' . $this->suffix;
        return $name;
    }
 
    public function getAgeAttribute(): int
    {
        return Carbon::parse($this->birthdate)->age;
    }
 
    public function getAgeGroupAttribute(): string
    {
        $age = $this->age;
        if ($age >= 15 && $age <= 17) return 'child_youth';
        if ($age >= 18 && $age <= 24) return 'youth';
        if ($age >= 25 && $age <= 30) return 'young_adult';
        if ($age >= 31 && $age <= 59) return 'adult';
        if ($age >= 60)               return 'senior';
        return 'other';
    }
 
    // ── Relationships ──────────────────────────────────────────
 
    public function documentRequests()
    {
        return $this->hasMany(DocumentRequest::class);
    }
 
    public function blotters()
    {
        return $this->hasMany(Blotter::class, 'complainant_id');
    }
 
    // ── Scopes ────────────────────────────────────────────────
 
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
 
    public function scopeSearch($query, string $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('first_name',      'LIKE', "%{$search}%")
              ->orWhere('last_name',      'LIKE', "%{$search}%")
              ->orWhere('address',        'LIKE', "%{$search}%")
              ->orWhere('contact_number', 'LIKE', "%{$search}%");
        });
    }
 
    public function scopeFilter($query, array $filters)
    {
        // Basic filters
        $query->when($filters['search']       ?? null, fn($q, $s) => $q->search($s));
        $query->when($filters['purok']        ?? null, fn($q, $v) => $q->where('purok', $v));
        $query->when($filters['gender']       ?? null, fn($q, $v) => $q->where('gender', $v));
        $query->when($filters['civil_status'] ?? null, fn($q, $v) => $q->where('civil_status', $v));
 
        // New filters
        $query->when($filters['educational_attainment'] ?? null,
            fn($q, $v) => $q->where('educational_attainment', $v));
 
        $query->when($filters['youth_classification'] ?? null,
            fn($q, $v) => $q->where('youth_classification', $v));
 
        $query->when($filters['house_ownership'] ?? null,
            fn($q, $v) => $q->where('house_ownership', $v));
 
        // Hazard filter — JSON contains
        $query->when($filters['hazard'] ?? null,
            fn($q, $v) => $q->whereJsonContains('hazards', $v));
 
        // Age group filter
        $query->when($filters['age_group'] ?? null, function ($q, $group) {
            $today = Carbon::today();
            return match ($group) {
                'child_youth' => $q->whereBetween('birthdate', [
                    $today->copy()->subYears(18)->addDay(), $today->copy()->subYears(15),
                ]),
                'youth'       => $q->whereBetween('birthdate', [
                    $today->copy()->subYears(25)->addDay(), $today->copy()->subYears(18),
                ]),
                'young_adult' => $q->whereBetween('birthdate', [
                    $today->copy()->subYears(31)->addDay(), $today->copy()->subYears(25),
                ]),
                'adult'       => $q->whereBetween('birthdate', [
                    $today->copy()->subYears(60)->addDay(), $today->copy()->subYears(31),
                ]),
                'senior'      => $q->where('birthdate', '<=', $today->copy()->subYears(60)),
                default       => $q,
            };
        });
 
        // Special group filter
        $query->when($filters['special_group'] ?? null, function ($q, $group) {
            return match ($group) {
                'voter'  => $q->where('is_voter', true),
                'senior' => $q->where('is_senior_citizen', true),
                'pwd'    => $q->where('is_pwd', true),
                '4ps'    => $q->where('is_4ps', true),
                default  => $q,
            };
        });
 
        return $query;
    }
}