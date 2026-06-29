export type ChassisRecord = {
  id: string;
  chassisNumber: string;
  type: string;
  sizeCompatibility: string;
  owner: string;
  currentLocation: string;
  assignedContainer: string;
  status: "Available" | "In Use" | "Maintenance";
  condition: string;
  lastInspection: string;
  notes: string;
  documents: string[];
  createdAt: string;
};

export type ChassisInput = {
  chassisNumber: string;
  type: string;
  sizeCompatibility: string;
  owner: string;
  currentLocation: string;
  assignedContainer: string;
  condition: string;
  lastInspection: string;
  notes: string;
  documents: string[];
};

const STORAGE_KEY = "freightflow.chassis";
const CHASSIS_STORAGE_EVENT = "freightflow:chassis-updated";

const seedChassis: ChassisRecord[] = [
  {
    id: "CHS-6001",
    chassisNumber: "CH-MUM-2218",
    type: "Tri-axle",
    sizeCompatibility: "40 ft / 45 ft",
    owner: "FreightFlow Fleet",
    currentLocation: "Mumbai Port Yard",
    assignedContainer: "MSCU-482190-3",
    status: "In Use",
    condition: "Roadworthy and loaded",
    lastInspection: "2026-06-20",
    notes: "Assigned for west coast outbound container movement.",
    documents: ["Fitness-Certificate.pdf", "Brake-Check.pdf"],
    createdAt: "2026-06-04T09:20:00.000Z",
  },
  {
    id: "CHS-6002",
    chassisNumber: "CH-BLR-1184",
    type: "Tandem axle",
    sizeCompatibility: "20 ft / 40 ft",
    owner: "Southern Trailer Leasing",
    currentLocation: "South Cold Storage Hub",
    assignedContainer: "Unassigned",
    status: "Available",
    condition: "Ready for dispatch",
    lastInspection: "2026-06-23",
    notes: "Standing by for reefer-linked export moves.",
    documents: ["Maintenance-Log.pdf"],
    createdAt: "2026-06-13T12:10:00.000Z",
  },
  {
    id: "CHS-6003",
    chassisNumber: "CH-DEL-9042",
    type: "Slider chassis",
    sizeCompatibility: "20 ft / 40 ft",
    owner: "North Mobility Assets",
    currentLocation: "North Staging Yard",
    assignedContainer: "OOLU-195672-1",
    status: "Maintenance",
    condition: "Suspension and light kit under repair",
    lastInspection: "2026-06-25",
    notes: "Blocked from dispatch until workshop clearance is complete.",
    documents: ["Repair-Order.pdf", "Workshop-Photos.zip"],
    createdAt: "2026-06-21T16:05:00.000Z",
  },
];

const seedChassisJson = JSON.stringify(seedChassis);

let cachedChassis: ChassisRecord[] = seedChassis;
let cachedRawChassis = seedChassisJson;

function canUseStorage() {
  return typeof window !== "undefined";
}

function updateChassisCache(rawChassis: string) {
  try {
    const parsedChassis = JSON.parse(rawChassis) as ChassisRecord[];

    if (!Array.isArray(parsedChassis) || parsedChassis.length === 0) {
      cachedChassis = seedChassis;
      cachedRawChassis = seedChassisJson;
      return seedChassisJson;
    }

    cachedChassis = parsedChassis;
    cachedRawChassis = rawChassis;
    return rawChassis;
  } catch {
    cachedChassis = seedChassis;
    cachedRawChassis = seedChassisJson;
    return seedChassisJson;
  }
}

export function getChassis(): ChassisRecord[] {
  if (!canUseStorage()) {
    return seedChassis;
  }

  const rawChassis = window.localStorage.getItem(STORAGE_KEY);

  if (!rawChassis) {
    window.localStorage.setItem(STORAGE_KEY, seedChassisJson);
    cachedChassis = seedChassis;
    cachedRawChassis = seedChassisJson;
    return cachedChassis;
  }

  if (rawChassis === cachedRawChassis) {
    return cachedChassis;
  }

  const normalizedChassis = updateChassisCache(rawChassis);

  if (normalizedChassis !== rawChassis) {
    window.localStorage.setItem(STORAGE_KEY, normalizedChassis);
  }

  return cachedChassis;
}

export function getChassisServerSnapshot(): ChassisRecord[] {
  return seedChassis;
}

export function addChassis(input: ChassisInput) {
  if (!canUseStorage()) {
    return;
  }

  const chassis = getChassis();
  const nextChassis: ChassisRecord = {
    id: `CHS-${Math.floor(1000 + (Date.now() % 9000))}`,
    chassisNumber: input.chassisNumber,
    type: input.type,
    sizeCompatibility: input.sizeCompatibility,
    owner: input.owner,
    currentLocation: input.currentLocation,
    assignedContainer: input.assignedContainer,
    status: "Available",
    condition: input.condition,
    lastInspection: input.lastInspection,
    notes: input.notes,
    documents: input.documents,
    createdAt: new Date().toISOString(),
  };

  const nextChassisList = [nextChassis, ...chassis];
  const nextChassisRaw = JSON.stringify(nextChassisList);

  cachedChassis = nextChassisList;
  cachedRawChassis = nextChassisRaw;
  window.localStorage.setItem(STORAGE_KEY, nextChassisRaw);
  window.dispatchEvent(new Event(CHASSIS_STORAGE_EVENT));
}

export function subscribeChassis(callback: () => void) {
  if (!canUseStorage()) {
    return () => undefined;
  }

  const handleChange = () => {
    callback();
  };

  window.addEventListener("storage", handleChange);
  window.addEventListener(CHASSIS_STORAGE_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(CHASSIS_STORAGE_EVENT, handleChange);
  };
}
