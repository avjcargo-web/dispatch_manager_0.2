"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
} from "react";
import {
  getCustomers,
  getCustomersServerSnapshot,
  subscribeCustomers,
} from "./customer-store";
import { FileUploadCard } from "./file-upload-card";
import {
  addContainer,
  getContainerById,
  subscribeContainers,
  updateContainer,
} from "./container-store";
import {
  getWarehouseYards,
  getWarehouseYardsServerSnapshot,
  subscribeWarehouseYards,
} from "./warehouse-yard-store";

const initialForm = {
  baseRate: "",
  bookingNumber: "",
  chassis: "",
  checkedInNumber: "",
  containerNumber: "",
  currencyType: "USD",
  customer: "",
  lfd: "",
  loadType: "Import" as "Import" | "Export",
  notes: "",
  pickupBookingTime: "",
  pickupLocation: "",
  prepull: "",
  scac: "",
  sealNumber: "",
  shippingLine: "",
  shipEta: "",
  size: "40 ft",
  storage: "",
  type: "Dry Container",
  waiting: "",
  warehouse: "",
  warehouseAddress: "",
  weightLbs: "",
};

const containerSignals = [
  {
    label: "Deployment focus",
    value: "Import and export control",
    detail:
      "Bring customer, vessel timing, warehouse, and pickup coordination into one operational entry flow.",
  },
  {
    label: "Average setup",
    value: "18 mins",
    detail:
      "Complete container and price details help dispatch move from booking to execution with fewer follow-ups.",
  },
  {
    label: "Suggested state",
    value: "Ready for billing and dispatch",
    detail:
      "The record carries booking, warehouse, and rate context into the next operational step right after save.",
  },
];

const containerChecklist = [
  "Load type, customer, and booking details captured",
  "Pickup and warehouse handling fields completed",
  "Base rate, standard charges, and extra charges reviewed",
];

const inputClassName =
  "h-13 rounded-2xl border border-line bg-white px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10";

const textAreaClassName =
  "rounded-3xl border border-line bg-white px-4 py-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10";

type ChargeDraft = {
  amount: string;
  id: string;
  label: string;
};

function createChargeDraft(id: string): ChargeDraft {
  return {
    amount: "",
    id,
    label: "",
  };
}

function createFilesFromNames(fileNames: string[]) {
  return fileNames.map(
    (fileName, index) =>
      new File([""], fileName, {
        lastModified: index,
        type: "application/octet-stream",
      }),
  );
}

type ContainerFormProps = {
  containerId?: string;
};

function createInitialFormValue(initialContainer?: {
  baseRate: string;
  bookingNumber: string;
  chassis: string;
  checkedInNumber: string;
  containerNumber: string;
  currencyType: string;
  customer: string;
  lfd: string;
  loadType: "Import" | "Export";
  notes: string;
  pickupBookingTime: string;
  pickupLocation: string;
  prepull: string;
  scac: string;
  sealNumber: string;
  shippingLine: string;
  shipEta: string;
  size: string;
  storage: string;
  type: string;
  waiting: string;
  warehouse: string;
  warehouseAddress: string;
  weightLbs: string;
}) {
  if (!initialContainer) {
    return initialForm;
  }

  return {
    baseRate: initialContainer.baseRate,
    bookingNumber: initialContainer.bookingNumber,
    chassis: initialContainer.chassis,
    checkedInNumber: initialContainer.checkedInNumber,
    containerNumber: initialContainer.containerNumber,
    currencyType: initialContainer.currencyType,
    customer: initialContainer.customer,
    lfd: initialContainer.lfd,
    loadType: initialContainer.loadType,
    notes: initialContainer.notes,
    pickupBookingTime: initialContainer.pickupBookingTime,
    pickupLocation: initialContainer.pickupLocation,
    prepull: initialContainer.prepull,
    scac: initialContainer.scac,
    sealNumber: initialContainer.sealNumber,
    shippingLine: initialContainer.shippingLine,
    shipEta: initialContainer.shipEta,
    size: initialContainer.size,
    storage: initialContainer.storage,
    type: initialContainer.type,
    waiting: initialContainer.waiting,
    warehouse: initialContainer.warehouse,
    warehouseAddress: initialContainer.warehouseAddress,
    weightLbs: initialContainer.weightLbs,
  };
}

function createInitialCharges(initialCharges?: ChargeDraft[]) {
  return initialCharges && initialCharges.length > 0
    ? initialCharges
    : [createChargeDraft("charge-1")];
}

type ContainerFormContentProps = {
  containerId?: string;
  initialContainer?: {
    additionalCharges: ChargeDraft[];
    documents: string[];
  } & ReturnType<typeof createInitialFormValue>;
};

function ContainerFormContent({
  containerId,
  initialContainer,
}: ContainerFormContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState(() => createInitialFormValue(initialContainer));
  const [containerDocs, setContainerDocs] = useState<File[]>(() =>
    createFilesFromNames(initialContainer?.documents ?? []),
  );
  const [additionalCharges, setAdditionalCharges] = useState<ChargeDraft[]>(() =>
    createInitialCharges(initialContainer?.additionalCharges),
  );
  const nextChargeId = useRef(
    Math.max((initialContainer?.additionalCharges.length ?? 0) + 1, 2),
  );
  const chargeInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const pendingFocusChargeId = useRef<string | null>(null);
  const customers = useSyncExternalStore(
    subscribeCustomers,
    getCustomers,
    getCustomersServerSnapshot,
  );
  const warehouseYards = useSyncExternalStore(
    subscribeWarehouseYards,
    getWarehouseYards,
    getWarehouseYardsServerSnapshot,
  );
  const warehouseOptions = warehouseYards.filter(
    (item) => item.type === "Warehouse",
  );
  const trackedChargesCount =
    [
      form.baseRate,
      form.prepull,
      form.chassis,
      form.storage,
      form.waiting,
    ].filter(Boolean).length +
    additionalCharges.filter(
      (charge) => charge.label.trim() || charge.amount.trim(),
    ).length;
  const isEditing = Boolean(containerId);

  useEffect(() => {
    const nextChargeIdToFocus = pendingFocusChargeId.current;

    if (!nextChargeIdToFocus) {
      return;
    }

    const nextInput = chargeInputRefs.current[nextChargeIdToFocus];

    if (nextInput) {
      nextInput.focus();
      nextInput.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
    pendingFocusChargeId.current = null;
  }, [additionalCharges]);

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

  function handleChargeChange(
    chargeId: string,
    field: "amount" | "label",
    value: string,
  ) {
    setAdditionalCharges((currentCharges) =>
      currentCharges.map((charge) =>
        charge.id === chargeId ? { ...charge, [field]: value } : charge,
      ),
    );
  }

  function addChargeRow() {
    const nextId = `charge-${nextChargeId.current++}`;

    setAdditionalCharges((currentCharges) => [
      ...currentCharges,
      createChargeDraft(nextId),
    ]);
    pendingFocusChargeId.current = nextId;
  }

  function removeChargeRow(chargeId: string) {
    setAdditionalCharges((currentCharges) =>
      currentCharges.length === 1
        ? [createChargeDraft(currentCharges[0]?.id ?? "charge-1")]
        : currentCharges.filter((charge) => charge.id !== chargeId),
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(() => {
      const payload = {
        ...form,
        additionalCharges: additionalCharges.filter(
          (charge) => charge.label.trim() || charge.amount.trim(),
        ),
        documents: containerDocs.map((file) => file.name),
      };

      if (containerId) {
        updateContainer(containerId, payload);
        router.push("/dashboard/containers?updated=1");
        return;
      }

      addContainer(payload);
      router.push("/dashboard/containers?created=1");
    });
  }

  return (
    <main className="space-y-6 p-5 md:p-7">
      <section className="rounded-[30px] border border-line bg-panel p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              Container section
            </p>
            <h3 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              {isEditing ? "Edit container" : "Add container"}
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
              {isEditing
                ? "Update the booking, warehouse, document, and pricing details while keeping this container record in the dispatch history."
                : "Create a complete import or export container job with booking, warehouse, document, and pricing details so operations can move directly into execution."}
            </p>
          </div>

          <Link
            href="/dashboard/containers"
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-line px-5 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent"
          >
            Back to container list
          </Link>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_360px]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-[28px] border border-line bg-[linear-gradient(135deg,rgba(15,108,189,0.08),rgba(255,255,255,0.95)_45%,rgba(245,158,11,0.08))] p-5 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">
                    Section 01
                  </p>
                  <h4 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
                    Container details
                  </h4>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
                    {isEditing
                      ? "Refine the load direction, customer, booking references, and warehouse handling without losing the record already in operations."
                      : "Capture the load direction, customer, booking references, container specs, warehouse handling, and the full document packet in one place."}
                  </p>
                </div>
                <div className="inline-flex rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink shadow-sm">
                  {isEditing ? "Record update" : "Booking intake"}
                </div>
              </div>

              <div className="mt-6 space-y-6">
                <div className="grid gap-3">
                  <span className="text-sm font-medium text-ink">Load type</span>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(["Import", "Export"] as const).map((value) => {
                      const active = form.loadType === value;

                      return (
                        <label
                          key={value}
                          className={`flex cursor-pointer items-start gap-3 rounded-[24px] border px-4 py-4 transition ${
                            active
                              ? "border-accent bg-white shadow-sm"
                              : "border-white/60 bg-white/70 hover:border-accent/40"
                          }`}
                        >
                          <input
                            checked={active}
                            className="mt-1 h-4 w-4 accent-accent"
                            name="loadType"
                            onChange={handleChange}
                            type="radio"
                            value={value}
                          />
                          <span>
                            <span className="block text-sm font-semibold text-ink">
                              {value}
                            </span>
                            <span className="mt-1 block text-xs leading-5 text-muted">
                              {value === "Import"
                                ? "Track arrival timing, pickup release, and warehouse intake."
                                : "Track booking, staging, and export handoff planning."}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-ink">Customer</span>
                    <select
                      required
                      name="customer"
                      value={form.customer}
                      onChange={handleChange}
                      className={inputClassName}
                    >
                      <option value="">Select customer</option>
                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.company}>
                          {customer.company} - {customer.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-ink">
                      Container number
                    </span>
                    <input
                      required
                      name="containerNumber"
                      value={form.containerNumber}
                      onChange={handleChange}
                      placeholder="e.g. MSCU-482190-3"
                      className={inputClassName}
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-ink">
                      Booking number
                    </span>
                    <input
                      required
                      name="bookingNumber"
                      value={form.bookingNumber}
                      onChange={handleChange}
                      placeholder="Carrier or client booking number"
                      className={inputClassName}
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-ink">
                      Container type
                    </span>
                    <select
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      className={inputClassName}
                    >
                      <option>Dry Container</option>
                      <option>Reefer Container</option>
                      <option>Open Top</option>
                      <option>Flat Rack</option>
                      <option>Tank Container</option>
                      <option>High Cube</option>
                    </select>
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-ink">Size</span>
                    <select
                      name="size"
                      value={form.size}
                      onChange={handleChange}
                      className={inputClassName}
                    >
                      <option>20 ft</option>
                      <option>40 ft</option>
                      <option>45 ft</option>
                    </select>
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-ink">
                      Weight (LBS)
                    </span>
                    <input
                      required
                      min="0"
                      name="weightLbs"
                      onChange={handleChange}
                      placeholder="Enter cargo or gross weight"
                      type="number"
                      value={form.weightLbs}
                      className={inputClassName}
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-ink">
                      Shipping line
                    </span>
                    <input
                      required
                      name="shippingLine"
                      value={form.shippingLine}
                      onChange={handleChange}
                      placeholder="Carrier or shipping line"
                      className={inputClassName}
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-ink">
                      Ship ETA
                    </span>
                    <input
                      required
                      type="date"
                      name="shipEta"
                      value={form.shipEta}
                      onChange={handleChange}
                      className={inputClassName}
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-ink">LFD</span>
                    <input
                      required
                      type="date"
                      name="lfd"
                      value={form.lfd}
                      onChange={handleChange}
                      className={inputClassName}
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-ink">
                      Pick up location
                    </span>
                    <input
                      required
                      name="pickupLocation"
                      value={form.pickupLocation}
                      onChange={handleChange}
                      placeholder="Port gate, depot, or yard pickup point"
                      className={inputClassName}
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-ink">
                      Pick up booking time
                    </span>
                    <input
                      required
                      type="datetime-local"
                      name="pickupBookingTime"
                      value={form.pickupBookingTime}
                      onChange={handleChange}
                      className={inputClassName}
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-ink">
                      Warehouse
                    </span>
                    <select
                      required
                      name="warehouse"
                      value={form.warehouse}
                      onChange={handleChange}
                      className={inputClassName}
                    >
                      <option value="">Select warehouse</option>
                      {warehouseOptions.map((warehouse) => (
                        <option key={warehouse.id} value={warehouse.name}>
                          {warehouse.name} - {warehouse.city}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-ink">
                      Warehouse address
                    </span>
                    <input
                      required
                      name="warehouseAddress"
                      value={form.warehouseAddress}
                      onChange={handleChange}
                      placeholder="Street, area, city, and landmark"
                      className={inputClassName}
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-ink">
                      Seal number
                    </span>
                    <input
                      name="sealNumber"
                      value={form.sealNumber}
                      onChange={handleChange}
                      placeholder="Seal or lock reference"
                      className={inputClassName}
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-ink">
                      Checked in number
                    </span>
                    <input
                      name="checkedInNumber"
                      value={form.checkedInNumber}
                      onChange={handleChange}
                      placeholder="Check-in reference or gate number"
                      className={inputClassName}
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-ink">SCAC</span>
                    <input
                      name="scac"
                      value={form.scac}
                      onChange={handleChange}
                      placeholder="Carrier SCAC code"
                      className={inputClassName}
                    />
                  </label>
                </div>

                <div className="rounded-[24px] border border-white/70 bg-white/75 p-4 sm:p-5">
                  <p className="text-sm font-semibold text-ink">
                    Upload container documents
                  </p>
                  <p className="mt-1 text-sm leading-6 text-muted">
                    Add DO, rate confirmation, release papers, or any other
                    container handling documents.
                  </p>
                  <div className="mt-4">
                    <FileUploadCard
                      acceptedLabel="DO / RC / Docs"
                      description="Upload delivery orders, rate confirmations, release forms, and all related container documents."
                      files={containerDocs}
                      label="Container document packet"
                      onFilesChange={setContainerDocs}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-line bg-panel-muted p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">
                    Section 02
                  </p>
                  <h4 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
                    Price details
                  </h4>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
                    Enter the base rate, standard accessorials, and any extra
                    charges that need to be added for this move.
                  </p>
                </div>
                <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-muted shadow-sm">
                  Billing ready
                </div>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">
                    Currency type
                  </span>
                  <select
                    name="currencyType"
                    value={form.currencyType}
                    onChange={handleChange}
                    className={inputClassName}
                  >
                    <option>USD</option>
                    <option>INR</option>
                    <option>EUR</option>
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">
                    Base rate
                  </span>
                  <input
                    required
                    min="0"
                    name="baseRate"
                    onChange={handleChange}
                    placeholder="Enter base rate"
                    type="number"
                    value={form.baseRate}
                    className={inputClassName}
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">Prepull</span>
                  <input
                    min="0"
                    name="prepull"
                    onChange={handleChange}
                    placeholder="Prepull charge"
                    type="number"
                    value={form.prepull}
                    className={inputClassName}
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">Chassis</span>
                  <input
                    min="0"
                    name="chassis"
                    onChange={handleChange}
                    placeholder="Chassis charge"
                    type="number"
                    value={form.chassis}
                    className={inputClassName}
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">Storage</span>
                  <input
                    min="0"
                    name="storage"
                    onChange={handleChange}
                    placeholder="Storage charge"
                    type="number"
                    value={form.storage}
                    className={inputClassName}
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-ink">Waiting</span>
                  <input
                    min="0"
                    name="waiting"
                    onChange={handleChange}
                    placeholder="Waiting charge"
                    type="number"
                    value={form.waiting}
                    className={inputClassName}
                  />
                </label>
              </div>

              <div className="mt-6 rounded-[24px] border border-line bg-white p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      Additional charges
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      Add as many extra charge lines as needed for this container.
                    </p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                      {additionalCharges.length} row(s) ready
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addChargeRow}
                    className="inline-flex h-11 items-center justify-center rounded-2xl border border-line bg-white px-4 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent"
                  >
                    Add charge
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {additionalCharges.map((charge, index) => (
                    <div
                      key={charge.id}
                      className="rounded-[22px] border border-line bg-panel-muted p-4"
                    >
                      <div className="flex flex-col gap-3 border-b border-line pb-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                            Charge {String(index + 1).padStart(2, "0")}
                          </p>
                          <p className="mt-1 text-sm text-muted">
                            Add a label and amount for this extra cost line.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeChargeRow(charge.id)}
                          className="inline-flex h-11 items-center justify-center rounded-2xl border border-line bg-white px-4 text-sm font-semibold text-muted transition hover:border-accent hover:text-accent"
                        >
                          {index === 0 && additionalCharges.length === 1
                            ? "Clear row"
                            : "Remove row"}
                        </button>
                      </div>

                      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_220px]">
                        <label className="grid gap-2">
                          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                            Charge label
                          </span>
                          <input
                            ref={(node) => {
                              chargeInputRefs.current[charge.id] = node;
                            }}
                            value={charge.label}
                            onChange={(event) =>
                              handleChargeChange(
                                charge.id,
                                "label",
                                event.target.value,
                              )
                            }
                            placeholder="e.g. Port handling, toll, escort"
                            className={inputClassName}
                          />
                        </label>

                        <label className="grid gap-2">
                          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                            Amount
                          </span>
                          <input
                            min="0"
                            value={charge.amount}
                            onChange={(event) =>
                              handleChargeChange(
                                charge.id,
                                "amount",
                                event.target.value,
                              )
                            }
                            placeholder="0"
                            type="number"
                            className={inputClassName}
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-start">
                  <button
                    type="button"
                    onClick={addChargeRow}
                    className="inline-flex h-11 items-center justify-center rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Add another charge row
                  </button>
                </div>
              </div>

              <label className="mt-6 grid gap-2">
                <span className="text-sm font-medium text-ink">
                  Internal notes
                </span>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Add any dispatch notes, delivery instructions, gate issues, or customer handling remarks."
                  className={textAreaClassName}
                />
              </label>

              <div className="mt-6 flex flex-col gap-3 rounded-[24px] border border-line bg-[linear-gradient(135deg,rgba(15,108,189,0.08),rgba(255,255,255,0.98))] p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-6 text-muted">
                  {isEditing
                    ? "The updated container job, document names, and all price lines will replace the stored record and refresh immediately in the container flow."
                    : "The container job, selected document names, and all entered price lines will be saved in this demo portal and shown immediately in the container flow."}
                </p>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isPending
                    ? isEditing
                      ? "Updating container..."
                      : "Saving container..."
                    : isEditing
                      ? "Update container"
                      : "Save container"}
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
                Container onboarding pulse
              </h4>
              <div className="mt-6 space-y-4">
                {containerSignals.map((item) => (
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
                {containerChecklist.map((item) => (
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
                Commercial summary
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">
                {trackedChargesCount}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Total tracked charge lines including base rate, standard charges,
                and any extra items.
              </p>
            </div>

            <div className="rounded-[28px] border border-line bg-panel p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                Files prepared
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">
                {containerDocs.length}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Documents selected for this container booking packet.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

export function ContainerForm({ containerId }: ContainerFormProps) {
  const isHydrated = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const container = useSyncExternalStore(
    subscribeContainers,
    () => (containerId ? getContainerById(containerId) : null),
    () => null,
  );

  if (containerId && !isHydrated) {
    return (
      <main className="space-y-6 p-5 md:p-7">
        <section className="rounded-[30px] border border-line bg-panel p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <p className="text-sm text-muted">Loading container record...</p>
        </section>
      </main>
    );
  }

  if (containerId && !container) {
    return (
      <main className="space-y-6 p-5 md:p-7">
        <section className="rounded-[30px] border border-line bg-panel p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            Container section
          </p>
          <h3 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
            Container not found
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
            This container could not be found in the current browser records.
          </p>
          <Link
            href="/dashboard/containers"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-2xl border border-line px-5 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent"
          >
            Back to container list
          </Link>
        </section>
      </main>
    );
  }

  return (
    <ContainerFormContent
      containerId={containerId}
      initialContainer={
        container
          ? {
              ...createInitialFormValue(container),
              additionalCharges: container.additionalCharges,
              documents: container.documents,
            }
          : undefined
      }
    />
  );
}
