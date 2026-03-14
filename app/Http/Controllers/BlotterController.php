<?php

namespace App\Http\Controllers;

use App\Models\Blotter;
use App\Models\Resident;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
class BlotterController extends Controller
{
    public function __construct()
    {
        $this->middleware('can:view blotter')->only(['index', 'show']);
        $this->middleware('can:create blotter')->only(['create', 'store']);
        $this->middleware('can:manage blotter')->only('updateStatus');
    }

    public function index(Request $request)
    {
        $blotters = Blotter::with('complainant')
            ->when($request->search, fn($q, $s) =>
                $q->where('case_number', 'LIKE', "%{$s}%")
                  ->orWhere('respondent_name', 'LIKE', "%{$s}%")
                  ->orWhereHas('complainant', fn($r) =>
                    $r->where('last_name', 'LIKE', "%{$s}%")
                  )
            )
            ->when($request->status, fn($q, $s) => $q->where('status', $s))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Blotter/Index', [
            'blotters' => $blotters,
            'filters'  => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        $residents = Resident::active()
            ->select(['id', 'first_name', 'last_name'])
            ->orderBy('last_name')
            ->get()
            ->map(fn($r) => [
                'id' => $r->id,
                'name' => $r->full_name
            ]);

        return Inertia::render('Blotter/Create', [
            'residents' => $residents,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'complainant_id'      => 'required|exists:residents,id',
            'respondent_name'     => 'required|string|max:200',
            'respondent_address'  => 'nullable|string|max:255',
            'incident_type'       => 'required|string',
            'incident_date'       => 'required|date',
            'incident_location'   => 'required|string|max:255',
            'narrative'           => 'required|string',
        ]);

        $validated['handled_by'] = auth()->user()->id;

        Blotter::create($validated);

        return redirect()->route('blotter.index')
            ->with('success', 'Blotter report filed!');
    }

    public function show(Blotter $blotter)
    {
        $blotter->load('complainant', 'handledBy');

        return Inertia::render('Blotter/Show', [
            'blotter' => $blotter,
        ]);
    }

    public function updateStatus(Request $request, Blotter $blotter)
    {
        $validated = $request->validate([
            'status'     => 'required|string',
            'resolution' => 'nullable|string',
        ]);

        $blotter->update($validated);

        return back()->with('success', 'Case status updated!');
    }
}