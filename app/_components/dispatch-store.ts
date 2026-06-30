export type DispatchStatus =
  | "Scheduled"
  | "In Transit"
  | "Delivered"
  | "Cancelled";

export type DispatchLoadType = "Import" | "Export";

export type DispatchType =
  | "Port to Warehouse"
  | "Port to Yard"
  | "Yard to Warehouse"
  | "Yard to Port";

export type DispatchTypeValue = DispatchType | "";
export type DeliveryType = "" | "Live" | "Drop" | "SOC";

export type DispatchPriority = "Standard" | "Priority" | "Critical";

export type DispatchRecord = {
  activatedAt: string | null;
  chassisNumber: string;
  containerNumber: string;
  createdAt: string;
  currencyType: string;
  customer: string;
  deliveryType: DeliveryType;
  deliveryWindow: string;
  destination: string;
  dispatchType: DispatchTypeValue;
  dispatcher: string;
  documents: string[];
  driver: string;
  equipmentType: string;
  gateCode: string;
  id: string;
  checkedInNumber: string;
  loadNumber: string;
  loadType: DispatchLoadType;
  notes: string;
  origin: string;
  pin: string;
  pickupWindow: string;
  priority: DispatchPriority;
  rate: string;
  routeTrack: string;
  scac: string;
  sealNumber: string;
  shippingLine: string;
  size: string;
  lastKnownLatitude: number | null;
  lastKnownLongitude: number | null;
  lastLocationRecordedAt: string | null;
  status: DispatchStatus;
  trackingActive: boolean;
};

export type DispatchInput = {
  activatedAt?: string | null;
  chassisNumber: string;
  containerNumber: string;
  currencyType: string;
  customer: string;
  deliveryType: DeliveryType;
  deliveryWindow: string;
  destination: string;
  dispatchType: DispatchTypeValue;
  dispatcher: string;
  documents: string[];
  driver: string;
  equipmentType: string;
  gateCode: string;
  checkedInNumber: string;
  loadNumber: string;
  loadType: DispatchLoadType;
  notes: string;
  origin: string;
  pin: string;
  pickupWindow: string;
  priority: DispatchPriority;
  rate: string;
  routeTrack: string;
  scac: string;
  sealNumber: string;
  shippingLine: string;
  size: string;
  lastKnownLatitude?: number | null;
  lastKnownLongitude?: number | null;
  lastLocationRecordedAt?: string | null;
  status: DispatchStatus;
  trackingActive?: boolean;
};

const STORAGE_KEY = "freightflow.dispatch";
const DISPATCH_STORAGE_EVENT = "freightflow:dispatch-updated";

const seedDispatches: DispatchRecord[] = [
  {
    activatedAt: "2026-06-29T09:42:00.000Z",
    chassisNumber: "140",
    containerNumber: "MSCU-482190-3",
    createdAt: "2026-06-27T07:20:00.000Z",
    currencyType: "",
    customer: "",
    deliveryType: "Live",
    deliveryWindow: "2026-06-29T18:00",
    destination: "Central Cross-Dock, Wadala Logistics Estate, Mumbai",
    dispatchType: "Port to Warehouse",
    dispatcher: "Ayesha Khan",
    documents: [],
    driver: "Arjun Singh",
    equipmentType: "Container Truck",
    gateCode: "GATE-3A",
    id: "DSP-7001",
    checkedInNumber: "CI-22091",
    loadNumber: "LOAD-MUM-1184",
    loadType: "Import",
    notes: "",
    origin: "Nhava Sheva Pickup Zone 3",
    pin: "4721",
    pickupWindow: "2026-06-29T09:30",
    priority: "Standard",
    rate: "",
    routeTrack: "Port -> Warehouse",
    scac: "MSCU",
    sealNumber: "SEAL-881092",
    shippingLine: "Mediterranean Shipping",
    size: "40 ft",
    lastKnownLatitude: 19.0907,
    lastKnownLongitude: 72.9121,
    lastLocationRecordedAt: "2026-06-29T11:14:00.000Z",
    status: "In Transit",
    trackingActive: true,
  },
  {
    activatedAt: null,
    chassisNumber: "120",
    containerNumber: "TGHU-310044-8",
    createdAt: "2026-06-28T10:05:00.000Z",
    currencyType: "",
    customer: "",
    deliveryType: "Drop",
    deliveryWindow: "2026-06-30T05:30",
    destination: "North Staging Yard",
    dispatchType: "Port to Yard",
    dispatcher: "Neha Verma",
    documents: [],
    driver: "Ritesh Patil",
    equipmentType: "Reefer Truck",
    gateCode: "GATE-2C",
    id: "DSP-7002",
    checkedInNumber: "CI-11820",
    loadNumber: "LOAD-BLR-2240",
    loadType: "Export",
    notes: "",
    origin: "South Cold Storage Hub Gate 2",
    pin: "6815",
    pickupWindow: "2026-06-29T23:30",
    priority: "Standard",
    rate: "",
    routeTrack: "Port -> Yard",
    scac: "TGHU",
    sealNumber: "SEAL-550812",
    shippingLine: "TransGlobe Haulage",
    size: "20 ft",
    lastKnownLatitude: null,
    lastKnownLongitude: null,
    lastLocationRecordedAt: null,
    status: "Scheduled",
    trackingActive: false,
  },
  {
    activatedAt: "2026-06-28T06:12:00.000Z",
    chassisNumber: "155",
    containerNumber: "OOLU-195672-1",
    createdAt: "2026-06-25T15:45:00.000Z",
    currencyType: "",
    customer: "",
    deliveryType: "SOC",
    deliveryWindow: "2026-06-28T14:30",
    destination: "North Staging Yard Bay 6",
    dispatchType: "Yard to Port",
    dispatcher: "Ayesha Khan",
    documents: [],
    driver: "Sameer Kulkarni",
    equipmentType: "Flatbed with escort",
    gateCode: "BAY-6E",
    id: "DSP-7003",
    checkedInNumber: "CI-51002",
    loadNumber: "LOAD-DEL-9038",
    loadType: "Export",
    notes: "",
    origin: "North Staging Yard",
    pin: "9054",
    pickupWindow: "2026-06-28T06:15",
    priority: "Standard",
    rate: "",
    routeTrack: "Yard -> Port",
    scac: "OOLU",
    sealNumber: "SEAL-774901",
    shippingLine: "OOCL Leasing",
    size: "40 ft",
    lastKnownLatitude: 19.0564,
    lastKnownLongitude: 72.8799,
    lastLocationRecordedAt: "2026-06-28T13:58:00.000Z",
    status: "Delivered",
    trackingActive: false,
  },
  {
    activatedAt: null,
    chassisNumber: "",
    containerNumber: "",
    createdAt: "2026-06-26T12:10:00.000Z",
    currencyType: "",
    customer: "",
    deliveryType: "",
    deliveryWindow: "2026-06-29T11:00",
    destination: "Ahmedabad City Hospital Cluster",
    dispatchType: "Yard to Warehouse",
    dispatcher: "Rahul Sethi",
    documents: [],
    driver: "Pooja Nair",
    equipmentType: "Box Truck",
    gateCode: "",
    id: "DSP-7004",
    checkedInNumber: "",
    loadNumber: "LOAD-AHD-4411",
    loadType: "Import",
    notes: "",
    origin: "West Medical Consolidation Hub",
    pin: "",
    pickupWindow: "2026-06-29T06:30",
    priority: "Standard",
    rate: "",
    routeTrack: "Yard -> Warehouse",
    scac: "",
    sealNumber: "",
    shippingLine: "",
    size: "",
    lastKnownLatitude: null,
    lastKnownLongitude: null,
    lastLocationRecordedAt: null,
    status: "Cancelled",
    trackingActive: false,
  },
];

const seedDispatchesJson = JSON.stringify(seedDispatches);

let cachedDispatches: DispatchRecord[] = seedDispatches;
let cachedRawDispatches = seedDispatchesJson;

function canUseStorage() {
  return typeof window !== "undefined";
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function normalizePriority(value: unknown): DispatchPriority {
  return value === "Priority" || value === "Critical" ? value : "Standard";
}

function normalizeStatus(value: unknown): DispatchStatus {
  if (
    value === "In Transit" ||
    value === "Delivered" ||
    value === "Cancelled"
  ) {
    return value;
  }

  return "Scheduled";
}

function normalizeLoadType(value: unknown): DispatchLoadType {
  return value === "Export" ? "Export" : "Import";
}

function normalizeDispatchType(value: unknown): DispatchTypeValue {
  if (value === "") {
    return "";
  }

  if (
    value === "Port to Yard" ||
    value === "Yard to Warehouse" ||
    value === "Yard to Port"
  ) {
    return value;
  }

  return value === "Port to Warehouse" ? value : "";
}

function normalizeDeliveryType(value: unknown): DeliveryType {
  if (value === "Live" || value === "Drop" || value === "SOC") {
    return value;
  }

  return "";
}

function normalizeDispatchRecord(record: unknown, index: number): DispatchRecord {
  const candidate = (record ?? {}) as Partial<
    DispatchRecord & {
      assignedDriver?: string;
      customerName?: string;
      laneFrom?: string;
      laneTo?: string;
      route?: string;
      tripNumber?: string;
      truckType?: string;
    }
  >;
  const fallbackRoute = asString(candidate.route);
  const [fallbackOrigin = "", fallbackDestination = ""] = fallbackRoute
    .split(" to ")
    .map((value) => value.trim());

  return {
    chassisNumber: asString(candidate.chassisNumber),
    containerNumber: asString(candidate.containerNumber),
    createdAt: asString(candidate.createdAt, new Date().toISOString()),
    currencyType: asString(candidate.currencyType, "USD"),
    customer: asString(candidate.customer ?? candidate.customerName),
    deliveryType: normalizeDeliveryType(candidate.deliveryType),
    deliveryWindow: asString(candidate.deliveryWindow),
    destination: asString(
      candidate.destination ?? candidate.laneTo,
      fallbackDestination,
    ),
    dispatchType: normalizeDispatchType(candidate.dispatchType),
    dispatcher: asString(candidate.dispatcher, "Ayesha Khan"),
    documents: Array.isArray(candidate.documents)
      ? candidate.documents.filter(
          (document): document is string => typeof document === "string",
        )
      : [],
    driver: asString(candidate.driver ?? candidate.assignedDriver),
    equipmentType: asString(candidate.equipmentType ?? candidate.truckType),
    gateCode: asString(candidate.gateCode),
    id: asString(candidate.id, `DSP-${7000 + index}`),
    checkedInNumber: asString(candidate.checkedInNumber),
    loadNumber: asString(
      candidate.loadNumber ?? candidate.tripNumber,
      `LOAD-${index + 1}`,
    ),
    activatedAt:
      typeof candidate.activatedAt === "string" ? candidate.activatedAt : null,
    loadType: normalizeLoadType(candidate.loadType),
    lastKnownLatitude:
      typeof candidate.lastKnownLatitude === "number"
        ? candidate.lastKnownLatitude
        : null,
    lastKnownLongitude:
      typeof candidate.lastKnownLongitude === "number"
        ? candidate.lastKnownLongitude
        : null,
    lastLocationRecordedAt:
      typeof candidate.lastLocationRecordedAt === "string"
        ? candidate.lastLocationRecordedAt
        : null,
    notes: asString(candidate.notes),
    origin: asString(candidate.origin ?? candidate.laneFrom, fallbackOrigin),
    pin: asString(candidate.pin),
    pickupWindow: asString(candidate.pickupWindow),
    priority: normalizePriority(candidate.priority),
    rate: asString(candidate.rate),
    routeTrack: asString(candidate.routeTrack),
    scac: asString(candidate.scac),
    sealNumber: asString(candidate.sealNumber),
    shippingLine: asString(candidate.shippingLine),
    size: asString(candidate.size),
    status: normalizeStatus(candidate.status),
    trackingActive: Boolean(candidate.trackingActive),
  };
}

function updateDispatchCache(rawDispatches: string) {
  try {
    const parsedDispatches = JSON.parse(rawDispatches) as unknown[];

    if (!Array.isArray(parsedDispatches) || parsedDispatches.length === 0) {
      cachedDispatches = seedDispatches;
      cachedRawDispatches = seedDispatchesJson;
      return seedDispatchesJson;
    }

    const normalizedDispatches = parsedDispatches.map((record, index) =>
      normalizeDispatchRecord(record, index),
    );
    const normalizedRawDispatches = JSON.stringify(normalizedDispatches);

    cachedDispatches = normalizedDispatches;
    cachedRawDispatches = normalizedRawDispatches;
    return normalizedRawDispatches;
  } catch {
    cachedDispatches = seedDispatches;
    cachedRawDispatches = seedDispatchesJson;
    return seedDispatchesJson;
  }
}

export function getDispatches(): DispatchRecord[] {
  if (!canUseStorage()) {
    return seedDispatches;
  }

  const rawDispatches = window.localStorage.getItem(STORAGE_KEY);

  if (!rawDispatches) {
    window.localStorage.setItem(STORAGE_KEY, seedDispatchesJson);
    cachedDispatches = seedDispatches;
    cachedRawDispatches = seedDispatchesJson;
    return cachedDispatches;
  }

  if (rawDispatches === cachedRawDispatches) {
    return cachedDispatches;
  }

  const normalizedDispatches = updateDispatchCache(rawDispatches);

  if (normalizedDispatches !== rawDispatches) {
    window.localStorage.setItem(STORAGE_KEY, normalizedDispatches);
  }

  return cachedDispatches;
}

export function getDispatchesServerSnapshot(): DispatchRecord[] {
  return seedDispatches;
}

function saveDispatches(nextDispatches: DispatchRecord[]) {
  const nextDispatchesRaw = JSON.stringify(nextDispatches);

  cachedDispatches = nextDispatches;
  cachedRawDispatches = nextDispatchesRaw;
  window.localStorage.setItem(STORAGE_KEY, nextDispatchesRaw);
  window.dispatchEvent(new Event(DISPATCH_STORAGE_EVENT));
}

export function addDispatch(input: DispatchInput) {
  if (!canUseStorage()) {
    return;
  }

  const dispatches = getDispatches();
  const nextDispatch: DispatchRecord = {
    ...input,
    activatedAt: input.activatedAt ?? null,
    createdAt: new Date().toISOString(),
    id: `DSP-${Math.floor(1000 + (Date.now() % 9000))}`,
    lastKnownLatitude: input.lastKnownLatitude ?? null,
    lastKnownLongitude: input.lastKnownLongitude ?? null,
    lastLocationRecordedAt: input.lastLocationRecordedAt ?? null,
    loadNumber:
      input.loadNumber || `LOAD-${Math.floor(10000 + (Date.now() % 90000))}`,
    trackingActive: input.trackingActive ?? false,
  };

  saveDispatches([nextDispatch, ...dispatches]);
}

export function getDispatchById(id: string) {
  return getDispatches().find((dispatch) => dispatch.id === id) ?? null;
}

export function updateDispatch(id: string, input: DispatchInput) {
  if (!canUseStorage()) {
    return false;
  }

  const dispatches = getDispatches();
  const targetDispatch = dispatches.find((dispatch) => dispatch.id === id);

  if (!targetDispatch) {
    return false;
  }

  const nextDispatches = dispatches.map((dispatch) =>
    dispatch.id === id
      ? {
          ...dispatch,
          ...input,
          documents: input.documents,
          loadNumber: input.loadNumber || dispatch.loadNumber,
        }
      : dispatch,
  );

  saveDispatches(nextDispatches);
  return true;
}

export function deleteDispatch(id: string) {
  if (!canUseStorage()) {
    return false;
  }

  const dispatches = getDispatches();
  const nextDispatches = dispatches.filter((dispatch) => dispatch.id !== id);

  if (nextDispatches.length === dispatches.length) {
    return false;
  }

  saveDispatches(nextDispatches);
  return true;
}

export function updateDispatchStatus(id: string, status: DispatchStatus) {
  if (!canUseStorage()) {
    return false;
  }

  const dispatches = getDispatches();
  let updated = false;

  const nextDispatches = dispatches.map((dispatch) => {
    if (dispatch.id !== id) {
      return dispatch;
    }

    updated = true;
    return {
      ...dispatch,
      status,
    };
  });

  if (!updated) {
    return false;
  }

  saveDispatches(nextDispatches);
  return true;
}

export function subscribeDispatches(callback: () => void) {
  if (!canUseStorage()) {
    return () => undefined;
  }

  const handleChange = () => {
    callback();
  };

  window.addEventListener("storage", handleChange);
  window.addEventListener(DISPATCH_STORAGE_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(DISPATCH_STORAGE_EVENT, handleChange);
  };
}
