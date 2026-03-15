import { Head, Link, useForm } from "@inertiajs/react";
import BimsLayout from "@/Layouts/BimsLayout";

const PUROKS = ["1", "2", "3", "4", "5", "6", "7", "8"];

const EDUC_LEVELS = [
    "No Formal Education",
    "Elementary Level",
    "Elementary Graduate",
    "High School Level",
    "High School Graduate",
    "Vocational / Tech-Voc",
    "College Level",
    "College Graduate",
    "Post Graduate",
];

const YOUTH_CLASSIFICATIONS = [
    "In-School Youth",
    "Out-of-School Youth",
    "Working Youth",
    "Youth with Disability",
    "Indigenous Youth",
    "Not Applicable",
];

const HAZARD_TYPES = [
    { key: "Fire Prone", icon: "🔥" },
    { key: "Flood Prone", icon: "🌊" },
    { key: "Landslide Prone", icon: "⛰️" },
    { key: "Storm Surge Prone", icon: "🌪️" },
    { key: "Earthquake Prone", icon: "⚡" },
];

const HOUSE_OWNERSHIP = [
    "Owned",
    "Rented",
    "Shared / Informal",
    "Government Provided",
    "Mortgaged",
];
const HOUSE_TYPES = [
    "Single Family",
    "Apartment / Unit",
    "Makeshift / Informal",
    "Duplex",
    "Condominium",
];

// ─── Reusable field wrapper ───────────────────────────────────
function F({ label, error, full, children }) {
    return (
        <div style={{ gridColumn: full ? "1/-1" : undefined }}>
            <label className="bims-label">{label}</label>
            {children}
            {error && <p className="bims-error">{error}</p>}
        </div>
    );
}

// ─── Section card ─────────────────────────────────────────────
function Section({ icon, title, children, extra }) {
    return (
        <div className="bims-card">
            <div className="bims-card-title">
                <span>{icon}</span> {title}
            </div>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                    gap: "18px 24px",
                }}
            >
                {children}
            </div>
            {extra}
        </div>
    );
}

// ─── Checkbox card ────────────────────────────────────────────
function CheckCard({ checked, onChange, icon, label }) {
    return (
        <label
            style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "13px 16px",
                background: checked ? "#e8f2fc" : "#fafdff",
                border: `1.5px solid ${checked ? "#2e7fc1" : "#d4e1ec"}`,
                borderRadius: 8,
                cursor: "pointer",
                transition: "all .15s",
                userSelect: "none",
            }}
        >
            <input
                type="checkbox"
                checked={!!checked}
                onChange={(e) => onChange(e.target.checked)}
                style={{
                    width: 16,
                    height: 16,
                    accentColor: "#2e7fc1",
                    flexShrink: 0,
                }}
            />
            <span style={{ fontSize: "1.1rem" }}>{icon}</span>
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
    );
}

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        // Personal
        last_name: "",
        first_name: "",
        middle_name: "",
        suffix: "",
        birthdate: "",
        gender: "",
        civil_status: "",
        nationality: "Filipino",
        religion: "",
        occupation: "",
        educational_attainment: "",
        youth_classification: "",
        // Contact
        contact_number: "",
        email: "",
        purok: "",
        street: "",
        address: "",
        // Classification
        is_voter: false,
        is_senior_citizen: false,
        is_pwd: false,
        is_4ps: false,
        // Household
        house_ownership: "",
        house_type: "",
        hazards: [],
    });

    const toggleHazard = (hazard, checked) => {
        const list = Array.isArray(data.hazards) ? data.hazards : [];
        setData(
            "hazards",
            checked ? [...list, hazard] : list.filter((h) => h !== hazard),
        );
    };

    const submit = (e) => {
        e.preventDefault();
        post("/residents");
    };

    return (
        <BimsLayout>
            <Head title="Encode Resident" />

            <div className="bims-section-header">
                <div className="bims-section-title">
                    <h2>Encode New Resident</h2>
                    <p>Fill in all applicable fields for accurate profiling</p>
                </div>
                <Link href="/residents" className="bims-btn bims-btn-outline">
                    ← Back
                </Link>
            </div>

            <form onSubmit={submit} autoComplete="off">
                {/* ── PERSONAL INFO ─────────────────────── */}
                <Section icon="👤" title="Personal Information">
                    <F label="Last Name *" error={errors.last_name}>
                        <input
                            type="text"
                            className="bims-input"
                            placeholder="De la Cruz"
                            required
                            value={data.last_name}
                            onChange={(e) =>
                                setData("last_name", e.target.value)
                            }
                        />
                    </F>
                    <F label="First Name *" error={errors.first_name}>
                        <input
                            type="text"
                            className="bims-input"
                            placeholder="Juan"
                            required
                            value={data.first_name}
                            onChange={(e) =>
                                setData("first_name", e.target.value)
                            }
                        />
                    </F>
                    <F label="Middle Name" error={errors.middle_name}>
                        <input
                            type="text"
                            className="bims-input"
                            placeholder="Santos"
                            value={data.middle_name}
                            onChange={(e) =>
                                setData("middle_name", e.target.value)
                            }
                        />
                    </F>
                    <F label="Suffix">
                        <select
                            className="bims-input"
                            value={data.suffix}
                            onChange={(e) => setData("suffix", e.target.value)}
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
                            className="bims-input"
                            required
                            value={data.birthdate}
                            onChange={(e) =>
                                setData("birthdate", e.target.value)
                            }
                        />
                    </F>
                    <F label="Sex *" error={errors.gender}>
                        <select
                            className="bims-input"
                            required
                            value={data.gender}
                            onChange={(e) => setData("gender", e.target.value)}
                        >
                            <option value="">Select</option>
                            <option>Male</option>
                            <option>Female</option>
                        </select>
                    </F>
                    <F label="Civil Status *" error={errors.civil_status}>
                        <select
                            className="bims-input"
                            required
                            value={data.civil_status}
                            onChange={(e) =>
                                setData("civil_status", e.target.value)
                            }
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
                            type="text"
                            className="bims-input"
                            value={data.nationality}
                            onChange={(e) =>
                                setData("nationality", e.target.value)
                            }
                        />
                    </F>
                    <F label="Religion">
                        <input
                            type="text"
                            className="bims-input"
                            placeholder="e.g. Roman Catholic"
                            value={data.religion}
                            onChange={(e) =>
                                setData("religion", e.target.value)
                            }
                        />
                    </F>
                    <F label="Occupation">
                        <input
                            type="text"
                            className="bims-input"
                            placeholder="e.g. Farmer, Teacher"
                            value={data.occupation}
                            onChange={(e) =>
                                setData("occupation", e.target.value)
                            }
                        />
                    </F>
                    <F
                        label="Educational Attainment"
                        error={errors.educational_attainment}
                    >
                        <select
                            className="bims-input"
                            value={data.educational_attainment}
                            onChange={(e) =>
                                setData(
                                    "educational_attainment",
                                    e.target.value,
                                )
                            }
                        >
                            <option value="">Select</option>
                            {EDUC_LEVELS.map((l) => (
                                <option key={l}>{l}</option>
                            ))}
                        </select>
                    </F>
                    <F
                        label="Youth Classification"
                        error={errors.youth_classification}
                    >
                        <select
                            className="bims-input"
                            value={data.youth_classification}
                            onChange={(e) =>
                                setData("youth_classification", e.target.value)
                            }
                        >
                            <option value="">Select (if applicable)</option>
                            {YOUTH_CLASSIFICATIONS.map((c) => (
                                <option key={c}>{c}</option>
                            ))}
                        </select>
                    </F>
                </Section>

                {/* ── CONTACT & ADDRESS ─────────────────── */}
                <Section icon="📍" title="Contact & Address">
                    <F label="Contact Number" error={errors.contact_number}>
                        <input
                            type="text"
                            className="bims-input"
                            placeholder="09XXXXXXXXX"
                            value={data.contact_number}
                            onChange={(e) =>
                                setData("contact_number", e.target.value)
                            }
                        />
                    </F>
                    <F label="Email Address" error={errors.email}>
                        <input
                            type="email"
                            className="bims-input"
                            placeholder="juan@email.com"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                        />
                    </F>
                    <F label="Purok">
                        <select
                            className="bims-input"
                            value={data.purok}
                            onChange={(e) => setData("purok", e.target.value)}
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
                            type="text"
                            className="bims-input"
                            placeholder="Street or Sitio name"
                            value={data.street}
                            onChange={(e) => setData("street", e.target.value)}
                        />
                    </F>
                    <F label="Complete Address *" error={errors.address} full>
                        <textarea
                            className="bims-input"
                            rows={2}
                            required
                            placeholder="House No., Street, Purok, Barangay"
                            style={{ resize: "vertical", minHeight: 60 }}
                            value={data.address}
                            onChange={(e) => setData("address", e.target.value)}
                        />
                    </F>
                </Section>

                {/* ── HOUSEHOLD INFORMATION ─────────────── */}
                <div className="bims-card">
                    <div className="bims-card-title">
                        <span>🏠</span> Household Information
                    </div>

                    {/* Ownership + Type */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit,minmax(220px,1fr))",
                            gap: "18px 24px",
                            marginBottom: 24,
                        }}
                    >
                        <F
                            label="House Ownership"
                            error={errors.house_ownership}
                        >
                            <select
                                className="bims-input"
                                value={data.house_ownership}
                                onChange={(e) =>
                                    setData("house_ownership", e.target.value)
                                }
                            >
                                <option value="">Select ownership type</option>
                                {HOUSE_OWNERSHIP.map((o) => (
                                    <option key={o}>{o}</option>
                                ))}
                            </select>
                        </F>
                        <F label="Type of House" error={errors.house_type}>
                            <select
                                className="bims-input"
                                value={data.house_type}
                                onChange={(e) =>
                                    setData("house_type", e.target.value)
                                }
                            >
                                <option value="">Select house type</option>
                                {HOUSE_TYPES.map((t) => (
                                    <option key={t}>{t}</option>
                                ))}
                            </select>
                        </F>
                    </div>

                    {/* Hazard Prone */}
                    <div>
                        <label
                            className="bims-label"
                            style={{ marginBottom: 10, display: "block" }}
                        >
                            🚨 Hazard Prone (select all that apply)
                        </label>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit,minmax(180px,1fr))",
                                gap: 10,
                            }}
                        >
                            {HAZARD_TYPES.map(({ key, icon }) => (
                                <CheckCard
                                    key={key}
                                    checked={(data.hazards || []).includes(key)}
                                    onChange={(checked) =>
                                        toggleHazard(key, checked)
                                    }
                                    icon={icon}
                                    label={key}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── CLASSIFICATION ────────────────────── */}
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
                        <CheckCard
                            checked={data.is_voter}
                            onChange={(v) => setData("is_voter", v)}
                            icon="🗳️"
                            label="Registered Voter"
                        />
                        <CheckCard
                            checked={data.is_senior_citizen}
                            onChange={(v) => setData("is_senior_citizen", v)}
                            icon="🧓"
                            label="Senior Citizen (60+)"
                        />
                        <CheckCard
                            checked={data.is_pwd}
                            onChange={(v) => setData("is_pwd", v)}
                            icon="♿"
                            label="Person with Disability"
                        />
                        <CheckCard
                            checked={data.is_4ps}
                            onChange={(v) => setData("is_4ps", v)}
                            icon="🏠"
                            label="4Ps Beneficiary"
                        />
                    </div>
                </div>

                {/* ── SUBMIT ────────────────────────────── */}
                <div style={{ display: "flex", gap: 12, paddingBottom: 32 }}>
                    <button
                        type="submit"
                        disabled={processing}
                        className="bims-btn bims-btn-primary"
                    >
                        {processing ? "⏳ Saving..." : "💾 Save Resident"}
                    </button>
                    <Link
                        href="/residents"
                        className="bims-btn bims-btn-outline"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </BimsLayout>
    );
}
