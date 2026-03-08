import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Pagination from "@/Components/Pagination";

export default function Index({ residents, filters, stats }) {
    const [search, setSearch] = useState(filters.search || "");

    const handleSearch = (e) => {
        e.preventDefault();
        router.get("/residents", { search }, { preserveState: true });
    };

    const handleFilter = (key, value) => {
        router.get(
            "/residents",
            { ...filters, [key]: value },
            { preserveState: true },
        );
    };

    return (
        <AuthenticatedLayout header="Resident Records">
            <Head title="Residents" />

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                    {
                        label: "Total Residents",
                        value: stats.total,
                        color: "blue",
                    },
                    {
                        label: "Registered Voters",
                        value: stats.voters,
                        color: "green",
                    },
                    {
                        label: "Senior Citizens",
                        value: stats.senior,
                        color: "yellow",
                    },
                    { label: "PWD", value: stats.pwd, color: "purple" },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-white rounded-lg shadow p-4"
                    >
                        <p className="text-sm text-gray-500">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-800">
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Search & Filters */}
            <div className="bg-white rounded-lg shadow p-4 mb-4">
                <form onSubmit={handleSearch} className="flex gap-2 flex-wrap">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name, address..."
                        className="flex-1 border rounded-lg px-4 py-2 min-w-[200px]"
                    />
                    <select
                        onChange={(e) => handleFilter("purok", e.target.value)}
                        defaultValue={filters.purok || ""}
                        className="border rounded-lg px-3 py-2"
                    >
                        <option value="">All Puroks</option>
                        {["1", "2", "3", "4", "5", "6", "7"].map((p) => (
                            <option key={p} value={`Purok ${p}`}>
                                Purok {p}
                            </option>
                        ))}
                    </select>
                    <select
                        onChange={(e) => handleFilter("gender", e.target.value)}
                        defaultValue={filters.gender || ""}
                        className="border rounded-lg px-3 py-2"
                    >
                        <option value="">All Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Search
                    </button>
                    <Link
                        href="/residents/create"
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                    >
                        + Add Resident
                    </Link>
                </form>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3 text-left">Name</th>
                            <th className="px-4 py-3 text-left">Purok</th>
                            <th className="px-4 py-3 text-left">Gender</th>
                            <th className="px-4 py-3 text-left">Contact</th>
                            <th className="px-4 py-3 text-left">Tags</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {residents.data.map((resident) => (
                            <tr key={resident.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium">
                                    {resident.last_name}, {resident.first_name}
                                    {resident.middle_name &&
                                        ` ${resident.middle_name[0]}.`}
                                </td>
                                <td className="px-4 py-3 text-gray-500">
                                    {resident.purok}
                                </td>
                                <td className="px-4 py-3">{resident.gender}</td>
                                <td className="px-4 py-3 text-gray-500">
                                    {resident.contact_number}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-1 flex-wrap">
                                        {resident.is_voter && (
                                            <Badge color="green">Voter</Badge>
                                        )}
                                        {resident.is_senior_citizen && (
                                            <Badge color="yellow">Senior</Badge>
                                        )}
                                        {resident.is_pwd && (
                                            <Badge color="purple">PWD</Badge>
                                        )}
                                        {resident.is_4ps && (
                                            <Badge color="blue">4Ps</Badge>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/residents/${resident.id}`}
                                            className="text-blue-600 hover:underline text-xs"
                                        >
                                            View
                                        </Link>
                                        <Link
                                            href={`/residents/${resident.id}/edit`}
                                            className="text-green-600 hover:underline text-xs"
                                        >
                                            Edit
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {residents.data.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No residents found.
                    </div>
                )}
            </div>

            {/* Pagination */}
            <Pagination links={residents.links} />
        </AuthenticatedLayout>
    );
}

// Small badge component
function Badge({ children, color }) {
    const colors = {
        green: "bg-green-100 text-green-700",
        yellow: "bg-yellow-100 text-yellow-700",
        purple: "bg-purple-100 text-purple-700",
        blue: "bg-blue-100 text-blue-700",
    };
    return (
        <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[color]}`}
        >
            {children}
        </span>
    );
}
