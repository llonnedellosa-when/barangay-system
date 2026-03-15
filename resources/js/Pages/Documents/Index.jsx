import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import BimsLayout from "@/Layouts/BimsLayout";

const DOC_TYPES = [
    "Barangay Clearance",
    "Certificate of Indigency",
    "Certificate of Residency",
    "Business Clearance",
    "Certificate of Good Moral Character",
];

const STATUS_MAP = {
    Pending: "badge-amber",
    Processing: "badge-blue",
    Approved: "badge-sky",
    Released: "badge-green",
    Rejected: "badge-red",
};

export function DocumentsIndex({ requests, filters }) {
    const [search, setSearch] = useState(filters.search || "");

    const go = (extra = {}) =>
        router.get(
            "/documents",
            { ...filters, ...extra },
            { preserveState: true },
        );

    return (
        <BimsLayout>
            <Head title="Document Requests" />
            <div className="bims-section-header">
                <div className="bims-section-title">
                    <h2>Document Requests</h2>
                    <p>Manage barangay document certifications</p>
                </div>
                <Link
                    href="/documents/create"
                    className="bims-btn bims-btn-primary"
                >
                    📄 New Request
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
                        placeholder="🔍  Search by resident name or request no..."
                        className="bims-input"
                        style={{ maxWidth: 320 }}
                    />
                    <select
                        onChange={(e) => go({ status: e.target.value })}
                        defaultValue={filters.status || ""}
                        className="bims-input"
                        style={{ maxWidth: 160 }}
                    >
                        <option value="">All Status</option>
                        {Object.keys(STATUS_MAP).map((s) => (
                            <option key={s}>{s}</option>
                        ))}
                    </select>
                    <select
                        onChange={(e) => go({ type: e.target.value })}
                        defaultValue={filters.type || ""}
                        className="bims-input"
                        style={{ maxWidth: 240 }}
                    >
                        <option value="">All Document Types</option>
                        {DOC_TYPES.map((t) => (
                            <option key={t}>{t}</option>
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
                                <th>Request No.</th>
                                <th>Resident</th>
                                <th>Document Type</th>
                                <th>Purpose</th>
                                <th>Fee</th>
                                <th>Status</th>
                                <th>Date Filed</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.data.map((req) => (
                                <tr key={req.id}>
                                    <td
                                        style={{
                                            fontFamily: "monospace",
                                            fontWeight: 700,
                                            color: "#2e7fc1",
                                        }}
                                    >
                                        {req.request_number}
                                    </td>
                                    <td style={{ fontWeight: 700 }}>
                                        {req.resident?.last_name},{" "}
                                        {req.resident?.first_name}
                                    </td>
                                    <td style={{ color: "#4a5e74" }}>
                                        {req.document_type}
                                    </td>
                                    <td
                                        style={{
                                            color: "#4a5e74",
                                            maxWidth: 140,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {req.purpose}
                                    </td>
                                    <td style={{ color: "#4a5e74" }}>
                                        {req.fee > 0
                                            ? `₱${parseFloat(req.fee).toFixed(2)}`
                                            : "Free"}
                                    </td>
                                    <td>
                                        <span
                                            className={`bims-badge ${STATUS_MAP[req.status] || "badge-gray"}`}
                                        >
                                            {req.status}
                                        </span>
                                    </td>
                                    <td style={{ color: "#4a5e74" }}>
                                        {new Date(
                                            req.created_at,
                                        ).toLocaleDateString("en-PH")}
                                    </td>
                                    <td>
                                        <div
                                            style={{ display: "flex", gap: 8 }}
                                        >
                                            <Link
                                                href={`/documents/${req.id}`}
                                                style={{
                                                    color: "#2e7fc1",
                                                    fontSize: ".8rem",
                                                    fontWeight: 700,
                                                    textDecoration: "none",
                                                }}
                                            >
                                                Manage
                                            </Link>
                                            {(req.status === "Approved" ||
                                                req.status === "Released") && (
                                                <a
                                                    href={`/documents/${req.id}/print`}
                                                    target="_blank"
                                                    style={{
                                                        color: "#1a7a4a",
                                                        fontSize: ".8rem",
                                                        fontWeight: 700,
                                                        textDecoration: "none",
                                                    }}
                                                >
                                                    Print
                                                </a>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {requests.data.length === 0 && (
                        <div className="bims-empty">
                            <div className="bims-empty-icon">📄</div>
                            <p>No document requests found.</p>
                        </div>
                    )}
                </div>
                {requests.links && requests.links.length > 3 && (
                    <div className="bims-pagination">
                        <span style={{ fontSize: ".8rem", color: "#8ca0b3" }}>
                            Showing {requests.from}–{requests.to} of{" "}
                            {requests.total}
                        </span>
                        <div style={{ display: "flex", gap: 4 }}>
                            {requests.links.map((link, i) => (
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

export default DocumentsIndex;
