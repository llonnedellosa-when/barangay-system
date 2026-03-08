<?php

namespace App\Http\Controllers;

use App\Models\Resident;
use App\Models\DocumentRequest;
use App\Models\Blotter;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_residents'   => Resident::active()->count(),
            'voters'            => Resident::active()->where('is_voter', true)->count(),
            'seniors'           => Resident::active()->where('is_senior_citizen', true)->count(),
            'pwd'               => Resident::active()->where('is_pwd', true)->count(),
            'fourps'            => Resident::active()->where('is_4ps', true)->count(),
            'pending_documents' => DocumentRequest::where('status', 'Pending')->count(),
            'active_blotters'   => Blotter::whereIn('status', ['Filed', 'Under Investigation', 'For Mediation'])->count(),
            'released_today'    => DocumentRequest::where('status', 'Released')
                                    ->whereDate('released_at', today())->count(),
        ];

        $recentRequests = DocumentRequest::with('resident')->latest()->take(5)->get();
        $recentBlotters = Blotter::with('complainant')->latest()->take(5)->get();

        return Inertia::render('Dashboard', compact('stats', 'recentRequests', 'recentBlotters'));
    }
}