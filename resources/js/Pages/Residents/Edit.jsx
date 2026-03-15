import { Head, Link, useForm } from "@inertiajs/react";
import BimsLayout from "@/Layouts/BimsLayout";

const PUROKS = ["1", "2", "3", "4", "5", "6", "7", "8"];

export default function Edit({ resident }) {
    const { data, setData, put, processing, errors } = useForm({
        first_name: resident.first_name || "",
        middle_name: resident.middle_name || "",
        last_name: resident.last_name || "",
        suffix: resident.suffix || "",
        birthdate: resident.birthdate || "",
        gender: resident.gender || "",
        civil_status: resident.civil_status || "",
        nationality: resident.nationality || "Filipino",
        religion: resident.religion || "",
        occupation: resident.occupation || "",
        contact_number: resident.contact_number || "",
        email: resident.email || "",
        purok: resident.purok || "",
        street: resident.street || "",
        address: resident.address || "",
        is_voter: resident.is_voter ?? false,
        is_senior_citizen: resident.is_senior_citizen ?? false,
        is_pwd: resident.is_pwd ?? false,
        is_4ps: resident.is_4ps ?? false,
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/residents/${resident.id}`);
    };

    const F = ({ label, error, children, full = false }) => (
        <div style={{ gridColumn: full ? "1/-1" : undefined }}>
            <label className="bims-label">{label}</label>
            {children}
            {error && <p className="bims-error">{error}</p>}
        </div>
    );

    return (
        <BimsLayout>
            <Head title="Edit Resident" />

            <div className="bims-section-header">
                <div className="bims-section-title">
                    <h2>Edit Resident</h2>
                    <p>
                        Update information for {resident.first_name}{" "}
                        {resident.last_name}
                    </p>
                </div>
                <Link
                    href={`/residents/${resident.id}`}
                    className="bims-btn bims-btn-outline"
                >
                    ← Back to Profile
                </Link>
            </div>

            <form onSubmit={submit}>
                {/* Personal Information */}
                <div className="bims-card">
                    <div className="bims-card-title">
                        <span>👤</span> Personal Information
                    </div>
                    <div className="form-grid">
                        <F label="Last Name *" error={errors.last_name}>
                            <input
                                value={data.last_name}
                                onChange={(e) =>
                                    setData("last_name", e.target.value)
                                }
                                className="bims-input"
                                required
                            />
                        </F>
                        <F label="First Name *" error={errors.first_name}>
                            <input
                                value={data.first_name}
                                onChange={(e) =>
                                    setData("first_name", e.target.value)
                                }
                                className="bims-input"
                                required
                            />
                        </F>
                        <F label="Middle Name" error={errors.middle_name}>
                            <input
                                value={data.middle_name}
                                onChange={(e) =>
                                    setData("middle_name", e.target.value)
                                }
                                className="bims-input"
                            />
                        </F>
                        <F label="Suffix">
                            <select
                                value={data.suffix}
                                onChange={(e) =>
                                    setData("suffix", e.target.value)
                                }
                                className="bims-input"
                            >
                                <option value="">None</option>
                                <option>Jr.</option>
                                <option>Sr.</option>
                                <option>II</option>
                                <option>III</option>
                                <option>IV</option>
                            </select>
                        </F>
                        <F label="Date of Birth *" error={errors.birthdate}>
                            <input
                                type="date"
                                value={data.birthdate}
                                onChange={(e) =>
                                    setData("birthdate", e.target.value)
                                }
                                className="bims-input"
                                required
                            />
                        </F>
                        <F label="Sex *" error={errors.gender}>
                            <select
                                value={data.gender}
                                onChange={(e) =>
                                    setData("gender", e.target.value)
                                }
                                className="bims-input"
                                required
                            >
                                <option value="">Select</option>
                                <option>Male</option>
                                <option>Female</option>
                            </select>
                        </F>
                        <F label="Civil Status *" error={errors.civil_status}>
                            <select
                                value={data.civil_status}
                                onChange={(e) =>
                                    setData("civil_status", e.target.value)
                                }
                                className="bims-input"
                                required
                            >
                                <option value="">Select</option>
                                <option>Single</option>
                                <option>Married</option>
                                <option>Widowed</option>
                                <option>Separated</option>
                                <option>Annulled</option>
                            </select>
                        </F>
                        <F label="Nationality">
                            <input
                                value={data.nationality}
                                onChange={(e) =>
                                    setData("nationality", e.target.value)
                                }
                                className="bims-input"
                            />
                        </F>
                        <F label="Religion">
                            <input
                                value={data.religion}
                                onChange={(e) =>
                                    setData("religion", e.target.value)
                                }
                                className="bims-input"
                            />
                        </F>
                        <F label="Occupation">
                            <input
                                value={data.occupation}
                                onChange={(e) =>
                                    setData("occupation", e.target.value)
                                }
                                className="bims-input"
                            />
                        </F>
                    </div>
                </div>

                {/* Contact & Address */}
                <div className="bims-card">
                    <div className="bims-card-title">
                        <span>📍</span> Contact & Address
                    </div>
                    <div className="form-grid">
                        <F label="Contact Number" error={errors.contact_number}>
                            <input
                                value={data.contact_number}
                                onChange={(e) =>
                                    setData("contact_number", e.target.value)
                                }
                                className="bims-input"
                                placeholder="09XXXXXXXXX"
                            />
                        </F>
                        <F label="Email Address" error={errors.email}>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                className="bims-input"
                            />
                        </F>
                        <F label="Purok">
                            <select
                                value={data.purok}
                                onChange={(e) =>
                                    setData("purok", e.target.value)
                                }
                                className="bims-input"
                            >
                                <option value="">Select Purok</option>
                                {PUROKS.map((p) => (
                                    <option key={p} value={`Purok ${p}`}>
                                        Purok {p}
                                    </option>
                                ))}
                            </select>
                        </F>
                        <F label="Street / Sitio">
                            <input
                                value={data.street}
                                onChange={(e) =>
                                    setData("street", e.target.value)
                                }
                                className="bims-input"
                            />
                        </F>
                        <F
                            label="Complete Address *"
                            error={errors.address}
                            full
                        >
                            <textarea
                                value={data.address}
                                onChange={(e) =>
                                    setData("address", e.target.value)
                                }
                                className="bims-input"
                                rows={2}
                                required
                                style={{ resize: "vertical", minHeight: 60 }}
                            />
                        </F>
                    </div>
                </div>

                {/* Classification */}
                <div className="bims-card">
                    <div className="bims-card-title">
                        <span>🏷️</span> Classification / Special Groups
                    </div>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit,minmax(200px,1fr))",
                            gap: 12,
                        }}
                    >
                        {[
                            {
                                key: "is_voter",
                                label: "Registered Voter",
                                icon: "🗳️",
                            },
                            {
                                key: "is_senior_citizen",
                                label: "Senior Citizen (60+)",
                                icon: "🧓",
                            },
                            {
                                key: "is_pwd",
                                label: "Person with Disability",
                                icon: "♿",
                            },
                            {
                                key: "is_4ps",
                                label: "4Ps Beneficiary",
                                icon: "🏠",
                            },
                        ].map(({ key, label, icon }) => (
                            <label
                                key={key}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    padding: "14px 16px",
                                    background: data[key]
                                        ? "#e8f2fc"
                                        : "#fafdff",
                                    border: `1.5px solid ${data[key] ? "#2e7fc1" : "#d4e1ec"}`,
                                    borderRadius: 8,
                                    cursor: "pointer",
                                    transition: "all .15s",
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={!!data[key]}
                                    onChange={(e) =>
                                        setData(key, e.target.checked)
                                    }
                                    style={{
                                        width: 16,
                                        height: 16,
                                        accentColor: "#2e7fc1",
                                    }}
                                />
                                <span style={{ fontSize: "1.1rem" }}>
                                    {icon}
                                </span>
                                <span
                                    style={{
                                        fontSize: ".88rem",
                                        fontWeight: 600,
                                        color: "#0d2137",
                                    }}
                                >
                                    {label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                    <button
                        type="submit"
                        disabled={processing}
                        className="bims-btn bims-btn-primary"
                    >
                        {processing ? "⏳ Updating..." : "💾 Update Resident"}
                    </button>
                    <Link
                        href={`/residents/${resident.id}`}
                        className="bims-btn bims-btn-outline"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </BimsLayout>
    );
}
