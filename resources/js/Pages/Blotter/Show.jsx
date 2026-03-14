import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import StatusBadge from "@/Components/StatusBadge";

const STATUS_COLORS = {
    Filed: "blue",
    "Under Investigation": "yellow",
    "For Mediation": "orange",
    Settled: "green",
    Dismissed: "gray",
    Escalated: "red",
};

const ALL_STATUSES = [
    "Filed",
    "Under Investigation",
    "For Mediation",
    "Settled",
    "Dismissed",
    "Escalated",
];

export default function Show({ blotter }) {
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
        <AuthenticatedLayout header={`Case: ${blotter.case_number}`}>
            <Head title={blotter.case_number} />
            <div className="max-w-4xl mx-auto grid gap-5">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-6 text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-red-200 text-sm uppercase tracking-wide">
                                Case Number
                            </p>
                            <h2 className="text-3xl font-bold font-mono">
                                {blotter.case_number}
                            </h2>
                            <p className="text-red-200 mt-1">
                                {blotter.incident_type}
                            </p>
                        </div>
                        <div className="text-right">
                            <StatusBadge
                                status={blotter.status}
                                colors={STATUS_COLORS}
                            />
                            <p className="text-red-200 text-sm mt-2">
                                Filed:{" "}
                                {new Date(
                                    blotter.created_at,
                                ).toLocaleDateString("en-PH")}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                    {/* Parties */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-700 mb-4">
                            Parties Involved
                        </h3>
                        <div className="space-y-3">
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <p className="text-xs text-blue-500 font-semibold uppercase mb-1">
                                    Complainant
                                </p>
                                <p className="font-medium">
                                    {blotter.complainant?.last_name},{" "}
                                    {blotter.complainant?.first_name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {blotter.complainant?.address}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {blotter.complainant?.contact_number}
                                </p>
                            </div>
                            <div className="p-3 bg-red-50 rounded-lg">
                                <p className="text-xs text-red-500 font-semibold uppercase mb-1">
                                    Respondent
                                </p>
                                <p className="font-medium">
                                    {blotter.respondent_name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {blotter.respondent_address}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Incident Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-700 mb-4">
                            Incident Details
                        </h3>
                        <dl className="space-y-3 text-sm">
                            <Detail
                                label="Type"
                                value={blotter.incident_type}
                            />
                            <Detail
                                label="Date & Time"
                                value={new Date(
                                    blotter.incident_date,
                                ).toLocaleString("en-PH")}
                            />
                            <Detail
                                label="Location"
                                value={blotter.incident_location}
                            />
                            <Detail
                                label="Handled By"
                                value={blotter.handled_by?.name}
                            />
                        </dl>
                    </div>
                </div>

                {/* Narrative */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-semibold text-gray-700 mb-3">
                        Incident Narrative
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {blotter.narrative}
                    </div>
                </div>

                {/* Case Management */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-semibold text-gray-700 mb-4">
                        Case Management
                    </h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="label">Update Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="input"
                            >
                                {ALL_STATUSES.map((s) => (
                                    <option key={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="label">Resolution / Notes</label>
                        <textarea
                            value={resolution}
                            onChange={(e) => setResolution(e.target.value)}
                            className="input"
                            rows={3}
                            placeholder="Enter resolution, mediation notes, or case updates..."
                        />
                    </div>
                    {blotter.resolution && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-lg">
                            <p className="text-xs text-green-600 font-semibold uppercase">
                                Previous Resolution
                            </p>
                            <p className="text-sm text-gray-700 mt-1">
                                {blotter.resolution}
                            </p>
                        </div>
                    )}
                    <button
                        onClick={updateStatus}
                        disabled={saving}
                        className="btn-primary"
                    >
                        {saving ? "Saving..." : "Update Case"}
                    </button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function Detail({ label, value }) {
    return (
        <div className="flex justify-between">
            <dt className="text-gray-400">{label}</dt>
            <dd className="font-medium text-right max-w-[200px]">
                {value || "—"}
            </dd>
        </div>
    );
}
