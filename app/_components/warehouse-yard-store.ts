export type WarehouseYardRecord = {
  id: string;
  name: string;
  type: "Warehouse" | "Yard";
  city: string;
  manager: string;
  phone: string;
  email: string;
  capacity: string;
  docks: number;
  status: "Active" | "High Utilization" | "Maintenance";
  operatingWindow: string;
  notes: string;
  documents: string[];
  createdAt: string;
};

export type WarehouseYardInput = {
  name: string;
  type: "Warehouse" | "Yard";
  city: string;
  manager: string;
  phone: string;
  email: string;
  capacity: string;
  docks: string;
  operatingWindow: string;
  notes: string;
  documents: string[];
};

const STORAGE_KEY = "freightflow.warehouse-yards";
const WAREHOUSE_YARD_STORAGE_EVENT = "freightflow:warehouse-yards-updated";

const seedWarehouseYards: WarehouseYardRecord[] = [
  {
    id: "WHY-3001",
    name: "Central Cross-Dock",
    type: "Warehouse",
    city: "Mumbai",
    manager: "Neha Kulkarni",
    phone: "+91 98190 33661",
    email: "neha.kulkarni@freightflow.com",
    capacity: "42,000 sq ft",
    docks: 14,
    status: "Active",
    operatingWindow: "24/7",
    notes: "Primary sortation and west-zone transfer facility with fast retail turnover.",
    documents: ["Fire-Clearance.pdf", "Lease-Agreement.pdf"],
    createdAt: "2026-05-30T10:30:00.000Z",
  },
  {
    id: "WHY-3002",
    name: "North Staging Yard",
    type: "Yard",
    city: "Delhi",
    manager: "Ritesh Arora",
    phone: "+91 98911 44227",
    email: "ritesh.arora@freightflow.com",
    capacity: "85 trailer slots",
    docks: 4,
    status: "High Utilization",
    operatingWindow: "05:00 - 23:00",
    notes: "High-turnover vehicle staging area supporting northbound dispatch peaks.",
    documents: ["Yard-Safety-Plan.pdf"],
    createdAt: "2026-06-08T14:05:00.000Z",
  },
  {
    id: "WHY-3003",
    name: "South Cold Storage Hub",
    type: "Warehouse",
    city: "Bengaluru",
    manager: "Lavanya Rao",
    phone: "+91 98450 11981",
    email: "lavanya.rao@freightflow.com",
    capacity: "18,500 pallet positions",
    docks: 9,
    status: "Maintenance",
    operatingWindow: "06:00 - 22:00",
    notes: "Undergoing refrigeration line servicing in one of the controlled zones.",
    documents: ["Cold-Chain-Compliance.pdf", "Maintenance-Schedule.pdf"],
    createdAt: "2026-06-16T09:20:00.000Z",
  },
];

const seedWarehouseYardsJson = JSON.stringify(seedWarehouseYards);

let cachedWarehouseYards: WarehouseYardRecord[] = seedWarehouseYards;
let cachedRawWarehouseYards = seedWarehouseYardsJson;

function canUseStorage() {
  return typeof window !== "undefined";
}

function updateWarehouseYardCache(rawWarehouseYards: string) {
  try {
    const parsedWarehouseYards =
      JSON.parse(rawWarehouseYards) as WarehouseYardRecord[];

    if (
      !Array.isArray(parsedWarehouseYards) ||
      parsedWarehouseYards.length === 0
    ) {
      cachedWarehouseYards = seedWarehouseYards;
      cachedRawWarehouseYards = seedWarehouseYardsJson;
      return seedWarehouseYardsJson;
    }

    cachedWarehouseYards = parsedWarehouseYards;
    cachedRawWarehouseYards = rawWarehouseYards;
    return rawWarehouseYards;
  } catch {
    cachedWarehouseYards = seedWarehouseYards;
    cachedRawWarehouseYards = seedWarehouseYardsJson;
    return seedWarehouseYardsJson;
  }
}

export function getWarehouseYards(): WarehouseYardRecord[] {
  if (!canUseStorage()) {
    return seedWarehouseYards;
  }

  const rawWarehouseYards = window.localStorage.getItem(STORAGE_KEY);

  if (!rawWarehouseYards) {
    window.localStorage.setItem(STORAGE_KEY, seedWarehouseYardsJson);
    cachedWarehouseYards = seedWarehouseYards;
    cachedRawWarehouseYards = seedWarehouseYardsJson;
    return cachedWarehouseYards;
  }

  if (rawWarehouseYards === cachedRawWarehouseYards) {
    return cachedWarehouseYards;
  }

  const normalizedWarehouseYards = updateWarehouseYardCache(rawWarehouseYards);

  if (normalizedWarehouseYards !== rawWarehouseYards) {
    window.localStorage.setItem(STORAGE_KEY, normalizedWarehouseYards);
  }

  return cachedWarehouseYards;
}

export function addWarehouseYard(input: WarehouseYardInput) {
  if (!canUseStorage()) {
    return;
  }

  const warehouseYards = getWarehouseYards();
  const nextWarehouseYard: WarehouseYardRecord = {
    id: `WHY-${Math.floor(1000 + (Date.now() % 9000))}`,
    name: input.name,
    type: input.type,
    city: input.city,
    manager: input.manager,
    phone: input.phone,
    email: input.email,
    capacity: input.capacity,
    docks: Number(input.docks) || 0,
    status: "Active",
    operatingWindow: input.operatingWindow,
    notes: input.notes,
    documents: input.documents,
    createdAt: new Date().toISOString(),
  };

  const nextWarehouseYards = [nextWarehouseYard, ...warehouseYards];
  const nextWarehouseYardsRaw = JSON.stringify(nextWarehouseYards);

  cachedWarehouseYards = nextWarehouseYards;
  cachedRawWarehouseYards = nextWarehouseYardsRaw;
  window.localStorage.setItem(STORAGE_KEY, nextWarehouseYardsRaw);
  window.dispatchEvent(new Event(WAREHOUSE_YARD_STORAGE_EVENT));
}

export function subscribeWarehouseYards(callback: () => void) {
  if (!canUseStorage()) {
    return () => undefined;
  }

  const handleChange = () => {
    callback();
  };

  window.addEventListener("storage", handleChange);
  window.addEventListener(WAREHOUSE_YARD_STORAGE_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(WAREHOUSE_YARD_STORAGE_EVENT, handleChange);
  };
}
