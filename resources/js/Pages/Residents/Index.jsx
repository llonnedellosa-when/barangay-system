import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import BimsLayout from "@/Layouts/BimsLayout";

const AGE_GROUPS = [
    { value: "child_youth", label: "Child Youth (15–17)" },
    { value: "youth", label: "Youth (18–24)" },
    { value: "young_adult", label: "Young Adult (25–30)" },
    { value: "adult", label: "Adult (31–59)" },
    { value: "senior", label: "Senior (60+)" },
];

const EDUC_LEVELS = [
    "No Formal Education",
    "Elementary Level",
    "Elementary Graduate",
    "High School Level",
    "High School Graduate",
    "Vocational / Tech-Voc",
    "College Level",
    "College Graduate",
    "Post Graduate",
];

const YOUTH_CLASSIFICATIONS = [
    "In-School Youth",
    "Out-of-School Youth",
    "Working Youth",
    "Youth with Disability",
    "Indigenous Youth",
    "Not Applicable",
];

const HOUSE_OWNERSHIP = [
    "Owned",
    "Rented",
    "Shared / Informal",
    "Government Provided",
    "Mortgaged",
];

const HAZARD_TYPES = [
    "Fire Prone",
    "Flood Prone",
    "Landslide Prone",
    "Storm Surge Prone",
    "Earthquake Prone",
];

export default function Index({ residents, filters, stats }) {
    const [search, setSearch] = useState(filters.search || "");
    const [showFilters, setShowFilters] = useState(false);

    const go = (extra = {}) =>
        router.get(
            "/residents",
            { ...filters, ...extra },
            { preserveState: true },
        );

    const clearAll = () => {
        setSearch("");
        router.get("/residents", {}, { preserveState: true });
    };

    const activeFilterCount = Object.values(filters).filter(
        (v) => v && v !== "",
    ).length;

    return (
        <BimsLayout>
            <Head title="Residents" />

            <div className="bims-section-header">
                <div className="bims-section-title">
                    <h2>Resident Records</h2>
                    <p>All registered residents of the barangay</p>
                </div>
                <Link
                    href="/residents/create"
                    className="bims-btn bims-btn-primary"
                >
                    ✏️ Add Resident
                </Link>
            </div>

            {/* ── STATS ────────────────────────────── */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
                    gap: 14,
                    marginBottom: 24,
                }}
            >
                {[
                    {
                        label: "Total Residents",
                        value: stats?.total ?? 0,
                        color: "#2e7fc1",
                    },
                    {
                        label: "Voters",
                        value: stats?.voters ?? 0,
                        color: "#c8962a",
                    },
                    {
                        label: "Senior Citizens",
                        value: stats?.seniors ?? 0,
                        color: "#1a7a4a",
                    },
                    { label: "PWD", value: stats?.pwd ?? 0, color: "#c0392b" },
                ].map((s) => (
                    <div
                        key={s.label}
                        style={{
                            background: "#fff",
                            borderRadius: 10,
                            padding: "18px 20px",
                            boxShadow: "0 4px 24px rgba(13,33,55,.10)",
                            borderTop: `4px solid ${s.color}`,
                        }}
                    >
                        <div
                            style={{
                                fontSize: ".72rem",
                                textTransform: "uppercase",
                                letterSpacing: "1.2px",
                                color: "#8ca0b3",
                                marginBottom: 4,
                            }}
                        >
                            {s.label}
                        </div>
                        <div
                            style={{
                                fontFamily: "Playfair Display, serif",
                                fontSize: "2rem",
                                color: "#0d2137",
                                lineHeight: 1,
                            }}
                        >
                            {s.value}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── SEARCH BAR ───────────────────────── */}
            <div
                className="bims-card"
                style={{ padding: "16px 20px", marginBottom: 12 }}
            >
                <div
                    style={{
                        display: "flex",
                        gap: 10,
                        flexWrap: "wrap",
                        alignItems: "center",
                    }}
                >
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && go({ search })}
                        placeholder="🔍  Search by name, address, contact..."
                        className="bims-input"
                        style={{ maxWidth: 340, flex: 1 }}
                    />
                    <button
                        onClick={() => go({ search })}
                        className="bims-btn bims-btn-primary bims-btn-sm"
                    >
                        Search
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowFilters(!showFilters)}
                        className="bims-btn bims-btn-outline bims-btn-sm"
                        style={{ position: "relative" }}
                    >
                        🔽 Filters
                        {activeFilterCount > 0 && (
                            <span
                                style={{
                                    position: "absolute",
                                    top: -8,
                                    right: -8,
                                    background: "#c0392b",
                                    color: "#fff",
                                    borderRadius: "50%",
                                    width: 18,
                                    height: 18,
                                    fontSize: ".65rem",
                                    fontWeight: 700,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                    {activeFilterCount > 0 && (
                        <button
                            onClick={clearAll}
                            className="bims-btn bims-btn-outline bims-btn-sm"
                            style={{ color: "#c0392b", borderColor: "#c0392b" }}
                        >
                            ✕ Clear All
                        </button>
                    )}
                </div>

                {/* ── ADVANCED FILTERS (collapsible) ─── */}
                {showFilters && (
                    <div
                        style={{
                            marginTop: 16,
                            paddingTop: 16,
                            borderTop: "1px solid #d4e1ec",
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit,minmax(180px,1fr))",
                            gap: "12px 16px",
                        }}
                    >
                        {/* Gender */}
                        <div>
                            <label className="bims-label">Gender</label>
                            <select
                                onChange={(e) => go({ gender: e.target.value })}
                                value={filters.gender || ""}
                                className="bims-input"
                            >
                                <option value="">All</option>
                                <option>Male</option>
                                <option>Female</option>
                            </select>
                        </div>

                        {/* Civil Status */}
                        <div>
                            <label className="bims-label">Civil Status</label>
                            <select
                                onChange={(e) =>
                                    go({ civil_status: e.target.value })
                                }
                                value={filters.civil_status || ""}
                                className="bims-input"
                            >
                                <option value="">All</option>
                                <option>Single</option>
                                <option>Married</option>
                                <option>Widowed</option>
                                <option>Separated</option>
                            </select>
                        </div>

                        {/* Purok */}
                        <div>
                            <label className="bims-label">Purok</label>
                            <select
                                onChange={(e) => go({ purok: e.target.value })}
                                value={filters.purok || ""}
                                className="bims-input"
                            >
                                <option value="">All Puroks</option>
                                {["1", "2", "3", "4", "5", "6", "7", "8"].map(
                                    (p) => (
                                        <option key={p} value={`Purok ${p}`}>
                                            Purok {p}
                                        </option>
                                    ),
                                )}
                            </select>
                        </div>

                        {/* Age Group */}
                        <div>
                            <label className="bims-label">Age Group</label>
                            <select
                                onChange={(e) =>
                                    go({ age_group: e.target.value })
                                }
                                value={filters.age_group || ""}
                                className="bims-input"
                            >
                                <option value="">All Ages</option>
                                {AGE_GROUPS.map((g) => (
                                    <option key={g.value} value={g.value}>
                                        {g.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Educational Attainment */}
                        <div>
                            <label className="bims-label">Education</label>
                            <select
                                onChange={(e) =>
                                    go({
                                        educational_attainment: e.target.value,
                                    })
                                }
                                value={filters.educational_attainment || ""}
                                className="bims-input"
                            >
                                <option value="">All Levels</option>
                                {EDUC_LEVELS.map((l) => (
                                    <option key={l}>{l}</option>
                                ))}
                            </select>
                        </div>

                        {/* Youth Classification */}
                        <div>
                            <label className="bims-label">
                                Youth Classification
                            </label>
                            <select
                                onChange={(e) =>
                                    go({ youth_classification: e.target.value })
                                }
                                value={filters.youth_classification || ""}
                                className="bims-input"
                            >
                                <option value="">All</option>
                                {YOUTH_CLASSIFICATIONS.map((c) => (
                                    <option key={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        {/* House Ownership */}
                        <div>
                            <label className="bims-label">
                                House Ownership
                            </label>
                            <select
                                onChange={(e) =>
                                    go({ house_ownership: e.target.value })
                                }
                                value={filters.house_ownership || ""}
                                className="bims-input"
                            >
                                <option value="">All</option>
                                {HOUSE_OWNERSHIP.map((o) => (
                                    <option key={o}>{o}</option>
                                ))}
                            </select>
                        </div>

                        {/* Hazard Prone */}
                        <div>
                            <label className="bims-label">Hazard Prone</label>
                            <select
                                onChange={(e) => go({ hazard: e.target.value })}
                                value={filters.hazard || ""}
                                className="bims-input"
                            >
                                <option value="">All</option>
                                {HAZARD_TYPES.map((h) => (
                                    <option key={h}>{h}</option>
                                ))}
                            </select>
                        </div>

                        {/* Special Groups */}
                        <div>
                            <label className="bims-label">Special Group</label>
                            <select
                                onChange={(e) =>
                                    go({ special_group: e.target.value })
                                }
                                value={filters.special_group || ""}
                                className="bims-input"
                            >
                                <option value="">All</option>
                                <option value="voter">Registered Voters</option>
                                <option value="senior">Senior Citizens</option>
                                <option value="pwd">PWD</option>
                                <option value="4ps">4Ps Beneficiaries</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* Active filter pills */}
                {activeFilterCount > 0 && (
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 6,
                            marginTop: 12,
                        }}
                    >
                        {Object.entries(filters)
                            .filter(([, v]) => v)
                            .map(([key, value]) => (
                                <span
                                    key={key}
                                    style={{
                                        background: "#e8f2fc",
                                        color: "#1a4a7a",
                                        padding: "3px 10px",
                                        borderRadius: 20,
                                        fontSize: ".75rem",
                                        fontWeight: 700,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 6,
                                    }}
                                >
                                    {String(value)}
                                    <button
                                        type="button"
                                        onClick={() => go({ [key]: "" })}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            color: "#c0392b",
                                            fontWeight: 700,
                                            padding: 0,
                                            fontSize: ".8rem",
                                        }}
                                    >
                                        ✕
                                    </button>
                                </span>
                            ))}
                    </div>
                )}
            </div>

            {/* ── TABLE ────────────────────────────── */}
            <div
                className="bims-card"
                style={{ padding: 0, overflow: "hidden" }}
            >
                <div style={{ overflowX: "auto" }}>
                    <table className="bims-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Full Name</th>
                                <th>Sex</th>
                                <th>Age</th>
                                <th>Civil Status</th>
                                <th>Education</th>
                                <th>Purok</th>
                                <th>Contact</th>
                                <th>Tags</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {residents.data.map((r) => (
                                <tr key={r.id}>
                                    <td>
                                        <span className="bims-badge badge-blue">
                                            {String(r.id).padStart(4, "0")}
                                        </span>
                                    </td>
                                    <td style={{ fontWeight: 700 }}>
                                        {r.last_name}, {r.first_name}
                                        {r.middle_name
                                            ? ` ${r.middle_name[0]}.`
                                            : ""}
                                        {r.suffix ? ` ${r.suffix}` : ""}
                                    </td>
                                    <td>
                                        <span
                                            className={`bims-badge ${r.gender === "Male" ? "badge-blue" : "badge-amber"}`}
                                        >
                                            {r.gender}
                                        </span>
                                    </td>
                                    <td style={{ color: "#4a5e74" }}>
                                        {r.age}
                                    </td>
                                    <td style={{ color: "#4a5e74" }}>
                                        {r.civil_status}
                                    </td>
                                    <td
                                        style={{
                                            color: "#4a5e74",
                                            fontSize: ".78rem",
                                        }}
                                    >
                                        {r.educational_attainment
                                            ? r.educational_attainment
                                                  .replace(" Graduate", "✓")
                                                  .replace(" Level", "")
                                            : "—"}
                                    </td>
                                    <td style={{ color: "#4a5e74" }}>
                                        {r.purok || "—"}
                                    </td>
                                    <td style={{ color: "#4a5e74" }}>
                                        {r.contact_number || "—"}
                                    </td>
                                    <td>
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: 4,
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            {r.is_voter && (
                                                <span className="bims-badge badge-green">
                                                    Voter
                                                </span>
                                            )}
                                            {r.is_senior_citizen && (
                                                <span className="bims-badge badge-amber">
                                                    Senior
                                                </span>
                                            )}
                                            {r.is_pwd && (
                                                <span className="bims-badge badge-sky">
                                                    PWD
                                                </span>
                                            )}
                                            {r.is_4ps && (
                                                <span className="bims-badge badge-indigo">
                                                    4Ps
                                                </span>
                                            )}
                                            {r.youth_classification &&
                                                r.youth_classification !==
                                                    "Not Applicable" && (
                                                    <span
                                                        className="bims-badge"
                                                        style={{
                                                            background:
                                                                "#f0e8ff",
                                                            color: "#5a2d8c",
                                                        }}
                                                    >
                                                        {r.youth_classification}
                                                    </span>
                                                )}
                                        </div>
                                    </td>
                                    <td>
                                        <div
                                            style={{ display: "flex", gap: 8 }}
                                        >
                                            <Link
                                                href={`/residents/${r.id}`}
                                                style={{
                                                    color: "#2e7fc1",
                                                    fontSize: ".8rem",
                                                    fontWeight: 700,
                                                    textDecoration: "none",
                                                }}
                                            >
                                                View
                                            </Link>
                                            <Link
                                                href={`/residents/${r.id}/edit`}
                                                style={{
                                                    color: "#c8962a",
                                                    fontSize: ".8rem",
                                                    fontWeight: 700,
                                                    textDecoration: "none",
                                                }}
                                            >
                                                Edit
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {residents.data.length === 0 && (
                        <div className="bims-empty">
                            <div className="bims-empty-icon">👥</div>
                            <p>No residents found.</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {residents.links && residents.links.length > 3 && (
                    <div className="bims-pagination">
                        <span style={{ fontSize: ".8rem", color: "#8ca0b3" }}>
                            Showing {residents.from}–{residents.to} of{" "}
                            {residents.total} residents
                        </span>
                        <div style={{ display: "flex", gap: 4 }}>
                            {residents.links.map((link, i) => (
                                <button
                                    key={i}
                                    disabled={!link.url}
                                    onClick={() =>
                                        link.url && router.get(link.url)
                                    }
                                    className={`bims-page-btn ${link.active ? "active" : ""}`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </BimsLayout>
    );
}
