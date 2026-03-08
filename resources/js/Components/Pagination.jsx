import { Link } from "@inertiajs/react";

export default function Pagination({ links }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="flex justify-center gap-1 mt-6">
            {links.map((link, i) => (
                <Link
                    key={i}
                    href={link.url || "#"}
                    className={`px-3 py-1 rounded text-sm border ${
                        link.active
                            ? "bg-blue-600 text-white border-blue-600"
                            : link.url
                              ? "bg-white hover:bg-gray-50"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );
}
