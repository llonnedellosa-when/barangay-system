<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;
class Resident extends Model
{
    use Searchable;

    protected $fillable = [
        'first_name',
        'last_name',
        'contact_number',
        'address',
    ];

    public function toSearchableArray()
    {
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'address' => $this->address,
            'contact_number' => $this->contact_number,
        ];
    }
}
