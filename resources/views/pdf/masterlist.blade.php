<!DOCTYPE html><html><head><meta charset="utf-8"><style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: Arial, sans-serif; font-size: 9pt; color: #111; padding: 18px 24px; }
  .report-header { text-align:center; margin-bottom:12px; border-bottom:3px solid #0d2137; padding-bottom:10px; }
  .brgy-name    { font-size:14pt; font-weight:bold; color:#0d2137; text-transform:uppercase; letter-spacing:1px; margin:4px 0 2px; }
  .report-title { font-size:12pt; font-weight:bold; color:#1a4a7a; }
  .report-sub   { font-size:9pt; color:#555; margin-top:2px; }
  .meta { display:flex; justify-content:space-between; font-size:8pt; color:#555; margin-bottom:10px; }
  table { width:100%; border-collapse:collapse; font-size:8.5pt; }
  thead tr { background:#0d2137; color:#fff; }
  thead th { padding:6px 8px; text-align:left; font-size:7.5pt; text-transform:uppercase; letter-spacing:.7px; white-space:nowrap; }
  tbody tr { border-bottom:1px solid #e0eaf3; }
  tbody tr:nth-child(even) { background:#f5f9fc; }
  tbody td { padding:5px 8px; vertical-align:middle; }
  tbody tr:last-child { border-bottom:2px solid #0d2137; }
  tfoot td { padding:5px 8px; font-weight:bold; font-size:8.5pt; background:#f0f0f0; }
  .signature-row { margin-top:24px; display:flex; justify-content:space-between; }
  .sig-block { text-align:center; }
  .sig-line { border-top:1px solid #333; width:180px; margin:38px auto 3px; }
  .sig-name { font-size:9.5pt; font-weight:bold; text-transform:uppercase; }
  .sig-title { font-size:8.5pt; color:#555; }
  .footer { margin-top:12px; font-size:7.5pt; color:#aaa; text-align:center; border-top:1px solid #d4e1ec; padding-top:6px; }
  .tag { display:inline-block; padding:1px 5px; border-radius:8px; font-size:6.5pt; font-weight:bold; }
  .tag-v { background:#d4f4e2; color:#1a7a4a; }
  .tag-s { background:#fef3cd; color:#7a5a00; }
  .tag-p { background:#e0f0ff; color:#2e7fc1; }
  .tag-f { background:#e8e8ff; color:#3a3ab0; }
</style></head><body>
 
@php $residents = collect($reportData); $total = $residents->count(); @endphp
 
<div class="report-header">
  <div style="font-size:8pt; color:#555;">Republic of the Philippines &bull; Province of [Province] &bull; Municipality of [Municipality]</div>
  <div class="brgy-name">Barangay [Name]</div>
  <div class="report-title">{{ $doc->doc_type_label }}</div>
  <div class="report-sub">Year {{ $year }} @if($doc->purok_filter) &bull; {{ $doc->purok_filter }} @endif</div>
</div>
 
<div class="meta">
  <span>Doc No.: <strong>{{ $doc->doc_number }}</strong></span>
  <span>Total Records: <strong>{{ $total }}</strong></span>
  <span>Date Generated: <strong>{{ $date }}</strong></span>
</div>
 
<table>
  <thead>
    <tr>
      <th>#</th>
      <th>Resident ID</th>
      <th>Last Name</th>
      <th>First Name</th>
      <th>M.I.</th>
      <th>Sex</th>
      <th>Age</th>
      <th>Civil Status</th>
      <th>Purok</th>
      <th>Address</th>
      <th>Contact</th>
      @if($doc->doc_type === 'masterlist' || $doc->doc_type === 'new_residents')
      <th>Classification</th>
      @endif
      @if($doc->doc_type === 'youth_report')
      <th>Youth Type</th>
      <th>Education</th>
      @endif
      @if($doc->doc_type === 'hazard_list')
      <th>Hazards</th>
      @endif
    </tr>
  </thead>
  <tbody>
    @forelse($residents as $i => $r)
    <tr>
      <td>{{ $i+1 }}</td>
      <td style="font-family:monospace; font-size:7.5pt;">{{ str_pad($r['id'], 4, '0', STR_PAD_LEFT) }}</td>
      <td><strong>{{ $r['last_name'] }}</strong></td>
      <td>{{ $r['first_name'] }}</td>
      <td>{{ $r['middle_name'] ? strtoupper($r['middle_name'][0]).'.' : '' }}</td>
      <td>{{ $r['gender'] === 'Male' ? 'M' : 'F' }}</td>
      <td>{{ $r['birthdate'] ? \Carbon\Carbon::parse($r['birthdate'])->age : '—' }}</td>
      <td>{{ $r['civil_status'] }}</td>
      <td>{{ $r['purok'] ?? '—' }}</td>
      <td style="font-size:7.5pt; max-width:120px;">{{ $r['address'] }}</td>
      <td style="font-size:7.5pt;">{{ $r['contact_number'] ?? '—' }}</td>
      @if($doc->doc_type === 'masterlist' || $doc->doc_type === 'new_residents')
      <td>
        @if($r['is_voter']) <span class="tag tag-v">V</span> @endif
        @if($r['is_senior_citizen']) <span class="tag tag-s">SC</span> @endif
        @if($r['is_pwd']) <span class="tag tag-p">PWD</span> @endif
        @if($r['is_4ps']) <span class="tag tag-f">4Ps</span> @endif
      </td>
      @endif
      @if($doc->doc_type === 'youth_report')
      <td style="font-size:7.5pt;">{{ $r['youth_classification'] ?? '—' }}</td>
      <td style="font-size:7.5pt;">{{ $r['educational_attainment'] ?? '—' }}</td>
      @endif
      @if($doc->doc_type === 'hazard_list')
      <td style="font-size:7.5pt;">
        @php $hazards = is_array($r['hazards']) ? $r['hazards'] : json_decode($r['hazards'] ?? '[]', true); @endphp
        {{ implode(', ', $hazards) }}
      </td>
      @endif
    </tr>
    @empty
    <tr><td colspan="12" style="text-align:center; padding:20px; color:#999;">No records found.</td></tr>
    @endforelse
  </tbody>
  <tfoot>
    <tr>
      <td colspan="5">TOTAL RECORDS</td>
      <td colspan="7">{{ $total }}</td>
    </tr>
  </tfoot>
</table>
 
<div class="signature-row">
  <div class="sig-block">
    <div class="sig-line"></div>
    <div class="sig-name">[PUNONG BARANGAY NAME]</div>
    <div class="sig-title">Punong Barangay</div>
  </div>
  <div class="sig-block">
    <div class="sig-line"></div>
    <div class="sig-name">[SECRETARY NAME]</div>
    <div class="sig-title">Barangay Secretary</div>
  </div>
</div>
 
<div class="footer">
  Barangay [Name] &bull; {{ $doc->doc_type_label }} &bull; Doc No. {{ $doc->doc_number }} &bull; Generated: {{ $date }}
</div>
</body></html>