"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FileUploadCard } from "./file-upload-card";

type FacilityType = "Warehouse" | "Yard";

const initialForm = {
  name: "",
  city: "",
  address: "",
  manager: "",
  phone: "",
  email: "",
  capacity: "",
  docks: "",
  operatingWindow: "24/7",
  notes: "",
};

const locationSignals = [
  {
    label: "Deployment focus",
    value: "Facility readiness",
    detail:
      "Capture the site type, operating window, and dock profile before activation.",
  },
  {
    label: "Typical setup",
    value: "26 mins",
    detail:
      "Well-documented sites are easier to assign into dispatch and storage workflows.",
  },
  {
    label: "Suggested state",
    value: "Ready for routing",
    detail:
      "Lets planners align yard staging and warehouse capacity immediately.",
  },
];

const locationChecklist = [
  "Site type, manager, and direct contact added",
  "Capacity and dock details verified",
  "Operational notes and compliance files attached",
];

const facilityContent: Record<
  FacilityType,
  {
    addTitle: string;
    backHref: string;
    backLabel: string;
    buttonSaving: string;
    buttonSubmit: string;
    description: string;
    docsCountLabel: string;
    docsSaveLabel: string;
    docsTitle: string;
    eyebrow: string;
    stepOneDescription: string;
    stepOneTitle: string;
  }
> = {
  Warehouse: {
    addTitle: "Add warehouse",
    backHref: "/dashboard/warehouses",
    backLabel: "Back to warehouse list",
    buttonSaving: "Saving warehouse...",
    buttonSubmit: "Save warehouse",
    description:
      "Create a new warehouse profile with site, capacity, manager, and operational details so the location can be used by planning and dispatch teams.",
    docsCountLabel: "Documents selected for warehouse onboarding review.",
    docsSaveLabel:
      "The warehouse and selected document names will be saved in MySQL and shown immediately in the warehouse list.",
    docsTitle: "Upload warehouse documents",
    eyebrow: "Warehouse section",
    stepOneDescription:
      "Start with the warehouse name, city, and the person responsible for day-to-day control.",
    stepOneTitle: "Warehouse identity and ownership",
  },
  Yard: {
    addTitle: "Add yard",
    backHref: "/dashboard/yards",
    backLabel: "Back to yard list",
    buttonSaving: "Saving yard...",
    buttonSubmit: "Save yard",
    description:
      "Create a new yard profile with site, capacity, manager, and operational details so the location can be used by planning and dispatch teams.",
    docsCountLabel: "Documents selected for yard onboarding review.",
    docsSaveLabel:
      "The yard and selected document names will be saved in MySQL and shown immediately in the yard list.",
    docsTitle: "Upload yard documents",
    eyebrow: "Yard section",
    stepOneDescription:
      "Start with the yard name, city, and the person responsible for day-to-day control.",
    stepOneTitle: "Yard identity and ownership",
  },
};

export function WarehouseYardForm({
  facilityType,
}: {
  facilityType: FacilityType;
}) {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [siteDocs, setSiteDocs] = useState<File[]>([]);
  const [opsDocs, setOpsDocs] = useState<File[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const content = facilityContent[facilityType];

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
      const endpoint =
        facilityType === "Warehouse" ? "/api/warehouses" : "/api/yards";
      const response = await fetch(endpoint, {
        body: JSON.stringify({
        ...form,
        docks: Number(form.docks) || 0,
        documents: [...siteDocs, ...opsDocs].map((file) => file.name),
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
        throw new Error(
          error?.message ||
            `Failed to save ${facilityType.toLowerCase()}.`,
        );
      }

      router.push(
        facilityType === "Warehouse"
          ? "/dashboard/warehouses?created=1"
          : "/dashboard/yards?created=1",
      );
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : `Failed to save ${facilityType.toLowerCase()}.`,
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
              {content.eyebrow}
            </p>
            <h3 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              {content.addTitle}
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
              {content.description}
            </p>
          </div>

          <Link
            href={content.backHref}
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-line px-5 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent"
          >
            {content.backLabel}
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
                    {content.stepOneTitle}
                  </h4>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
                    {content.stepOneDescription}
                  </p>
                </div>
                <div className="inline-flex rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink shadow-sm">
                  {facilityType} profile
                </div>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">
                    {facilityType} name
                  </span>
                  <input
                    required
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter facility name"
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
                    placeholder="Primary city or zone"
                    className="h-13 rounded-2xl border border-white/70 bg-white px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10"
                  />
                </label>

                <label className="grid gap-2 md:col-span-2">
                  <span className="text-sm font-medium text-ink">Address</span>
                  <input
                    required
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Street, area, city, and landmark"
                    className="h-13 rounded-2xl border border-white/70 bg-white px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">
                    Facility manager
                  </span>
                  <input
                    required
                    name="manager"
                    value={form.manager}
                    onChange={handleChange}
                    placeholder="Manager full name"
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
                    Contact and operating capacity
                  </h4>
                </div>
                <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-muted shadow-sm">
                  Planning ready
                </div>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">Phone</span>
                  <input
                    required
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98xxx xxxxx"
                    className="h-13 rounded-2xl border border-line bg-white px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">Email</span>
                  <input
                    required
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="facility@freightflow.com"
                    className="h-13 rounded-2xl border border-line bg-white px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">Capacity</span>
                  <input
                    required
                    name="capacity"
                    value={form.capacity}
                    onChange={handleChange}
                    placeholder="e.g. 40,000 sq ft or 80 trailer slots"
                    className="h-13 rounded-2xl border border-line bg-white px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">
                    Dock count
                  </span>
                  <input
                    required
                    name="docks"
                    value={form.docks}
                    onChange={handleChange}
                    placeholder="Number of docks or loading points"
                    className="h-13 rounded-2xl border border-line bg-white px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10"
                  />
                </label>

                <label className="grid gap-2 md:col-span-2">
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
              </div>
            </div>

            <div className="rounded-[28px] border border-line bg-panel p-5 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">
                Step 03
              </p>
              <h4 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
                {content.docsTitle}
              </h4>

              <div className="mt-6 grid gap-4">
                <FileUploadCard
                  acceptedLabel="Site pack"
                  description="Upload lease, permit, fire safety, or infrastructure approval files."
                  files={siteDocs}
                  label="Facility identity and permit documents"
                  onFilesChange={setSiteDocs}
                />
                <FileUploadCard
                  acceptedLabel="Ops pack"
                  description="Attach dock plans, SOPs, maintenance records, or storage operation instructions."
                  files={opsDocs}
                  label="Operations and compliance documents"
                  onFilesChange={setOpsDocs}
                />
              </div>
            </div>

            <div className="rounded-[28px] border border-line bg-panel p-5 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">
                Step 04
              </p>
              <h4 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
                Site notes and handoff context
              </h4>

              <label className="mt-6 grid gap-2">
                <span className="text-sm font-medium text-ink">Notes</span>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Add route suitability, storage handling notes, yard staging rules, or special access instructions."
                  className="rounded-3xl border border-line bg-panel-muted px-4 py-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10"
                />
              </label>

              <div className="mt-6 flex flex-col gap-3 rounded-[24px] border border-line bg-[linear-gradient(135deg,rgba(15,108,189,0.08),rgba(255,255,255,0.98))] p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-6 text-muted">
                  {content.docsSaveLabel}
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? content.buttonSaving : content.buttonSubmit}
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
                Facility onboarding pulse
              </h4>
              <div className="mt-6 space-y-4">
                {locationSignals.map((item) => (
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
                {locationChecklist.map((item) => (
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
                {siteDocs.length + opsDocs.length}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                {content.docsCountLabel}
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
