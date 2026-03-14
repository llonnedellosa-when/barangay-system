import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";

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
            {/* ── Google Fonts ──────────────────────────────────── */}
            <Head title="Dashboard">
                <link
                    href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Source+Sans+3:wght@300;400;600;700&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <style>{`
        /* ── CSS Variables ─────────────────────────────── */
        :root {
          --navy:   #0d2137;
          --blue:   #1a4a7a;
          --sky:    #2e7fc1;
          --gold:   #c8962a;
          --amber:  #f0b429;
          --cream:  #fdf8f0;
          --white:  #ffffff;
          --slate:  #4a5e74;
          --muted:  #8ca0b3;
          --border: #d4e1ec;
          --danger: #c0392b;
          --success:#1a7a4a;
          --tag-bg: #e8f2fc;
          --shadow: 0 4px 24px rgba(13,33,55,.10);
          --radius: 10px;
        }
        .bims-body {
          font-family: 'Source Sans 3', sans-serif;
          background: var(--cream);
          color: var(--navy);
          min-height: 100vh;
        }
        /* ── Header ─────────────────────────────────────── */
        .bims-header {
          background: linear-gradient(135deg, var(--navy) 0%, var(--blue) 100%);
          color: var(--white);
          padding: 0 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
          box-shadow: 0 2px 20px rgba(13,33,55,.35);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .bims-header-brand { display: flex; align-items: center; gap: 14px; }
        .bims-seal {
          width: 48px; height: 48px;
          background: radial-gradient(circle, var(--amber) 0%, var(--gold) 100%);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
          box-shadow: 0 0 0 3px rgba(248,180,41,.3);
          flex-shrink: 0;
        }
        .bims-header-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.15rem;
          letter-spacing: .5px;
          line-height: 1.2;
        }
        .bims-header-sub {
          font-size: .72rem;
          color: rgba(255,255,255,.6);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin: 0;
        }
        .bims-header-meta { text-align: right; font-size: .75rem; color: rgba(255,255,255,.65); }
        .bims-header-meta strong { display: block; color: var(--amber); font-size: .85rem; }

        /* ── Layout ──────────────────────────────────────── */
        .bims-app {
          display: grid;
          grid-template-columns: 230px 1fr;
          min-height: calc(100vh - 72px);
        }

        /* ── Sidebar ─────────────────────────────────────── */
        .bims-nav {
          background: var(--navy);
          padding: 24px 0;
          position: sticky;
          top: 72px;
          height: calc(100vh - 72px);
          overflow-y: auto;
        }
        .bims-nav-label {
          font-size: .65rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,255,255,.35);
          padding: 18px 24px 6px;
        }
        .bims-nav-link {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 11px 24px;
          color: rgba(255,255,255,.7);
          text-decoration: none;
          font-size: .88rem;
          font-weight: 600;
          transition: background .15s, color .15s;
          border-left: 3px solid transparent;
          cursor: pointer;
          background: none;
          border-right: none;
          border-top: none;
          border-bottom: none;
          width: 100%;
          text-align: left;
          font-family: 'Source Sans 3', sans-serif;
        }
        .bims-nav-link:hover, .bims-nav-link.active {
          background: rgba(255,255,255,.07);
          color: var(--white);
          border-left-color: var(--amber);
        }
        .bims-nav-icon { font-size: 1rem; width: 20px; text-align: center; }
        .bims-nav-divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,.08);
          margin: 10px 20px;
        }

        /* ── Main ────────────────────────────────────────── */
        .bims-main { padding: 32px 36px; overflow-y: auto; }

        /* ── Section Header ──────────────────────────────── */
        .bims-section-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .bims-section-title h2 {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem;
          color: var(--navy);
          margin: 0;
        }
        .bims-section-title p { color: var(--muted); font-size: .85rem; margin-top: 3px; margin-bottom: 0; }

        /* ── Stat Cards ──────────────────────────────────── */
        .bims-stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
          gap: 16px;
          margin-bottom: 28px;
        }
        .bims-stat-card {
          background: var(--white);
          border-radius: var(--radius);
          padding: 20px 22px;
          box-shadow: var(--shadow);
          border-top: 4px solid var(--sky);
          animation: bimsfadeUp .4s ease both;
          cursor: default;
        }
        .bims-stat-card:nth-child(2) { border-top-color: var(--gold); }
        .bims-stat-card:nth-child(3) { border-top-color: var(--success); }
        .bims-stat-card:nth-child(4) { border-top-color: var(--danger); }
        .bims-stat-label { font-size: .72rem; text-transform: uppercase; letter-spacing: 1.2px; color: var(--muted); margin-bottom: 6px; }
        .bims-stat-num { font-family: 'Playfair Display', serif; font-size: 2rem; color: var(--navy); line-height: 1; }
        .bims-stat-sub { font-size: .75rem; color: var(--muted); margin-top: 4px; }

        /* ── Cards ───────────────────────────────────────── */
        .bims-card {
          background: var(--white);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          padding: 28px 32px;
          margin-bottom: 24px;
          animation: bimsfadeUp .35s ease both;
        }
        .bims-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          color: var(--navy);
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 2px solid var(--border);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .bims-card-title span { font-size: 1.1rem; }

        /* ── Charts ──────────────────────────────────────── */
        .bims-chart-bars {
          display: flex;
          align-items: flex-end;
          gap: 10px;
          height: 130px;
          padding: 0 8px;
        }
        .bims-bar-wrap { display: flex; flex-direction: column; align-items: center; gap: 5px; flex: 1; }
        .bims-bar {
          width: 100%;
          border-radius: 5px 5px 0 0;
          background: linear-gradient(180deg, var(--sky), var(--blue));
          min-height: 10px;
          transition: height .6s cubic-bezier(.4,0,.2,1), opacity .2s;
        }
        .bims-bar:hover { opacity: .8; }
        .bims-bar-label { font-size: .68rem; color: var(--muted); text-align: center; }
        .bims-bar-val { font-size: .72rem; font-weight: 700; color: var(--slate); }

        /* ── Table ───────────────────────────────────────── */
        .bims-table-wrap { overflow-x: auto; border-radius: var(--radius); }
        .bims-table { width: 100%; border-collapse: collapse; font-size: .85rem; }
        .bims-table thead {
          background: linear-gradient(90deg, var(--navy), var(--blue));
          color: var(--white);
        }
        .bims-table thead th {
          padding: 13px 16px;
          text-align: left;
          font-size: .72rem;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          font-weight: 700;
          white-space: nowrap;
        }
        .bims-table tbody tr { border-bottom: 1px solid var(--border); transition: background .12s; }
        .bims-table tbody tr:hover { background: #f0f6fb; }
        .bims-table tbody td { padding: 11px 16px; vertical-align: middle; }
        .bims-table tbody tr:last-child { border-bottom: none; }

        /* ── Badges ──────────────────────────────────────── */
        .bims-badge {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: .72rem;
          font-weight: 700;
          letter-spacing: .5px;
          text-transform: uppercase;
        }
        .bims-badge-blue   { background: #dbeeff; color: var(--blue); }
        .bims-badge-green  { background: #d4f4e2; color: var(--success); }
        .bims-badge-amber  { background: #fef3cd; color: #7a5a00; }
        .bims-badge-red    { background: #fde8e8; color: var(--danger); }
        .bims-badge-gray   { background: #e8ecf0; color: var(--slate); }
        .bims-badge-sky    { background: #e0f0ff; color: var(--sky); }

        /* ── Buttons ─────────────────────────────────────── */
        .bims-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 22px; border-radius: 7px; border: none;
          cursor: pointer; font-family: 'Source Sans 3', sans-serif;
          font-size: .88rem; font-weight: 700; letter-spacing: .3px;
          transition: transform .12s, box-shadow .12s, background .15s;
          text-decoration: none;
        }
        .bims-btn:active { transform: scale(.97); }
        .bims-btn-primary {
          background: var(--sky); color: var(--white);
          box-shadow: 0 3px 12px rgba(46,127,193,.35);
        }
        .bims-btn-primary:hover { background: var(--blue); color: var(--white); }
        .bims-btn-gold {
          background: var(--gold); color: var(--white);
          box-shadow: 0 3px 12px rgba(200,150,42,.35);
        }
        .bims-btn-gold:hover { background: #b5841f; }
        .bims-btn-danger { background: var(--danger); color: var(--white); }
        .bims-btn-outline {
          background: transparent; color: var(--sky);
          border: 1.5px solid var(--sky);
        }
        .bims-btn-outline:hover { background: var(--tag-bg); }
        .bims-btn-sm { padding: 6px 14px; font-size: .8rem; }

        /* ── Housing summary bar ─────────────────────────── */
        .bims-progress-row {
          display: flex; justify-content: space-between;
          align-items: center; padding: 10px 0;
          border-bottom: 1px solid var(--border);
          font-size: .85rem;
        }
        .bims-progress-row:last-child { border-bottom: none; }
        .bims-progress-bar-wrap {
          flex: 1; height: 8px;
          background: var(--border);
          border-radius: 6px;
          overflow: hidden;
          margin: 0 12px;
        }
        .bims-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, var(--sky), var(--blue));
          border-radius: 6px;
          transition: width .6s cubic-bezier(.4,0,.2,1);
        }

        /* ── Special groups mini cards ───────────────────── */
        .bims-mini-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 12px;
          margin-top: 4px;
        }
        .bims-mini-card {
          background: var(--tag-bg);
          border-radius: 8px;
          padding: 14px 16px;
          display: flex; flex-direction: column; gap: 4px;
        }
        .bims-mini-icon { font-size: 1.3rem; }
        .bims-mini-num { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: var(--navy); }
        .bims-mini-label { font-size: .68rem; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); }

        /* ── Quick action pills ──────────────────────────── */
        .bims-quick-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 0; }

        /* ── Animations ──────────────────────────────────── */
        @keyframes bimsfadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0);    }
        }

        /* ── Responsive ──────────────────────────────────── */
        @media (max-width: 768px) {
          .bims-app { grid-template-columns: 1fr; }
          .bims-nav { position: static; height: auto; display: flex; flex-wrap: wrap; padding: 8px; gap: 2px; }
          .bims-nav-link { padding: 8px 12px; font-size: .78rem; border-left: none; border-bottom: 2px solid transparent; }
          .bims-nav-link.active { border-bottom-color: var(--amber); border-left: none; }
          .bims-nav-label, .bims-nav-divider { display: none; }
          .bims-main { padding: 20px 16px; }
          .bims-card { padding: 18px 16px; }
          .bims-charts-row { grid-template-columns: 1fr !important; }
        }
      `}</style>

            <div className="bims-body">
                {/* ══ HEADER ══════════════════════════════════════════ */}
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

                {/* ══ APP LAYOUT ══════════════════════════════════════ */}
                <div className="bims-app">
                    {/* ── SIDEBAR ──────────────────────────────────────── */}
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

                    {/* ── MAIN CONTENT ─────────────────────────────────── */}
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

                        {/* ── TOP STAT CARDS ────────────────────────────── */}
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

                        {/* ── CHARTS ROW ────────────────────────────────── */}
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

                        {/* ── SPECIAL GROUPS ────────────────────────────── */}
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

                        {/* ── RECENT RESIDENTS TABLE ────────────────────── */}
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

                        {/* ── BOTTOM ROW: Documents + Blotter ───────────── */}
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

                        {/* ── QUICK ACTIONS ─────────────────────────────── */}
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

/* ── Sub-components ─────────────────────────────────────────── */

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
