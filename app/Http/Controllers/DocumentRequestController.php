<?php
namespace App\Http\Controllers;

use App\Models\DocumentRequest;
use App\Models\Resident;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class DocumentRequestController extends Controller
{
    public function index(Request $request)
    {
        $requests = DocumentRequest::with('resident')
            ->when($request->search, fn($q, $s) =>
                $q->whereHas('resident', fn($r) =>
                    $r->where('first_name', 'LIKE', "%{$s}%")
                      ->orWhere('last_name',  'LIKE', "%{$s}%")
                ))
            ->when($request->status, fn($q, $s) => $q->where('status', $s))
            ->when($request->type,   fn($q, $t) => $q->where('document_type', $t))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Documents/Index', [
            'requests' => $requests,
            'filters'  => $request->only(['search', 'status', 'type']),
        ]);
    }

    public function create()
    {
        $residents = Resident::active()
            ->select(['id', 'first_name', 'last_name', 'address'])
            ->orderBy('last_name')
            ->get()
            ->map(fn($r) => [
                'id'      => $r->id,
                'name'    => $r->full_name,
                'address' => $r->address,
            ]);

        return Inertia::render('Documents/Create', [
            'residents' => $residents,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'resident_id'   => 'required|exists:residents,id',
            'document_type' => 'required|string',
            'purpose'       => 'required|string|max:255',
            'fee'           => 'nullable|numeric|min:0',
        ]);

        DocumentRequest::create($validated);

        return redirect()->route('documents.index')
            ->with('success', 'Document request submitted!');
    }

    public function updateStatus(Request $request, DocumentRequest $document)
    {
        $validated = $request->validate([
            'status'  => 'required|in:Pending,Processing,Approved,Released,Rejected',
            'remarks' => 'nullable|string',
        ]);

        // ✅ array_merge instead of spread operator
        $document->update(array_merge($validated, [
            'processed_by' => Auth::id(),
            'released_at'  => $validated['status'] === 'Released' ? now() : null,
        ]));

        return back()->with('success', 'Status updated!');
    }

    public function print(DocumentRequest $document)
    {
        $document->load('resident');

        $pdf = Pdf::loadView('pdf.document-certificate', [
            'document' => $document,
            'resident' => $document->resident,
            'date'     => now()->format('F d, Y'),
        ]);

        return $pdf->stream("{$document->request_number}.pdf");
    }
}