import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";

const NAV_LINKS = [
    { href: "/dashboard", label: "Dashboard", icon: "🏠" },
    { href: "/residents", label: "Residents", icon: "👥" },
    { href: "/documents", label: "Document Requests", icon: "📄" },
    { href: "/blotter", label: "Blotter Reports", icon: "⚖️" },
];

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const currentPath = window.location.pathname;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside
                className={`${sidebarOpen ? "w-56" : "w-16"} bg-blue-900 text-white flex flex-col transition-all duration-200 shrink-0`}
            >
                {/* Logo */}
                <div className="p-4 border-b border-blue-800 flex items-center gap-3">
                    <span className="text-2xl">🏛️</span>
                    {sidebarOpen && (
                        <div>
                            <p className="font-bold text-sm leading-tight">
                                Barangay
                            </p>
                            <p className="text-blue-300 text-xs">
                                Management System
                            </p>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4">
                    {NAV_LINKS.map((link) => {
                        const active =
                            currentPath.startsWith(link.href) &&
                            (link.href !== "/" || currentPath === "/");
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors
                  ${
                      active
                          ? "bg-blue-700 text-white border-r-4 border-blue-300"
                          : "text-blue-200 hover:bg-blue-800 hover:text-white"
                  }`}
                            >
                                <span className="text-lg">{link.icon}</span>
                                {sidebarOpen && <span>{link.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Info + Logout */}
                <div className="p-4 border-t border-blue-800">
                    {sidebarOpen && (
                        <div className="mb-2">
                            <p className="text-sm font-medium truncate">
                                {auth?.user?.name}
                            </p>
                            <p className="text-blue-400 text-xs truncate">
                                {auth?.user?.email}
                            </p>
                        </div>
                    )}
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="text-blue-300 hover:text-white text-xs flex items-center gap-1"
                    >
                        <span>🚪</span>
                        {sidebarOpen && "Logout"}
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="text-gray-500 hover:text-gray-700 text-xl"
                        >
                            ☰
                        </button>
                        <h1 className="text-lg font-semibold text-gray-800">
                            {header}
                        </h1>
                    </div>
                    <div className="text-sm text-gray-400">
                        {new Date().toLocaleDateString("en-PH", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </div>
                </header>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="mx-6 mt-4 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
                        ✅ {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
                        ❌ {flash.error}
                    </div>
                )}

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
        </div>
    );
}
