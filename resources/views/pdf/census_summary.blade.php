<!DOCTYPE html><html><head><meta charset="utf-8"><style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: Arial, sans-serif; font-size: 10pt; color: #111; padding: 24px 32px; }
  .report-header { text-align:center; margin-bottom:16px; border-bottom:3px solid #0d2137; padding-bottom:12px; }
  .republic { font-size:9pt; color:#555; }
  .brgy-name { font-size:16pt; font-weight:bold; color:#0d2137; text-transform:uppercase; margin:4px 0; letter-spacing:1px; }
  .report-title { font-size:13pt; font-weight:bold; color:#1a4a7a; margin:4px 0; }
  .report-sub { font-size:10pt; color:#555; }
  .meta { display:flex; justify-content:space-between; font-size:9pt; color:#555; margin-bottom:16px; }
  .summary-grid { display:flex; gap:12px; flex-wrap:wrap; margin-bottom:16px; }
  .sum-card { background:#e8f2fc; border:1.5px solid #2e7fc1; border-radius:6px; padding:10px 16px; flex:1; min-width:100px; text-align:center; }
  .sum-num { font-size:22pt; font-weight:bold; color:#0d2137; line-height:1; }
  .sum-lbl { font-size:8pt; color:#555; text-transform:uppercase; letter-spacing:.8px; margin-top:3px; }
  .section-title { font-size:11pt; font-weight:bold; color:#0d2137; margin:14px 0 6px; border-left:4px solid #2e7fc1; padding-left:8px; }
  table { width:100%; border-collapse:collapse; font-size:9pt; margin-bottom:14px; }
  thead tr { background:#0d2137; color:#fff; }
  thead th { padding:7px 10px; text-align:left; font-size:8pt; text-transform:uppercase; }
  tbody tr { border-bottom:1px solid #e0eaf3; }
  tbody tr:nth-child(even) { background:#f5f9fc; }
  tbody td { padding:5px 10px; }
  .signature-row { margin-top:30px; display:flex; justify-content:space-between; }
  .sig-block { text-align:center; }
  .sig-line { border-top:1px solid #333; width:180px; margin:42px auto 3px; }
  .sig-name { font-size:10pt; font-weight:bold; text-transform:uppercase; }
  .sig-title { font-size:9pt; color:#555; }
  .footer { margin-top:16px; font-size:8pt; color:#aaa; text-align:center; border-top:1px solid #d4e1ec; padding-top:8px; }
</style></head><body>
 
@php
  $residents = collect($reportData);
  $total     = $residents->count();
  $male      = $residents->where('gender','Male')->count();
  $female    = $residents->where('gender','Female')->count();
  $voters    = $residents->where('is_voter',1)->count();
  $seniors   = $residents->where('is_senior_citizen',1)->count();
  $pwd       = $residents->where('is_pwd',1)->count();
  $fourps    = $residents->where('is_4ps',1)->count();
 
  // Age groups
  $today   = \Carbon\Carbon::today();
  $minor   = $residents->filter(fn($r) => isset($r['birthdate']) && \Carbon\Carbon::parse($r['birthdate'])->age < 18)->count();
  $youth   = $residents->filter(fn($r) => isset($r['birthdate']) && \Carbon\Carbon::parse($r['birthdate'])->age >= 18 && \Carbon\Carbon::parse($r['birthdate'])->age <= 30)->count();
  $adult   = $residents->filter(fn($r) => isset($r['birthdate']) && \Carbon\Carbon::parse($r['birthdate'])->age >= 31 && \Carbon\Carbon::parse($r['birthdate'])->age <= 59)->count();
  $senior2 = $residents->filter(fn($r) => isset($r['birthdate']) && \Carbon\Carbon::parse($r['birthdate'])->age >= 60)->count();
 
  // Purok breakdown
  $puroks = $residents->groupBy('purok')->map->count()->sortKeys();
  // Education
  $eduGroups = $residents->groupBy('educational_attainment')->map->count()->sortByDesc(fn($v) => $v);
@endphp
 
<div class="report-header">
  <div class="republic">Republic of the Philippines &bull; Province of [Province] &bull; Municipality of [Municipality]</div>
  <div class="brgy-name">Barangay [Name]</div>
  <div class="report-title">Population Census Summary</div>
  <div class="report-sub">Year {{ $year }}</div>
</div>
 
<div class="meta">
  <span>Doc No.: <strong>{{ $doc->doc_number }}</strong></span>
  <span>Date Generated: <strong>{{ $date }}</strong></span>
  @if($doc->purok_filter)<span>Filtered by: <strong>{{ $doc->purok_filter }}</strong></span>@endif
</div>
 
{{-- Summary Cards --}}
<div class="summary-grid">
  <div class="sum-card"><div class="sum-num">{{ $total }}</div><div class="sum-lbl">Total Residents</div></div>
  <div class="sum-card"><div class="sum-num">{{ $male }}</div><div class="sum-lbl">Male</div></div>
  <div class="sum-card"><div class="sum-num">{{ $female }}</div><div class="sum-lbl">Female</div></div>
  <div class="sum-card"><div class="sum-num">{{ $voters }}</div><div class="sum-lbl">Voters</div></div>
  <div class="sum-card"><div class="sum-num">{{ $seniors }}</div><div class="sum-lbl">Seniors</div></div>
  <div class="sum-card"><div class="sum-num">{{ $pwd }}</div><div class="sum-lbl">PWD</div></div>
  <div class="sum-card"><div class="sum-num">{{ $fourps }}</div><div class="sum-lbl">4Ps</div></div>
</div>
 
{{-- Age Distribution --}}
<div class="section-title">Age Distribution</div>
<table>
  <thead><tr><th>Age Group</th><th>Count</th><th>Percentage</th></tr></thead>
  <tbody>
    <tr><td>Minors (Below 18)</td><td>{{ $minor }}</td><td>{{ $total > 0 ? number_format($minor/$total*100,1) : 0 }}%</td></tr>
    <tr><td>Youth (18 – 30)</td><td>{{ $youth }}</td><td>{{ $total > 0 ? number_format($youth/$total*100,1) : 0 }}%</td></tr>
    <tr><td>Adult (31 – 59)</td><td>{{ $adult }}</td><td>{{ $total > 0 ? number_format($adult/$total*100,1) : 0 }}%</td></tr>
    <tr><td>Senior Citizens (60+)</td><td>{{ $senior2 }}</td><td>{{ $total > 0 ? number_format($senior2/$total*100,1) : 0 }}%</td></tr>
  </tbody>
</table>
 
{{-- Purok Breakdown --}}
@if($puroks->count() > 0)
<div class="section-title">Population by Purok</div>
<table>
  <thead><tr><th>Purok</th><th>Residents</th><th>Percentage</th></tr></thead>
  <tbody>
    @foreach($puroks as $purok => $count)
    <tr>
      <td>{{ $purok ?: 'Unspecified' }}</td>
      <td>{{ $count }}</td>
      <td>{{ $total > 0 ? number_format($count/$total*100,1) : 0 }}%</td>
    </tr>
    @endforeach
  </tbody>
</table>
@endif
 
{{-- Education --}}
@if($eduGroups->count() > 0)
<div class="section-title">Educational Attainment</div>
<table>
  <thead><tr><th>Level</th><th>Count</th><th>Percentage</th></tr></thead>
  <tbody>
    @foreach($eduGroups as $level => $count)
    <tr>
      <td>{{ $level ?: 'Not Specified' }}</td>
      <td>{{ $count }}</td>
      <td>{{ $total > 0 ? number_format($count/$total*100,1) : 0 }}%</td>
    </tr>
    @endforeach
  </tbody>
</table>
@endif
 
{{-- Signature --}}
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
  Barangay [Name] &bull; Population Census Summary &bull; Generated: {{ $date }} &bull; {{ $doc->doc_number }}
</div>
</body></html>