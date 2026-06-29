"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { addChassis } from "./chassis-store";
import { FileUploadCard } from "./file-upload-card";

const initialForm = {
  chassisNumber: "",
  type: "Tri-axle",
  sizeCompatibility: "40 ft / 45 ft",
  owner: "",
  currentLocation: "",
  assignedContainer: "",
  condition: "",
  lastInspection: "",
  notes: "",
};

const chassisSignals = [
  {
    label: "Deployment focus",
    value: "Road readiness",
    detail:
      "Capture chassis compatibility, location, and inspection state before assigning it to movement.",
  },
  {
    label: "Average setup",
    value: "15 mins",
    detail:
      "Complete chassis profiles move faster into dispatch, yard, and container planning.",
  },
  {
    label: "Suggested state",
    value: "Ready for allocation",
    detail:
      "Helps teams link chassis to container and transport movements immediately after save.",
  },
];

const chassisChecklist = [
  "Chassis number, type, and compatibility captured",
  "Owner and current site confirmed",
  "Inspection notes and files attached",
];

export function ChassisForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState(initialForm);
  const [inspectionDocs, setInspectionDocs] = useState<File[]>([]);
  const [movementDocs, setMovementDocs] = useState<File[]>([]);

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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(() => {
      addChassis({
        ...form,
        documents: [...inspectionDocs, ...movementDocs].map((file) => file.name),
      });
      router.push("/dashboard/chassis?created=1");
    });
  }

  return (
    <main className="space-y-6 p-5 md:p-7">
      <section className="rounded-[30px] border border-line bg-panel p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              Chassis section
            </p>
            <h3 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              Add chassis
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
              Create a new chassis profile with compatibility, inspection, and
              movement details so the asset can be assigned into operations.
            </p>
          </div>

          <Link
            href="/dashboard/chassis"
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-line px-5 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent"
          >
            Back to chassis list
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
                    Chassis identity and compatibility
                  </h4>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
                    Start with the chassis number, unit type, size compatibility,
                    and current operating location.
                  </p>
                </div>
                <div className="inline-flex rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink shadow-sm">
                  Chassis profile
                </div>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">
                    Chassis number
                  </span>
                  <input
                    required
                    name="chassisNumber"
                    value={form.chassisNumber}
                    onChange={handleChange}
                    placeholder="e.g. CH-MUM-2218"
                    className="h-13 rounded-2xl border border-white/70 bg-white px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">
                    Chassis type
                  </span>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="h-13 rounded-2xl border border-white/70 bg-white px-4 text-sm text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10"
                  >
                    <option>Tri-axle</option>
                    <option>Tandem axle</option>
                    <option>Slider chassis</option>
                    <option>Gooseneck chassis</option>
                    <option>Extendable chassis</option>
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">
                    Size compatibility
                  </span>
                  <select
                    name="sizeCompatibility"
                    value={form.sizeCompatibility}
                    onChange={handleChange}
                    className="h-13 rounded-2xl border border-white/70 bg-white px-4 text-sm text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10"
                  >
                    <option>20 ft</option>
                    <option>20 ft / 40 ft</option>
                    <option>40 ft / 45 ft</option>
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">
                    Current location
                  </span>
                  <input
                    required
                    name="currentLocation"
                    value={form.currentLocation}
                    onChange={handleChange}
                    placeholder="Yard, warehouse, or port location"
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
                    Ownership and inspection readiness
                  </h4>
                </div>
                <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-muted shadow-sm">
                  Dispatch ready
                </div>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">Owner</span>
                  <input
                    required
                    name="owner"
                    value={form.owner}
                    onChange={handleChange}
                    placeholder="Fleet owner or leasing company"
                    className="h-13 rounded-2xl border border-line bg-white px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">
                    Assigned container
                  </span>
                  <input
                    required
                    name="assignedContainer"
                    value={form.assignedContainer}
                    onChange={handleChange}
                    placeholder="Container number or Unassigned"
                    className="h-13 rounded-2xl border border-line bg-white px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">Condition</span>
                  <input
                    required
                    name="condition"
                    value={form.condition}
                    onChange={handleChange}
                    placeholder="Road readiness or repair state"
                    className="h-13 rounded-2xl border border-line bg-white px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">
                    Last inspection date
                  </span>
                  <input
                    required
                    type="date"
                    name="lastInspection"
                    value={form.lastInspection}
                    onChange={handleChange}
                    className="h-13 rounded-2xl border border-line bg-white px-4 text-sm text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10"
                  />
                </label>
              </div>
            </div>

            <div className="rounded-[28px] border border-line bg-panel p-5 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">
                Step 03
              </p>
              <h4 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
                Upload chassis documents
              </h4>

              <div className="mt-6 grid gap-4">
                <FileUploadCard
                  acceptedLabel="Inspection pack"
                  description="Upload inspection sheets, fitness certificates, repair notes, or condition photos."
                  files={inspectionDocs}
                  label="Inspection and condition documents"
                  onFilesChange={setInspectionDocs}
                />
                <FileUploadCard
                  acceptedLabel="Movement pack"
                  description="Attach dispatch releases, assignment approvals, movement slips, or operating instructions."
                  files={movementDocs}
                  label="Movement and assignment documents"
                  onFilesChange={setMovementDocs}
                />
              </div>
            </div>

            <div className="rounded-[28px] border border-line bg-panel p-5 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">
                Step 04
              </p>
              <h4 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
                Handling notes and handoff context
              </h4>

              <label className="mt-6 grid gap-2">
                <span className="text-sm font-medium text-ink">Notes</span>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Add road restrictions, yard notes, allocation context, or maintenance handling instructions."
                  className="rounded-3xl border border-line bg-panel-muted px-4 py-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10"
                />
              </label>

              <div className="mt-6 flex flex-col gap-3 rounded-[24px] border border-line bg-[linear-gradient(135deg,rgba(15,108,189,0.08),rgba(255,255,255,0.98))] p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-6 text-muted">
                  The chassis and selected document names will be saved in this
                  demo portal and shown immediately in the chassis flow.
                </p>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isPending ? "Saving chassis..." : "Save chassis"}
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
                Chassis onboarding pulse
              </h4>
              <div className="mt-6 space-y-4">
                {chassisSignals.map((item) => (
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
                {chassisChecklist.map((item) => (
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
                {inspectionDocs.length + movementDocs.length}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Documents selected for chassis onboarding review.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
