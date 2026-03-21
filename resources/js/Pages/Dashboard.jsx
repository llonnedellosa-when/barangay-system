import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import "../../css/dashboard.css";

export default function Dashboard({
    stats = {},
    housing = [],
    recentResidents = [],
    recentRequests = [],
    recentBlotters = [],
    barangayName = "Barangay Information Management System",
    captainName = "",
}) {
    const today = new Date().toLocaleDateString("en-PH", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    // Animated counters
    const [displayStats, setDisplayStats] = useState({
        total_residents: 0,
        households: 0,
        male: 0,
        female: 0,
    });

    useEffect(() => {
        const targets = {
            total_residents: stats.total_residents ?? 0,
            households: stats.households ?? 0,
            male: stats.male ?? 0,
            female: stats.female ?? 0,
        };
        const duration = 800;
        const steps = 40;
        const interval = duration / steps;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setDisplayStats({
                total_residents: Math.round(targets.total_residents * eased),
                households: Math.round(targets.households * eased),
                male: Math.round(targets.male * eased),
                female: Math.round(targets.female * eased),
            });
            if (step >= steps) clearInterval(timer);
        }, interval);

        return () => clearInterval(timer);
    }, [stats]);

    // Age group bars
    const ageGroups = [
        {
            key: "minor",
            label: "Minor",
            sub: "<18",
            color: "linear-gradient(180deg,#2e7fc1,#1a4a7a)",
            value: stats.minor ?? 0,
        },
        {
            key: "young",
            label: "Young",
            sub: "18–35",
            color: "linear-gradient(180deg,#2eb87a,#1a7a4a)",
            value: stats.young ?? 0,
        },
        {
            key: "adult",
            label: "Adult",
            sub: "36–59",
            color: "linear-gradient(180deg,#f0b429,#c8962a)",
            value: stats.adult ?? 0,
        },
        {
            key: "senior_age",
            label: "Senior",
            sub: "60+",
            color: "linear-gradient(180deg,#e05c5c,#c0392b)",
            value: stats.senior_age ?? 0,
        },
    ];
    const maxAge = Math.max(...ageGroups.map((g) => g.value), 1);

    return (
        <>
            {/* Google Fonts  */}
            <Head title="Dashboard">
                <link
                    href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Source+Sans+3:wght@300;400;600;700&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div className="bims-body">
                {/*HEADER */}
                <header className="bims-header">
                    <div className="bims-header-brand">
                        <div className="bims-seal">🏛️</div>
                        <div>
                            <h1 className="bims-header-title">
                                {barangayName}
                            </h1>
                            <p className="bims-header-sub">
                                {captainName
                                    ? `Punong Barangay: ${captainName}`
                                    : "Office of the Barangay Captain · Republic of the Philippines"}
                            </p>
                        </div>
                    </div>
                    <div className="bims-header-meta">
                        <strong>BIMS v1.0</strong>
                        <span>{today}</span>
                    </div>
                </header>

                {/* APP LAYOUT */}
                <div className="bims-app">
                    {/* SIDEBAR */}
                    <nav className="bims-nav">
                        <div className="bims-nav-label">Main Menu</div>

                        <Link
                            href="/dashboard"
                            className="bims-nav-link active"
                        >
                            <span className="bims-nav-icon">📊</span> Dashboard
                        </Link>
                        <Link href="/residents" className="bims-nav-link">
                            <span className="bims-nav-icon">👥</span> Residents
                        </Link>
                        <Link
                            href="/residents/create"
                            className="bims-nav-link"
                        >
                            <span className="bims-nav-icon">✏️</span> Encode
                            Resident
                        </Link>

                        <hr className="bims-nav-divider" />
                        <div className="bims-nav-label">Records</div>

                        <Link href="/documents" className="bims-nav-link">
                            <span className="bims-nav-icon">📄</span> Document
                            Requests
                        </Link>
                        <Link
                            href="/documents/create"
                            className="bims-nav-link"
                        >
                            <span className="bims-nav-icon">➕</span> New
                            Request
                        </Link>

                        <hr className="bims-nav-divider" />
                        <div className="bims-nav-label">Cases</div>

                        <Link href="/blotter" className="bims-nav-link">
                            <span className="bims-nav-icon">⚖️</span> Blotter
                            Reports
                        </Link>
                        <Link href="/blotter/create" className="bims-nav-link">
                            <span className="bims-nav-icon">🚨</span> File
                            Blotter
                        </Link>

                        <hr className="bims-nav-divider" />
                        <div className="bims-nav-label">System</div>

                        <Link href="/settings" className="bims-nav-link">
                            <span className="bims-nav-icon">⚙️</span> Settings
                        </Link>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="bims-nav-link"
                        >
                            <span className="bims-nav-icon">🚪</span> Logout
                        </Link>
                    </nav>

                    {/* MAIN CONTENT */}
                    <main className="bims-main">
                        {/* Section Header */}
                        <div className="bims-section-header">
                            <div className="bims-section-title">
                                <h2>Dashboard Overview</h2>
                                <p>
                                    Real-time barangay population and household
                                    statistics
                                </p>
                            </div>
                            <button
                                className="bims-btn bims-btn-outline bims-btn-sm"
                                onClick={() => router.reload()}
                            >
                                🔄 Refresh
                            </button>
                        </div>

                        {/* TOP STAT CARDS */}
                        <div className="bims-stats-row">
                            <div className="bims-stat-card">
                                <div className="bims-stat-label">
                                    Total Residents
                                </div>
                                <div className="bims-stat-num">
                                    {displayStats.total_residents.toLocaleString()}
                                </div>
                                <div className="bims-stat-sub">
                                    Registered individuals
                                </div>
                            </div>
                            <div className="bims-stat-card">
                                <div className="bims-stat-label">
                                    Total Households
                                </div>
                                <div className="bims-stat-num">
                                    {displayStats.households.toLocaleString()}
                                </div>
                                <div className="bims-stat-sub">
                                    Registered households
                                </div>
                            </div>
                            <div className="bims-stat-card">
                                <div className="bims-stat-label">
                                    Male Residents
                                </div>
                                <div className="bims-stat-num">
                                    {displayStats.male.toLocaleString()}
                                </div>
                                <div className="bims-stat-sub">
                                    Male population
                                </div>
                            </div>
                            <div className="bims-stat-card">
                                <div className="bims-stat-label">
                                    Female Residents
                                </div>
                                <div className="bims-stat-num">
                                    {displayStats.female.toLocaleString()}
                                </div>
                                <div className="bims-stat-sub">
                                    Female population
                                </div>
                            </div>
                        </div>

                        {/* CHARTS ROW */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: "20px",
                                marginBottom: "24px",
                            }}
                            className="bims-charts-row"
                        >
                            {/* Age Distribution Bar Chart */}
                            <div
                                className="bims-card"
                                style={{ marginBottom: 0 }}
                            >
                                <div className="bims-card-title">
                                    <span>📈</span> Age Distribution
                                </div>
                                <div className="bims-chart-bars">
                                    {ageGroups.map((g) => (
                                        <div
                                            className="bims-bar-wrap"
                                            key={g.key}
                                        >
                                            <div
                                                className="bims-bar"
                                                style={{
                                                    height: `${Math.max(10, (g.value / maxAge) * 110)}px`,
                                                    background: g.color,
                                                }}
                                            />
                                            <div className="bims-bar-val">
                                                {g.value}
                                            </div>
                                            <div className="bims-bar-label">
                                                {g.label}
                                                <br />
                                                {g.sub}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Housing Status */}
                            <div
                                className="bims-card"
                                style={{ marginBottom: 0 }}
                            >
                                <div className="bims-card-title">
                                    <span>🏠</span> Housing / Ownership Status
                                </div>
                                {housing.length > 0 ? (
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 2,
                                        }}
                                    >
                                        {(() => {
                                            const total =
                                                housing.reduce(
                                                    (s, h) => s + h.count,
                                                    0,
                                                ) || 1;
                                            return housing.map((h) => (
                                                <div
                                                    className="bims-progress-row"
                                                    key={h.ownership}
                                                >
                                                    <span
                                                        style={{
                                                            minWidth: 90,
                                                            fontSize: ".82rem",
                                                        }}
                                                    >
                                                        {h.ownership}
                                                    </span>
                                                    <div className="bims-progress-bar-wrap">
                                                        <div
                                                            className="bims-progress-bar"
                                                            style={{
                                                                width: `${((h.count / total) * 100).toFixed(1)}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="bims-badge bims-badge-blue">
                                                        {h.count}
                                                    </span>
                                                </div>
                                            ));
                                        })()}
                                    </div>
                                ) : (
                                    <p
                                        style={{
                                            color: "var(--muted)",
                                            fontSize: ".85rem",
                                            marginTop: 8,
                                        }}
                                    >
                                        No household data available.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* SPECIAL GROUPS */}
                        <div className="bims-card">
                            <div className="bims-card-title">
                                <span>🏷️</span> Special Population Groups
                            </div>
                            <div className="bims-mini-grid">
                                {[
                                    {
                                        icon: "🗳️",
                                        label: "Registered Voters",
                                        value: stats.voters ?? 0,
                                    },
                                    {
                                        icon: "🧓",
                                        label: "Senior Citizens",
                                        value: stats.seniors ?? 0,
                                    },
                                    {
                                        icon: "♿",
                                        label: "PWD",
                                        value: stats.pwd ?? 0,
                                    },
                                    {
                                        icon: "🏠",
                                        label: "4Ps Beneficiaries",
                                        value: stats.fourps ?? 0,
                                    },
                                    {
                                        icon: "👤",
                                        label: "Solo Parents",
                                        value: stats.solo_parent ?? 0,
                                    },
                                    {
                                        icon: "📄",
                                        label: "Pending Documents",
                                        value: stats.pending_documents ?? 0,
                                    },
                                    {
                                        icon: "⚖️",
                                        label: "Active Cases",
                                        value: stats.active_blotters ?? 0,
                                    },
                                    {
                                        icon: "✅",
                                        label: "Released Today",
                                        value: stats.released_today ?? 0,
                                    },
                                ].map((g) => (
                                    <div
                                        className="bims-mini-card"
                                        key={g.label}
                                    >
                                        <div className="bims-mini-icon">
                                            {g.icon}
                                        </div>
                                        <div className="bims-mini-num">
                                            {g.value}
                                        </div>
                                        <div className="bims-mini-label">
                                            {g.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RECENT RESIDENTS TABLE */}
                        <div className="bims-card">
                            <div
                                className="bims-card-title"
                                style={{ justifyContent: "space-between" }}
                            >
                                <span
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 10,
                                    }}
                                >
                                    <span>🕐</span> Recently Registered
                                    Residents
                                </span>
                                <Link
                                    href="/residents"
                                    className="bims-btn bims-btn-outline bims-btn-sm"
                                >
                                    View All →
                                </Link>
                            </div>

                            <div className="bims-table-wrap">
                                <table className="bims-table">
                                    <thead>
                                        <tr>
                                            <th>Resident ID</th>
                                            <th>Full Name</th>
                                            <th>Sex</th>
                                            <th>Birthdate</th>
                                            <th>Purok</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentResidents.length > 0 ? (
                                            recentResidents.map((r) => (
                                                <tr key={r.id}>
                                                    <td>
                                                        <span className="bims-badge bims-badge-blue">
                                                            {String(
                                                                r.id,
                                                            ).padStart(4, "0")}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <strong>
                                                            {r.last_name},{" "}
                                                            {r.first_name}
                                                            {r.middle_name
                                                                ? ` ${r.middle_name[0]}.`
                                                                : ""}
                                                            {r.suffix
                                                                ? ` ${r.suffix}`
                                                                : ""}
                                                        </strong>
                                                    </td>
                                                    <td>
                                                        <span
                                                            className={`bims-badge ${r.gender === "Male" ? "bims-badge-blue" : "bims-badge-amber"}`}
                                                        >
                                                            {r.gender || "—"}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {r.birthdate || "—"}
                                                    </td>
                                                    <td>
                                                        {r.purok ? (
                                                            <span className="bims-badge bims-badge-gray">
                                                                {r.purok}
                                                            </span>
                                                        ) : (
                                                            "—"
                                                        )}
                                                    </td>
                                                    <td>
                                                        <span
                                                            className={`bims-badge ${r.is_active ? "bims-badge-green" : "bims-badge-red"}`}
                                                        >
                                                            {r.is_active
                                                                ? "Active"
                                                                : "Inactive"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    style={{
                                                        textAlign: "center",
                                                        color: "var(--muted)",
                                                        padding: 30,
                                                    }}
                                                >
                                                    No residents registered yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* BOTTOM ROW: Documents + Blotter─ */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: "24px",
                            }}
                            className="bims-charts-row"
                        >
                            {/* Recent Document Requests */}
                            <div
                                className="bims-card"
                                style={{ marginBottom: 0 }}
                            >
                                <div
                                    className="bims-card-title"
                                    style={{ justifyContent: "space-between" }}
                                >
                                    <span
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 10,
                                        }}
                                    >
                                        <span>📄</span> Recent Document Requests
                                    </span>
                                    <Link
                                        href="/documents"
                                        className="bims-btn bims-btn-outline bims-btn-sm"
                                    >
                                        View All
                                    </Link>
                                </div>
                                {recentRequests.length > 0 ? (
                                    recentRequests.map((req) => (
                                        <div
                                            key={req.id}
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                padding: "10px 0",
                                                borderBottom:
                                                    "1px solid var(--border)",
                                            }}
                                        >
                                            <div>
                                                <div
                                                    style={{
                                                        fontWeight: 700,
                                                        fontSize: ".88rem",
                                                        color: "var(--navy)",
                                                    }}
                                                >
                                                    {req.resident?.last_name},{" "}
                                                    {req.resident?.first_name}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: ".75rem",
                                                        color: "var(--muted)",
                                                    }}
                                                >
                                                    {req.document_type}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: ".7rem",
                                                        color: "var(--muted)",
                                                        fontFamily: "monospace",
                                                    }}
                                                >
                                                    {req.request_number}
                                                </div>
                                            </div>
                                            <StatusBadge status={req.status} />
                                        </div>
                                    ))
                                ) : (
                                    <div
                                        style={{
                                            textAlign: "center",
                                            padding: "30px 0",
                                            color: "var(--muted)",
                                            fontSize: ".85rem",
                                        }}
                                    >
                                        No recent document requests.
                                    </div>
                                )}
                            </div>

                            {/* Recent Blotter Cases */}
                            <div
                                className="bims-card"
                                style={{ marginBottom: 0 }}
                            >
                                <div
                                    className="bims-card-title"
                                    style={{ justifyContent: "space-between" }}
                                >
                                    <span
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 10,
                                        }}
                                    >
                                        <span>⚖️</span> Recent Blotter Cases
                                    </span>
                                    <Link
                                        href="/blotter"
                                        className="bims-btn bims-btn-outline bims-btn-sm"
                                    >
                                        View All
                                    </Link>
                                </div>
                                {recentBlotters.length > 0 ? (
                                    recentBlotters.map((b) => (
                                        <div
                                            key={b.id}
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                padding: "10px 0",
                                                borderBottom:
                                                    "1px solid var(--border)",
                                            }}
                                        >
                                            <div>
                                                <div
                                                    style={{
                                                        fontWeight: 700,
                                                        fontSize: ".85rem",
                                                        fontFamily: "monospace",
                                                        color: "#c0392b",
                                                    }}
                                                >
                                                    {b.case_number}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: ".75rem",
                                                        color: "var(--muted)",
                                                    }}
                                                >
                                                    {b.incident_type}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: ".75rem",
                                                        color: "var(--slate)",
                                                    }}
                                                >
                                                    vs. {b.respondent_name}
                                                </div>
                                            </div>
                                            <BlotterStatusBadge
                                                status={b.status}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div
                                        style={{
                                            textAlign: "center",
                                            padding: "30px 0",
                                            color: "var(--muted)",
                                            fontSize: ".85rem",
                                        }}
                                    >
                                        No recent blotter cases.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* QUICK ACTIONS─ */}
                        <div className="bims-card" style={{ marginTop: 24 }}>
                            <div className="bims-card-title">
                                <span>⚡</span> Quick Actions
                            </div>
                            <div className="bims-quick-actions">
                                <Link
                                    href="/residents/create"
                                    className="bims-btn bims-btn-primary"
                                >
                                    ✏️ Add Resident
                                </Link>
                                <Link
                                    href="/documents/create"
                                    className="bims-btn bims-btn-gold"
                                >
                                    📄 New Document Request
                                </Link>
                                <Link
                                    href="/blotter/create"
                                    className="bims-btn bims-btn-danger"
                                >
                                    🚨 File Blotter
                                </Link>
                            </div>
                        </div>
                    </main>
                </div>
                {/* end .bims-app */}
            </div>
            {/* end .bims-body */}
        </>
    );
}

/* Sub-components─ */

function StatusBadge({ status }) {
    const map = {
        Pending: { cls: "bims-badge-amber", label: "Pending" },
        Processing: { cls: "bims-badge-blue", label: "Processing" },
        Approved: { cls: "bims-badge-sky", label: "Approved" },
        Released: { cls: "bims-badge-green", label: "Released" },
        Rejected: { cls: "bims-badge-red", label: "Rejected" },
    };
    const s = map[status] || { cls: "bims-badge-gray", label: status };
    return <span className={`bims-badge ${s.cls}`}>{s.label}</span>;
}

function BlotterStatusBadge({ status }) {
    const map = {
        Filed: "bims-badge-blue",
        "Under Investigation": "bims-badge-amber",
        "For Mediation": "bims-badge-sky",
        Settled: "bims-badge-green",
        Dismissed: "bims-badge-gray",
        Escalated: "bims-badge-red",
    };
    return (
        <span className={`bims-badge ${map[status] || "bims-badge-gray"}`}>
            {status}
        </span>
    );
}
