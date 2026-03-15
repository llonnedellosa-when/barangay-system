import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import BimsLayout from "@/Layouts/BimsLayout";

const DOC_TYPES = [
    "Barangay Clearance",
    "Certificate of Indigency",
    "Certificate of Residency",
    "Business Clearance",
    "Certificate of Good Moral Character",
];

const PURPOSES = {
    "Barangay Clearance": [
        "Employment",
        "Loan Application",
        "Travel Abroad",
        "School Enrollment",
        "Other",
    ],
    "Certificate of Indigency": [
        "Medical Assistance",
        "Scholarship",
        "Legal Aid",
        "Other",
    ],
    "Certificate of Residency": [
        "School Enrollment",
        "Employment",
        "Government Transaction",
        "Other",
    ],
    "Business Clearance": ["New Business", "Business Renewal", "Other"],
    "Certificate of Good Moral Character": [
        "Employment",
        "School Enrollment",
        "Other",
    ],
};

export default function Create({ residents }) {
    const [residentSearch, setResidentSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        resident_id: "",
        document_type: "",
        purpose: "",
        custom_purpose: "",
        fee: "",
    });

    const filtered = (residents || [])
        .filter((r) =>
            r.name.toLowerCase().includes(residentSearch.toLowerCase()),
        )
        .slice(0, 8);

    const selectResident = (r) => {
        setData("resident_id", r.id);
        setResidentSearch(r.name);
        setShowDropdown(false);
    };

    const submit = (e) => {
        e.preventDefault();
        const submitData = {
            ...data,
            purpose:
                data.purpose === "Other" ? data.custom_purpose : data.purpose,
        };
        post("/documents", { data: submitData });
    };

    return (
        <BimsLayout>
            <Head title="New Document Request" />
            <div className="bims-section-header">
                <div className="bims-section-title">
                    <h2>New Document Request</h2>
                    <p>Submit a barangay document request</p>
                </div>
                <Link href="/documents" className="bims-btn bims-btn-outline">
                    ← Back
                </Link>
            </div>

            <div className="bims-card" style={{ maxWidth: 680 }}>
                <form onSubmit={submit} className="form-grid">
                    {/* Resident Search */}
                    <div className="full" style={{ position: "relative" }}>
                        <label className="bims-label">Resident Name *</label>
                        <input
                            type="text"
                            value={residentSearch}
                            onChange={(e) => {
                                setResidentSearch(e.target.value);
                                setShowDropdown(true);
                            }}
                            onFocus={() => setShowDropdown(true)}
                            placeholder="Type to search resident..."
                            className="bims-input"
                            autoComplete="off"
                        />
                        {errors.resident_id && (
                            <p className="bims-error">{errors.resident_id}</p>
                        )}

                        {showDropdown && residentSearch.length > 0 && (
                            <div
                                style={{
                                    position: "absolute",
                                    zIndex: 10,
                                    width: "100%",
                                    marginTop: 4,
                                    background: "#fff",
                                    border: "1.5px solid #d4e1ec",
                                    borderRadius: 8,
                                    boxShadow: "0 4px 24px rgba(13,33,55,.12)",
                                    maxHeight: 220,
                                    overflowY: "auto",
                                }}
                            >
                                {filtered.length > 0 ? (
                                    filtered.map((r) => (
                                        <button
                                            key={r.id}
                                            type="button"
                                            onClick={() => selectResident(r)}
                                            style={{
                                                width: "100%",
                                                padding: "10px 16px",
                                                textAlign: "left",
                                                background: "none",
                                                border: "none",
                                                borderBottom:
                                                    "1px solid #f0f4f8",
                                                cursor: "pointer",
                                                fontSize: ".88rem",
                                                fontFamily:
                                                    "Source Sans 3, sans-serif",
                                            }}
                                            onMouseEnter={(e) =>
                                                (e.currentTarget.style.background =
                                                    "#f0f6fb")
                                            }
                                            onMouseLeave={(e) =>
                                                (e.currentTarget.style.background =
                                                    "none")
                                            }
                                        >
                                            <strong>{r.name}</strong>
                                            <span
                                                style={{
                                                    color: "#8ca0b3",
                                                    fontSize: ".78rem",
                                                    marginLeft: 8,
                                                }}
                                            >
                                                {r.address}
                                            </span>
                                        </button>
                                    ))
                                ) : (
                                    <div
                                        style={{
                                            padding: "12px 16px",
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

                    {/* Document Type */}
                    <div className="full">
                        <label className="bims-label">Document Type *</label>
                        <select
                            value={data.document_type}
                            onChange={(e) => {
                                setData("document_type", e.target.value);
                                setData("purpose", "");
                            }}
                            className="bims-input"
                            required
                        >
                            <option value="">Select document type...</option>
                            {DOC_TYPES.map((t) => (
                                <option key={t}>{t}</option>
                            ))}
                        </select>
                        {errors.document_type && (
                            <p className="bims-error">{errors.document_type}</p>
                        )}
                    </div>

                    {/* Purpose */}
                    {data.document_type && (
                        <div className="full">
                            <label className="bims-label">Purpose *</label>
                            <select
                                value={data.purpose}
                                onChange={(e) =>
                                    setData("purpose", e.target.value)
                                }
                                className="bims-input"
                                required
                            >
                                <option value="">Select purpose...</option>
                                {(PURPOSES[data.document_type] || []).map(
                                    (p) => (
                                        <option key={p}>{p}</option>
                                    ),
                                )}
                            </select>
                            {data.purpose === "Other" && (
                                <input
                                    type="text"
                                    value={data.custom_purpose}
                                    onChange={(e) =>
                                        setData(
                                            "custom_purpose",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Specify purpose..."
                                    className="bims-input"
                                    style={{ marginTop: 8 }}
                                    required
                                />
                            )}
                            {errors.purpose && (
                                <p className="bims-error">{errors.purpose}</p>
                            )}
                        </div>
                    )}

                    {/* Fee */}
                    <div>
                        <label className="bims-label">Processing Fee (₱)</label>
                        <input
                            type="number"
                            value={data.fee}
                            onChange={(e) => setData("fee", e.target.value)}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            className="bims-input"
                        />
                        <p
                            style={{
                                fontSize: ".75rem",
                                color: "#8ca0b3",
                                marginTop: 4,
                            }}
                        >
                            Leave blank if free of charge
                        </p>
                    </div>

                    {/* Actions */}
                    <div
                        className="full"
                        style={{ display: "flex", gap: 12, marginTop: 8 }}
                    >
                        <button
                            type="submit"
                            disabled={processing}
                            className="bims-btn bims-btn-primary"
                        >
                            {processing
                                ? "⏳ Submitting..."
                                : "📄 Submit Request"}
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
        </BimsLayout>
    );
}
