import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { usePage } from "@inertiajs/react";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx"),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: "#4B5563",
    },
});

export default function SomeComponent() {
    const { auth } = usePage().props;

    // Helper functions
    const can = (permission) => auth.permissions.includes(permission);
    const hasRole = (role) => auth.roles.includes(role);

    return (
        <div>
            {can("create residents") && (
                <Link href="/residents/create" className="btn-primary">
                    + Add Resident
                </Link>
            )}
            {can("create blotter") && (
                <Link href="/blotter/create" className="btn-danger">
                    + File Blotter
                </Link>
            )}
            {hasRole("Admin") && <Link href="/admin/users">Manage Users</Link>}
        </div>
    );
}
