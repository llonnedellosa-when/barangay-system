<!DOCTYPE html>

<html>
<head>
<meta charset="utf-8">
<style>
*{margin:0;padding:0;box-sizing:border-box;}

body{
font-family:'Times New Roman',serif;
font-size:12pt;
color:#111;
padding:40px 60px;
}

.header{
text-align:center;
margin-bottom:20px;
}

.header h1{
font-size:15pt;
text-transform:uppercase;
}

.header p{
font-size:10pt;
}

.divider{
border-top:3px double #1a3a8f;
margin:15px 0;
}

.cert-title{
text-align:center;
font-size:18pt;
font-weight:bold;
text-transform:uppercase;
margin:20px 0;
text-decoration:underline;
}

.body{
line-height:1.9;
text-align:justify;
}

.purpose-box{
border:1px solid #ccc;
background:#f9f9f9;
padding:10px;
margin:15px 0;
}

.sig-block{
margin-top:50px;
}

.sig-line{
border-top:1px solid #333;
width:220px;
margin-top:50px;
}

.doc-number{
position:absolute;
top:40px;
right:60px;
font-size:10pt;
}

.footer{
margin-top:40px;
font-size:9pt;
} </style>

</head>
<body>

<div class="doc-number">
    {{ $doc->doc_number }}
</div>

<div class="header">
    <p>Republic of the Philippines</p>
    <p>Province of [Province]</p>
    <p>Municipality of [Municipality]</p>
    <h1>Barangay [Name]</h1>
    <p>Office of the Punong Barangay</p>
</div>

<div class="divider"></div>

<div class="cert-title">
    {{ strtoupper($doc->doc_type_label) }}
</div>

<p><strong>TO WHOM IT MAY CONCERN:</strong></p>

<div class="body">

@if($doc->doc_type === 'clearance')

<p>
This is to certify that <strong>{{ strtoupper($resident->full_name) }}</strong>,
{{ $resident->age }} years old,
{{ $resident->civil_status }},
and a resident of
<strong>{{ $resident->address }}</strong>,
is known to be of good moral character and has no derogatory record on file in this barangay.
</p>

@elseif($doc->doc_type === 'indigency')

<p>
This is to certify that <strong>{{ strtoupper($resident->full_name) }}</strong>,
a resident of <strong>{{ $resident->address }}</strong>,
belongs to an indigent family and is financially incapable of meeting certain expenses without assistance.
</p>

@elseif($doc->doc_type === 'residency')

<p>
This is to certify that <strong>{{ strtoupper($resident->full_name) }}</strong>
is a bona fide resident of
<strong>{{ $resident->address }}</strong>
and has been residing in this barangay.
</p>

@elseif($doc->doc_type === 'good_moral')

<p>
This is to certify that <strong>{{ strtoupper($resident->full_name) }}</strong>
is known in this barangay as a person of good moral character and community standing.
</p>

@elseif($doc->doc_type === 'business')

<p>
This is to certify that <strong>{{ strtoupper($resident->full_name) }}</strong>
has complied with barangay requirements and is hereby granted a Business Clearance.
</p>

@elseif($doc->doc_type === 'solo_parent')

<p>
This is to certify that <strong>{{ strtoupper($resident->full_name) }}</strong>
is recognized as a Solo Parent residing in this barangay.
</p>

@elseif($doc->doc_type === 'guardianship')

<p>
This is to certify that <strong>{{ strtoupper($resident->full_name) }}</strong>
is the lawful guardian of the concerned minor/dependent as recognized by this barangay.
</p>

@elseif($doc->doc_type === 'cohabitation')

<p>
This is to certify that <strong>{{ strtoupper($resident->full_name) }}</strong>
is currently residing with his/her partner in the same household within this barangay.
</p>

@endif

<div class="purpose-box">
Purpose:
<strong>{{ strtoupper($doc->purpose ?? 'OFFICIAL PURPOSES') }}</strong>
</div>

<p>
Issued this <strong>{{ $date }}</strong>
at Barangay [Name], [Municipality], [Province], Philippines.
</p>

</div>

<div class="sig-block">
    <div class="sig-line"></div>
    <strong>[PUNONG BARANGAY NAME]</strong><br>
    Punong Barangay
</div>

<div class="footer">
    Document No.: {{ $doc->doc_number }}
</div>

</body>
</html>
