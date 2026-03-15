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

const ALL_STATUSES = [
    "Filed",
    "Under Investigation",
    "For Mediation",
    "Settled",
    "Dismissed",
    "Escalated",
];

export default function BlotterShow({ blotter }) {
    const [status, setStatus] = useState(blotter.status);
    const [resolution, setResolution] = useState(blotter.resolution || "");
    const [saving, setSaving] = useState(false);

    const updateStatus = () => {
        setSaving(true);
        router.patch(
            `/blotter/${blotter.id}/status`,
            { status, resolution },
            {
                onFinish: () => setSaving(false),
            },
        );
    };

    return (
        <BimsLayout>
            <Head title={blotter.case_number} />

            {/* Red header banner */}
            <div
                style={{
                    background: "linear-gradient(135deg,#c0392b,#a93226)",
                    borderRadius: 10,
                    padding: "20px 28px",
                    marginBottom: 24,
                    color: "#fff",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div>
                    <p
                        style={{
                            fontSize: ".75rem",
                            color: "rgba(255,255,255,.7)",
                            textTransform: "uppercase",
                            letterSpacing: 2,
                            marginBottom: 4,
                        }}
                    >
                        Case Number
                    </p>
                    <h2
                        style={{
                            fontFamily: "monospace",
                            fontSize: "2rem",
                            fontWeight: 700,
                        }}
                    >
                        {blotter.case_number}
                    </h2>
                    <p style={{ color: "rgba(255,255,255,.8)", marginTop: 4 }}>
                        {blotter.incident_type}
                    </p>
                </div>
                <div style={{ textAlign: "right" }}>
                    <span
                        className={`bims-badge ${STATUS_MAP[blotter.status] || "badge-gray"}`}
                    >
                        {blotter.status}
                    </span>
                    <p
                        style={{
                            color: "rgba(255,255,255,.7)",
                            fontSize: ".8rem",
                            marginTop: 8,
                        }}
                    >
                        Filed:{" "}
                        {new Date(blotter.created_at).toLocaleDateString(
                            "en-PH",
                        )}
                    </p>
                </div>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 20,
                    marginBottom: 20,
                }}
            >
                {/* Parties */}
                <div className="bims-card" style={{ marginBottom: 0 }}>
                    <div className="bims-card-title">
                        <span>👥</span> Parties Involved
                    </div>
                    <div
                        style={{
                            background: "#e8f2fc",
                            borderRadius: 8,
                            padding: "12px 16px",
                            marginBottom: 12,
                        }}
                    >
                        <p
                            style={{
                                fontSize: ".7rem",
                                color: "#2e7fc1",
                                textTransform: "uppercase",
                                fontWeight: 700,
                                marginBottom: 4,
                            }}
                        >
                            Complainant
                        </p>
                        <p style={{ fontWeight: 700, color: "#0d2137" }}>
                            {blotter.complainant?.last_name},{" "}
                            {blotter.complainant?.first_name}
                        </p>
                        <p style={{ fontSize: ".8rem", color: "#4a5e74" }}>
                            {blotter.complainant?.address}
                        </p>
                        <p style={{ fontSize: ".8rem", color: "#4a5e74" }}>
                            {blotter.complainant?.contact_number}
                        </p>
                    </div>
                    <div
                        style={{
                            background: "#fde8e8",
                            borderRadius: 8,
                            padding: "12px 16px",
                        }}
                    >
                        <p
                            style={{
                                fontSize: ".7rem",
                                color: "#c0392b",
                                textTransform: "uppercase",
                                fontWeight: 700,
                                marginBottom: 4,
                            }}
                        >
                            Respondent
                        </p>
                        <p style={{ fontWeight: 700, color: "#0d2137" }}>
                            {blotter.respondent_name}
                        </p>
                        <p style={{ fontSize: ".8rem", color: "#4a5e74" }}>
                            {blotter.respondent_address || "—"}
                        </p>
                    </div>
                </div>

                {/* Incident Info */}
                <div className="bims-card" style={{ marginBottom: 0 }}>
                    <div className="bims-card-title">
                        <span>📋</span> Incident Details
                    </div>
                    {[
                        {
                            label: "Incident Type",
                            value: blotter.incident_type,
                        },
                        {
                            label: "Date & Time",
                            value: new Date(
                                blotter.incident_date,
                            ).toLocaleString("en-PH"),
                        },
                        { label: "Location", value: blotter.incident_location },
                        {
                            label: "Handled By",
                            value: blotter.handled_by?.name,
                        },
                    ].map(({ label, value }) => (
                        <div
                            key={label}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "8px 0",
                                borderBottom: "1px solid #d4e1ec",
                            }}
                        >
                            <span
                                style={{ color: "#8ca0b3", fontSize: ".85rem" }}
                            >
                                {label}
                            </span>
                            <span
                                style={{
                                    fontWeight: 600,
                                    color: "#0d2137",
                                    textAlign: "right",
                                    maxWidth: 200,
                                }}
                            >
                                {value || "—"}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Narrative */}
            <div className="bims-card">
                <div className="bims-card-title">
                    <span>📝</span> Incident Narrative
                </div>
                <div
                    style={{
                        background: "#fdf8f0",
                        borderRadius: 8,
                        padding: "16px 20px",
                        fontSize: ".88rem",
                        color: "#0d2137",
                        lineHeight: 1.8,
                        whiteSpace: "pre-wrap",
                    }}
                >
                    {blotter.narrative}
                </div>
            </div>

            {/* Case Management */}
            <div className="bims-card">
                <div className="bims-card-title">
                    <span>⚙️</span> Case Management
                </div>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 16,
                        marginBottom: 16,
                    }}
                >
                    <div>
                        <label className="bims-label">Update Case Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="bims-input"
                        >
                            {ALL_STATUSES.map((s) => (
                                <option key={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                    <label className="bims-label">Resolution / Notes</label>
                    <textarea
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value)}
                        className="bims-input"
                        rows={3}
                        style={{ resize: "vertical" }}
                        placeholder="Enter resolution, mediation notes, or case updates..."
                    />
                </div>
                {blotter.resolution && (
                    <div
                        style={{
                            background: "#d4f4e2",
                            border: "1px solid #1a7a4a",
                            borderRadius: 8,
                            padding: "12px 16px",
                            marginBottom: 16,
                        }}
                    >
                        <p
                            style={{
                                fontSize: ".7rem",
                                color: "#1a7a4a",
                                textTransform: "uppercase",
                                fontWeight: 700,
                                marginBottom: 4,
                            }}
                        >
                            Previous Resolution
                        </p>
                        <p style={{ fontSize: ".85rem", color: "#0d2137" }}>
                            {blotter.resolution}
                        </p>
                    </div>
                )}
                <div style={{ display: "flex", gap: 12 }}>
                    <button
                        onClick={updateStatus}
                        disabled={saving}
                        className="bims-btn bims-btn-primary"
                    >
                        {saving ? "⏳ Saving..." : "💾 Update Case"}
                    </button>
                    <Link href="/blotter" className="bims-btn bims-btn-outline">
                        ← Back to List
                    </Link>
                </div>
            </div>
        </BimsLayout>
    );
}
