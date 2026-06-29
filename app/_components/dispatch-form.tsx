"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ContainerRecord } from "./container-store";
import {
  type DispatchRecord,
  type DispatchInput,
  type DispatchLoadType,
  type DispatchType,
} from "./dispatch-store";
import type { DriverRecord } from "./driver-store";
import type { WarehouseYardRecord } from "./warehouse-yard-store";

const DISPATCHER_NAME = "Ayesha Khan";

const initialForm = {
  containerNumber: "",
  dispatchType: "Port to Warehouse" as DispatchType,
  driver: "",
  loadType: "Import" as DispatchLoadType,
};

const dispatchSignals = [
  {
    label: "Workflow style",
    value: "Container-first dispatching",
    detail:
      "Pick the container once, then let dispatch inherit customer, lane, and document context automatically.",
  },
  {
    label: "Operator effort",
    value: "4 key inputs",
    detail:
      "The form stays light so the team can activate a dispatch quickly without retyping data that already exists.",
  },
  {
    label: "Pricing next",
    value: "Driver charges after activation",
    detail:
      "Different driver payouts and extra charges can be layered on after the dispatch becomes active.",
  },
];

const dispatchChecklist = [
  "Container selected from the existing container board",
  "Dispatch type and driver assigned for the live move",
  "Container details reviewed before activation",
];

const dispatchTypeOptions: DispatchType[] = [
  "Port to Warehouse",
  "Port to Yard",
  "Yard to Warehouse",
  "Yard to Port",
];

const inputClassName =
  "h-13 rounded-2xl border border-line bg-white px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10";

function normalizeDateTimeInput(value: string, fallbackTime: string) {
  if (!value) {
    return "";
  }

  if (value.includes("T")) {
    return value.slice(0, 16);
  }

  return `${value}T${fallbackTime}`;
}

function getPreferredYardName(
  container: ContainerRecord | null,
  yards: Array<{ name: string }>,
) {
  if (!container) {
    return yards[0]?.name ?? "";
  }

  const pickupText = container.pickupLocation.toLowerCase();
  const matchedYard = yards.find((yard) =>
    pickupText.includes(yard.name.toLowerCase()),
  );

  return matchedYard?.name ?? yards[0]?.name ?? "";
}

function resolveRoute(
  dispatchType: DispatchType,
  container: ContainerRecord | null,
  yards: Array<{ name: string }>,
) {
  const portLocation = container?.port || container?.pickupLocation || "";
  const warehouseLocation = container?.warehouse ?? "";
  const yardLocation = getPreferredYardName(container, yards);

  if (dispatchType === "Port to Yard") {
    return {
      destination: yardLocation,
      origin: portLocation,
    };
  }

  if (dispatchType === "Yard to Warehouse") {
    return {
      destination: warehouseLocation,
      origin: yardLocation,
    };
  }

  if (dispatchType === "Yard to Port") {
    return {
      destination: portLocation,
      origin: yardLocation,
    };
  }

  return {
    destination: warehouseLocation,
    origin: portLocation,
  };
}

function createLoadNumber(
  container: ContainerRecord | null,
  dispatchType: DispatchType,
) {
  const typeCode =
    dispatchType === "Port to Warehouse"
      ? "PW"
      : dispatchType === "Port to Yard"
        ? "PY"
        : dispatchType === "Yard to Warehouse"
          ? "YW"
          : "YP";
  const containerCode =
    container?.containerNumber.replace(/[^A-Z0-9]/gi, "").slice(-6) ?? "NEW";

  return `LOAD-${typeCode}-${containerCode}`;
}

function createRouteTrack(dispatchType: DispatchType) {
  return dispatchType.replaceAll(" to ", " -> ");
}

function createInitialFormValue(initialDispatch?: {
  containerNumber: string;
  dispatchType: DispatchType;
  driver: string;
  loadType: DispatchLoadType;
}) {
  if (!initialDispatch) {
    return initialForm;
  }

  return {
    containerNumber: initialDispatch.containerNumber,
    dispatchType: initialDispatch.dispatchType,
    driver: initialDispatch.driver,
    loadType: initialDispatch.loadType,
  };
}

type DispatchFormProps = {
  containers: ContainerRecord[];
  dispatchId?: string;
  drivers: DriverRecord[];
  initialDispatch?: DispatchRecord;
  yards: WarehouseYardRecord[];
};

type DispatchFormContentProps = {
  containers: ContainerRecord[];
  dispatchId?: string;
  drivers: DriverRecord[];
  initialDispatch?: ReturnType<typeof createInitialFormValue>;
  yards: WarehouseYardRecord[];
};

function DispatchFormContent({
  containers,
  dispatchId,
  drivers,
  initialDispatch,
  yards,
}: DispatchFormContentProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState(() => createInitialFormValue(initialDispatch));
  const [submitError, setSubmitError] = useState<string | null>(null);
  const selectedContainer =
    containers.find((container) => container.containerNumber === form.containerNumber) ??
    null;
  const selectedDriver =
    drivers.find((driver) => driver.name === form.driver) ?? null;
  const routePreview = resolveRoute(form.dispatchType, selectedContainer, yards);
  const linkedAssetsCount = [form.containerNumber, form.driver].filter(Boolean).length;
  const isEditing = Boolean(dispatchId);
  const inheritedDocsCount = selectedContainer?.documents.length ?? 0;
  const ratePreview = selectedContainer?.baseRate || "Pending after activation";
  const destinationLabel =
    form.dispatchType === "Port to Warehouse" ||
    form.dispatchType === "Yard to Warehouse"
      ? "Warehouse endpoint"
      : "Yard/Port endpoint";

  function handleContainerChange(containerNumber: string) {
    const nextContainer =
      containers.find((container) => container.containerNumber === containerNumber) ??
      null;

    setForm((currentForm) => ({
      ...currentForm,
      containerNumber,
      loadType: nextContainer?.loadType ?? currentForm.loadType,
    }));
  }

  function handleDispatchTypeChange(dispatchType: DispatchType) {
    setForm((currentForm) => ({
      ...currentForm,
      dispatchType,
    }));
  }

  function handleDriverChange(driver: string) {
    setForm((currentForm) => ({
      ...currentForm,
      driver,
    }));
  }

  function handleLoadTypeChange(loadType: DispatchLoadType) {
    setForm((currentForm) => ({
      ...currentForm,
      loadType,
    }));
  }

  const payload: DispatchInput | null =
    selectedContainer && selectedDriver
      ? {
          chassisNumber: selectedContainer.chassis,
          containerNumber: selectedContainer.containerNumber,
          currencyType: selectedContainer.currencyType,
          customer: selectedContainer.customer,
          deliveryWindow: normalizeDateTimeInput(
            selectedContainer.lfd || selectedContainer.shipEta,
            "18:00",
          ),
          destination: routePreview.destination,
          dispatchType: form.dispatchType,
          dispatcher: DISPATCHER_NAME,
          documents: selectedContainer.documents,
          driver: selectedDriver.name,
          equipmentType: selectedDriver.vehicleType,
          loadNumber: createLoadNumber(selectedContainer, form.dispatchType),
          loadType: form.loadType,
          notes: selectedContainer.notes,
          origin: routePreview.origin,
          pickupWindow: normalizeDateTimeInput(
            selectedContainer.pickupBookingTime,
            "09:00",
          ),
          priority:
            selectedContainer.waiting && Number(selectedContainer.waiting) >= 60
              ? "Critical"
              : "Standard",
          rate: "",
          routeTrack: createRouteTrack(form.dispatchType),
          status: "Scheduled",
        }
      : null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!payload) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch(
        dispatchId
          ? `/api/dispatches/${encodeURIComponent(dispatchId)}`
          : "/api/dispatches",
        {
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
          method: dispatchId ? "PATCH" : "POST",
        },
      );

      if (!response.ok) {
        const error = (await response.json().catch(() => null)) as
          | { message?: string }
          | null;
        throw new Error(error?.message || "Failed to save dispatch.");
      }

      router.push(
        dispatchId
          ? "/dashboard/dispatch?updated=1"
          : "/dashboard/dispatch?created=1",
      );
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to save dispatch.",
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
              Dispatch section
            </p>
            <h3 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              {isEditing ? "Edit dispatch" : "Create dispatch"}
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
              Start from the existing container record, choose the dispatch move,
              assign a driver, and let the system pull the linked details for the
              live board.
            </p>
          </div>

          <Link
            href="/dashboard/dispatch"
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-line px-5 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent"
          >
            Back to dispatch board
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
                    Create from linked records
                  </h4>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
                    Choose the container, confirm the load type, select the
                    dispatch move, and assign the driver. Everything else is
                    inherited from the records you already created.
                  </p>
                </div>
                <div className="inline-flex rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink shadow-sm">
                  4 input workflow
                </div>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <label className="grid gap-2 md:col-span-2">
                  <span className="text-sm font-medium text-ink">
                    Container number
                  </span>
                  <select
                    required
                    value={form.containerNumber}
                    onChange={(event) => handleContainerChange(event.target.value)}
                    className={inputClassName}
                  >
                    <option value="">Select container</option>
                    {containers.map((container) => (
                      <option key={container.id} value={container.containerNumber}>
                        {container.containerNumber} / {container.customer} /{" "}
                        {container.loadType}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">Load type</span>
                  <select
                    value={form.loadType}
                    onChange={(event) =>
                      handleLoadTypeChange(event.target.value as DispatchLoadType)
                    }
                    className={inputClassName}
                  >
                    <option>Import</option>
                    <option>Export</option>
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">
                    Dispatch type
                  </span>
                  <select
                    value={form.dispatchType}
                    onChange={(event) =>
                      handleDispatchTypeChange(event.target.value as DispatchType)
                    }
                    className={inputClassName}
                  >
                    {dispatchTypeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2 md:col-span-2">
                  <span className="text-sm font-medium text-ink">
                    Select driver
                  </span>
                  <select
                    required
                    value={form.driver}
                    onChange={(event) => handleDriverChange(event.target.value)}
                    className={inputClassName}
                  >
                    <option value="">Select driver</option>
                    {drivers
                      .filter((driver) => driver.status !== "Pending")
                      .map((driver) => (
                        <option key={driver.id} value={driver.name}>
                          {driver.name} / {driver.vehicleType} / {driver.baseLocation}
                        </option>
                      ))}
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
                    Fetched dispatch preview
                  </h4>
                </div>
                <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-muted shadow-sm">
                  Auto-filled from records
                </div>
              </div>

              {selectedContainer ? (
                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                  <article className="rounded-[24px] border border-line bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                      Container details
                    </p>
                    <div className="mt-4 space-y-3 text-sm text-muted">
                      <p>
                        <span className="font-semibold text-ink">Customer:</span>{" "}
                        {selectedContainer.customer}
                      </p>
                      <p>
                        <span className="font-semibold text-ink">Booking:</span>{" "}
                        {selectedContainer.bookingNumber || "Not added"}
                      </p>
                      <p>
                        <span className="font-semibold text-ink">Shipping line:</span>{" "}
                        {selectedContainer.shippingLine || "Not added"}
                      </p>
                      <p>
                        <span className="font-semibold text-ink">Port:</span>{" "}
                        {selectedContainer.port || "Not added"}
                      </p>
                      <p>
                        <span className="font-semibold text-ink">Chassis:</span>{" "}
                        {selectedContainer.chassis || "Not added"}
                      </p>
                    </div>
                  </article>

                  <article className="rounded-[24px] border border-line bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                      Dispatch route
                    </p>
                    <div className="mt-4 space-y-3 text-sm text-muted">
                      <p>
                        <span className="font-semibold text-ink">Track order:</span>{" "}
                        {createRouteTrack(form.dispatchType)}
                      </p>
                      <p>
                        <span className="font-semibold text-ink">Origin:</span>{" "}
                        {routePreview.origin || "Awaiting container route"}
                      </p>
                      <p>
                        <span className="font-semibold text-ink">Pickup point:</span>{" "}
                        {selectedContainer.pickupLocation || "Not added"}
                      </p>
                      <p>
                        <span className="font-semibold text-ink">
                          {destinationLabel}:
                        </span>{" "}
                        {routePreview.destination || "Awaiting route mapping"}
                      </p>
                      <p>
                        <span className="font-semibold text-ink">Pickup slot:</span>{" "}
                        {selectedContainer.pickupBookingTime || "Not scheduled"}
                      </p>
                      <p>
                        <span className="font-semibold text-ink">LFD / ETA:</span>{" "}
                        {selectedContainer.lfd || selectedContainer.shipEta || "Not added"}
                      </p>
                    </div>
                  </article>

                  <article className="rounded-[24px] border border-line bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                      Selected driver
                    </p>
                    <div className="mt-4 space-y-3 text-sm text-muted">
                      <p>
                        <span className="font-semibold text-ink">Driver:</span>{" "}
                        {selectedDriver?.name || "Select driver"}
                      </p>
                      <p>
                        <span className="font-semibold text-ink">Vehicle type:</span>{" "}
                        {selectedDriver?.vehicleType || "Pending"}
                      </p>
                      <p>
                        <span className="font-semibold text-ink">Base location:</span>{" "}
                        {selectedDriver?.baseLocation || "Pending"}
                      </p>
                      <p>
                        <span className="font-semibold text-ink">Contact:</span>{" "}
                        {selectedDriver?.phone || "Pending"}
                      </p>
                    </div>
                  </article>

                  <article className="rounded-[24px] border border-line bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                      Pricing handoff
                    </p>
                    <div className="mt-4 space-y-3 text-sm text-muted">
                      <p>
                        <span className="font-semibold text-ink">
                          Current container rate:
                        </span>{" "}
                        {selectedContainer.currencyType} {ratePreview}
                      </p>
                      <p>
                        <span className="font-semibold text-ink">
                          Driver payout:
                        </span>{" "}
                        To be added after dispatch activation
                      </p>
                      <p>
                        <span className="font-semibold text-ink">
                          Future dynamic charges:
                        </span>{" "}
                        Waiting, detention, escort, toll, or custom lines
                      </p>
                      <p>
                        <span className="font-semibold text-ink">
                          Linked documents:
                        </span>{" "}
                        {selectedContainer.documents.length} file(s)
                      </p>
                    </div>
                  </article>
                </div>
              ) : (
                <div className="mt-6 rounded-[24px] border border-dashed border-line bg-white/70 px-5 py-8 text-sm text-muted">
                  Select a container first. The customer, pickup, destination,
                  chassis, and linked document context will appear here.
                </div>
              )}
            </div>

            <div className="rounded-[28px] border border-line bg-panel p-5 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-6">
              <div className="flex flex-col gap-3 rounded-[24px] border border-line bg-[linear-gradient(135deg,rgba(15,108,189,0.08),rgba(255,255,255,0.98))] p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-6 text-muted">
                  This step creates the active dispatch only. Driver-specific
                  pricing and extra charge lines will be added in the next phase
                  after the dispatch is active.
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting || !payload}
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting
                    ? isEditing
                      ? "Updating dispatch..."
                      : "Creating dispatch..."
                    : isEditing
                      ? "Update Dispatch"
                      : "Create Dispatch"}
                </button>
              </div>
            </div>
          </form>

          <aside className="space-y-5">
            <div className="rounded-[28px] border border-slate-900/0 bg-slate-950 p-5 text-white shadow-[0_24px_70px_rgba(15,23,42,0.14)]">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-200/70">
                Dispatch design
              </p>
              <h4 className="mt-3 text-2xl font-semibold tracking-tight">
                Fast activation flow
              </h4>
              <div className="mt-6 space-y-4">
                {dispatchSignals.map((item) => (
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
                {dispatchChecklist.map((item) => (
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
                Linked assets
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">
                {linkedAssetsCount}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Connected records selected for this dispatch activation.
              </p>
            </div>

            <div className="rounded-[28px] border border-line bg-panel p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                Inherited docs
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">
                {inheritedDocsCount}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Documents already linked from the selected container record.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

export function DispatchForm({
  containers,
  dispatchId,
  drivers,
  initialDispatch,
  yards,
}: DispatchFormProps) {
  if (dispatchId && !initialDispatch) {
    return (
      <main className="space-y-6 p-5 md:p-7">
        <section className="rounded-[30px] border border-line bg-panel p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            Dispatch section
          </p>
          <h3 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
            Dispatch not found
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
            This dispatch could not be found in the MySQL records.
          </p>
          <Link
            href="/dashboard/dispatch"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-2xl border border-line px-5 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent"
          >
            Back to dispatch board
          </Link>
        </section>
      </main>
    );
  }

  return (
    <DispatchFormContent
      containers={containers}
      dispatchId={dispatchId}
      drivers={drivers}
      initialDispatch={
        initialDispatch
          ? createInitialFormValue({
              containerNumber: initialDispatch.containerNumber,
              dispatchType: initialDispatch.dispatchType,
              driver: initialDispatch.driver,
              loadType: initialDispatch.loadType,
            })
          : undefined
      }
      yards={yards}
    />
  );
}
