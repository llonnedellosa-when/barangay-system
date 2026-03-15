import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import BimsLayout from "@/Layouts/BimsLayout";

const INCIDENT_TYPES = [
    "Physical Assault",
    "Verbal Abuse",
    "Theft",
    "Trespassing",
    "Noise Complaint",
    "Domestic Violence",
    "Vandalism",
    "Others",
];

export default function BlotterCreate({ residents }) {
    const [residentSearch, setResidentSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        complainant_id: "",
        respondent_name: "",
        respondent_address: "",
        incident_type: "",
        incident_date: "",
        incident_location: "",
        narrative: "",
    });

    const filtered = (residents || [])
        .filter((r) =>
            r.name.toLowerCase().includes(residentSearch.toLowerCase()),
        )
        .slice(0, 8);

    const selectResident = (r) => {
        setData("complainant_id", r.id);
        setResidentSearch(r.name);
        setShowDropdown(false);
    };

    return (
        <BimsLayout>
            <Head title="File Blotter" />
            <div className="bims-section-header">
                <div className="bims-section-title">
                    <h2>File Blotter Report</h2>
                    <p>Official incident and complaint record</p>
                </div>
                <Link href="/blotter" className="bims-btn bims-btn-outline">
                    ← Back
                </Link>
            </div>

            {/* Warning */}
            <div
                style={{
                    background: "#fde8e8",
                    border: "1px solid #c0392b",
                    borderRadius: 8,
                    padding: "14px 18px",
                    marginBottom: 20,
                }}
            >
                <p
                    style={{
                        color: "#c0392b",
                        fontWeight: 700,
                        fontSize: ".88rem",
                        marginBottom: 2,
                    }}
                >
                    ⚠️ Official Legal Document
                </p>
                <p style={{ color: "#c0392b", fontSize: ".82rem" }}>
                    This blotter report is an official record. All information
                    must be accurate and truthful.
                </p>
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    post("/blotter");
                }}
            >
                {/* Complainant */}
                <div className="bims-card">
                    <div className="bims-card-title">
                        <span>👤</span> Complainant
                    </div>
                    <div style={{ position: "relative", maxWidth: 500 }}>
                        <label className="bims-label">
                            Resident Complainant *
                        </label>
                        <input
                            type="text"
                            value={residentSearch}
                            onChange={(e) => {
                                setResidentSearch(e.target.value);
                                setShowDropdown(true);
                            }}
                            onFocus={() => setShowDropdown(true)}
                            placeholder="Search resident name..."
                            className="bims-input"
                            autoComplete="off"
                        />
                        {errors.complainant_id && (
                            <p className="bims-error">
                                {errors.complainant_id}
                            </p>
                        )}
                        {showDropdown && residentSearch && (
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
                                {filtered.map((r) => (
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
                                            borderBottom: "1px solid #f0f4f8",
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
                                        {r.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Respondent */}
                <div className="bims-card">
                    <div className="bims-card-title">
                        <span>🎯</span> Respondent
                    </div>
                    <div className="form-grid">
                        <div>
                            <label className="bims-label">Full Name *</label>
                            <input
                                value={data.respondent_name}
                                onChange={(e) =>
                                    setData("respondent_name", e.target.value)
                                }
                                className="bims-input"
                                required
                                placeholder="Person being complained about"
                            />
                            {errors.respondent_name && (
                                <p className="bims-error">
                                    {errors.respondent_name}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="bims-label">Address</label>
                            <input
                                value={data.respondent_address}
                                onChange={(e) =>
                                    setData(
                                        "respondent_address",
                                        e.target.value,
                                    )
                                }
                                className="bims-input"
                                placeholder="Known address"
                            />
                        </div>
                    </div>
                </div>

                {/* Incident Details */}
                <div className="bims-card">
                    <div className="bims-card-title">
                        <span>📋</span> Incident Details
                    </div>
                    <div className="form-grid">
                        <div>
                            <label className="bims-label">
                                Type of Incident *
                            </label>
                            <select
                                value={data.incident_type}
                                onChange={(e) =>
                                    setData("incident_type", e.target.value)
                                }
                                className="bims-input"
                                required
                            >
                                <option value="">Select type...</option>
                                {INCIDENT_TYPES.map((t) => (
                                    <option key={t}>{t}</option>
                                ))}
                            </select>
                            {errors.incident_type && (
                                <p className="bims-error">
                                    {errors.incident_type}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="bims-label">Date & Time *</label>
                            <input
                                type="datetime-local"
                                value={data.incident_date}
                                onChange={(e) =>
                                    setData("incident_date", e.target.value)
                                }
                                className="bims-input"
                                required
                            />
                            {errors.incident_date && (
                                <p className="bims-error">
                                    {errors.incident_date}
                                </p>
                            )}
                        </div>
                        <div className="full">
                            <label className="bims-label">Location *</label>
                            <input
                                value={data.incident_location}
                                onChange={(e) =>
                                    setData("incident_location", e.target.value)
                                }
                                className="bims-input"
                                required
                                placeholder="e.g. Purok 3, near the waiting shed"
                            />
                            {errors.incident_location && (
                                <p className="bims-error">
                                    {errors.incident_location}
                                </p>
                            )}
                        </div>
                        <div className="full">
                            <label className="bims-label">
                                Full Narrative *
                            </label>
                            <textarea
                                value={data.narrative}
                                onChange={(e) =>
                                    setData("narrative", e.target.value)
                                }
                                className="bims-input"
                                rows={6}
                                required
                                style={{ resize: "vertical", minHeight: 120 }}
                                placeholder="Provide a detailed and accurate account of what happened — time, place, persons involved, and sequence of events..."
                            />
                            {errors.narrative && (
                                <p className="bims-error">{errors.narrative}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                    <button
                        type="submit"
                        disabled={processing}
                        className="bims-btn bims-btn-danger"
                    >
                        {processing ? "⏳ Filing..." : "🚨 File Blotter Report"}
                    </button>
                    <Link href="/blotter" className="bims-btn bims-btn-outline">
                        Cancel
                    </Link>
                </div>
            </form>
        </BimsLayout>
    );
}
