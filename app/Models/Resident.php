<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Resident extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'first_name', 'middle_name', 'last_name', 'suffix',
        'birthdate', 'gender', 'civil_status', 'nationality',
        'religion', 'occupation', 'contact_number', 'email',
        'purok', 'street', 'address',
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
    ];

    // ── Accessors ──────────────────────────────────────────
    public function getFullNameAttribute(): string
    {
        $name = "{$this->first_name}";
        if ($this->middle_name) $name .= " {$this->middle_name[0]}.";
        $name .= " {$this->last_name}";
        if ($this->suffix)      $name .= " {$this->suffix}";
        return $name;
    }

    public function getAgeAttribute(): int
    {
        return $this->birthdate->age;
    }

    // ── Relationships ──────────────────────────────────────
    public function documentRequests()
    {
        return $this->hasMany(DocumentRequest::class);
    }

    public function blotters()
    {
        return $this->hasMany(Blotter::class, 'complainant_id');
    }

    // ── Scopes (reusable query filters) ───────────────────
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeSearch($query, string $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('first_name', 'LIKE', "%{$search}%")
              ->orWhere('last_name',  'LIKE', "%{$search}%")
              ->orWhere('address',    'LIKE', "%{$search}%")
              ->orWhere('contact_number', 'LIKE', "%{$search}%");
        });
    }

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, fn($q, $s) => $q->search($s));
        $query->when($filters['purok']  ?? null, fn($q, $p) => $q->where('purok', $p));
        $query->when($filters['gender'] ?? null, fn($q, $g) => $q->where('gender', $g));
        $query->when(isset($filters['is_voter']) && $filters['is_voter'] !== '',
            fn($q) => $q->where('is_voter', $filters['is_voter']));

        return $query;
    }
}