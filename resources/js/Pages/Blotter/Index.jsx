import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import BimsLayout from "@/Layouts/BimsLayout";

const STATUS_MAP = {
    Filed: "badge-blue",
    "Under Investigation": "badge-amber",
    "For Mediation": "badge-sky",
    Settled: "badge-green",
    Dismissed: "badge-gray",
    Escalated: "badge-red",
};

export default function BlotterIndex({ blotters, filters }) {
    const [search, setSearch] = useState(filters.search || "");

    const go = (extra = {}) =>
        router.get(
            "/blotter",
            { ...filters, ...extra },
            { preserveState: true },
        );

    return (
        <BimsLayout>
            <Head title="Blotter Reports" />
            <div className="bims-section-header">
                <div className="bims-section-title">
                    <h2>Blotter Reports</h2>
                    <p>Official incident and complaint records</p>
                </div>
                <Link
                    href="/blotter/create"
                    className="bims-btn bims-btn-danger"
                >
                    🚨 File Blotter
                </Link>
            </div>

            <div
                className="bims-card"
                style={{ padding: "18px 24px", marginBottom: 16 }}
            >
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && go({ search })}
                        placeholder="🔍  Search by case no., complainant, respondent..."
                        className="bims-input"
                        style={{ maxWidth: 360 }}
                    />
                    <select
                        onChange={(e) => go({ status: e.target.value })}
                        defaultValue={filters.status || ""}
                        className="bims-input"
                        style={{ maxWidth: 200 }}
                    >
                        <option value="">All Status</option>
                        {Object.keys(STATUS_MAP).map((s) => (
                            <option key={s}>{s}</option>
                        ))}
                    </select>
                    <button
                        onClick={() => go({ search })}
                        className="bims-btn bims-btn-primary bims-btn-sm"
                    >
                        Search
                    </button>
                </div>
            </div>

            <div
                className="bims-card"
                style={{ padding: 0, overflow: "hidden" }}
            >
                <div style={{ overflowX: "auto" }}>
                    <table className="bims-table">
                        <thead>
                            <tr>
                                <th>Case No.</th>
                                <th>Complainant</th>
                                <th>Respondent</th>
                                <th>Incident Type</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blotters.data.map((b) => (
                                <tr key={b.id}>
                                    <td
                                        style={{
                                            fontFamily: "monospace",
                                            fontWeight: 700,
                                            color: "#c0392b",
                                        }}
                                    >
                                        {b.case_number}
                                    </td>
                                    <td style={{ fontWeight: 700 }}>
                                        {b.complainant?.last_name},{" "}
                                        {b.complainant?.first_name}
                                    </td>
                                    <td style={{ color: "#4a5e74" }}>
                                        {b.respondent_name}
                                    </td>
                                    <td>
                                        <span className="bims-badge badge-red">
                                            {b.incident_type}
                                        </span>
                                    </td>
                                    <td style={{ color: "#4a5e74" }}>
                                        {new Date(
                                            b.incident_date,
                                        ).toLocaleDateString("en-PH")}
                                    </td>
                                    <td>
                                        <span
                                            className={`bims-badge ${STATUS_MAP[b.status] || "badge-gray"}`}
                                        >
                                            {b.status}
                                        </span>
                                    </td>
                                    <td>
                                        <Link
                                            href={`/blotter/${b.id}`}
                                            style={{
                                                color: "#2e7fc1",
                                                fontSize: ".8rem",
                                                fontWeight: 700,
                                                textDecoration: "none",
                                            }}
                                        >
                                            View Case
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {blotters.data.length === 0 && (
                        <div className="bims-empty">
                            <div className="bims-empty-icon">⚖️</div>
                            <p>No blotter records found.</p>
                        </div>
                    )}
                </div>
                {blotters.links && blotters.links.length > 3 && (
                    <div className="bims-pagination">
                        <span style={{ fontSize: ".8rem", color: "#8ca0b3" }}>
                            Showing {blotters.from}–{blotters.to} of{" "}
                            {blotters.total}
                        </span>
                        <div style={{ display: "flex", gap: 4 }}>
                            {blotters.links.map((link, i) => (
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
