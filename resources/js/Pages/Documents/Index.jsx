import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Pagination from "@/Components/Pagination";
import StatusBadge from "@/Components/StatusBadge";

const DOCUMENT_TYPES = [
    "Barangay Clearance",
    "Certificate of Indigency",
    "Certificate of Residency",
    "Business Clearance",
    "Certificate of Good Moral Character",
];

const STATUS_COLORS = {
    Pending: "yellow",
    Processing: "blue",
    Approved: "indigo",
    Released: "green",
    Rejected: "red",
};

export default function Index({ requests, filters }) {
    const [search, setSearch] = useState(filters.search || "");

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            "/documents",
            { ...filters, search },
            { preserveState: true },
        );
    };

    return (
        <AuthenticatedLayout header="Document Requests">
            <Head title="Document Requests" />

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-5">
                <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by resident name..."
                        className="input flex-1 min-w-[200px]"
                    />
                    <select
                        onChange={(e) =>
                            router.get(
                                "/documents",
                                { ...filters, status: e.target.value },
                                { preserveState: true },
                            )
                        }
                        defaultValue={filters.status || ""}
                        className="input w-44"
                    >
                        <option value="">All Status</option>
                        {Object.keys(STATUS_COLORS).map((s) => (
                            <option key={s}>{s}</option>
                        ))}
                    </select>
                    <select
                        onChange={(e) =>
                            router.get(
                                "/documents",
                                { ...filters, type: e.target.value },
                                { preserveState: true },
                            )
                        }
                        defaultValue={filters.type || ""}
                        className="input w-56"
                    >
                        <option value="">All Document Types</option>
                        {DOCUMENT_TYPES.map((t) => (
                            <option key={t}>{t}</option>
                        ))}
                    </select>
                    <button type="submit" className="btn-primary">
                        Search
                    </button>
                    <Link href="/documents/create" className="btn-success">
                        + New Request
                    </Link>
                </form>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                        <tr>
                            <th className="px-5 py-3 text-left">Request No.</th>
                            <th className="px-5 py-3 text-left">Resident</th>
                            <th className="px-5 py-3 text-left">
                                Document Type
                            </th>
                            <th className="px-5 py-3 text-left">Purpose</th>
                            <th className="px-5 py-3 text-left">Status</th>
                            <th className="px-5 py-3 text-left">Date Filed</th>
                            <th className="px-5 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {requests.data.map((req) => (
                            <tr
                                key={req.id}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-5 py-3 font-mono text-xs font-semibold text-blue-700">
                                    {req.request_number}
                                </td>
                                <td className="px-5 py-3 font-medium">
                                    {req.resident?.last_name},{" "}
                                    {req.resident?.first_name}
                                </td>
                                <td className="px-5 py-3 text-gray-600">
                                    {req.document_type}
                                </td>
                                <td className="px-5 py-3 text-gray-500 max-w-[150px] truncate">
                                    {req.purpose}
                                </td>
                                <td className="px-5 py-3">
                                    <StatusBadge
                                        status={req.status}
                                        colors={STATUS_COLORS}
                                    />
                                </td>
                                <td className="px-5 py-3 text-gray-500">
                                    {new Date(
                                        req.created_at,
                                    ).toLocaleDateString("en-PH")}
                                </td>
                                <td className="px-5 py-3">
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/documents/${req.id}`}
                                            className="text-blue-600 hover:underline text-xs"
                                        >
                                            Manage
                                        </Link>
                                        {(req.status === "Approved" ||
                                            req.status === "Released") && (
                                            <a
                                                href={`/documents/${req.id}/print`}
                                                target="_blank"
                                                className="text-green-600 hover:underline text-xs"
                                            >
                                                Print
                                            </a>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {requests.data.length === 0 && (
                    <div className="text-center py-16 text-gray-400">
                        No document requests found.
                    </div>
                )}
            </div>
            <Pagination links={requests.links} />
        </AuthenticatedLayout>
    );
}
