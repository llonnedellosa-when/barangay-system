<?php

namespace App\Http\Controllers;

use App\Models\GeneratedDocument;
use App\Models\Resident;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class DocumentController extends Controller
{
    private const DOC_LABELS = [
        'clearance'        => 'Barangay Clearance',
        'indigency'        => 'Certificate of Indigency',
        'residency'        => 'Certificate of Residency',
        'good_moral'       => 'Certificate of Good Moral Character',
        'business'         => 'Business Clearance',
        'solo_parent'      => 'Solo Parent Certificate',
        'guardianship'     => 'Certificate of Guardianship',
        'cohabitation'     => 'Certificate of Cohabitation',
        'census_summary'   => 'Population Census Summary',
        'voter_list'       => 'Registered Voters List',
        'senior_list'      => 'Senior Citizens List',
        'pwd_list'         => 'PWD Residents List',
        'fourps_list'      => '4Ps Beneficiaries List',
        'youth_report'     => 'Youth Profiling Report',
        'hazard_list'      => 'Hazard-Prone Households Report',
        'purok_summary'    => 'Purok Population Summary',
        'masterlist'       => 'Resident Masterlist',
        'new_residents'    => 'New Residents Report',
        'purok_roster'     => 'Purok Roster',
        'education_report' => 'Educational Attainment Report',
        'gender_report'    => 'Gender Distribution Report',
        'civil_status'     => 'Civil Status Report',
    ];

    private const REPORT_TYPES = [
        'census_summary', 'voter_list', 'senior_list', 'pwd_list',
        'fourps_list', 'youth_report', 'hazard_list', 'purok_summary',
        'masterlist', 'new_residents', 'purok_roster', 'education_report',
        'gender_report', 'civil_status',
    ];

    // ── Index / Dashboard ────────────────────────────────────────
    public function index()
    {
        $stats = [
            'total_residents' => Resident::active()->count(),
            'voters'          => Resident::active()->where('is_voter', true)->count(),
            'seniors'         => Resident::active()->where('is_senior_citizen', true)->count(),
            'pwd'             => Resident::active()->where('is_pwd', true)->count(),
            'fourps'          => Resident::active()->where('is_4ps', true)->count(),
            'youth'           => Resident::active()
                                    ->whereBetween('birthdate', [
                                        Carbon::today()->subYears(31)->addDay(),
                                        Carbon::today()->subYears(15),
                                    ])->count(),
        ];

        $recentDocs = GeneratedDocument::with('resident')
            ->latest()
            ->take(10)
            ->get();

        return Inertia::render('Documents/Index', [
            'stats'      => $stats,
            'recentDocs' => $recentDocs,
        ]);
    }

    // ── Generate form ─────────────────────────────────────────────
    public function generate(string $docType)
    {
        if (!array_key_exists($docType, self::DOC_LABELS)) {
            abort(404, 'Document type not found.');
        }

        $residents = [];

        // Only certificates need resident lookup
        if (!in_array($docType, self::REPORT_TYPES)) {
            $residents = Resident::active()
                ->select([
                    'id', 'first_name', 'last_name', 'middle_name',
                    'suffix', 'address', 'purok', 'civil_status',
                    'birthdate', 'gender',
                ])
                ->orderBy('last_name')
                ->get()
                ->map(fn($r) => [
                    'id'           => $r->id,
                    'name'         => $r->full_name,
                    'address'      => $r->address,
                    'purok'        => $r->purok,
                    'civil_status' => $r->civil_status,
                    'age'          => $r->age,
                    'gender'       => $r->gender,
                ]);
        }

        return Inertia::render('Documents/Generate', [
            'docType'   => $docType,
            'residents' => $residents,
        ]);
    }

    // ── Store — save record and redirect to PDF ───────────────────
    public function store(Request $request)
    {
        $docType  = $request->input('doc_type');
        $isReport = in_array($docType, self::REPORT_TYPES);

        $rules = ['doc_type' => 'required|string'];

        if (!$isReport) {
            $rules['resident_id'] = 'required|exists:residents,id';
            $rules['purpose']     = 'required|string';
        }

        $request->validate($rules);

        $purpose = $request->purpose === 'Other'
            ? $request->custom_purpose
            : $request->purpose;

        $doc = GeneratedDocument::create([
            'doc_type'       => $docType,
            'doc_type_label' => self::DOC_LABELS[$docType] ?? $docType,
            'resident_id'    => $isReport ? null : $request->resident_id,
            'scope'          => $isReport ? (self::DOC_LABELS[$docType] ?? '') : null,
            'purpose'        => $purpose,
            'or_number'      => $request->or_number,
            'fee'            => $request->fee ?? 0,
            'purok_filter'   => $request->purok_filter,
            'year_filter'    => $request->year_filter ?? date('Y'),
            'generated_by'   => Auth::id(),
        ]);

        // ✅ Use ->id (integer) not model binding
        return redirect()->route('documents.print', ['id' => $doc->id]);
    }

    // ── Print PDF ─────────────────────────────────────────────────
    // ✅ Uses plain $id instead of model binding to avoid route conflicts
    public function print(int $id)
    {
        $document = GeneratedDocument::with('resident')->findOrFail($id);

        $isReport   = in_array($document->doc_type, self::REPORT_TYPES);
        $reportData = $isReport ? $this->getReportData($document) : [];

        // Check view exists — fallback to shared templates
        $viewName = "pdf.{$document->doc_type}";

        // Certificates all share one template
        $certificateTypes = array_keys(array_diff_key(
            self::DOC_LABELS,
            array_flip(self::REPORT_TYPES)
        ));

       if (in_array($document->doc_type, $certificateTypes)) {
           $viewName = 'pdf.certificate';
        }
        // Reports: masterlist template handles most list reports
        $listReports = [
            'voter_list','senior_list','pwd_list','fourps_list',
            'youth_report','hazard_list','new_residents','purok_roster',
            'masterlist',
        ];
        if (in_array($document->doc_type, $listReports)) {
            $viewName = 'pdf.masterlist';
        }

        // Summary/analysis reports
        $summaryReports = [
            'census_summary','purok_summary','education_report',
            'gender_report','civil_status',
        ];
        if (in_array($document->doc_type, $summaryReports)) {
            $viewName = 'pdf.census_summary';
        }

        $orientation = in_array($document->doc_type, [
            'masterlist','voter_list','senior_list','pwd_list',
            'fourps_list','purok_roster','hazard_list','new_residents',
        ]) ? 'landscape' : 'portrait';

        $pdf = Pdf::loadView($viewName, [
            'doc'        => $document,
            'resident'   => $document->resident,
            'reportData' => $reportData,
            'date'       => now()->format('F d, Y'),
            'year'       => $document->year_filter ?? date('Y'),
        ])->setPaper('letter', $orientation);

        return $pdf->stream("{$document->doc_number}.pdf");
    }

    // ── Helper: fetch report residents ───────────────────────────
    private function getReportData(GeneratedDocument $doc): array
    {
        $query = Resident::active();

        if ($doc->purok_filter) {
            $query->where('purok', $doc->purok_filter);
        }

        return match ($doc->doc_type) {
            'voter_list'      => $query->where('is_voter', true)->orderBy('last_name')->get()->toArray(),
            'senior_list'     => $query->where('is_senior_citizen', true)->orderBy('last_name')->get()->toArray(),
            'pwd_list'        => $query->where('is_pwd', true)->orderBy('last_name')->get()->toArray(),
            'fourps_list'     => $query->where('is_4ps', true)->orderBy('last_name')->get()->toArray(),
            'youth_report'    => $query->whereBetween('birthdate', [
                                        Carbon::today()->subYears(31)->addDay(),
                                        Carbon::today()->subYears(15),
                                    ])->orderBy('last_name')->get()->toArray(),
            'hazard_list'     => $query->whereNotNull('hazards')
                                    ->where('hazards', '!=', '[]')
                                    ->orderBy('last_name')->get()->toArray(),
            'new_residents'   => $query->whereYear('created_at', $doc->year_filter ?? date('Y'))
                                    ->orderBy('last_name')->get()->toArray(),
            'purok_summary'   => $query->orderBy('purok')->orderBy('last_name')->get()->toArray(),
            'purok_roster'    => $query->orderBy('purok')->orderBy('last_name')->get()->toArray(),
            'education_report'=> $query->orderBy('educational_attainment')->get()->toArray(),
            'gender_report'   => $query->orderBy('gender')->get()->toArray(),
            'civil_status'    => $query->orderBy('civil_status')->get()->toArray(),
            default           => $query->orderBy('last_name')->get()->toArray(),
        };
    }
}