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
  type DispatchTypeValue,
} from "./dispatch-store";
import type { DriverRecord } from "./driver-store";
import type { WarehouseYardRecord } from "./warehouse-yard-store";

const DISPATCHER_NAME = "Ayesha Khan";

const initialForm = {
  containerNumber: "",
  dispatchType: "" as DispatchTypeValue,
  driver: "",
  loadType: "Import" as DispatchLoadType,
};

const dispatchSignals = [
  {
    label: "Handoff style",
    value: "Driver-safe dispatching",
    detail:
      "Only operational details needed for pickup and delivery are carried into dispatch for the driver handoff.",
  },
  {
    label: "Operator effort",
    value: "2 required inputs",
    detail:
      "Container number and load type are enough to create the dispatch first, then driver and dispatch type can be assigned later.",
  },
  {
    label: "Privacy guard",
    value: "Reduced field sharing",
    detail:
      "Commercial notes, customer context, and extra documents stay out of the driver-facing dispatch details.",
  },
];

const dispatchChecklist = [
  "Container selected from the existing container board",
  "Load type confirmed before activation",
  "Pickup and delivery instructions reviewed for the driver handoff",
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

function getWarehouseDestination(container: ContainerRecord | null) {
  if (!container) {
    return "";
  }

  return [container.warehouse, container.warehouseAddress].filter(Boolean).join(", ");
}

function resolveDispatchDestination(
  dispatchType: DispatchTypeValue,
  container: ContainerRecord | null,
  yards: Array<{ name: string }>,
) {
  const portLocation = container?.port || container?.pickupLocation || "";
  const warehouseLocation = getWarehouseDestination(container);
  const yardLocation = getPreferredYardName(container, yards);

  if (!dispatchType) {
    return warehouseLocation;
  }

  if (dispatchType === "Port to Yard") {
    return yardLocation;
  }

  if (dispatchType === "Yard to Port") {
    return portLocation;
  }

  return warehouseLocation;
}

function createLoadNumber(
  container: ContainerRecord | null,
  dispatchType: DispatchTypeValue,
) {
  const typeCode =
    dispatchType === "Port to Warehouse"
      ? "PW"
      : dispatchType === "Port to Yard"
        ? "PY"
        : dispatchType === "Yard to Warehouse"
          ? "YW"
          : dispatchType === "Yard to Port"
            ? "YP"
            : "GEN";
  const containerCode =
    container?.containerNumber.replace(/[^A-Z0-9]/gi, "").slice(-6) ?? "NEW";

  return `LOAD-${typeCode}-${containerCode}`;
}

function createRouteTrack(dispatchType: DispatchTypeValue) {
  return dispatchType ? dispatchType.replaceAll(" to ", " -> ") : "";
}

function createInitialFormValue(initialDispatch?: {
  containerNumber: string;
  dispatchType: DispatchTypeValue;
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
  const deliveryLocationPreview = resolveDispatchDestination(
    form.dispatchType,
    selectedContainer,
    yards,
  );
  const linkedAssetsCount = [
    form.containerNumber,
    form.dispatchType,
    form.driver,
  ].filter(Boolean).length;
  const isEditing = Boolean(dispatchId);
  const driverBriefCount = selectedContainer
    ? [
        selectedContainer.containerNumber,
        selectedContainer.deliveryType,
        selectedContainer.pickupLocation,
        selectedContainer.pickupBookingTime,
        selectedContainer.gateCode,
        selectedContainer.pin,
        deliveryLocationPreview,
        selectedContainer.deliveryBookingTime,
        selectedContainer.size,
        selectedContainer.shippingLine,
        selectedContainer.sealNumber,
        selectedContainer.checkedInNumber,
        selectedContainer.scac,
      ].filter(Boolean).length
    : 0;

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

  function handleDispatchTypeChange(dispatchType: DispatchTypeValue) {
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

  const payload: DispatchInput | null = selectedContainer
    ? {
          chassisNumber: selectedContainer.chassis,
          checkedInNumber: selectedContainer.checkedInNumber,
          containerNumber: selectedContainer.containerNumber,
          currencyType: "",
          customer: "",
          deliveryType: selectedContainer.deliveryType,
          deliveryWindow: normalizeDateTimeInput(
            selectedContainer.deliveryBookingTime ||
              selectedContainer.lfd ||
              selectedContainer.shipEta,
            "18:00",
          ),
          destination: deliveryLocationPreview,
          dispatchType: form.dispatchType,
          dispatcher: DISPATCHER_NAME,
          documents: [],
          driver: selectedDriver?.name ?? form.driver,
          equipmentType: selectedDriver?.vehicleType ?? "",
          gateCode: selectedContainer.gateCode,
          loadNumber: createLoadNumber(selectedContainer, form.dispatchType),
          loadType: form.loadType,
          notes: "",
          origin: selectedContainer.pickupLocation,
          pin: selectedContainer.pin,
          pickupWindow: normalizeDateTimeInput(
            selectedContainer.pickupBookingTime,
            "09:00",
          ),
          priority: "Standard",
          rate: "",
          routeTrack: createRouteTrack(form.dispatchType),
          scac: selectedContainer.scac,
          sealNumber: selectedContainer.sealNumber,
          shippingLine: selectedContainer.shippingLine,
          size: selectedContainer.size,
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
              Start from the existing container record and generate a driver-safe
              dispatch handoff with pickup, delivery, and container instructions
              only.
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
                    Create from linked container
                  </h4>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
                    Choose the container and confirm the load type. Dispatch type
                    and driver can be assigned now or updated later without
                    re-entering the driver-safe operational details.
                  </p>
                </div>
                <div className="inline-flex rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink shadow-sm">
                  Create now, assign later
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
                      handleDispatchTypeChange(
                        event.target.value as DispatchTypeValue,
                      )
                    }
                    className={inputClassName}
                  >
                    <option value="">Assign later</option>
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
                  Driver-safe fields only
                </div>
              </div>

              {selectedContainer ? (
                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                  <article className="rounded-[24px] border border-line bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                      Container snapshot
                    </p>
                    <div className="mt-4 space-y-3 text-sm text-muted">
                      <p>
                        <span className="font-semibold text-ink">Container:</span>{" "}
                        {selectedContainer.containerNumber || "Not added"}
                      </p>
                      <p>
                        <span className="font-semibold text-ink">Load type:</span>{" "}
                        {form.loadType}
                      </p>
                      <p>
                        <span className="font-semibold text-ink">
                          Delivery type:
                        </span>{" "}
                        {selectedContainer.deliveryType || "Not added"}
                      </p>
                      <p>
                        <span className="font-semibold text-ink">Size:</span>{" "}
                        {selectedContainer.size || "Not added"}
                      </p>
                      <p>
                        <span className="font-semibold text-ink">
                          Shipping line:
                        </span>{" "}
                        {selectedContainer.shippingLine || "Not added"}
                      </p>
                      <p>
                        <span className="font-semibold text-ink">SCAC:</span>{" "}
                        {selectedContainer.scac || "Not added"}
                      </p>
                    </div>
                  </article>

                  <article className="rounded-[24px] border border-line bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                      Pickup instructions
                    </p>
                    <div className="mt-4 space-y-3 text-sm text-muted">
                      <p>
                        <span className="font-semibold text-ink">
                          Pick up location:
                        </span>{" "}
                        {selectedContainer.pickupLocation || "Not added"}
                      </p>
                      <p>
                        <span className="font-semibold text-ink">Pick up time:</span>{" "}
                        {selectedContainer.pickupBookingTime || "Not scheduled"}
                      </p>
                      <p>
                        <span className="font-semibold text-ink">Gate code:</span>{" "}
                        {selectedContainer.gateCode || "Not added"}
                      </p>
                      <p>
                        <span className="font-semibold text-ink">PIN:</span>{" "}
                        {selectedContainer.pin || "Not added"}
                      </p>
                      <p>
                        <span className="font-semibold text-ink">
                          Checked in ID:
                        </span>{" "}
                        {selectedContainer.checkedInNumber || "Not added"}
                      </p>
                    </div>
                  </article>

                  <article className="rounded-[24px] border border-line bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                      Delivery instructions
                    </p>
                    <div className="mt-4 space-y-3 text-sm text-muted">
                      <p>
                        <span className="font-semibold text-ink">
                          Dispatch type:
                        </span>{" "}
                        {form.dispatchType || "Assign later"}
                      </p>
                      <p>
                        <span className="font-semibold text-ink">
                          Delivery location:
                        </span>{" "}
                        {deliveryLocationPreview || "Not added"}
                      </p>
                      <p>
                        <span className="font-semibold text-ink">
                          Delivery time:
                        </span>{" "}
                        {selectedContainer.deliveryBookingTime ||
                          selectedContainer.lfd ||
                          selectedContainer.shipEta ||
                          "Not scheduled"}
                      </p>
                      <p>
                        <span className="font-semibold text-ink">Seal:</span>{" "}
                        {selectedContainer.sealNumber || "Not added"}
                      </p>
                    </div>
                  </article>

                  <article className="rounded-[24px] border border-line bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                      Driver assignment
                    </p>
                    <div className="mt-4 space-y-3 text-sm text-muted">
                      <p>
                        <span className="font-semibold text-ink">Driver:</span>{" "}
                        {selectedDriver?.name || "Assign later"}
                      </p>
                      <p>
                        <span className="font-semibold text-ink">
                          Vehicle type:
                        </span>{" "}
                        {selectedDriver?.vehicleType || "Pending"}
                      </p>
                      <p>
                        <span className="font-semibold text-ink">
                          Base location:
                        </span>{" "}
                        {selectedDriver?.baseLocation || "Pending"}
                      </p>
                      <p>
                        <span className="font-semibold text-ink">
                          Route track:
                        </span>{" "}
                        {createRouteTrack(form.dispatchType) || "Assign later"}
                      </p>
                    </div>
                  </article>
                </div>
              ) : (
                <div className="mt-6 rounded-[24px] border border-dashed border-line bg-white/70 px-5 py-8 text-sm text-muted">
                  Select a container first. The pickup, delivery, gate, seal,
                  and container handoff details will appear here.
                </div>
              )}
            </div>

            <div className="rounded-[28px] border border-line bg-panel p-5 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-6">
              <div className="flex flex-col gap-3 rounded-[24px] border border-line bg-[linear-gradient(135deg,rgba(15,108,189,0.08),rgba(255,255,255,0.98))] p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-6 text-muted">
                  This step creates the dispatch using the reduced operational
                  handoff only. Dispatch type and driver can stay empty and be
                  updated later.
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
                Safe handoff fields
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">
                {driverBriefCount}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Driver-safe operational details available from the selected
                container.
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
