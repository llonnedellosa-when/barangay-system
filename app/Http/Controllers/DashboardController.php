<?php

namespace App\Http\Controllers;

use App\Models\Resident;
use App\Models\DocumentRequest;
use App\Models\Blotter;
use App\Models\Setting;   
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        /* ── Core population stats ─────────────────────────── */
        $baseQuery = Resident::active();

        $totalResidents = (clone $baseQuery)->count();
        $male           = (clone $baseQuery)->where('gender', 'Male')->count();
        $female         = (clone $baseQuery)->where('gender', 'Female')->count();

        /* ── Age groups ────────────────────────────────────── */
        $today = Carbon::today();

        // Minor: < 18
        $minor = (clone $baseQuery)
            ->where('birthdate', '>', $today->copy()->subYears(18))
            ->count();

        // Young: 18–35
        $young = (clone $baseQuery)
            ->whereBetween('birthdate', [
                $today->copy()->subYears(36)->addDay(),
                $today->copy()->subYears(18),
            ])->count();

        // Adult: 36–59
        $adult = (clone $baseQuery)
            ->whereBetween('birthdate', [
                $today->copy()->subYears(60)->addDay(),
                $today->copy()->subYears(36),
            ])->count();

        // Senior: 60+
        $seniorAge = (clone $baseQuery)
            ->where('birthdate', '<=', $today->copy()->subYears(60))
            ->count();

        /* ── Special groups ────────────────────────────────── */
        $voters      = (clone $baseQuery)->where('is_voter', true)->count();
        $seniors     = (clone $baseQuery)->where('is_senior_citizen', true)->count();
        $pwd         = (clone $baseQuery)->where('is_pwd', true)->count();
        $fourps      = (clone $baseQuery)->where('is_4ps', true)->count();
        $soloParent  = 0; 

        /* ── Document stats ────────────────────────────────── */
        $pendingDocuments = DocumentRequest::where('status', 'Pending')->count();
        $releasedToday    = DocumentRequest::where('status', 'Released')
                                ->whereDate('released_at', today())
                                ->count();

        /* ── Blotter stats ─────────────────────────────────── */
        $activeBlotters = Blotter::whereIn('status', [
            'Filed', 'Under Investigation', 'For Mediation',
        ])->count();


        $housing = DB::table('residents')
            ->select('purok as ownership', DB::raw('count(*) as count'))
            ->whereNull('deleted_at')
            ->where('is_active', true)
            ->whereNotNull('purok')
            ->groupBy('purok')
            ->orderByDesc('count')
            ->get()
            ->map(fn($row) => [
                'ownership' => $row->ownership,
                'count'     => $row->count,
            ])
            ->toArray();

        /* ── Recent residents (last 6) ─────────────────────── */
        $recentResidents = Resident::active()
            ->orderByDesc('created_at')
            ->take(6)
            ->get([
                'id', 'first_name', 'middle_name', 'last_name', 'suffix',
                'gender', 'birthdate', 'purok', 'is_active',
            ]);

        /* ── Recent document requests (last 5) ─────────────── */
        $recentRequests = DocumentRequest::with([
                'resident:id,first_name,last_name',
            ])
            ->latest()
            ->take(5)
            ->get();

        /* ── Recent blotter cases (last 5) ─────────────────── */
        $recentBlotters = Blotter::with([
                'complainant:id,first_name,last_name',
            ])
            ->latest()
            ->take(5)
            ->get();


        $barangayName = config('app.barangay_name', 'Barangay Information Management System');
        $captainName  = config('app.captain_name', '');

        $households = Resident::active()
            ->distinct('purok')
            ->whereNotNull('purok')
            ->count('purok');

        /* ── Pass to React ─────────────────────────────────── */
        return Inertia::render('Dashboard', [
            'stats' => [
                'total_residents'   => $totalResidents,
                'households'        => $households,
                'male'              => $male,
                'female'            => $female,
                'minor'             => $minor,
                'young'             => $young,
                'adult'             => $adult,
                'senior_age'        => $seniorAge,
                'voters'            => $voters,
                'seniors'           => $seniors,
                'pwd'               => $pwd,
                'fourps'            => $fourps,
                'solo_parent'       => $soloParent,
                'pending_documents' => $pendingDocuments,
                'active_blotters'   => $activeBlotters,
                'released_today'    => $releasedToday,
            ],
            'housing'          => $housing,
            'recentResidents'  => $recentResidents,
            'recentRequests'   => $recentRequests,
            'recentBlotters'   => $recentBlotters,
            'barangayName'     => $barangayName,
            'captainName'      => $captainName,
        ]);
    }
}