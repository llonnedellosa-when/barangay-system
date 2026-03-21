import { Head, Link, useForm, router } from "@inertiajs/react";
import { useState } from "react";
import BimsLayout from "@/Layouts/BimsLayout";

// ── Document meta config ──────────────────────────────────────
const DOC_CONFIG = {
    // Individual certificates — need resident lookup
    clearance: {
        label: "Barangay Clearance",
        type: "certificate",
        icon: "✅",
        color: "#1a4a7a",
        purposes: [
            "Employment",
            "Loan Application",
            "Travel Abroad",
            "School Enrollment",
            "Court Requirement",
            "Police Clearance",
            "Other",
        ],
    },
    indigency: {
        label: "Certificate of Indigency",
        type: "certificate",
        icon: "🏚️",
        color: "#1a4a7a",
        purposes: [
            "Medical Assistance",
            "Scholarship",
            "Legal Aid",
            "Social Welfare",
            "Burial Assistance",
            "Other",
        ],
    },
    residency: {
        label: "Certificate of Residency",
        type: "certificate",
        icon: "🏠",
        color: "#1a4a7a",
        purposes: [
            "School Enrollment",
            "Employment",
            "Government Transaction",
            "Passport Application",
            "Other",
        ],
    },
    good_moral: {
        label: "Certificate of Good Moral",
        type: "certificate",
        icon: "🌟",
        color: "#1a4a7a",
        purposes: ["Employment", "School Enrollment", "Scholarship", "Other"],
    },
    business: {
        label: "Business Clearance",
        type: "certificate",
        icon: "🏪",
        color: "#1a4a7a",
        purposes: ["New Business", "Business Renewal", "Other"],
    },
    solo_parent: {
        label: "Solo Parent Certificate",
        type: "certificate",
        icon: "👩‍👧",
        color: "#1a4a7a",
        purposes: ["Solo Parent Benefits", "School Enrollment", "Other"],
    },
    guardianship: {
        label: "Certificate of Guardianship",
        type: "certificate",
        icon: "👨‍👧",
        color: "#1a4a7a",
        purposes: ["School Enrollment", "Medical", "Legal", "Other"],
    },
    cohabitation: {
        label: "Certificate of Cohabitation",
        type: "certificate",
        icon: "👫",
        color: "#1a4a7a",
        purposes: ["Government Transaction", "Legal Purpose", "Other"],
    },

    // Reports — no resident needed, covers whole barangay
    census_summary: {
        label: "Population Census Summary",
        type: "report",
        icon: "📊",
        color: "#1a7a4a",
        scope: "All Residents",
    },
    voter_list: {
        label: "Registered Voters List",
        type: "report",
        icon: "🗳️",
        color: "#1a7a4a",
        scope: "Registered Voters",
    },
    senior_list: {
        label: "Senior Citizens List",
        type: "report",
        icon: "🧓",
        color: "#1a7a4a",
        scope: "Senior Citizens (60+)",
    },
    pwd_list: {
        label: "PWD Residents List",
        type: "report",
        icon: "♿",
        color: "#1a7a4a",
        scope: "Persons with Disability",
    },
    fourps_list: {
        label: "4Ps Beneficiaries List",
        type: "report",
        icon: "🏠",
        color: "#1a7a4a",
        scope: "4Ps Beneficiaries",
    },
    youth_report: {
        label: "Youth Profiling Report",
        type: "report",
        icon: "👧",
        color: "#1a7a4a",
        scope: "Youth (15-30 years old)",
    },
    hazard_list: {
        label: "Hazard-Prone Households",
        type: "report",
        icon: "🚨",
        color: "#1a7a4a",
        scope: "Hazard-Prone Residents",
    },
    purok_summary: {
        label: "Purok Population Summary",
        type: "report",
        icon: "📍",
        color: "#1a7a4a",
        scope: "Per Purok",
    },
    masterlist: {
        label: "Resident Masterlist",
        type: "report",
        icon: "📋",
        color: "#6d3d8c",
        scope: "All Residents",
    },
    new_residents: {
        label: "New Residents This Year",
        type: "report",
        icon: "🆕",
        color: "#6d3d8c",
        scope: "New Registrations",
    },
    purok_roster: {
        label: "Purok Roster",
        type: "report",
        icon: "🗺️",
        color: "#6d3d8c",
        scope: "Grouped by Purok",
    },
    education_report: {
        label: "Educational Attainment Report",
        type: "report",
        icon: "🎓",
        color: "#6d3d8c",
        scope: "All Residents",
    },
    gender_report: {
        label: "Gender Distribution Report",
        type: "report",
        icon: "⚖️",
        color: "#6d3d8c",
        scope: "All Residents",
    },
    civil_status: {
        label: "Civil Status Report",
        type: "report",
        icon: "💍",
        color: "#6d3d8c",
        scope: "All Residents",
    },
};

export default function Generate({
    docType,
    residents = [],
    barangayInfo = {},
}) {
    const config = DOC_CONFIG[docType];
    const isCertificate = config?.type === "certificate";

    const [residentSearch, setResidentSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedResident, setSelectedResident] = useState(null);

    const { data, setData, post, processing } = useForm({
        doc_type: docType,
        resident_id: "",
        purpose: "",
        custom_purpose: "",
        or_number: "",
        fee: "",
        // Report filters
        purok_filter: "",
        year_filter: new Date().getFullYear().toString(),
    });

    const filteredResidents = residents
        .filter((r) =>
            r.name.toLowerCase().includes(residentSearch.toLowerCase()),
        )
        .slice(0, 8);

    const selectResident = (r) => {
        setSelectedResident(r);
        setData("resident_id", r.id);
        setResidentSearch(r.name);
        setShowDropdown(false);
    };

    const submit = (e) => {
        e.preventDefault();
        post("/documents/generate");
    };

    if (!config) {
        return (
            <BimsLayout>
                <Head title="Document Not Found" />
                <div style={{ textAlign: "center", padding: "60px 20px" }}>
                    <div style={{ fontSize: "3rem", marginBottom: 16 }}>❓</div>
                    <h2
                        style={{
                            fontFamily: "Playfair Display, serif",
                            color: "#0d2137",
                        }}
                    >
                        Document type not found
                    </h2>
                    <Link
                        href="/documents"
                        className="bims-btn bims-btn-primary"
                        style={{ marginTop: 20, display: "inline-flex" }}
                    >
                        ← Back to Documents
                    </Link>
                </div>
            </BimsLayout>
        );
    }

    return (
        <BimsLayout>
            <Head title={`Generate: ${config.label}`} />

            <div className="bims-section-header">
                <div className="bims-section-title">
                    <h2>
                        {config.icon} {config.label}
                    </h2>
                    <p>
                        {isCertificate
                            ? "Fill in the details to generate this certificate"
                            : `Generate ${config.scope} report`}
                    </p>
                </div>
                <Link href="/documents" className="bims-btn bims-btn-outline">
                    ← Back
                </Link>
            </div>

            <div
                style={{
                    maxWidth: isCertificate ? 680 : 560,
                    margin: "0 auto",
                }}
            >
                <div className="bims-card">
                    <form onSubmit={submit} autoComplete="off">
                        {/* ── CERTIFICATE FORM ──────────────── */}
                        {isCertificate && (
                            <>
                                {/* Resident Search */}
                                <div
                                    style={{
                                        marginBottom: 20,
                                        position: "relative",
                                    }}
                                >
                                    <label className="bims-label">
                                        Resident Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={residentSearch}
                                        onChange={(e) => {
                                            setResidentSearch(e.target.value);
                                            setShowDropdown(true);
                                            setSelectedResident(null);
                                            setData("resident_id", "");
                                        }}
                                        onFocus={() => setShowDropdown(true)}
                                        placeholder="Type to search resident..."
                                        className="bims-input"
                                        autoComplete="off"
                                        required
                                    />
                                    {showDropdown &&
                                        residentSearch.length > 0 && (
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    zIndex: 20,
                                                    width: "100%",
                                                    marginTop: 4,
                                                    background: "#fff",
                                                    border: "1.5px solid #d4e1ec",
                                                    borderRadius: 8,
                                                    boxShadow:
                                                        "0 8px 28px rgba(13,33,55,.14)",
                                                    maxHeight: 240,
                                                    overflowY: "auto",
                                                }}
                                            >
                                                {filteredResidents.length >
                                                0 ? (
                                                    filteredResidents.map(
                                                        (r) => (
                                                            <button
                                                                key={r.id}
                                                                type="button"
                                                                onClick={() =>
                                                                    selectResident(
                                                                        r,
                                                                    )
                                                                }
                                                                style={{
                                                                    width: "100%",
                                                                    padding:
                                                                        "10px 16px",
                                                                    textAlign:
                                                                        "left",
                                                                    background:
                                                                        "none",
                                                                    border: "none",
                                                                    borderBottom:
                                                                        "1px solid #f0f4f8",
                                                                    cursor: "pointer",
                                                                    fontFamily:
                                                                        "Source Sans 3, sans-serif",
                                                                }}
                                                                onMouseEnter={(
                                                                    e,
                                                                ) =>
                                                                    (e.currentTarget.style.background =
                                                                        "#f0f6fb")
                                                                }
                                                                onMouseLeave={(
                                                                    e,
                                                                ) =>
                                                                    (e.currentTarget.style.background =
                                                                        "none")
                                                                }
                                                            >
                                                                <div
                                                                    style={{
                                                                        fontWeight: 700,
                                                                        fontSize:
                                                                            ".88rem",
                                                                        color: "#0d2137",
                                                                    }}
                                                                >
                                                                    {r.name}
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        fontSize:
                                                                            ".75rem",
                                                                        color: "#8ca0b3",
                                                                    }}
                                                                >
                                                                    {r.address}{" "}
                                                                    · {r.purok}
                                                                </div>
                                                            </button>
                                                        ),
                                                    )
                                                ) : (
                                                    <div
                                                        style={{
                                                            padding:
                                                                "14px 16px",
                                                            color: "#8ca0b3",
                                                            fontSize: ".85rem",
                                                        }}
                                                    >
                                                        No residents found
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                </div>

                                {/* Selected Resident Info Card */}
                                {selectedResident && (
                                    <div
                                        style={{
                                            background: "#e8f2fc",
                                            border: "1.5px solid #2e7fc1",
                                            borderRadius: 8,
                                            padding: "14px 18px",
                                            marginBottom: 20,
                                            display: "grid",
                                            gridTemplateColumns: "1fr 1fr",
                                            gap: "6px 20px",
                                        }}
                                    >
                                        <div>
                                            <span
                                                style={{
                                                    fontSize: ".68rem",
                                                    color: "#2e7fc1",
                                                    textTransform: "uppercase",
                                                    letterSpacing: 1,
                                                }}
                                            >
                                                Name
                                            </span>
                                            <div
                                                style={{
                                                    fontWeight: 700,
                                                    color: "#0d2137",
                                                    fontSize: ".9rem",
                                                }}
                                            >
                                                {selectedResident.name}
                                            </div>
                                        </div>
                                        <div>
                                            <span
                                                style={{
                                                    fontSize: ".68rem",
                                                    color: "#2e7fc1",
                                                    textTransform: "uppercase",
                                                    letterSpacing: 1,
                                                }}
                                            >
                                                Age
                                            </span>
                                            <div
                                                style={{
                                                    fontWeight: 700,
                                                    color: "#0d2137",
                                                    fontSize: ".9rem",
                                                }}
                                            >
                                                {selectedResident.age} years old
                                            </div>
                                        </div>
                                        <div>
                                            <span
                                                style={{
                                                    fontSize: ".68rem",
                                                    color: "#2e7fc1",
                                                    textTransform: "uppercase",
                                                    letterSpacing: 1,
                                                }}
                                            >
                                                Address
                                            </span>
                                            <div
                                                style={{
                                                    fontWeight: 600,
                                                    color: "#0d2137",
                                                    fontSize: ".85rem",
                                                }}
                                            >
                                                {selectedResident.address}
                                            </div>
                                        </div>
                                        <div>
                                            <span
                                                style={{
                                                    fontSize: ".68rem",
                                                    color: "#2e7fc1",
                                                    textTransform: "uppercase",
                                                    letterSpacing: 1,
                                                }}
                                            >
                                                Civil Status
                                            </span>
                                            <div
                                                style={{
                                                    fontWeight: 600,
                                                    color: "#0d2137",
                                                    fontSize: ".85rem",
                                                }}
                                            >
                                                {selectedResident.civil_status}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Purpose */}
                                <div style={{ marginBottom: 16 }}>
                                    <label className="bims-label">
                                        Purpose *
                                    </label>
                                    <select
                                        value={data.purpose}
                                        onChange={(e) =>
                                            setData("purpose", e.target.value)
                                        }
                                        className="bims-input"
                                        required
                                    >
                                        <option value="">
                                            Select purpose...
                                        </option>
                                        {(config.purposes || []).map((p) => (
                                            <option key={p}>{p}</option>
                                        ))}
                                    </select>
                                </div>

                                {data.purpose === "Other" && (
                                    <div style={{ marginBottom: 16 }}>
                                        <label className="bims-label">
                                            Specify Purpose *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.custom_purpose}
                                            onChange={(e) =>
                                                setData(
                                                    "custom_purpose",
                                                    e.target.value,
                                                )
                                            }
                                            className="bims-input"
                                            placeholder="Enter specific purpose..."
                                            required
                                            autoComplete="off"
                                        />
                                    </div>
                                )}

                                {/* OR Number + Fee */}
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        gap: 16,
                                        marginBottom: 16,
                                    }}
                                >
                                    <div>
                                        <label className="bims-label">
                                            O.R. Number (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={data.or_number}
                                            onChange={(e) =>
                                                setData(
                                                    "or_number",
                                                    e.target.value,
                                                )
                                            }
                                            className="bims-input"
                                            placeholder="e.g. 2024-001"
                                            autoComplete="off"
                                        />
                                    </div>
                                    <div>
                                        <label className="bims-label">
                                            Fee Collected (₱)
                                        </label>
                                        <input
                                            type="number"
                                            value={data.fee}
                                            onChange={(e) =>
                                                setData("fee", e.target.value)
                                            }
                                            className="bims-input"
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                        />
                                        <p
                                            style={{
                                                fontSize: ".72rem",
                                                color: "#8ca0b3",
                                                marginTop: 3,
                                            }}
                                        >
                                            Leave blank if free
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ── REPORT FORM ───────────────────── */}
                        {!isCertificate && (
                            <>
                                <div
                                    style={{
                                        background: "#d4f4e2",
                                        border: "1px solid #1a7a4a",
                                        borderRadius: 8,
                                        padding: "14px 18px",
                                        marginBottom: 20,
                                    }}
                                >
                                    <p
                                        style={{
                                            color: "#1a7a4a",
                                            fontWeight: 700,
                                            fontSize: ".88rem",
                                            marginBottom: 4,
                                        }}
                                    >
                                        📊 Report Scope: {config.scope}
                                    </p>
                                    <p
                                        style={{
                                            color: "#1a7a4a",
                                            fontSize: ".8rem",
                                        }}
                                    >
                                        This will generate a report based on
                                        current resident data in the database.
                                    </p>
                                </div>

                                {/* Optional purok filter */}
                                {[
                                    "census_summary",
                                    "masterlist",
                                    "purok_summary",
                                    "purok_roster",
                                ].includes(docType) && (
                                    <div style={{ marginBottom: 16 }}>
                                        <label className="bims-label">
                                            Filter by Purok (Optional)
                                        </label>
                                        <select
                                            value={data.purok_filter}
                                            onChange={(e) =>
                                                setData(
                                                    "purok_filter",
                                                    e.target.value,
                                                )
                                            }
                                            className="bims-input"
                                        >
                                            <option value="">All Puroks</option>
                                            {[
                                                "1",
                                                "2",
                                                "3",
                                                "4",
                                                "5",
                                                "6",
                                                "7",
                                                "8",
                                            ].map((p) => (
                                                <option
                                                    key={p}
                                                    value={`Purok ${p}`}
                                                >
                                                    Purok {p}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div style={{ marginBottom: 16 }}>
                                    <label className="bims-label">
                                        Report Year
                                    </label>
                                    <select
                                        value={data.year_filter}
                                        onChange={(e) =>
                                            setData(
                                                "year_filter",
                                                e.target.value,
                                            )
                                        }
                                        className="bims-input"
                                    >
                                        {[2025, 2024, 2023, 2022].map((y) => (
                                            <option key={y}>{y}</option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}

                        {/* ── SUBMIT ────────────────────────── */}
                        <div
                            style={{
                                display: "flex",
                                gap: 12,
                                marginTop: 24,
                                paddingTop: 20,
                                borderTop: "1px solid #d4e1ec",
                            }}
                        >
                            <button
                                type="submit"
                                disabled={processing}
                                className="bims-btn bims-btn-primary"
                                style={{ background: config.color }}
                            >
                                {processing
                                    ? "⏳ Generating..."
                                    : `🖨️ Generate & Print ${isCertificate ? "Certificate" : "Report"}`}
                            </button>
                            <Link
                                href="/documents"
                                className="bims-btn bims-btn-outline"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </BimsLayout>
    );
}
