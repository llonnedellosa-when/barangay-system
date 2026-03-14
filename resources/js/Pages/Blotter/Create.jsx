import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

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

export default function Create({ residents }) {
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

    const filtered = residents
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
        <AuthenticatedLayout header="File Blotter Report">
            <Head title="File Blotter" />
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-700 text-sm font-semibold">
                            ⚠️ Official Record
                        </p>
                        <p className="text-red-600 text-xs mt-1">
                            This blotter report is an official legal document.
                            All information must be accurate and truthful.
                        </p>
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            post("/blotter");
                        }}
                        className="space-y-6"
                    >
                        {/* Complainant */}
                        <div>
                            <h3 className="font-semibold text-gray-700 border-b border-gray-100 pb-2 mb-4">
                                Complainant
                            </h3>
                            <div className="relative">
                                <label className="label">
                                    Resident Complainant{" "}
                                    <span className="text-red-500">*</span>
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
                                    className="input"
                                    autoComplete="off"
                                />
                                {errors.complainant_id && (
                                    <p className="error">
                                        {errors.complainant_id}
                                    </p>
                                )}
                                {showDropdown && residentSearch && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-52 overflow-y-auto">
                                        {filtered.map((r) => (
                                            <button
                                                key={r.id}
                                                type="button"
                                                onClick={() =>
                                                    selectResident(r)
                                                }
                                                className="w-full px-4 py-2.5 text-left hover:bg-blue-50 text-sm border-b border-gray-50"
                                            >
                                                {r.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Respondent */}
                        <div>
                            <h3 className="font-semibold text-gray-700 border-b border-gray-100 pb-2 mb-4">
                                Respondent
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">
                                        Full Name{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        value={data.respondent_name}
                                        onChange={(e) =>
                                            setData(
                                                "respondent_name",
                                                e.target.value,
                                            )
                                        }
                                        className="input"
                                        required
                                        placeholder="Person being complained about"
                                    />
                                    {errors.respondent_name && (
                                        <p className="error">
                                            {errors.respondent_name}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="label">Address</label>
                                    <input
                                        value={data.respondent_address}
                                        onChange={(e) =>
                                            setData(
                                                "respondent_address",
                                                e.target.value,
                                            )
                                        }
                                        className="input"
                                        placeholder="Known address"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Incident */}
                        <div>
                            <h3 className="font-semibold text-gray-700 border-b border-gray-100 pb-2 mb-4">
                                Incident Details
                            </h3>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="label">
                                        Type of Incident{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.incident_type}
                                        onChange={(e) =>
                                            setData(
                                                "incident_type",
                                                e.target.value,
                                            )
                                        }
                                        className="input"
                                        required
                                    >
                                        <option value="">Select type...</option>
                                        {INCIDENT_TYPES.map((t) => (
                                            <option key={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="label">
                                        Date & Time{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={data.incident_date}
                                        onChange={(e) =>
                                            setData(
                                                "incident_date",
                                                e.target.value,
                                            )
                                        }
                                        className="input"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="label">
                                    Location{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    value={data.incident_location}
                                    onChange={(e) =>
                                        setData(
                                            "incident_location",
                                            e.target.value,
                                        )
                                    }
                                    className="input"
                                    required
                                    placeholder="e.g. Purok 3, near the waiting shed"
                                />
                            </div>
                            <div>
                                <label className="label">
                                    Full Narrative{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={data.narrative}
                                    onChange={(e) =>
                                        setData("narrative", e.target.value)
                                    }
                                    className="input"
                                    rows={6}
                                    required
                                    placeholder="Provide a detailed and accurate account of what happened — time, place, persons involved, and sequence of events..."
                                />
                                {errors.narrative && (
                                    <p className="error">{errors.narrative}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-red-600 text-white px-8 py-2.5 rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium text-sm"
                            >
                                {processing
                                    ? "Filing..."
                                    : "File Blotter Report"}
                            </button>
                            <a href="/blotter" className="btn-secondary">
                                Cancel
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
