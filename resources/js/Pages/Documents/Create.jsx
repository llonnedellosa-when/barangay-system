import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const DOCUMENT_TYPES = [
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

    const filtered = residents
        .filter((r) =>
            r.name.toLowerCase().includes(residentSearch.toLowerCase()),
        )
        .slice(0, 8);

    const selectResident = (r) => {
        setData("resident_id", r.id);
        setResidentSearch(r.name);
        setShowDropdown(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/documents");
    };

    return (
        <AuthenticatedLayout header="New Document Request">
            <Head title="New Request" />
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Resident Lookup */}
                        <div className="relative">
                            <label className="label">
                                Resident Name{" "}
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
                                placeholder="Type to search resident..."
                                className="input"
                                autoComplete="off"
                            />
                            {errors.resident_id && (
                                <p className="error">{errors.resident_id}</p>
                            )}

                            {showDropdown && residentSearch.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-y-auto">
                                    {filtered.length > 0 ? (
                                        filtered.map((r) => (
                                            <button
                                                key={r.id}
                                                type="button"
                                                onClick={() =>
                                                    selectResident(r)
                                                }
                                                className="w-full px-4 py-2.5 text-left hover:bg-blue-50 text-sm border-b border-gray-50 last:border-0"
                                            >
                                                <span className="font-medium">
                                                    {r.name}
                                                </span>
                                                <span className="text-gray-400 text-xs ml-2">
                                                    {r.address}
                                                </span>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-4 py-3 text-gray-400 text-sm">
                                            No residents found
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Document Type */}
                        <div>
                            <label className="label">
                                Document Type{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.document_type}
                                onChange={(e) => {
                                    setData("document_type", e.target.value);
                                    setData("purpose", "");
                                }}
                                className="input"
                                required
                            >
                                <option value="">
                                    Select document type...
                                </option>
                                {DOCUMENT_TYPES.map((t) => (
                                    <option key={t}>{t}</option>
                                ))}
                            </select>
                        </div>

                        {/* Purpose */}
                        {data.document_type && (
                            <div>
                                <label className="label">
                                    Purpose{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.purpose}
                                    onChange={(e) =>
                                        setData("purpose", e.target.value)
                                    }
                                    className="input"
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
                                        className="input mt-2"
                                        required
                                    />
                                )}
                            </div>
                        )}

                        {/* Fee */}
                        <div>
                            <label className="label">Processing Fee (₱)</label>
                            <input
                                type="number"
                                value={data.fee}
                                onChange={(e) => setData("fee", e.target.value)}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                className="input"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                Leave blank if free of charge
                            </p>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="btn-primary"
                            >
                                {processing
                                    ? "Submitting..."
                                    : "Submit Request"}
                            </button>
                            <a href="/documents" className="btn-secondary">
                                Cancel
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
