<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            color: #111;
            padding: 40px 60px;
        }

        .header {
            text-align: center;
            margin-bottom: 16px;
        }

        .header h1 {
            font-size: 15pt;
            font-weight: bold;
            text-transform: uppercase;
        }

        .header p {
            font-size: 10pt;
            color: #444;
        }

        .divider {
            border-top: 3px double #1a3a8f;
            margin: 14px 0;
        }

        .cert-title {
            text-align: center;
            font-size: 18pt;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin: 18px 0;
            text-decoration: underline;
        }

        .body {
            line-height: 1.9;
            text-align: justify;
            margin-bottom: 16px;
        }

        .purpose-box {
            border: 1px solid #ccc;
            padding: 10px 16px;
            margin: 14px 0;
            background: #f9f9f9;
            font-style: italic;
        }

        .validity {
            font-size: 10pt;
            color: #555;
            margin-bottom: 28px;
        }

        .sig-block {
            margin-top: 40px;
        }

        .sig-line {
            border-top: 1px solid #333;
            width: 200px;
            margin-top: 50px;
        }

        .doc-number {
            position: absolute;
            top: 40px;
            right: 60px;
            font-size: 9pt;
            color: #888;
        }

        .or-number {
            position: absolute;
            bottom: 40px;
            right: 60px;
            font-size: 9pt;
            color: #888;
            text-align: right;
        }
    </style>
</head>

<body>
    <div class="doc-number">{{ $document->request_number }}</div>

    <div class="header">
        <p>Republic of the Philippines</p>
        <p>Province of [Province] • Municipality of [Municipality]</p>
        <h1>Barangay [Name]</h1>
        <p>Office of the Punong Barangay</p>
    </div>

    <div class="divider"></div>

    <div class="cert-title">{{ $document->document_type }}</div>

    <p style="margin-bottom: 14px;"><strong>TO WHOM IT MAY CONCERN:</strong></p>

    <div class="body">
        @if($document->document_type === 'Barangay Clearance')
            <p>This is to certify that <strong>{{ strtoupper($resident->full_name) }}</strong>,
                {{ $resident->age }} years old, {{ $resident->civil_status }},
                a resident of <strong>{{ $resident->address }}</strong>,
                is known to be a person of good moral character and has no derogatory record on file in this barangay.
            </p>
        @elseif($document->document_type === 'Certificate of Indigency')
            <p>This is to certify that <strong>{{ strtoupper($resident->full_name) }}</strong>,
                {{ $resident->age }} years old, {{ $resident->civil_status }},
                residing at <strong>{{ $resident->address }}</strong>,
                belongs to an indigent family and is not financially capable of paying for services
                without assistance from the government.
            </p>
        @elseif($document->document_type === 'Certificate of Residency')
            <p>This is to certify that <strong>{{ strtoupper($resident->full_name) }}</strong>,
                {{ $resident->age }} years old, {{ $resident->civil_status }},
                is a <em>bona fide</em> resident of <strong>{{ $resident->address }}</strong>,
                this barangay, and has been residing therein for the past years.
            </p>
        @else
            <p>This is to certify that <strong>{{ strtoupper($resident->full_name) }}</strong>,
                {{ $resident->age }} years old, {{ $resident->civil_status }},
                a resident of <strong>{{ $resident->address }}</strong>,
                is known in this community to be a person of good moral character and law-abiding,
                with no pending case or derogatory record in this barangay.
            </p>
        @endif

        <div class="purpose-box">
            This certification is issued upon request of the above-named person for the purpose of:
            <strong>{{ strtoupper($document->purpose) }}</strong>
        </div>

        <p>Issued this <strong>{{ \Carbon\Carbon::parse($date)->format('jS') }} day of
                {{ \Carbon\Carbon::parse($date)->format('F Y') }}</strong>
            at Barangay [Name], [Municipality], [Province], Philippines.
        </p>
    </div>

    <p class="validity">Valid for 30 days from date of issuance.</p>

    <div class="sig-block">
        <p>Attested by:</p>
        <div class="sig-line"></div>
        <p><strong>[PUNONG BARANGAY NAME]</strong></p>
        <p>Punong Barangay</p>
    </div>

    <div class="or-number">
        @if($document->fee > 0)
            OR No.: _____________ | Amount: ₱{{ number_format($document->fee, 2) }}
        @else
            No Fee Required
        @endif
    </div>
</body>

</html>