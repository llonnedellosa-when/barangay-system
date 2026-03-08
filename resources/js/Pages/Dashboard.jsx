import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Dashboard({ stats, recentRequests, recentBlotters }) {
    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />

            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-800 rounded-xl p-6 mb-6 text-white">
                <h2 className="text-xl font-bold">
                    Barangay Management System
                </h2>
                <p className="text-blue-200 text-sm mt-1">
                    {new Date().toLocaleDateString("en-PH", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <StatCard
                    label="Total Residents"
                    value={stats.total_residents}
                    icon="👥"
                    color="blue"
                    href="/residents"
                />
                <StatCard
                    label="Registered Voters"
                    value={stats.voters}
                    icon="🗳️"
                    color="green"
                    href="/residents"
                />
                <StatCard
                    label="Pending Requests"
                    value={stats.pending_documents}
                    icon="📄"
                    color="yellow"
                    href="/documents?status=Pending"
                />
                <StatCard
                    label="Active Cases"
                    value={stats.active_blotters}
                    icon="⚖️"
                    color="red"
                    href="/blotter"
                />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    label="Senior Citizens"
                    value={stats.seniors}
                    icon="🧓"
                    color="orange"
                    href="/residents"
                />
                <StatCard
                    label="PWD Residents"
                    value={stats.pwd}
                    icon="♿"
                    color="purple"
                    href="/residents"
                />
                <StatCard
                    label="4Ps Beneficiaries"
                    value={stats.fourps}
                    icon="🏠"
                    color="teal"
                    href="/residents"
                />
                <StatCard
                    label="Released Today"
                    value={stats.released_today}
                    icon="✅"
                    color="green"
                    href="/documents?status=Released"
                />
            </div>

            <div className="grid grid-cols-2 gap-5">
                {/* Recent Document Requests */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-700">
                            Recent Document Requests
                        </h3>
                        <Link
                            href="/documents"
                            className="text-blue-600 text-xs hover:underline"
                        >
                            View all →
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {recentRequests.map((req) => (
                            <div
                                key={req.id}
                                className="px-5 py-3 flex justify-between items-center"
                            >
                                <div>
                                    <p className="text-sm font-medium">
                                        {req.resident?.last_name},{" "}
                                        {req.resident?.first_name}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {req.document_type}
                                    </p>
                                </div>
                                <StatusPill status={req.status} />
                            </div>
                        ))}
                        {recentRequests.length === 0 && (
                            <p className="px-5 py-8 text-center text-gray-400 text-sm">
                                No recent requests
                            </p>
                        )}
                    </div>
                </div>

                {/* Recent Blotter Cases */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-700">
                            Recent Blotter Cases
                        </h3>
                        <Link
                            href="/blotter"
                            className="text-blue-600 text-xs hover:underline"
                        >
                            View all →
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {recentBlotters.map((b) => (
                            <div
                                key={b.id}
                                className="px-5 py-3 flex justify-between items-center"
                            >
                                <div>
                                    <p className="text-sm font-mono font-semibold text-red-700">
                                        {b.case_number}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {b.incident_type}
                                    </p>
                                </div>
                                <StatusPill status={b.status} />
                            </div>
                        ))}
                        {recentBlotters.length === 0 && (
                            <p className="px-5 py-8 text-center text-gray-400 text-sm">
                                No recent blotters
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-5 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-700 mb-3">
                    Quick Actions
                </h3>
                <div className="flex flex-wrap gap-3">
                    <Link href="/residents/create" className="btn-primary">
                        + Add Resident
                    </Link>
                    <Link href="/documents/create" className="btn-success">
                        + Document Request
                    </Link>
                    <Link href="/blotter/create" className="btn-danger">
                        + File Blotter
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function StatCard({ label, value, icon, color, href }) {
    const colors = {
        blue: "bg-blue-50 text-blue-700 border-blue-100",
        green: "bg-green-50 text-green-700 border-green-100",
        yellow: "bg-yellow-50 text-yellow-700 border-yellow-100",
        red: "bg-red-50 text-red-700 border-red-100",
        orange: "bg-orange-50 text-orange-700 border-orange-100",
        purple: "bg-purple-50 text-purple-700 border-purple-100",
        teal: "bg-teal-50 text-teal-700 border-teal-100",
    };
    return (
        <Link
            href={href}
            className={`rounded-xl border p-4 flex items-center gap-3 hover:shadow-md transition-shadow ${colors[color]}`}
        >
            <span className="text-2xl">{icon}</span>
            <div>
                <p className="text-xs opacity-70">{label}</p>
                <p className="text-2xl font-bold">{value ?? 0}</p>
            </div>
        </Link>
    );
}

function StatusPill({ status }) {
    const colors = {
        Pending: "bg-yellow-100 text-yellow-700",
        Processing: "bg-blue-100 text-blue-700",
        Approved: "bg-indigo-100 text-indigo-700",
        Released: "bg-green-100 text-green-700",
        Rejected: "bg-red-100 text-red-700",
        Filed: "bg-blue-100 text-blue-700",
        "Under Investigation": "bg-yellow-100 text-yellow-700",
        "For Mediation": "bg-orange-100 text-orange-700",
        Settled: "bg-green-100 text-green-700",
        Dismissed: "bg-gray-100 text-gray-600",
        Escalated: "bg-red-100 text-red-700",
    };
    return (
        <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[status] || "bg-gray-100 text-gray-600"}`}
        >
            {status}
        </span>
    );
}
