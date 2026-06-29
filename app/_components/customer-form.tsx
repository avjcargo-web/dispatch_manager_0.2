"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { addCustomer } from "./customer-store";
import { FileUploadCard } from "./file-upload-card";

const initialForm = {
  name: "",
  company: "",
  email: "",
  phone: "",
  city: "",
  billingTerms: "Net 30",
  industry: "",
  notes: "",
};

const customerSignals = [
  {
    label: "Onboarding focus",
    value: "Commercial setup",
    detail: "Capture billing, lane, and handling expectations before activation.",
  },
  {
    label: "Average approval",
    value: "18 mins",
    detail: "Well-completed profiles move faster into dispatch planning.",
  },
  {
    label: "Suggested status",
    value: "Ready for review",
    detail: "Ops and finance can validate the account immediately after save.",
  },
];

const customerChecklist = [
  "Primary contact and company details",
  "Billing terms aligned with finance",
  "Operational notes for dispatch teams",
];

export function CustomerForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState(initialForm);
  const [profileDocs, setProfileDocs] = useState<File[]>([]);
  const [commercialDocs, setCommercialDocs] = useState<File[]>([]);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(() => {
      addCustomer({
        ...form,
        documents: [...profileDocs, ...commercialDocs].map((file) => file.name),
      });
      router.push("/dashboard/customers?created=1");
    });
  }

  return (
    <main className="space-y-6 p-5 md:p-7">
      <section className="rounded-[30px] border border-line bg-panel p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              Customer section
            </p>
            <h3 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              Add customer
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
              Create a new customer profile with commercial, contact, and lane
              planning details so the team can start working with the account.
            </p>
          </div>

          <Link
            href="/dashboard/customers"
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-line px-5 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent"
          >
            Back to customer list
          </Link>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_360px]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-[28px] border border-line bg-[linear-gradient(135deg,rgba(15,108,189,0.08),rgba(255,255,255,0.95)_45%,rgba(245,158,11,0.08))] p-5 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">
                    Step 01
                  </p>
                  <h4 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
                    Identity and commercial details
                  </h4>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
                    Start with the customer contact, company identity, billing
                    setup, and the market segment this account belongs to.
                  </p>
                </div>
                <div className="inline-flex rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink shadow-sm">
                  Customer profile
                </div>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">
                    Customer name
                  </span>
                  <input
                    required
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter customer full name"
                    className="h-13 rounded-2xl border border-white/70 bg-white px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">
                    Company name
                  </span>
                  <input
                    required
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Enter company name"
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
                    placeholder="name@company.com"
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
              </div>
            </div>

            <div className="rounded-[28px] border border-line bg-panel-muted p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">
                    Step 02
                  </p>
                  <h4 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
                    Operations alignment
                  </h4>
                </div>
                <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-muted shadow-sm">
                  Dispatch ready
                </div>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">City</span>
                  <input
                    required
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Primary city or hub"
                    className="h-13 rounded-2xl border border-line bg-white px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">
                    Billing terms
                  </span>
                  <select
                    name="billingTerms"
                    value={form.billingTerms}
                    onChange={handleChange}
                    className="h-13 rounded-2xl border border-line bg-white px-4 text-sm text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10"
                  >
                    <option>Net 30</option>
                    <option>Net 21</option>
                    <option>Net 15</option>
                    <option>Advance</option>
                  </select>
                </label>

                <label className="grid gap-2 md:col-span-2">
                  <span className="text-sm font-medium text-ink">Industry</span>
                  <input
                    required
                    name="industry"
                    value={form.industry}
                    onChange={handleChange}
                    placeholder="Retail, Cold Chain, Manufacturing, Pharma..."
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
                Upload account documents
              </h4>

              <div className="mt-6 grid gap-4">
                <FileUploadCard
                  acceptedLabel="KYC pack"
                  description="Upload GST certificate, registration paperwork, or onboarding KYC documents."
                  files={profileDocs}
                  label="Identity and registration files"
                  onFilesChange={setProfileDocs}
                />
                <FileUploadCard
                  acceptedLabel="Commercial pack"
                  description="Attach agreements, pricing sheets, SLAs, or service instructions for internal review."
                  files={commercialDocs}
                  label="Commercial and service documents"
                  onFilesChange={setCommercialDocs}
                />
              </div>
            </div>

            <div className="rounded-[28px] border border-line bg-panel p-5 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">
                Step 04
              </p>
              <h4 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
                Service notes and handoff context
              </h4>

              <label className="mt-6 grid gap-2">
                <span className="text-sm font-medium text-ink">Notes</span>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Add lane preferences, handling notes, billing instructions, or service expectations."
                  className="rounded-3xl border border-line bg-panel-muted px-4 py-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10"
                />
              </label>

              <div className="mt-6 flex flex-col gap-3 rounded-[24px] border border-line bg-[linear-gradient(135deg,rgba(15,108,189,0.08),rgba(255,255,255,0.98))] p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-6 text-muted">
                  The customer and selected document names will be saved in
                  this demo portal and shown immediately in the customer flow.
                </p>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isPending ? "Saving customer..." : "Save customer"}
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
                Customer onboarding pulse
              </h4>
              <div className="mt-6 space-y-4">
                {customerSignals.map((item) => (
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
                {customerChecklist.map((item) => (
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
                {profileDocs.length + commercialDocs.length}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Documents selected for customer onboarding review.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
