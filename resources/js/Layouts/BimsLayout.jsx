import { Link, usePage } from "@inertiajs/react";

// ── Updated navigation — no blotter ──────────────────────────
const NAV = [
    {
        label: "Main Menu",
        items: [
            { href: "/dashboard", icon: "📊", label: "Dashboard" },
            { href: "/residents", icon: "👥", label: "Residents" },
            { href: "/residents/create", icon: "✏️", label: "Encode Resident" },
        ],
    },
    {
        label: "Documents",
        items: [
            { href: "/documents", icon: "📄", label: "Document Generator" },
        ],
    },
    {
        label: "System",
        items: [{ href: "/settings", icon: "⚙️", label: "Settings" }],
    },
];

export default function BimsLayout({ children }) {
    const { auth, flash } = usePage().props;
    const path = window.location.pathname;

    const today = new Date().toLocaleDateString("en-PH", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    const isActive = (href) => {
        if (href === "/dashboard") return path === "/dashboard";
        return path.startsWith(href) && href !== "/";
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Source+Sans+3:wght@300;400;600;700&display=swap');
                * { box-sizing:border-box; margin:0; padding:0; }
                body { font-family:'Source Sans 3',sans-serif; background:#fdf8f0; color:#0d2137; }

                .bims-header {
                    background:linear-gradient(135deg,#0d2137 0%,#1a4a7a 100%);
                    height:72px; padding:0 32px;
                    display:flex; align-items:center; justify-content:space-between;
                    box-shadow:0 2px 20px rgba(13,33,55,.35);
                    position:sticky; top:0; z-index:100;
                }
                .bims-seal {
                    width:48px; height:48px; border-radius:50%; font-size:22px;
                    background:radial-gradient(circle,#f0b429 0%,#c8962a 100%);
                    display:flex; align-items:center; justify-content:center;
                    box-shadow:0 0 0 3px rgba(248,180,41,.3); flex-shrink:0;
                }
                .bims-htitle { font-family:'Playfair Display',serif; font-size:1.15rem; color:#fff; line-height:1.2; }
                .bims-hsub   { font-size:.72rem; color:rgba(255,255,255,.6); letter-spacing:1.5px; text-transform:uppercase; }
                .bims-hmeta  { text-align:right; font-size:.75rem; color:rgba(255,255,255,.65); }
                .bims-hmeta strong { display:block; color:#f0b429; font-size:.85rem; }

                .bims-layout { display:grid; grid-template-columns:230px 1fr; min-height:calc(100vh - 72px); }

                .bims-nav {
                    background:#0d2137; padding:24px 0;
                    position:sticky; top:72px;
                    height:calc(100vh - 72px); overflow-y:auto;
                }
                .bims-nav-label { font-size:.65rem; letter-spacing:2px; text-transform:uppercase; color:rgba(255,255,255,.35); padding:18px 24px 6px; }
                .bims-nav-link {
                    display:flex; align-items:center; gap:11px;
                    padding:11px 24px; color:rgba(255,255,255,.7);
                    text-decoration:none; font-size:.88rem; font-weight:600;
                    border-left:3px solid transparent; transition:all .15s;
                    background:none; border-right:none; border-top:none; border-bottom:none;
                    width:100%; text-align:left; cursor:pointer;
                    font-family:'Source Sans 3',sans-serif;
                }
                .bims-nav-link:hover { background:rgba(255,255,255,.07); color:#fff; border-left-color:rgba(240,180,41,.5); }
                .bims-nav-link.active { background:rgba(255,255,255,.09); color:#fff; border-left-color:#f0b429; }
                .bims-nav-hr { border:none; border-top:1px solid rgba(255,255,255,.08); margin:10px 20px; }

                .bims-main { padding:32px 36px; overflow-y:auto; }

                .bims-flash-ok  { background:#d4f4e2; border:1px solid #1a7a4a; color:#1a7a4a; padding:12px 18px; border-radius:8px; margin-bottom:20px; font-size:.88rem; font-weight:600; }
                .bims-flash-err { background:#fde8e8; border:1px solid #c0392b; color:#c0392b; padding:12px 18px; border-radius:8px; margin-bottom:20px; font-size:.88rem; font-weight:600; }

                @keyframes bimsUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
                .bims-anim { animation:bimsUp .35s ease both; }

                .bims-section-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:28px; gap:12px; flex-wrap:wrap; }
                .bims-section-title h2 { font-family:'Playfair Display',serif; font-size:1.6rem; color:#0d2137; }
                .bims-section-title p  { color:#8ca0b3; font-size:.85rem; margin-top:3px; }

                .bims-card { background:#fff; border-radius:10px; box-shadow:0 4px 24px rgba(13,33,55,.10); padding:28px 32px; margin-bottom:24px; }
                .bims-card-title { font-family:'Playfair Display',serif; font-size:1.1rem; color:#0d2137; margin-bottom:20px; padding-bottom:12px; border-bottom:2px solid #d4e1ec; display:flex; align-items:center; gap:10px; }

                .bims-input { width:100%; border:1.5px solid #d4e1ec; border-radius:7px; padding:10px 13px; font-family:'Source Sans 3',sans-serif; font-size:.9rem; color:#0d2137; background:#fafdff; transition:border-color .2s,box-shadow .2s; outline:none; }
                .bims-input:focus { border-color:#2e7fc1; box-shadow:0 0 0 3px rgba(46,127,193,.12); }
                .bims-label { font-size:.78rem; font-weight:700; color:#4a5e74; letter-spacing:.5px; text-transform:uppercase; display:block; margin-bottom:5px; }
                .bims-error { color:#c0392b; font-size:.75rem; margin-top:4px; }

                .bims-btn { display:inline-flex; align-items:center; gap:8px; padding:10px 22px; border-radius:7px; border:none; cursor:pointer; font-family:'Source Sans 3',sans-serif; font-size:.88rem; font-weight:700; letter-spacing:.3px; transition:transform .12s,box-shadow .12s,background .15s; text-decoration:none; }
                .bims-btn:active { transform:scale(.97); }
                .bims-btn-sm { padding:6px 14px; font-size:.8rem; }
                .bims-btn-primary { background:#2e7fc1; color:#fff; box-shadow:0 3px 12px rgba(46,127,193,.35); }
                .bims-btn-primary:hover { background:#1a4a7a; color:#fff; }
                .bims-btn-gold { background:#c8962a; color:#fff; box-shadow:0 3px 12px rgba(200,150,42,.35); }
                .bims-btn-gold:hover { background:#b5841f; color:#fff; }
                .bims-btn-danger { background:#c0392b; color:#fff; }
                .bims-btn-danger:hover { background:#a93226; color:#fff; }
                .bims-btn-outline { background:transparent; color:#2e7fc1; border:1.5px solid #2e7fc1; }
                .bims-btn-outline:hover { background:#e8f2fc; }

                .bims-badge { display:inline-block; padding:3px 10px; border-radius:20px; font-size:.72rem; font-weight:700; letter-spacing:.5px; text-transform:uppercase; }
                .badge-blue   { background:#dbeeff; color:#1a4a7a; }
                .badge-green  { background:#d4f4e2; color:#1a7a4a; }
                .badge-amber  { background:#fef3cd; color:#7a5a00; }
                .badge-red    { background:#fde8e8; color:#c0392b; }
                .badge-gray   { background:#e8ecf0; color:#4a5e74; }
                .badge-sky    { background:#e0f0ff; color:#2e7fc1; }
                .badge-indigo { background:#e8e8ff; color:#3a3ab0; }

                .bims-table { width:100%; border-collapse:collapse; font-size:.85rem; }
                .bims-table thead tr { background:linear-gradient(90deg,#0d2137,#1a4a7a); color:#fff; }
                .bims-table thead th { padding:13px 16px; text-align:left; font-size:.72rem; letter-spacing:1.2px; text-transform:uppercase; white-space:nowrap; font-weight:700; }
                .bims-table tbody tr { border-bottom:1px solid #d4e1ec; transition:background .12s; }
                .bims-table tbody tr:hover { background:#f0f6fb; }
                .bims-table tbody td { padding:11px 16px; vertical-align:middle; }
                .bims-table tbody tr:last-child { border-bottom:none; }

                .bims-empty { text-align:center; padding:48px 20px; color:#8ca0b3; }
                .bims-empty-icon { font-size:2.5rem; margin-bottom:12px; }

                .bims-pagination { display:flex; justify-content:space-between; align-items:center; padding:14px 20px; border-top:1px solid #d4e1ec; }
                .bims-page-btn { padding:5px 12px; border-radius:6px; border:1.5px solid; font-size:.82rem; font-weight:700; cursor:pointer; background:#fff; color:#2e7fc1; border-color:#2e7fc1; transition:all .15s; }
                .bims-page-btn:disabled { color:#ccc; border-color:#e0e0e0; cursor:default; }
                .bims-page-btn.active { background:#2e7fc1; color:#fff; }

                .form-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:18px 24px; }
                .form-grid .full { grid-column:1/-1; }

                @media (max-width:768px) {
                    .bims-layout { grid-template-columns:1fr; }
                    .bims-nav { position:static; height:auto; display:flex; flex-wrap:wrap; padding:8px; }
                    .bims-nav-link { border-left:none; border-bottom:2px solid transparent; padding:8px 12px; font-size:.78rem; }
                    .bims-nav-link.active { border-bottom-color:#f0b429; border-left-color:transparent; }
                    .bims-nav-label, .bims-nav-hr { display:none; }
                    .bims-main { padding:20px 16px; }
                    .bims-card { padding:18px 16px; }
                }
            `}</style>

            {/* Header */}
            <header className="bims-header">
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div className="bims-seal">🏛️</div>
                    <div>
                        <div className="bims-htitle">
                            Barangay Information Management System
                        </div>
                        <div className="bims-hsub">
                            Office of the Barangay Captain · Republic of the
                            Philippines
                        </div>
                    </div>
                </div>
                <div className="bims-hmeta">
                    <strong>BIMS v1.0</strong>
                    <span>{today}</span>
                </div>
            </header>

            <div className="bims-layout">
                {/* Sidebar */}
                <nav className="bims-nav">
                    {NAV.map((section, si) => (
                        <div key={si}>
                            {si > 0 && <hr className="bims-nav-hr" />}
                            <div className="bims-nav-label">
                                {section.label}
                            </div>
                            {section.items.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`bims-nav-link ${isActive(item.href) ? "active" : ""}`}
                                >
                                    <span
                                        style={{
                                            fontSize: "1rem",
                                            width: 20,
                                            textAlign: "center",
                                        }}
                                    >
                                        {item.icon}
                                    </span>
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    ))}

                    <hr className="bims-nav-hr" />
                    <div className="bims-nav-label">Account</div>
                    <div style={{ padding: "8px 24px 4px" }}>
                        <div
                            style={{
                                color: "rgba(255,255,255,.8)",
                                fontSize: ".85rem",
                                fontWeight: 600,
                            }}
                        >
                            {auth?.user?.name}
                        </div>
                        <div
                            style={{
                                color: "rgba(255,255,255,.4)",
                                fontSize: ".72rem",
                                marginTop: 2,
                            }}
                        >
                            {auth?.user?.email}
                        </div>
                    </div>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="bims-nav-link"
                        style={{ marginTop: 4 }}
                    >
                        <span
                            style={{
                                fontSize: "1rem",
                                width: 20,
                                textAlign: "center",
                            }}
                        >
                            🚪
                        </span>
                        Logout
                    </Link>
                </nav>

                {/* Main content */}
                <main className="bims-main">
                    {flash?.success && (
                        <div className="bims-flash-ok">✅ {flash.success}</div>
                    )}
                    {flash?.error && (
                        <div className="bims-flash-err">❌ {flash.error}</div>
                    )}
                    <div className="bims-anim">{children}</div>
                </main>
            </div>
        </>
    );
}
