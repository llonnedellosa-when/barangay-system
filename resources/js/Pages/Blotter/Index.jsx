import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Pagination from "@/Components/Pagination";
import StatusBadge from "@/Components/StatusBadge";

const STATUS_COLORS = {
    Filed: "blue",
    "Under Investigation": "yellow",
    "For Mediation": "orange",
    Settled: "green",
    Dismissed: "gray",
    Escalated: "red",
};

export default function Index({ blotters, filters }) {
    const [search, setSearch] = useState(filters.search || "");

    const handleSearch = (e) => {
        e.preventDefault();
        router.get("/blotter", { ...filters, search }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout header="Blotter Reports">
            <Head title="Blotter" />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-5">
                <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by case no., respondent, complainant..."
                        className="input flex-1 min-w-[250px]"
                    />
                    <select
                        onChange={(e) =>
                            router.get(
                                "/blotter",
                                { ...filters, status: e.target.value },
                                { preserveState: true },
                            )
                        }
                        defaultValue={filters.status || ""}
                        className="input w-52"
                    >
                        <option value="">All Status</option>
                        {Object.keys(STATUS_COLORS).map((s) => (
                            <option key={s}>{s}</option>
                        ))}
                    </select>
                    <button type="submit" className="btn-primary">
                        Search
                    </button>
                    <Link href="/blotter/create" className="btn-danger">
                        + File Blotter
                    </Link>
                </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                        <tr>
                            <th className="px-5 py-3 text-left">Case No.</th>
                            <th className="px-5 py-3 text-left">Complainant</th>
                            <th className="px-5 py-3 text-left">Respondent</th>
                            <th className="px-5 py-3 text-left">
                                Incident Type
                            </th>
                            <th className="px-5 py-3 text-left">Date</th>
                            <th className="px-5 py-3 text-left">Status</th>
                            <th className="px-5 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {blotters.data.map((blotter) => (
                            <tr
                                key={blotter.id}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-5 py-3 font-mono text-xs font-bold text-red-700">
                                    {blotter.case_number}
                                </td>
                                <td className="px-5 py-3 font-medium">
                                    {blotter.complainant?.last_name},{" "}
                                    {blotter.complainant?.first_name}
                                </td>
                                <td className="px-5 py-3 text-gray-600">
                                    {blotter.respondent_name}
                                </td>
                                <td className="px-5 py-3">
                                    <span className="bg-red-50 text-red-700 text-xs px-2 py-0.5 rounded-full">
                                        {blotter.incident_type}
                                    </span>
                                </td>
                                <td className="px-5 py-3 text-gray-500">
                                    {new Date(
                                        blotter.incident_date,
                                    ).toLocaleDateString("en-PH")}
                                </td>
                                <td className="px-5 py-3">
                                    <StatusBadge
                                        status={blotter.status}
                                        colors={STATUS_COLORS}
                                    />
                                </td>
                                <td className="px-5 py-3">
                                    <Link
                                        href={`/blotter/${blotter.id}`}
                                        className="text-blue-600 hover:underline text-xs"
                                    >
                                        View Case
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {blotters.data.length === 0 && (
                    <div className="text-center py-16 text-gray-400">
                        No blotter records found.
                    </div>
                )}
            </div>
            <Pagination links={blotters.links} />
        </AuthenticatedLayout>
    );
}
