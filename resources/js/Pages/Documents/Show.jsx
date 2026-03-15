import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import BimsLayout from "@/Layouts/BimsLayout";

const STATUS_MAP = {
    Pending: "badge-amber",
    Processing: "badge-blue",
    Approved: "badge-sky",
    Released: "badge-green",
    Rejected: "badge-red",
};
const STATUS_FLOW = ["Pending", "Processing", "Approved", "Released"];

export default function DocumentShow({ document: doc }) {
    const [status, setStatus] = useState(doc.status);
    const [remarks, setRemarks] = useState(doc.remarks || "");
    const [saving, setSaving] = useState(false);

    const currentStep = STATUS_FLOW.indexOf(doc.status);

    const updateStatus = () => {
        setSaving(true);
        router.patch(
            `/documents/${doc.id}/status`,
            { status, remarks },
            {
                onFinish: () => setSaving(false),
            },
        );
    };

    const Detail = ({ label, value, mono = false }) => (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid #d4e1ec",
            }}
        >
            <span style={{ color: "#8ca0b3", fontSize: ".85rem" }}>
                {label}
            </span>
            <span
                style={{
                    fontWeight: 600,
                    fontFamily: mono ? "monospace" : undefined,
                    color: mono ? "#2e7fc1" : "#0d2137",
                }}
            >
                {value || "—"}
            </span>
        </div>
    );

    return (
        <BimsLayout>
            <Head title={doc.request_number} />
            <div className="bims-section-header">
                <div className="bims-section-title">
                    <h2>Document Request</h2>
                    <p
                        style={{
                            fontFamily: "monospace",
                            fontWeight: 700,
                            color: "#2e7fc1",
                        }}
                    >
                        {doc.request_number}
                    </p>
                </div>
                <Link href="/documents" className="bims-btn bims-btn-outline">
                    ← Back
                </Link>
            </div>

            {/* Progress Timeline */}
            <div className="bims-card">
                <div className="bims-card-title">
                    <span>📋</span> Request Progress
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                    {STATUS_FLOW.map((s, i) => (
                        <div
                            key={s}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                flex: 1,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    flex: 1,
                                }}
                            >
                                <div
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: ".85rem",
                                        fontWeight: 700,
                                        background:
                                            doc.status === "Rejected"
                                                ? "#e8ecf0"
                                                : currentStep >= i
                                                  ? "#2e7fc1"
                                                  : "#e8ecf0",
                                        color:
                                            doc.status === "Rejected"
                                                ? "#8ca0b3"
                                                : currentStep >= i
                                                  ? "#fff"
                                                  : "#8ca0b3",
                                    }}
                                >
                                    {currentStep > i ? "✓" : i + 1}
                                </div>
                                <span
                                    style={{
                                        fontSize: ".72rem",
                                        marginTop: 6,
                                        color:
                                            currentStep >= i
                                                ? "#2e7fc1"
                                                : "#8ca0b3",
                                        fontWeight:
                                            currentStep >= i ? 700 : 400,
                                    }}
                                >
                                    {s}
                                </span>
                            </div>
                            {i < STATUS_FLOW.length - 1 && (
                                <div
                                    style={{
                                        height: 3,
                                        flex: 1,
                                        marginBottom: 20,
                                        background:
                                            currentStep > i
                                                ? "#2e7fc1"
                                                : "#e8ecf0",
                                        borderRadius: 2,
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </div>
                {doc.status === "Rejected" && (
                    <div
                        style={{
                            marginTop: 12,
                            background: "#fde8e8",
                            border: "1px solid #c0392b",
                            borderRadius: 8,
                            padding: "10px 14px",
                            color: "#c0392b",
                            fontSize: ".85rem",
                            fontWeight: 600,
                        }}
                    >
                        ❌ This request was rejected.{" "}
                        {doc.remarks && `Reason: ${doc.remarks}`}
                    </div>
                )}
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 20,
                    marginBottom: 20,
                }}
            >
                {/* Request Details */}
                <div className="bims-card" style={{ marginBottom: 0 }}>
                    <div className="bims-card-title">
                        <span>📄</span> Request Details
                    </div>
                    <Detail
                        label="Request No."
                        value={doc.request_number}
                        mono
                    />
                    <Detail label="Document Type" value={doc.document_type} />
                    <Detail label="Purpose" value={doc.purpose} />
                    <Detail
                        label="Fee"
                        value={
                            doc.fee > 0
                                ? `₱${parseFloat(doc.fee).toFixed(2)}`
                                : "Free"
                        }
                    />
                    <Detail
                        label="Date Filed"
                        value={new Date(doc.created_at).toLocaleDateString(
                            "en-PH",
                            { dateStyle: "long" },
                        )}
                    />
                    {doc.released_at && (
                        <Detail
                            label="Date Released"
                            value={new Date(doc.released_at).toLocaleDateString(
                                "en-PH",
                                { dateStyle: "long" },
                            )}
                        />
                    )}
                </div>

                {/* Resident Info */}
                <div className="bims-card" style={{ marginBottom: 0 }}>
                    <div className="bims-card-title">
                        <span>👤</span> Requesting Resident
                    </div>
                    <Detail
                        label="Full Name"
                        value={`${doc.resident?.last_name}, ${doc.resident?.first_name}`}
                    />
                    <Detail label="Address" value={doc.resident?.address} />
                    <Detail
                        label="Contact"
                        value={doc.resident?.contact_number}
                    />
                    <div style={{ marginTop: 12 }}>
                        <Link
                            href={`/residents/${doc.resident_id}`}
                            style={{
                                color: "#2e7fc1",
                                fontSize: ".82rem",
                                fontWeight: 700,
                                textDecoration: "none",
                            }}
                        >
                            View Full Profile →
                        </Link>
                    </div>
                </div>
            </div>

            {/* Update Status */}
            <div className="bims-card">
                <div className="bims-card-title">
                    <span>⚙️</span> Update Request Status
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
                        <label className="bims-label">Change Status To</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="bims-input"
                        >
                            {[
                                "Pending",
                                "Processing",
                                "Approved",
                                "Released",
                                "Rejected",
                            ].map((s) => (
                                <option key={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="bims-label">Remarks (Optional)</label>
                        <input
                            type="text"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            placeholder="Add notes..."
                            className="bims-input"
                        />
                    </div>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                    <button
                        onClick={updateStatus}
                        disabled={saving}
                        className="bims-btn bims-btn-primary"
                    >
                        {saving ? "⏳ Saving..." : "💾 Save Changes"}
                    </button>
                    {(status === "Approved" || status === "Released") && (
                        <a
                            href={`/documents/${doc.id}/print`}
                            target="_blank"
                            className="bims-btn bims-btn-gold"
                        >
                            🖨️ Print Certificate
                        </a>
                    )}
                </div>
            </div>
        </BimsLayout>
    );
}
