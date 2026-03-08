import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        first_name: "",
        middle_name: "",
        last_name: "",
        suffix: "",
        birthdate: "",
        gender: "",
        civil_status: "",
        contact_number: "",
        email: "",
        purok: "",
        address: "",
        occupation: "",
        is_voter: false,
        is_senior_citizen: false,
        is_pwd: false,
        is_4ps: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/residents");
    };

    return (
        <AuthenticatedLayout header="Add New Resident">
            <Head title="Add Resident" />

            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Info */}
                    <Section title="Personal Information">
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="First Name" error={errors.first_name}>
                                <input
                                    value={data.first_name}
                                    onChange={(e) =>
                                        setData("first_name", e.target.value)
                                    }
                                    className="input"
                                    required
                                />
                            </Field>
                            <Field label="Last Name" error={errors.last_name}>
                                <input
                                    value={data.last_name}
                                    onChange={(e) =>
                                        setData("last_name", e.target.value)
                                    }
                                    className="input"
                                    required
                                />
                            </Field>
                            <Field
                                label="Middle Name"
                                error={errors.middle_name}
                            >
                                <input
                                    value={data.middle_name}
                                    onChange={(e) =>
                                        setData("middle_name", e.target.value)
                                    }
                                    className="input"
                                />
                            </Field>
                            <Field
                                label="Suffix (Jr., Sr., III)"
                                error={errors.suffix}
                            >
                                <input
                                    value={data.suffix}
                                    onChange={(e) =>
                                        setData("suffix", e.target.value)
                                    }
                                    className="input"
                                />
                            </Field>
                            <Field label="Birthdate" error={errors.birthdate}>
                                <input
                                    type="date"
                                    value={data.birthdate}
                                    onChange={(e) =>
                                        setData("birthdate", e.target.value)
                                    }
                                    className="input"
                                    required
                                />
                            </Field>
                            <Field label="Gender" error={errors.gender}>
                                <select
                                    value={data.gender}
                                    onChange={(e) =>
                                        setData("gender", e.target.value)
                                    }
                                    className="input"
                                    required
                                >
                                    <option value="">Select...</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                </select>
                            </Field>
                            <Field
                                label="Civil Status"
                                error={errors.civil_status}
                            >
                                <select
                                    value={data.civil_status}
                                    onChange={(e) =>
                                        setData("civil_status", e.target.value)
                                    }
                                    className="input"
                                    required
                                >
                                    <option value="">Select...</option>
                                    <option>Single</option>
                                    <option>Married</option>
                                    <option>Widowed</option>
                                    <option>Separated</option>
                                </select>
                            </Field>
                            <Field label="Occupation" error={errors.occupation}>
                                <input
                                    value={data.occupation}
                                    onChange={(e) =>
                                        setData("occupation", e.target.value)
                                    }
                                    className="input"
                                />
                            </Field>
                        </div>
                    </Section>

                    {/* Contact */}
                    <Section title="Contact & Address">
                        <div className="grid grid-cols-2 gap-4">
                            <Field
                                label="Contact Number"
                                error={errors.contact_number}
                            >
                                <input
                                    value={data.contact_number}
                                    onChange={(e) =>
                                        setData(
                                            "contact_number",
                                            e.target.value,
                                        )
                                    }
                                    className="input"
                                />
                            </Field>
                            <Field label="Email Address" error={errors.email}>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    className="input"
                                />
                            </Field>
                            <Field label="Purok" error={errors.purok}>
                                <select
                                    value={data.purok}
                                    onChange={(e) =>
                                        setData("purok", e.target.value)
                                    }
                                    className="input"
                                >
                                    <option value="">Select Purok...</option>
                                    {["1", "2", "3", "4", "5", "6", "7"].map(
                                        (p) => (
                                            <option
                                                key={p}
                                                value={`Purok ${p}`}
                                            >
                                                Purok {p}
                                            </option>
                                        ),
                                    )}
                                </select>
                            </Field>
                        </div>
                        <Field label="Complete Address" error={errors.address}>
                            <textarea
                                value={data.address}
                                onChange={(e) =>
                                    setData("address", e.target.value)
                                }
                                className="input"
                                rows={2}
                                required
                            />
                        </Field>
                    </Section>

                    {/* Classification */}
                    <Section title="Classification">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { key: "is_voter", label: "Registered Voter" },
                                {
                                    key: "is_senior_citizen",
                                    label: "Senior Citizen",
                                },
                                {
                                    key: "is_pwd",
                                    label: "Person with Disability",
                                },
                                { key: "is_4ps", label: "4Ps Beneficiary" },
                            ].map(({ key, label }) => (
                                <label
                                    key={key}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={data[key]}
                                        onChange={(e) =>
                                            setData(key, e.target.checked)
                                        }
                                        className="w-4 h-4 rounded"
                                    />
                                    <span className="text-sm">{label}</span>
                                </label>
                            ))}
                        </div>
                    </Section>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing ? "Saving..." : "Save Resident"}
                        </button>
                        <a
                            href="/residents"
                            className="border px-8 py-2 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </a>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}

// Reusable form section
function Section({ title, children }) {
    return (
        <div>
            <h3 className="font-semibold text-gray-700 border-b pb-2 mb-4">
                {title}
            </h3>
            {children}
        </div>
    );
}

// Reusable form field with error
function Field({ label, error, children }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            {children}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}
