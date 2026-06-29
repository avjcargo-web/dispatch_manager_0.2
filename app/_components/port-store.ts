export type PortRecord = {
  id: string;
  name: string;
  code: string;
  country: string;
  city: string;
  terminalType: string;
  authority: string;
  contactEmail: string;
  contactPhone: string;
  operatingWindow: string;
  status: "Active" | "Congested" | "Maintenance";
  capacity: string;
  notes: string;
  documents: string[];
  createdAt: string;
};

export type PortInput = {
  name: string;
  code: string;
  country: string;
  city: string;
  terminalType: string;
  authority: string;
  contactEmail: string;
  contactPhone: string;
  operatingWindow: string;
  capacity: string;
  notes: string;
  documents: string[];
};

const STORAGE_KEY = "freightflow.ports";
const PORT_STORAGE_EVENT = "freightflow:ports-updated";

const seedPorts: PortRecord[] = [
  {
    id: "PORT-5001",
    name: "Jawaharlal Nehru Port",
    code: "INNSA",
    country: "India",
    city: "Navi Mumbai",
    terminalType: "Container Port",
    authority: "JNPA",
    contactEmail: "ops@jnpa.in",
    contactPhone: "+91 22 2724 2222",
    operatingWindow: "24/7",
    status: "Active",
    capacity: "5.5M TEU annually",
    notes: "Primary gateway for west coast container traffic and export lanes.",
    documents: ["Port-Access-Guidelines.pdf", "Terminal-SLA.pdf"],
    createdAt: "2026-06-01T08:30:00.000Z",
  },
  {
    id: "PORT-5002",
    name: "Chennai Port",
    code: "INMAA",
    country: "India",
    city: "Chennai",
    terminalType: "Mixed Cargo Port",
    authority: "Chennai Port Authority",
    contactEmail: "coordination@chennaiport.gov.in",
    contactPhone: "+91 44 2536 2222",
    operatingWindow: "24/7",
    status: "Congested",
    capacity: "1.8M TEU annually",
    notes: "High volume on automotive and southbound container movements.",
    documents: ["Berth-Schedule.pdf"],
    createdAt: "2026-06-10T11:10:00.000Z",
  },
  {
    id: "PORT-5003",
    name: "Visakhapatnam Port",
    code: "INVTZ",
    country: "India",
    city: "Visakhapatnam",
    terminalType: "Bulk and Container",
    authority: "VPA",
    contactEmail: "harbor.control@vizagport.com",
    contactPhone: "+91 891 287 3000",
    operatingWindow: "06:00 - 23:00",
    status: "Maintenance",
    capacity: "1.2M TEU annually",
    notes: "One berth under scheduled crane maintenance this week.",
    documents: ["Maintenance-Notice.pdf", "Harbor-Entry-Procedure.pdf"],
    createdAt: "2026-06-18T14:40:00.000Z",
  },
];

const seedPortsJson = JSON.stringify(seedPorts);

let cachedPorts: PortRecord[] = seedPorts;
let cachedRawPorts = seedPortsJson;

function canUseStorage() {
  return typeof window !== "undefined";
}

function updatePortCache(rawPorts: string) {
  try {
    const parsedPorts = JSON.parse(rawPorts) as PortRecord[];

    if (!Array.isArray(parsedPorts) || parsedPorts.length === 0) {
      cachedPorts = seedPorts;
      cachedRawPorts = seedPortsJson;
      return seedPortsJson;
    }

    cachedPorts = parsedPorts;
    cachedRawPorts = rawPorts;
    return rawPorts;
  } catch {
    cachedPorts = seedPorts;
    cachedRawPorts = seedPortsJson;
    return seedPortsJson;
  }
}

export function getPorts(): PortRecord[] {
  if (!canUseStorage()) {
    return seedPorts;
  }

  const rawPorts = window.localStorage.getItem(STORAGE_KEY);

  if (!rawPorts) {
    window.localStorage.setItem(STORAGE_KEY, seedPortsJson);
    cachedPorts = seedPorts;
    cachedRawPorts = seedPortsJson;
    return cachedPorts;
  }

  if (rawPorts === cachedRawPorts) {
    return cachedPorts;
  }

  const normalizedPorts = updatePortCache(rawPorts);

  if (normalizedPorts !== rawPorts) {
    window.localStorage.setItem(STORAGE_KEY, normalizedPorts);
  }

  return cachedPorts;
}

export function addPort(input: PortInput) {
  if (!canUseStorage()) {
    return;
  }

  const ports = getPorts();
  const nextPort: PortRecord = {
    id: `PORT-${Math.floor(1000 + (Date.now() % 9000))}`,
    name: input.name,
    code: input.code,
    country: input.country,
    city: input.city,
    terminalType: input.terminalType,
    authority: input.authority,
    contactEmail: input.contactEmail,
    contactPhone: input.contactPhone,
    operatingWindow: input.operatingWindow,
    status: "Active",
    capacity: input.capacity,
    notes: input.notes,
    documents: input.documents,
    createdAt: new Date().toISOString(),
  };

  const nextPorts = [nextPort, ...ports];
  const nextPortsRaw = JSON.stringify(nextPorts);

  cachedPorts = nextPorts;
  cachedRawPorts = nextPortsRaw;
  window.localStorage.setItem(STORAGE_KEY, nextPortsRaw);
  window.dispatchEvent(new Event(PORT_STORAGE_EVENT));
}

export function subscribePorts(callback: () => void) {
  if (!canUseStorage()) {
    return () => undefined;
  }

  const handleChange = () => {
    callback();
  };

  window.addEventListener("storage", handleChange);
  window.addEventListener(PORT_STORAGE_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(PORT_STORAGE_EVENT, handleChange);
  };
}
