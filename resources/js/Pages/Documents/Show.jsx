import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import StatusBadge from "@/Components/StatusBadge";

const STATUS_COLORS = {
    Pending: "yellow",
    Processing: "blue",
    Approved: "indigo",
    Released: "green",
    Rejected: "red",
};

const STATUS_FLOW = ["Pending", "Processing", "Approved", "Released"];

export default function Show({ document: doc }) {
    const [status, setStatus] = useState(doc.status);
    const [remarks, setRemarks] = useState(doc.remarks || "");
    const [saving, setSaving] = useState(false);

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

    const currentStep = STATUS_FLOW.indexOf(doc.status);

    return (
        <AuthenticatedLayout header={`Request: ${doc.request_number}`}>
            <Head title={doc.request_number} />

            <div className="max-w-3xl mx-auto grid gap-5">
                {/* Progress Timeline */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-semibold text-gray-700 mb-5">
                        Request Progress
                    </h3>
                    <div className="flex items-start">
                        {STATUS_FLOW.map((s, i) => (
                            <div key={s} className="flex items-center flex-1">
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold
                    ${
                        doc.status === "Rejected"
                            ? "bg-gray-200 text-gray-400"
                            : currentStep >= i
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-400"
                    }`}
                                    >
                                        {currentStep > i ? "✓" : i + 1}
                                    </div>
                                    <span
                                        className={`text-xs mt-2 text-center w-16 ${currentStep >= i ? "text-blue-600 font-medium" : "text-gray-400"}`}
                                    >
                                        {s}
                                    </span>
                                </div>
                                {i < STATUS_FLOW.length - 1 && (
                                    <div
                                        className={`flex-1 h-0.5 mb-5 ${currentStep > i ? "bg-blue-600" : "bg-gray-200"}`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    {doc.status === "Rejected" && (
                        <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-sm text-red-700">
                            ❌ This request was rejected.{" "}
                            {doc.remarks && `Reason: ${doc.remarks}`}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-5">
                    {/* Request Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-700 mb-4">
                            Request Details
                        </h3>
                        <dl className="space-y-3 text-sm">
                            <Detail
                                label="Request No."
                                value={doc.request_number}
                                mono
                            />
                            <Detail
                                label="Document Type"
                                value={doc.document_type}
                            />
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
                                value={new Date(
                                    doc.created_at,
                                ).toLocaleDateString("en-PH", {
                                    dateStyle: "long",
                                })}
                            />
                            {doc.released_at && (
                                <Detail
                                    label="Date Released"
                                    value={new Date(
                                        doc.released_at,
                                    ).toLocaleDateString("en-PH", {
                                        dateStyle: "long",
                                    })}
                                />
                            )}
                        </dl>
                    </div>

                    {/* Resident Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-700 mb-4">
                            Requesting Resident
                        </h3>
                        <dl className="space-y-3 text-sm">
                            <Detail
                                label="Full Name"
                                value={`${doc.resident?.last_name}, ${doc.resident?.first_name} ${doc.resident?.middle_name?.[0] || ""}.`}
                            />
                            <Detail
                                label="Address"
                                value={doc.resident?.address}
                            />
                            <Detail
                                label="Contact"
                                value={doc.resident?.contact_number}
                            />
                        </dl>
                        <a
                            href={`/residents/${doc.resident_id}`}
                            className="text-blue-600 text-xs hover:underline mt-4 inline-block"
                        >
                            View Full Profile →
                        </a>
                    </div>
                </div>

                {/* Update Status Panel */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-semibold text-gray-700 mb-4">
                        Update Request Status
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="label">Change Status To</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="input"
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
                            <label className="label">Remarks (Optional)</label>
                            <input
                                type="text"
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                placeholder="Add notes..."
                                className="input"
                            />
                        </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={updateStatus}
                            disabled={saving}
                            className="btn-primary"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                        {(status === "Approved" || status === "Released") && (
                            <a
                                href={`/documents/${doc.id}/print`}
                                target="_blank"
                                className="btn-success"
                            >
                                🖨️ Print Certificate
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function Detail({ label, value, mono }) {
    return (
        <div className="flex justify-between gap-2">
            <dt className="text-gray-400 shrink-0">{label}</dt>
            <dd
                className={`font-medium text-right ${mono ? "font-mono text-blue-700" : ""}`}
            >
                {value || "—"}
            </dd>
        </div>
    );
}
