import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import BimsLayout from "@/Layouts/BimsLayout";

const TEMPLATES = [
    {
        category: "Barangay Certificates",
        icon: "📜",
        color: "#1a4a7a",
        bg: "#e8f2fc",
        docs: [
            {
                id: "clearance",
                label: "Barangay Clearance",
                icon: "✅",
                desc: "Employment, travel, loan applications",
            },
            {
                id: "indigency",
                label: "Certificate of Indigency",
                icon: "🏚️",
                desc: "Medical, scholarship, legal assistance",
            },
            {
                id: "residency",
                label: "Certificate of Residency",
                icon: "🏠",
                desc: "Proof of residence in the barangay",
            },
            {
                id: "good_moral",
                label: "Certificate of Good Moral",
                icon: "🌟",
                desc: "Good moral character attestation",
            },
            {
                id: "business",
                label: "Business Clearance",
                icon: "🏪",
                desc: "New or renewal of business permits",
            },
            {
                id: "solo_parent",
                label: "Solo Parent Certificate",
                icon: "👩‍👧",
                desc: "For solo parent welfare benefits",
            },
            {
                id: "guardianship",
                label: "Certificate of Guardianship",
                icon: "👨‍👧",
                desc: "Legal guardian attestation",
            },
            {
                id: "cohabitation",
                label: "Certificate of Cohabitation",
                icon: "👫",
                desc: "Common law / live-in partners",
            },
        ],
    },
    {
        category: "Census & Population Reports",
        icon: "📊",
        color: "#1a7a4a",
        bg: "#d4f4e2",
        docs: [
            {
                id: "census_summary",
                label: "Population Census Summary",
                icon: "📊",
                desc: "Full population breakdown",
            },
            {
                id: "voter_list",
                label: "Registered Voters List",
                icon: "🗳️",
                desc: "All registered voters",
            },
            {
                id: "senior_list",
                label: "Senior Citizens List",
                icon: "🧓",
                desc: "All residents aged 60+",
            },
            {
                id: "pwd_list",
                label: "PWD Residents List",
                icon: "♿",
                desc: "All persons with disability",
            },
            {
                id: "fourps_list",
                label: "4Ps Beneficiaries List",
                icon: "🏠",
                desc: "All 4Ps program beneficiaries",
            },
            {
                id: "youth_report",
                label: "Youth Profiling Report",
                icon: "👧",
                desc: "In-school, out-of-school, working",
            },
            {
                id: "hazard_list",
                label: "Hazard-Prone Households",
                icon: "🚨",
                desc: "Residents in hazard-prone areas",
            },
            {
                id: "purok_summary",
                label: "Purok Population Summary",
                icon: "📍",
                desc: "Population count per purok",
            },
        ],
    },
    {
        category: "Official Records & Masterlist",
        icon: "📋",
        color: "#6d3d8c",
        bg: "#f0e8ff",
        docs: [
            {
                id: "masterlist",
                label: "Resident Masterlist",
                icon: "📋",
                desc: "All registered residents",
            },
            {
                id: "new_residents",
                label: "New Residents This Year",
                icon: "🆕",
                desc: "Recently registered residents",
            },
            {
                id: "purok_roster",
                label: "Purok Roster",
                icon: "🗺️",
                desc: "Residents grouped by purok",
            },
            {
                id: "education_report",
                label: "Educational Attainment Report",
                icon: "🎓",
                desc: "Education level breakdown",
            },
            {
                id: "gender_report",
                label: "Gender Distribution Report",
                icon: "⚖️",
                desc: "Male vs female population",
            },
            {
                id: "civil_status",
                label: "Civil Status Report",
                icon: "💍",
                desc: "Single, married, widowed, etc.",
            },
        ],
    },
];

export default function DocumentIndex({ stats, recentDocs = [] }) {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <BimsLayout>
            <Head title="Document Generator" />

            <div className="bims-section-header">
                <div className="bims-section-title">
                    <h2>Document Generator</h2>
                    <p>
                        Generate official barangay certificates, clearances, and
                        reports
                    </p>
                </div>
            </div>

            {/* ── POPULATION QUICK STATS ──────────────────── */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))",
                    gap: 12,
                    marginBottom: 28,
                }}
            >
                {[
                    {
                        label: "Total Residents",
                        value: stats?.total_residents ?? 0,
                        icon: "👥",
                        color: "#2e7fc1",
                    },
                    {
                        label: "Voters",
                        value: stats?.voters ?? 0,
                        icon: "🗳️",
                        color: "#c8962a",
                    },
                    {
                        label: "Senior Citizens",
                        value: stats?.seniors ?? 0,
                        icon: "🧓",
                        color: "#1a7a4a",
                    },
                    {
                        label: "PWD",
                        value: stats?.pwd ?? 0,
                        icon: "♿",
                        color: "#c0392b",
                    },
                    {
                        label: "4Ps",
                        value: stats?.fourps ?? 0,
                        icon: "🏠",
                        color: "#6d3d8c",
                    },
                    {
                        label: "Youth (15-30)",
                        value: stats?.youth ?? 0,
                        icon: "👧",
                        color: "#b5841f",
                    },
                ].map((s) => (
                    <div
                        key={s.label}
                        style={{
                            background: "#fff",
                            borderRadius: 10,
                            padding: "14px 16px",
                            boxShadow: "0 4px 24px rgba(13,33,55,.08)",
                            borderLeft: `4px solid ${s.color}`,
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                        }}
                    >
                        <span style={{ fontSize: "1.3rem" }}>{s.icon}</span>
                        <div>
                            <div
                                style={{
                                    fontFamily: "Playfair Display, serif",
                                    fontSize: "1.5rem",
                                    color: "#0d2137",
                                    lineHeight: 1,
                                }}
                            >
                                {Number(s.value).toLocaleString()}
                            </div>
                            <div
                                style={{
                                    fontSize: ".68rem",
                                    textTransform: "uppercase",
                                    letterSpacing: "1px",
                                    color: "#8ca0b3",
                                    marginTop: 2,
                                }}
                            >
                                {s.label}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── CATEGORY TABS ───────────────────────────── */}
            <div
                style={{
                    display: "flex",
                    gap: 0,
                    borderBottom: "2px solid #d4e1ec",
                    marginBottom: 20,
                }}
            >
                {TEMPLATES.map((cat, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => setActiveTab(i)}
                        style={{
                            padding: "11px 22px",
                            background: "none",
                            border: "none",
                            fontFamily: "Source Sans 3, sans-serif",
                            fontSize: ".88rem",
                            fontWeight: 700,
                            cursor: "pointer",
                            color: activeTab === i ? cat.color : "#8ca0b3",
                            borderBottom:
                                activeTab === i
                                    ? `2px solid ${cat.color}`
                                    : "2px solid transparent",
                            marginBottom: -2,
                            transition: "all .15s",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {cat.icon} {cat.category}
                    </button>
                ))}
            </div>

            {/* ── DOCUMENT CARDS ──────────────────────────── */}
            {TEMPLATES.map(
                (cat, ci) =>
                    activeTab === ci && (
                        <div
                            key={ci}
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fill,minmax(250px,1fr))",
                                gap: 14,
                                marginBottom: 28,
                            }}
                        >
                            {cat.docs.map((doc) => (
                                <div
                                    key={doc.id}
                                    style={{
                                        background: "#fff",
                                        borderRadius: 10,
                                        border: "1.5px solid #d4e1ec",
                                        padding: "18px 20px",
                                        boxShadow:
                                            "0 2px 12px rgba(13,33,55,.06)",
                                        transition: "all .15s",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow =
                                            "0 8px 28px rgba(13,33,55,.12)";
                                        e.currentTarget.style.transform =
                                            "translateY(-2px)";
                                        e.currentTarget.style.borderColor =
                                            cat.color;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow =
                                            "0 2px 12px rgba(13,33,55,.06)";
                                        e.currentTarget.style.transform =
                                            "translateY(0)";
                                        e.currentTarget.style.borderColor =
                                            "#d4e1ec";
                                    }}
                                >
                                    {/* Icon + Generate button */}
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "flex-start",
                                            marginBottom: 12,
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 42,
                                                height: 42,
                                                borderRadius: 10,
                                                background: cat.bg,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "1.3rem",
                                            }}
                                        >
                                            {doc.icon}
                                        </div>
                                        <Link
                                            href={`/documents/generate/${doc.id}`}
                                            style={{
                                                background: cat.color,
                                                color: "#fff",
                                                padding: "5px 12px",
                                                borderRadius: 6,
                                                fontSize: ".75rem",
                                                fontWeight: 700,
                                                textDecoration: "none",
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: 3,
                                            }}
                                        >
                                            Generate ›
                                        </Link>
                                    </div>
                                    <div
                                        style={{
                                            fontWeight: 700,
                                            color: "#0d2137",
                                            fontSize: ".92rem",
                                            marginBottom: 4,
                                        }}
                                    >
                                        {doc.label}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: ".78rem",
                                            color: "#8ca0b3",
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        {doc.desc}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ),
            )}

            {/* ── RECENTLY GENERATED ──────────────────────── */}
            {recentDocs.length > 0 && (
                <div className="bims-card">
                    <div className="bims-card-title">
                        <span>🕐</span> Recently Generated Documents
                    </div>
                    <table className="bims-table">
                        <thead>
                            <tr>
                                <th>Doc No.</th>
                                <th>Document Type</th>
                                <th>Resident / Scope</th>
                                <th>Purpose</th>
                                <th>Generated</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentDocs.map((doc) => (
                                <tr key={doc.id}>
                                    <td
                                        style={{
                                            fontFamily: "monospace",
                                            fontWeight: 700,
                                            color: "#2e7fc1",
                                        }}
                                    >
                                        {doc.doc_number}
                                    </td>
                                    <td style={{ fontWeight: 600 }}>
                                        {doc.doc_type_label}
                                    </td>
                                    <td style={{ color: "#4a5e74" }}>
                                        {doc.scope}
                                    </td>
                                    <td
                                        style={{
                                            color: "#4a5e74",
                                            fontSize: ".82rem",
                                        }}
                                    >
                                        {doc.purpose || "—"}
                                    </td>
                                    <td style={{ color: "#4a5e74" }}>
                                        {new Date(
                                            doc.created_at,
                                        ).toLocaleDateString("en-PH")}
                                    </td>
                                    <td>
                                        <a
                                            href={`/documents/print/${doc.id}`}
                                            target="_blank"
                                            style={{
                                                color: "#1a7a4a",
                                                fontSize: ".8rem",
                                                fontWeight: 700,
                                                textDecoration: "none",
                                            }}
                                        >
                                            🖨️ Reprint
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {recentDocs.length === 0 && (
                <div
                    className="bims-card"
                    style={{ textAlign: "center", padding: "40px 20px" }}
                >
                    <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>
                        📄
                    </div>
                    <p style={{ color: "#8ca0b3", fontSize: ".88rem" }}>
                        No documents generated yet. Click{" "}
                        <strong>Generate</strong> on any document above to get
                        started.
                    </p>
                </div>
            )}
        </BimsLayout>
    );
}
