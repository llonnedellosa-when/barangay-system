<?php

namespace App\Http\Controllers;

use App\Models\Resident;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ResidentController extends Controller
{
    // LIST with search, filter, paginate
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'purok', 'gender', 'is_voter']);

        $residents = Resident::query()
            ->active()
            ->filter($filters)
            ->orderBy('last_name')
            ->paginate(25)
            ->withQueryString(); // keeps filters in URL

        $stats = [
            'total'        => Resident::active()->count(),
            'voters'       => Resident::active()->where('is_voter', true)->count(),
            'senior'       => Resident::active()->where('is_senior_citizen', true)->count(),
            'pwd'          => Resident::active()->where('is_pwd', true)->count(),
        ];

        return Inertia::render('Residents/Index', [
            'residents' => $residents,
            'filters'   => $filters,
            'stats'     => $stats,
        ]);
    }

    // SHOW single resident
    public function show(Resident $resident)
    {
        $resident->load(['documentRequests', 'blotters']);

        return Inertia::render('Residents/Show', [
            'resident' => $resident->append(['full_name', 'age']),
        ]);
    }

    // CREATE form
    public function create()
    {
        return Inertia::render('Residents/Create');
    }

    // STORE new resident
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name'    => 'required|string|max:100',
            'middle_name'   => 'nullable|string|max:100',
            'last_name'     => 'required|string|max:100',
            'suffix'        => 'nullable|string|max:10',
            'birthdate'     => 'required|date|before:today',
            'gender'        => 'required|in:Male,Female',
            'civil_status'  => 'required|in:Single,Married,Widowed,Separated',
            'contact_number'=> 'nullable|string|max:20',
            'email'         => 'nullable|email|max:100',
            'purok'         => 'nullable|string|max:50',
            'address'       => 'required|string|max:255',
            'occupation'    => 'nullable|string|max:100',
            'is_voter'      => 'boolean',
            'is_senior_citizen' => 'boolean',
            'is_pwd'        => 'boolean',
            'is_4ps'        => 'boolean',
        ]);

        Resident::create($validated);

        return redirect()->route('residents.index')
            ->with('success', 'Resident added successfully!');
    }

    // EDIT form
    public function edit(Resident $resident)
    {
        return Inertia::render('Residents/Edit', [
            'resident' => $resident,
        ]);
    }

    // UPDATE resident
    public function update(Request $request, Resident $resident)
    {
        $validated = $request->validate([
            'first_name'    => 'required|string|max:100',
            'middle_name'   => 'nullable|string|max:100',
            'last_name'     => 'required|string|max:100',
            'suffix'        => 'nullable|string|max:10',
            'birthdate'     => 'required|date|before:today',
            'gender'        => 'required|in:Male,Female',
            'civil_status'  => 'required|in:Single,Married,Widowed,Separated',
            'contact_number'=> 'nullable|string|max:20',
            'email'         => 'nullable|email|max:100',
            'purok'         => 'nullable|string|max:50',
            'address'       => 'required|string|max:255',
            'occupation'    => 'nullable|string|max:100',
            'is_voter'      => 'boolean',
            'is_senior_citizen' => 'boolean',
            'is_pwd'        => 'boolean',
            'is_4ps'        => 'boolean',
        ]);

        $resident->update($validated);

        return redirect()->route('residents.show', $resident)
            ->with('success', 'Resident updated successfully!');
    }

    // SOFT DELETE
    public function destroy(Resident $resident)
    {
        $resident->delete();

        return redirect()->route('residents.index')
            ->with('success', 'Resident archived successfully.');
    }
}