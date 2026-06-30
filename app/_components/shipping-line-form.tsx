"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createFilesFromNames } from "./file-upload-utils";
import { FileUploadCard } from "./file-upload-card";
import type { ShippingLineRecord, ShippingLineStatus } from "./shipping-line-store";

const initialForm = {
  city: "",
  contactEmail: "",
  contactPhone: "",
  country: "",
  name: "",
  notes: "",
  scac: "",
  serviceMode: "Ocean Freight",
  status: "Active" as ShippingLineStatus,
  website: "",
};

const shippingLineSignals = [
  {
    detail:
      "Capture carrier identity, SCAC, and contact coverage before linking the line into container planning.",
    label: "Deployment focus",
    value: "Carrier readiness",
  },
  {
    detail:
      "A complete line master reduces retyping across container, dispatch, and customer workflows.",
    label: "Operational gain",
    value: "Shared carrier data",
  },
  {
    detail:
      "Preferred lines can be surfaced first when the team is creating new container records.",
    label: "Suggested usage",
    value: "Master record first",
  },
];

const shippingLineChecklist = [
  "Carrier name, SCAC, and service mode captured",
  "Operations contact and geography verified",
  "Notes and reference files attached",
];

function createInitialFormValue(
  initialShippingLine?: Pick<
    ShippingLineRecord,
    | "city"
    | "contactEmail"
    | "contactPhone"
    | "country"
    | "name"
    | "notes"
    | "scac"
    | "serviceMode"
    | "status"
    | "website"
  >,
) {
  if (!initialShippingLine) {
    return initialForm;
  }

  return {
    city: initialShippingLine.city,
    contactEmail: initialShippingLine.contactEmail,
    contactPhone: initialShippingLine.contactPhone,
    country: initialShippingLine.country,
    name: initialShippingLine.name,
    notes: initialShippingLine.notes,
    scac: initialShippingLine.scac,
    serviceMode: initialShippingLine.serviceMode,
    status: initialShippingLine.status,
    website: initialShippingLine.website,
  };
}

type ShippingLineFormProps = {
  initialShippingLine?: ShippingLineRecord;
  shippingLineId?: string;
};

export function ShippingLineForm({
  initialShippingLine,
  shippingLineId,
}: ShippingLineFormProps) {
  const router = useRouter();
  const [form, setForm] = useState(() =>
    createInitialFormValue(initialShippingLine),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileDocs, setProfileDocs] = useState<File[]>(() =>
    createFilesFromNames(initialShippingLine?.documents ?? []),
  );
  const [opsDocs, setOpsDocs] = useState<File[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isEditing = Boolean(shippingLineId);

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
      const response = await fetch(
        shippingLineId
          ? `/api/shipping-lines/${encodeURIComponent(shippingLineId)}`
          : "/api/shipping-lines",
        {
          body: JSON.stringify({
            ...form,
            documents: [...profileDocs, ...opsDocs].map((file) => file.name),
          }),
          headers: {
            "Content-Type": "application/json",
          },
          method: shippingLineId ? "PATCH" : "POST",
        },
      );

      if (!response.ok) {
        const error = (await response.json().catch(() => null)) as
          | { message?: string }
          | null;
        throw new Error(error?.message || "Failed to save shipping line.");
      }

      router.push(
        shippingLineId
          ? "/dashboard/shipping-lines?updated=1"
          : "/dashboard/shipping-lines?created=1",
      );
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to save shipping line.",
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
              Shipping line section
            </p>
            <h3 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              {isEditing ? "Edit shipping line" : "Add shipping line"}
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
              {isEditing
                ? "Update the carrier master profile, contact information, and supporting documents without losing the existing master record."
                : "Create a carrier master profile with SCAC, service coverage, and contact details so container teams can reuse it consistently."}
            </p>
          </div>

          <Link
            href="/dashboard/shipping-lines"
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-line px-5 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent"
          >
            Back to shipping line list
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
                    Carrier identity and geography
                  </h4>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
                    Start with the shipping line name, SCAC, and the operating geography your team uses for planning.
                  </p>
                </div>
                <div className="inline-flex rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink shadow-sm">
                  Carrier master
                </div>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">Shipping line name</span>
                  <input
                    required
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Carrier or shipping line name"
                    className="h-13 rounded-2xl border border-white/70 bg-white px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">SCAC</span>
                  <input
                    required
                    name="scac"
                    value={form.scac}
                    onChange={handleChange}
                    placeholder="e.g. MSCU"
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
                    placeholder="Primary city or office hub"
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
                    Service and contact coverage
                  </h4>
                </div>
                <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-muted shadow-sm">
                  Planning ready
                </div>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">Service mode</span>
                  <select
                    name="serviceMode"
                    value={form.serviceMode}
                    onChange={handleChange}
                    className="h-13 rounded-2xl border border-line bg-white px-4 text-sm text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10"
                  >
                    <option>Ocean Freight</option>
                    <option>Container Line</option>
                    <option>Feeder Service</option>
                    <option>Multimodal Carrier</option>
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">Status</span>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="h-13 rounded-2xl border border-line bg-white px-4 text-sm text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10"
                  >
                    <option>Active</option>
                    <option>Preferred</option>
                    <option>Suspended</option>
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">Contact email</span>
                  <input
                    required
                    type="email"
                    name="contactEmail"
                    value={form.contactEmail}
                    onChange={handleChange}
                    placeholder="ops@carrier.com"
                    className="h-13 rounded-2xl border border-line bg-white px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">Contact phone</span>
                  <input
                    required
                    name="contactPhone"
                    value={form.contactPhone}
                    onChange={handleChange}
                    placeholder="+91 22 0000 0000"
                    className="h-13 rounded-2xl border border-line bg-white px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10"
                  />
                </label>

                <label className="grid gap-2 md:col-span-2">
                  <span className="text-sm font-medium text-ink">Website</span>
                  <input
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                    placeholder="https://carrier.example"
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
                Upload reference documents
              </h4>

              <div className="mt-6 grid gap-4">
                <FileUploadCard
                  acceptedLabel="Carrier pack"
                  description="Upload carrier agreements, routing guides, or commercial reference files."
                  files={profileDocs}
                  label="Carrier profile documents"
                  onFilesChange={setProfileDocs}
                />
                <FileUploadCard
                  acceptedLabel="Ops pack"
                  description="Attach operational instructions, cut-off notices, or escalation contacts."
                  files={opsDocs}
                  label="Operations and planning documents"
                  onFilesChange={setOpsDocs}
                />
              </div>
            </div>

            <div className="rounded-[28px] border border-line bg-panel p-5 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">
                Step 04
              </p>
              <h4 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
                Carrier notes and handoff context
              </h4>

              <label className="mt-6 grid gap-2">
                <span className="text-sm font-medium text-ink">Notes</span>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Add routing notes, escalation guidance, or planning context for this shipping line."
                  className="rounded-3xl border border-line bg-panel-muted px-4 py-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10"
                />
              </label>

              <div className="mt-6 flex flex-col gap-3 rounded-[24px] border border-line bg-[linear-gradient(135deg,rgba(15,108,189,0.08),rgba(255,255,255,0.98))] p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-6 text-muted">
                  {isEditing
                    ? "The shipping line master record and selected document names will update the saved MySQL record and refresh immediately in the list."
                    : "The shipping line master record and selected document names will be saved in MySQL and shown immediately in the list."}
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting
                    ? isEditing
                      ? "Updating shipping line..."
                      : "Saving shipping line..."
                    : isEditing
                      ? "Update shipping line"
                      : "Save shipping line"}
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
                Shipping line onboarding pulse
              </h4>
              <div className="mt-6 space-y-4">
                {shippingLineSignals.map((item) => (
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
                {shippingLineChecklist.map((item) => (
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
                {profileDocs.length + opsDocs.length}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Documents selected for this shipping line master record.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
