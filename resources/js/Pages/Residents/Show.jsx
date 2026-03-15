import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import BimsLayout from "@/Layouts/BimsLayout";

export default function Show({ resident }) {
    const [confirmDelete, setConfirmDelete] = useState(false);

    const initials =
        `${resident.first_name?.[0] || ""}${resident.last_name?.[0] || ""}`.toUpperCase();

    const handleDelete = () => {
        router.delete(`/residents/${resident.id}`);
    };

    const Info = ({ label, value }) => (
        <div style={{ padding: "8px 0", borderBottom: "1px solid #d4e1ec" }}>
            <span
                style={{
                    fontSize: ".68rem",
                    color: "#8ca0b3",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    display: "block",
                    marginBottom: 2,
                }}
            >
                {label}
            </span>
            <span
                style={{ fontSize: ".9rem", fontWeight: 600, color: "#0d2137" }}
            >
                {value || "—"}
            </span>
        </div>
    );

    return (
        <BimsLayout>
            <Head title={`${resident.first_name} ${resident.last_name}`} />

            <div className="bims-section-header">
                <div className="bims-section-title">
                    <h2>Resident Profile</h2>
                    <p>Detailed resident information</p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <Link
                        href={`/residents/${resident.id}/edit`}
                        className="bims-btn-primary"
                    >
                        ✏️ Edit
                    </Link>
                    <button
                        onClick={() => setConfirmDelete(true)}
                        className="bims-btn-danger bims-btn-sm"
                    >
                        🗑️ Archive
                    </button>
                </div>
            </div>

            {/* Delete confirm */}
            {confirmDelete && (
                <div
                    style={{
                        background: "#fde8e8",
                        border: "1px solid #c0392b",
                        borderRadius: 8,
                        padding: "14px 18px",
                        marginBottom: 20,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <span
                        style={{
                            color: "#c0392b",
                            fontWeight: 600,
                            fontSize: ".88rem",
                        }}
                    >
                        ⚠️ Archive this resident? This can be restored later.
                    </span>
                    <div style={{ display: "flex", gap: 8 }}>
                        <button
                            onClick={handleDelete}
                            className="bims-btn-danger bims-btn-sm"
                        >
                            Yes, Archive
                        </button>
                        <button
                            onClick={() => setConfirmDelete(false)}
                            className="bims-btn-outline bims-btn-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "220px 1fr",
                    gap: 24,
                    alignItems: "start",
                }}
            >
                {/* Avatar Card */}
                <div
                    className="bims-card"
                    style={{ textAlign: "center", padding: "28px 20px" }}
                >
                    <div
                        style={{
                            width: 90,
                            height: 90,
                            borderRadius: "50%",
                            margin: "0 auto 14px",
                            background:
                                "linear-gradient(135deg,#2e7fc1,#1a4a7a)",
                            color: "#fff",
                            fontSize: "2.2rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: "Playfair Display, serif",
                        }}
                    >
                        {initials}
                    </div>
                    <div
                        style={{
                            fontFamily: "Playfair Display, serif",
                            fontSize: "1rem",
                            color: "#0d2137",
                            fontWeight: 700,
                        }}
                    >
                        {resident.first_name} {resident.last_name}
                    </div>
                    <div
                        style={{
                            fontSize: ".72rem",
                            color: "#8ca0b3",
                            marginTop: 4,
                        }}
                    >
                        ID: {String(resident.id).padStart(4, "0")}
                    </div>
                    <div
                        style={{
                            marginTop: 14,
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            gap: 6,
                        }}
                    >
                        {resident.is_voter && (
                            <span className="bims-badge badge-green">
                                🗳️ Voter
                            </span>
                        )}
                        {resident.is_senior_citizen && (
                            <span className="bims-badge badge-amber">
                                🧓 Senior
                            </span>
                        )}
                        {resident.is_pwd && (
                            <span className="bims-badge badge-sky">♿ PWD</span>
                        )}
                        {resident.is_4ps && (
                            <span className="bims-badge badge-indigo">
                                🏠 4Ps
                            </span>
                        )}
                    </div>
                    <div style={{ marginTop: 16 }}>
                        <Link
                            href={`/documents/create?resident_id=${resident.id}`}
                            className="bims-btn-gold"
                            style={{
                                width: "100%",
                                justifyContent: "center",
                                fontSize: ".8rem",
                            }}
                        >
                            📄 Request Document
                        </Link>
                    </div>
                </div>

                {/* Info Grid */}
                <div>
                    <div className="bims-card" style={{ marginBottom: 16 }}>
                        <div className="bims-card-title">
                            <span>👤</span> Personal Information
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit,minmax(200px,1fr))",
                                gap: "4px 24px",
                            }}
                        >
                            <Info
                                label="Full Name"
                                value={`${resident.last_name}, ${resident.first_name} ${resident.middle_name?.[0] || ""}.${resident.suffix ? " " + resident.suffix : ""}`}
                            />
                            <Info
                                label="Date of Birth"
                                value={resident.birthdate}
                            />
                            <Info
                                label="Age"
                                value={`${resident.age} years old`}
                            />
                            <Info label="Sex" value={resident.gender} />
                            <Info
                                label="Civil Status"
                                value={resident.civil_status}
                            />
                            <Info
                                label="Blood Type"
                                value={resident.blood_type}
                            />
                            <Info
                                label="Nationality"
                                value={resident.nationality}
                            />
                            <Info label="Religion" value={resident.religion} />
                            <Info
                                label="Education"
                                value={resident.educational_attainment}
                            />
                            <Info
                                label="Occupation"
                                value={resident.occupation}
                            />
                        </div>
                    </div>
                    <div className="bims-card">
                        <div className="bims-card-title">
                            <span>📍</span> Contact & Address
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit,minmax(200px,1fr))",
                                gap: "4px 24px",
                            }}
                        >
                            <Info
                                label="Contact Number"
                                value={resident.contact_number}
                            />
                            <Info label="Email" value={resident.email} />
                            <Info label="Purok" value={resident.purok} />
                            <Info label="Address" value={resident.address} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Document History */}
            {resident.document_requests?.length > 0 && (
                <div className="bims-card">
                    <div className="bims-card-title">
                        <span>📄</span> Document Request History
                    </div>
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            fontSize: ".85rem",
                        }}
                    >
                        <thead>
                            <tr
                                style={{
                                    background:
                                        "linear-gradient(90deg,#0d2137,#1a4a7a)",
                                    color: "#fff",
                                }}
                            >
                                {[
                                    "Request No.",
                                    "Document Type",
                                    "Purpose",
                                    "Status",
                                    "Date",
                                ].map((h) => (
                                    <th
                                        key={h}
                                        style={{
                                            padding: "10px 14px",
                                            textAlign: "left",
                                            fontSize: ".72rem",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {resident.document_requests.map((req) => (
                                <tr
                                    key={req.id}
                                    style={{
                                        borderBottom: "1px solid #d4e1ec",
                                    }}
                                >
                                    <td
                                        style={{
                                            padding: "10px 14px",
                                            fontFamily: "monospace",
                                            color: "#2e7fc1",
                                            fontWeight: 700,
                                        }}
                                    >
                                        {req.request_number}
                                    </td>
                                    <td style={{ padding: "10px 14px" }}>
                                        {req.document_type}
                                    </td>
                                    <td
                                        style={{
                                            padding: "10px 14px",
                                            color: "#4a5e74",
                                        }}
                                    >
                                        {req.purpose}
                                    </td>
                                    <td style={{ padding: "10px 14px" }}>
                                        <DocStatusBadge status={req.status} />
                                    </td>
                                    <td
                                        style={{
                                            padding: "10px 14px",
                                            color: "#4a5e74",
                                        }}
                                    >
                                        {new Date(
                                            req.created_at,
                                        ).toLocaleDateString("en-PH")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </BimsLayout>
    );
}

function DocStatusBadge({ status }) {
    const map = {
        Pending: "badge-amber",
        Processing: "badge-blue",
        Approved: "badge-sky",
        Released: "badge-green",
        Rejected: "badge-red",
    };
    return (
        <span className={`bims-badge ${map[status] || "badge-gray"}`}>
            {status}
        </span>
    );
}
