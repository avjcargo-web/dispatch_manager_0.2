"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FileUploadCard } from "./file-upload-card";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  baseLocation: "",
  licenseNumber: "",
  vehicleType: "Heavy Trailer",
  experience: "",
  emergencyContact: "",
  notes: "",
};

const driverSignals = [
  {
    label: "Dispatch priority",
    value: "Readiness review",
    detail: "Capture license, base, and vehicle fit before active assignment.",
  },
  {
    label: "Average activation",
    value: "22 mins",
    detail: "Profiles with complete compliance notes move faster to operations.",
  },
  {
    label: "Suggested status",
    value: "Fleet-ready intake",
    detail: "Helps planners decide route pairing right after onboarding.",
  },
];

const driverChecklist = [
  "Verified license and emergency contact",
  "Vehicle type and base hub matched",
  "Experience and route notes captured",
];

export function DriverForm() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [licenseDocs, setLicenseDocs] = useState<File[]>([]);
  const [complianceDocs, setComplianceDocs] = useState<File[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/drivers", {
        body: JSON.stringify({
        ...form,
        documents: [...licenseDocs, ...complianceDocs].map((file) => file.name),
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) {
        const error = (await response.json().catch(() => null)) as
          | { message?: string }
          | null;
        throw new Error(error?.message || "Failed to save driver.");
      }

      router.push("/dashboard/drivers?created=1");
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to save driver.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="space-y-6 p-5 md:p-7">
      <section className="rounded-[30px] border border-line bg-panel p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              Driver section
            </p>
            <h3 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              Add driver
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
              Create a new driver profile with contact, licensing, and
              assignment details so dispatch can onboard the driver quickly.
            </p>
          </div>

          <Link
            href="/dashboard/drivers"
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-line px-5 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent"
          >
            Back to driver list
          </Link>
        </div>

        {submitError ? (
          <div className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-500/12 px-4 py-3 text-sm text-rose-200">
            {submitError}
          </div>
        ) : null}

        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_360px]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-[28px] border border-line bg-[linear-gradient(135deg,rgba(15,108,189,0.08),rgba(255,255,255,0.95)_45%,rgba(16,185,129,0.08))] p-5 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">
                    Step 01
                  </p>
                  <h4 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
                    Driver identity and reachability
                  </h4>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
                    Start with the driver profile, direct contact details, and
                    base location so dispatch knows where this driver belongs.
                  </p>
                </div>
                <div className="inline-flex rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink shadow-sm">
                  Driver profile
                </div>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">
                    Driver name
                  </span>
                  <input
                    required
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter full driver name"
                    className="h-13 rounded-2xl border border-white/70 bg-white px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">
                    Email address
                  </span>
                  <input
                    required
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="driver@freightflow.com"
                    className="h-13 rounded-2xl border border-white/70 bg-white px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">
                    Phone number
                  </span>
                  <input
                    required
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98xxx xxxxx"
                    className="h-13 rounded-2xl border border-white/70 bg-white px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">
                    Base location
                  </span>
                  <input
                    required
                    name="baseLocation"
                    value={form.baseLocation}
                    onChange={handleChange}
                    placeholder="Primary yard or hub"
                    className="h-13 rounded-2xl border border-white/70 bg-white px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10"
                  />
                </label>
              </div>
            </div>

            <div className="rounded-[28px] border border-line bg-panel-muted p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">
                    Step 02
                  </p>
                  <h4 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
                    Compliance and assignment fit
                  </h4>
                </div>
                <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-muted shadow-sm">
                  Fleet aligned
                </div>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">
                    License number
                  </span>
                  <input
                    required
                    name="licenseNumber"
                    value={form.licenseNumber}
                    onChange={handleChange}
                    placeholder="Enter transport license number"
                    className="h-13 rounded-2xl border border-line bg-white px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">
                    Vehicle type
                  </span>
                  <select
                    name="vehicleType"
                    value={form.vehicleType}
                    onChange={handleChange}
                    className="h-13 rounded-2xl border border-line bg-white px-4 text-sm text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10"
                  >
                    <option>Heavy Trailer</option>
                    <option>Container Truck</option>
                    <option>Reefer Truck</option>
                    <option>Light Commercial Vehicle</option>
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">
                    Experience
                  </span>
                  <input
                    required
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    placeholder="e.g. 5 years"
                    className="h-13 rounded-2xl border border-line bg-white px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">
                    Emergency contact
                  </span>
                  <input
                    required
                    name="emergencyContact"
                    value={form.emergencyContact}
                    onChange={handleChange}
                    placeholder="+91 98xxx xxxxx"
                    className="h-13 rounded-2xl border border-line bg-white px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10"
                  />
                </label>
              </div>
            </div>

            <div className="rounded-[28px] border border-line bg-panel p-5 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">
                Step 03
              </p>
              <h4 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
                Upload compliance documents
              </h4>

              <div className="mt-6 grid gap-4">
                <FileUploadCard
                  acceptedLabel="License pack"
                  description="Upload driving license scans, ID proof, or transport endorsement records."
                  files={licenseDocs}
                  label="License and identification files"
                  onFilesChange={setLicenseDocs}
                />
                <FileUploadCard
                  acceptedLabel="Compliance pack"
                  description="Attach medical certificates, training records, or fleet clearance documents."
                  files={complianceDocs}
                  label="Compliance and safety documents"
                  onFilesChange={setComplianceDocs}
                />
              </div>
            </div>

            <div className="rounded-[28px] border border-line bg-panel p-5 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">
                Step 04
              </p>
              <h4 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
                Route notes and dispatch context
              </h4>

              <label className="mt-6 grid gap-2">
                <span className="text-sm font-medium text-ink">Notes</span>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Add route familiarity, vehicle preferences, compliance notes, or scheduling considerations."
                  className="rounded-3xl border border-line bg-panel-muted px-4 py-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10"
                />
              </label>

              <div className="mt-6 flex flex-col gap-3 rounded-[24px] border border-line bg-[linear-gradient(135deg,rgba(16,185,129,0.08),rgba(255,255,255,0.98))] p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-6 text-muted">
                  The driver and selected document names will be saved in MySQL
                  and shown immediately in the driver list.
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Saving driver..." : "Save driver"}
                </button>
              </div>
            </div>
          </form>

          <aside className="space-y-5">
            <div className="rounded-[28px] border border-slate-900/0 bg-slate-950 p-5 text-white shadow-[0_24px_70px_rgba(15,23,42,0.14)]">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-200/70">
                Readiness panel
              </p>
              <h4 className="mt-3 text-2xl font-semibold tracking-tight">
                Driver onboarding pulse
              </h4>
              <div className="mt-6 space-y-4">
                {driverSignals.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[22px] border border-white/10 bg-white/7 p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                      {item.label}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {item.value}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-line bg-panel-muted p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                Quality checklist
              </p>
              <div className="mt-4 space-y-3">
                {driverChecklist.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3 text-sm text-ink shadow-sm"
                  >
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-accent" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-line bg-panel p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                Files prepared
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">
                {licenseDocs.length + complianceDocs.length}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Documents selected for driver onboarding review.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
