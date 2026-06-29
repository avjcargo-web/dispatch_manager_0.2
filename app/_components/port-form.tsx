"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FileUploadCard } from "./file-upload-card";

const initialForm = {
  name: "",
  code: "",
  country: "",
  city: "",
  terminalType: "Container Port",
  authority: "",
  contactEmail: "",
  contactPhone: "",
  operatingWindow: "24/7",
  capacity: "",
  notes: "",
};

const portSignals = [
  {
    label: "Deployment focus",
    value: "Port readiness",
    detail:
      "Capture authority, operating window, and terminal profile before route planning.",
  },
  {
    label: "Average setup",
    value: "19 mins",
    detail:
      "Complete port profiles move faster into container and shipment coordination.",
  },
  {
    label: "Suggested state",
    value: "Ready for routing",
    detail:
      "Helps teams link ports to customer, container, and dispatch movements immediately.",
  },
];

const portChecklist = [
  "Port code, city, and country captured",
  "Authority and contact details verified",
  "Operating notes and compliance files attached",
];

export function PortForm() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authorityDocs, setAuthorityDocs] = useState<File[]>([]);
  const [operationsDocs, setOperationsDocs] = useState<File[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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
      const response = await fetch("/api/ports", {
        body: JSON.stringify({
        ...form,
        documents: [...authorityDocs, ...operationsDocs].map((file) => file.name),
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
        throw new Error(error?.message || "Failed to save port.");
      }

      router.push("/dashboard/ports?created=1");
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to save port.",
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
              Port section
            </p>
            <h3 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              Add port
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
              Create a new port profile with authority, terminal, and capacity
              details so the location can be used by maritime operations teams.
            </p>
          </div>

          <Link
            href="/dashboard/ports"
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-line px-5 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent"
          >
            Back to port list
          </Link>
        </div>

        {submitError ? (
          <div className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-500/12 px-4 py-3 text-sm text-rose-200">
            {submitError}
          </div>
        ) : null}

        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_360px]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-[28px] border border-line bg-[linear-gradient(135deg,rgba(15,108,189,0.08),rgba(255,255,255,0.95)_45%,rgba(245,158,11,0.08))] p-5 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">
                    Step 01
                  </p>
                  <h4 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
                    Port identity and geography
                  </h4>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
                    Start with the port name, official code, country, city, and
                    terminal classification.
                  </p>
                </div>
                <div className="inline-flex rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink shadow-sm">
                  Port profile
                </div>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">Port name</span>
                  <input
                    required
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter port name"
                    className="h-13 rounded-2xl border border-white/70 bg-white px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">Port code</span>
                  <input
                    required
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    placeholder="e.g. INNSA"
                    className="h-13 rounded-2xl border border-white/70 bg-white px-4 text-sm uppercase text-ink outline-none transition placeholder:normal-case placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">Country</span>
                  <input
                    required
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    placeholder="Country name"
                    className="h-13 rounded-2xl border border-white/70 bg-white px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">City</span>
                  <input
                    required
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Port city"
                    className="h-13 rounded-2xl border border-white/70 bg-white px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10"
                  />
                </label>

                <label className="grid gap-2 md:col-span-2">
                  <span className="text-sm font-medium text-ink">
                    Terminal type
                  </span>
                  <select
                    name="terminalType"
                    value={form.terminalType}
                    onChange={handleChange}
                    className="h-13 rounded-2xl border border-white/70 bg-white px-4 text-sm text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10"
                  >
                    <option>Container Port</option>
                    <option>Mixed Cargo Port</option>
                    <option>Bulk and Container</option>
                    <option>Oil and Liquid Terminal</option>
                    <option>Feeder Port</option>
                  </select>
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
                    Authority and operating capacity
                  </h4>
                </div>
                <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-muted shadow-sm">
                  Maritime ready
                </div>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">
                    Port authority
                  </span>
                  <input
                    required
                    name="authority"
                    value={form.authority}
                    onChange={handleChange}
                    placeholder="Authority or controlling body"
                    className="h-13 rounded-2xl border border-line bg-white px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">
                    Contact email
                  </span>
                  <input
                    required
                    type="email"
                    name="contactEmail"
                    value={form.contactEmail}
                    onChange={handleChange}
                    placeholder="ops@port.com"
                    className="h-13 rounded-2xl border border-line bg-white px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">
                    Contact phone
                  </span>
                  <input
                    required
                    name="contactPhone"
                    value={form.contactPhone}
                    onChange={handleChange}
                    placeholder="+91 22 0000 0000"
                    className="h-13 rounded-2xl border border-line bg-white px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">
                    Operating window
                  </span>
                  <input
                    required
                    name="operatingWindow"
                    value={form.operatingWindow}
                    onChange={handleChange}
                    placeholder="24/7 or 06:00 - 22:00"
                    className="h-13 rounded-2xl border border-line bg-white px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10"
                  />
                </label>

                <label className="grid gap-2 md:col-span-2">
                  <span className="text-sm font-medium text-ink">Capacity</span>
                  <input
                    required
                    name="capacity"
                    value={form.capacity}
                    onChange={handleChange}
                    placeholder="e.g. 5.5M TEU annually"
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
                Upload port documents
              </h4>

              <div className="mt-6 grid gap-4">
                <FileUploadCard
                  acceptedLabel="Authority pack"
                  description="Upload permits, access guidelines, authority circulars, or regulatory documents."
                  files={authorityDocs}
                  label="Authority and regulatory documents"
                  onFilesChange={setAuthorityDocs}
                />
                <FileUploadCard
                  acceptedLabel="Operations pack"
                  description="Attach berth schedules, terminal SOPs, movement notices, or operating procedures."
                  files={operationsDocs}
                  label="Operations and terminal documents"
                  onFilesChange={setOperationsDocs}
                />
              </div>
            </div>

            <div className="rounded-[28px] border border-line bg-panel p-5 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">
                Step 04
              </p>
              <h4 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
                Port notes and handoff context
              </h4>

              <label className="mt-6 grid gap-2">
                <span className="text-sm font-medium text-ink">Notes</span>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Add berth notes, congestion concerns, customer handling instructions, or gate process details."
                  className="rounded-3xl border border-line bg-panel-muted px-4 py-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10"
                />
              </label>

              <div className="mt-6 flex flex-col gap-3 rounded-[24px] border border-line bg-[linear-gradient(135deg,rgba(15,108,189,0.08),rgba(255,255,255,0.98))] p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-6 text-muted">
                  The port and selected document names will be saved in MySQL
                  and shown immediately in the port list.
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Saving port..." : "Save port"}
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
                Port onboarding pulse
              </h4>
              <div className="mt-6 space-y-4">
                {portSignals.map((item) => (
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
                {portChecklist.map((item) => (
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
                {authorityDocs.length + operationsDocs.length}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Documents selected for port onboarding review.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
