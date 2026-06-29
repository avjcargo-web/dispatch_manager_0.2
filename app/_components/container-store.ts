export type ContainerCharge = {
  amount: string;
  id: string;
  label: string;
};

export type ContainerStatus =
  | "Available"
  | "In Transit"
  | "Under Inspection"
  | "Cancelled";

export type ContainerRecord = {
  additionalCharges: ContainerCharge[];
  baseRate: string;
  bookingNumber: string;
  chassis: string;
  checkedInNumber: string;
  containerNumber: string;
  createdAt: string;
  currencyType: string;
  customer: string;
  documents: string[];
  id: string;
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
  status: ContainerStatus;
  storage: string;
  type: string;
  waiting: string;
  warehouse: string;
  warehouseAddress: string;
  weightLbs: string;
};

export type ContainerInput = {
  additionalCharges: ContainerCharge[];
  baseRate: string;
  bookingNumber: string;
  chassis: string;
  checkedInNumber: string;
  containerNumber: string;
  currencyType: string;
  customer: string;
  documents: string[];
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
};

const STORAGE_KEY = "freightflow.containers";
const CONTAINER_STORAGE_EVENT = "freightflow:containers-updated";

const seedContainers: ContainerRecord[] = [
  {
    additionalCharges: [
      { amount: "125", id: "charge-1", label: "Port handling" },
      { amount: "60", id: "charge-2", label: "Documentation" },
    ],
    baseRate: "1850",
    bookingNumber: "BK-MUM-92014",
    chassis: "140",
    checkedInNumber: "CI-22091",
    containerNumber: "MSCU-482190-3",
    createdAt: "2026-06-02T09:00:00.000Z",
    currencyType: "USD",
    customer: "Metro Retail Supply",
    documents: ["Delivery-Order.pdf", "Dispatch-Release.pdf"],
    id: "CONT-4001",
    lfd: "2026-06-30",
    loadType: "Import",
    notes: "Allocated for western retail replenishment lane.",
    pickupBookingTime: "2026-06-28T09:30",
    pickupLocation: "Nhava Sheva Pickup Zone 3",
    prepull: "95",
    scac: "MSCU",
    sealNumber: "SEAL-881092",
    shippingLine: "Mediterranean Shipping",
    shipEta: "2026-06-28",
    size: "40 ft",
    status: "In Transit",
    storage: "75",
    type: "Dry Container",
    waiting: "45",
    warehouse: "Central Cross-Dock",
    warehouseAddress: "Wadala Logistics Estate, Mumbai",
    weightLbs: "44000",
  },
  {
    additionalCharges: [{ amount: "40", id: "charge-1", label: "Power plug" }],
    baseRate: "1325",
    bookingNumber: "BK-BLR-77125",
    chassis: "120",
    checkedInNumber: "CI-11820",
    containerNumber: "TGHU-310044-8",
    createdAt: "2026-06-11T11:20:00.000Z",
    currencyType: "USD",
    customer: "NorthFresh Foods",
    documents: ["Rate-Confirmation.pdf"],
    id: "CONT-4002",
    lfd: "2026-07-02",
    loadType: "Export",
    notes: "Ready for cold-chain allocation from Bengaluru hub.",
    pickupBookingTime: "2026-06-29T05:30",
    pickupLocation: "South Cold Storage Hub Gate 2",
    prepull: "65",
    scac: "TGHU",
    sealNumber: "SEAL-550812",
    shippingLine: "TransGlobe Haulage",
    shipEta: "2026-07-01",
    size: "20 ft",
    status: "Available",
    storage: "20",
    type: "Reefer Container",
    waiting: "35",
    warehouse: "South Cold Storage Hub",
    warehouseAddress: "Airport Cargo Corridor, Bengaluru",
    weightLbs: "28600",
  },
  {
    additionalCharges: [
      { amount: "110", id: "charge-1", label: "Escort handling" },
    ],
    baseRate: "2150",
    bookingNumber: "BK-DEL-66288",
    chassis: "155",
    checkedInNumber: "CI-51002",
    containerNumber: "OOLU-195672-1",
    createdAt: "2026-06-19T15:45:00.000Z",
    currencyType: "USD",
    customer: "Westline Components",
    documents: ["Inspection-Checklist.pdf", "Damage-Photos.zip"],
    id: "CONT-4003",
    lfd: "2026-07-04",
    loadType: "Export",
    notes: "Pending structural review before loading heavy machinery.",
    pickupBookingTime: "2026-06-30T14:15",
    pickupLocation: "North Staging Yard Bay 6",
    prepull: "110",
    scac: "OOLU",
    sealNumber: "SEAL-774901",
    shippingLine: "OOCL Leasing",
    shipEta: "2026-07-03",
    size: "40 ft",
    status: "Under Inspection",
    storage: "95",
    type: "Open Top",
    waiting: "70",
    warehouse: "Central Cross-Dock",
    warehouseAddress: "Wadala Logistics Estate, Mumbai",
    weightLbs: "39200",
  },
];

const seedContainersJson = JSON.stringify(seedContainers);

let cachedContainers: ContainerRecord[] = seedContainers;
let cachedRawContainers = seedContainersJson;

function canUseStorage() {
  return typeof window !== "undefined";
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function normalizeCharge(
  charge: unknown,
  index: number,
): ContainerCharge | null {
  if (!charge || typeof charge !== "object") {
    return null;
  }

  const candidate = charge as Partial<ContainerCharge>;

  return {
    amount: asString(candidate.amount),
    id: asString(candidate.id, `charge-${index + 1}`),
    label: asString(candidate.label),
  };
}

function normalizeContainerRecord(record: unknown, index: number): ContainerRecord {
  const candidate = (record ?? {}) as Partial<
    ContainerRecord & {
      assignedCustomer?: string;
      currentLocation?: string;
      lastInspection?: string;
      owner?: string;
    }
  >;

  return {
    additionalCharges: Array.isArray(candidate.additionalCharges)
      ? candidate.additionalCharges
          .map((charge, chargeIndex) => normalizeCharge(charge, chargeIndex))
          .filter((charge): charge is ContainerCharge => charge !== null)
      : [],
    baseRate: asString(candidate.baseRate),
    bookingNumber: asString(candidate.bookingNumber),
    chassis: asString(candidate.chassis),
    checkedInNumber: asString(candidate.checkedInNumber),
    containerNumber: asString(candidate.containerNumber, `CONT-${index + 1}`),
    createdAt: asString(candidate.createdAt, new Date().toISOString()),
    currencyType: asString(candidate.currencyType, "USD"),
    customer: asString(candidate.customer ?? candidate.assignedCustomer),
    documents: Array.isArray(candidate.documents)
      ? candidate.documents.filter(
          (document): document is string => typeof document === "string",
        )
      : [],
    id: asString(candidate.id, `CONT-${4000 + index}`),
    lfd: asString(candidate.lfd),
    loadType: candidate.loadType === "Export" ? "Export" : "Import",
    notes: asString(candidate.notes),
    pickupBookingTime: asString(candidate.pickupBookingTime),
    pickupLocation: asString(candidate.pickupLocation ?? candidate.currentLocation),
    prepull: asString(candidate.prepull),
    scac: asString(candidate.scac),
    sealNumber: asString(candidate.sealNumber),
    shippingLine: asString(candidate.shippingLine ?? candidate.owner),
    shipEta: asString(candidate.shipEta ?? candidate.lastInspection),
    size: asString(candidate.size, "40 ft"),
    status:
      candidate.status === "In Transit" ||
      candidate.status === "Under Inspection" ||
      candidate.status === "Cancelled"
        ? candidate.status
        : "Available",
    storage: asString(candidate.storage),
    type: asString(candidate.type, "Dry Container"),
    waiting: asString(candidate.waiting),
    warehouse: asString(candidate.warehouse),
    warehouseAddress: asString(candidate.warehouseAddress),
    weightLbs: asString(candidate.weightLbs),
  };
}

function updateContainerCache(rawContainers: string) {
  try {
    const parsedContainers = JSON.parse(rawContainers) as unknown[];

    if (!Array.isArray(parsedContainers) || parsedContainers.length === 0) {
      cachedContainers = seedContainers;
      cachedRawContainers = seedContainersJson;
      return seedContainersJson;
    }

    const normalizedContainers = parsedContainers.map((record, index) =>
      normalizeContainerRecord(record, index),
    );
    const normalizedRawContainers = JSON.stringify(normalizedContainers);

    cachedContainers = normalizedContainers;
    cachedRawContainers = normalizedRawContainers;
    return normalizedRawContainers;
  } catch {
    cachedContainers = seedContainers;
    cachedRawContainers = seedContainersJson;
    return seedContainersJson;
  }
}

export function getContainers(): ContainerRecord[] {
  if (!canUseStorage()) {
    return seedContainers;
  }

  const rawContainers = window.localStorage.getItem(STORAGE_KEY);

  if (!rawContainers) {
    window.localStorage.setItem(STORAGE_KEY, seedContainersJson);
    cachedContainers = seedContainers;
    cachedRawContainers = seedContainersJson;
    return cachedContainers;
  }

  if (rawContainers === cachedRawContainers) {
    return cachedContainers;
  }

  const normalizedContainers = updateContainerCache(rawContainers);

  if (normalizedContainers !== rawContainers) {
    window.localStorage.setItem(STORAGE_KEY, normalizedContainers);
  }

  return cachedContainers;
}

export function getContainersServerSnapshot(): ContainerRecord[] {
  return seedContainers;
}

function saveContainers(nextContainers: ContainerRecord[]) {
  const nextContainersRaw = JSON.stringify(nextContainers);

  cachedContainers = nextContainers;
  cachedRawContainers = nextContainersRaw;
  window.localStorage.setItem(STORAGE_KEY, nextContainersRaw);
  window.dispatchEvent(new Event(CONTAINER_STORAGE_EVENT));
}

export function addContainer(input: ContainerInput) {
  if (!canUseStorage()) {
    return;
  }

  const containers = getContainers();
  const nextContainer: ContainerRecord = {
    additionalCharges: input.additionalCharges,
    baseRate: input.baseRate,
    bookingNumber: input.bookingNumber,
    chassis: input.chassis,
    checkedInNumber: input.checkedInNumber,
    containerNumber: input.containerNumber,
    createdAt: new Date().toISOString(),
    currencyType: input.currencyType,
    customer: input.customer,
    documents: input.documents,
    id: `CONT-${Math.floor(1000 + (Date.now() % 9000))}`,
    lfd: input.lfd,
    loadType: input.loadType,
    notes: input.notes,
    pickupBookingTime: input.pickupBookingTime,
    pickupLocation: input.pickupLocation,
    prepull: input.prepull,
    scac: input.scac,
    sealNumber: input.sealNumber,
    shippingLine: input.shippingLine,
    shipEta: input.shipEta,
    size: input.size,
    status: "Available",
    storage: input.storage,
    type: input.type,
    waiting: input.waiting,
    warehouse: input.warehouse,
    warehouseAddress: input.warehouseAddress,
    weightLbs: input.weightLbs,
  };

  saveContainers([nextContainer, ...containers]);
}

export function getContainerById(id: string) {
  return getContainers().find((container) => container.id === id) ?? null;
}

export function updateContainer(id: string, input: ContainerInput) {
  if (!canUseStorage()) {
    return false;
  }

  const containers = getContainers();
  const targetContainer = containers.find((container) => container.id === id);

  if (!targetContainer) {
    return false;
  }

  const nextContainers = containers.map((container) =>
    container.id === id
      ? {
          ...container,
          ...input,
          additionalCharges: input.additionalCharges,
          documents: input.documents,
        }
      : container,
  );

  saveContainers(nextContainers);
  return true;
}

export function deleteContainer(id: string) {
  if (!canUseStorage()) {
    return false;
  }

  const containers = getContainers();
  const nextContainers = containers.filter((container) => container.id !== id);

  if (nextContainers.length === containers.length) {
    return false;
  }

  saveContainers(nextContainers);
  return true;
}

export function updateContainerStatus(id: string, status: ContainerStatus) {
  if (!canUseStorage()) {
    return false;
  }

  const containers = getContainers();
  let updated = false;

  const nextContainers = containers.map((container) => {
    if (container.id !== id) {
      return container;
    }

    updated = true;
    return {
      ...container,
      status,
    };
  });

  if (!updated) {
    return false;
  }

  saveContainers(nextContainers);
  return true;
}

export function subscribeContainers(callback: () => void) {
  if (!canUseStorage()) {
    return () => undefined;
  }

  const handleChange = () => {
    callback();
  };

  window.addEventListener("storage", handleChange);
  window.addEventListener(CONTAINER_STORAGE_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(CONTAINER_STORAGE_EVENT, handleChange);
  };
}
