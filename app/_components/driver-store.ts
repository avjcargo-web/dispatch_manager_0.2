export type DriverRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  baseLocation: string;
  licenseNumber: string;
  vehicleType: string;
  experience: string;
  emergencyContact: string;
  status: "Active" | "On Route" | "Pending";
  trips: number;
  notes: string;
  documents: string[];
  createdAt: string;
};

export type DriverInput = {
  name: string;
  email: string;
  phone: string;
  baseLocation: string;
  licenseNumber: string;
  vehicleType: string;
  experience: string;
  emergencyContact: string;
  notes: string;
  documents: string[];
};

const STORAGE_KEY = "freightflow.drivers";
const DRIVER_STORAGE_EVENT = "freightflow:drivers-updated";

const seedDrivers: DriverRecord[] = [
  {
    id: "DRV-2001",
    name: "Arjun Singh",
    email: "arjun.singh@freightflow.com",
    phone: "+91 98980 11442",
    baseLocation: "Delhi Hub",
    licenseNumber: "DL-14-TR-8821",
    vehicleType: "Heavy Trailer",
    experience: "8 years",
    emergencyContact: "+91 98100 22884",
    status: "On Route",
    trips: 118,
    notes: "Handles northern long-haul lanes and priority FMCG movements.",
    documents: ["Driver-License.pdf", "Route-Clearance.pdf"],
    createdAt: "2026-05-28T08:30:00.000Z",
  },
  {
    id: "DRV-2002",
    name: "Karan Patel",
    email: "karan.patel@freightflow.com",
    phone: "+91 98250 77661",
    baseLocation: "Ahmedabad Yard",
    licenseNumber: "GJ-07-HV-1944",
    vehicleType: "Container Truck",
    experience: "5 years",
    emergencyContact: "+91 98250 66512",
    status: "Active",
    trips: 84,
    notes: "Strong performance on port-linked container schedules.",
    documents: ["Medical-Certificate.pdf", "Container-Endorsement.pdf"],
    createdAt: "2026-06-06T10:15:00.000Z",
  },
  {
    id: "DRV-2003",
    name: "Sameer Khan",
    email: "sameer.khan@freightflow.com",
    phone: "+91 99871 33005",
    baseLocation: "Mumbai Dock",
    licenseNumber: "MH-02-LT-5513",
    vehicleType: "Reefer Truck",
    experience: "3 years",
    emergencyContact: "+91 99871 44006",
    status: "Pending",
    trips: 19,
    notes: "Pending final cold-chain safety clearance and route orientation.",
    documents: ["Reefer-Certification.pdf"],
    createdAt: "2026-06-18T15:20:00.000Z",
  },
];

const seedDriversJson = JSON.stringify(seedDrivers);

let cachedDrivers: DriverRecord[] = seedDrivers;
let cachedRawDrivers = seedDriversJson;

function canUseStorage() {
  return typeof window !== "undefined";
}

function updateDriverCache(rawDrivers: string) {
  try {
    const parsedDrivers = JSON.parse(rawDrivers) as DriverRecord[];

    if (!Array.isArray(parsedDrivers) || parsedDrivers.length === 0) {
      cachedDrivers = seedDrivers;
      cachedRawDrivers = seedDriversJson;
      return seedDriversJson;
    }

    cachedDrivers = parsedDrivers;
    cachedRawDrivers = rawDrivers;
    return rawDrivers;
  } catch {
    cachedDrivers = seedDrivers;
    cachedRawDrivers = seedDriversJson;
    return seedDriversJson;
  }
}

export function getDrivers(): DriverRecord[] {
  if (!canUseStorage()) {
    return seedDrivers;
  }

  const rawDrivers = window.localStorage.getItem(STORAGE_KEY);

  if (!rawDrivers) {
    window.localStorage.setItem(STORAGE_KEY, seedDriversJson);
    cachedDrivers = seedDrivers;
    cachedRawDrivers = seedDriversJson;
    return cachedDrivers;
  }

  if (rawDrivers === cachedRawDrivers) {
    return cachedDrivers;
  }

  const normalizedDrivers = updateDriverCache(rawDrivers);

  if (normalizedDrivers !== rawDrivers) {
    window.localStorage.setItem(STORAGE_KEY, normalizedDrivers);
  }

  return cachedDrivers;
}

export function getDriversServerSnapshot(): DriverRecord[] {
  return seedDrivers;
}

export function addDriver(input: DriverInput) {
  if (!canUseStorage()) {
    return;
  }

  const drivers = getDrivers();
  const nextDriver: DriverRecord = {
    id: `DRV-${Math.floor(1000 + Date.now() % 9000)}`,
    name: input.name,
    email: input.email,
    phone: input.phone,
    baseLocation: input.baseLocation,
    licenseNumber: input.licenseNumber,
    vehicleType: input.vehicleType,
    experience: input.experience,
    emergencyContact: input.emergencyContact,
    status: "Active",
    trips: 0,
    notes: input.notes,
    documents: input.documents,
    createdAt: new Date().toISOString(),
  };

  const nextDrivers = [nextDriver, ...drivers];
  const nextDriversRaw = JSON.stringify(nextDrivers);

  cachedDrivers = nextDrivers;
  cachedRawDrivers = nextDriversRaw;
  window.localStorage.setItem(STORAGE_KEY, nextDriversRaw);
  window.dispatchEvent(new Event(DRIVER_STORAGE_EVENT));
}

export function subscribeDrivers(callback: () => void) {
  if (!canUseStorage()) {
    return () => undefined;
  }

  const handleChange = () => {
    callback();
  };

  window.addEventListener("storage", handleChange);
  window.addEventListener(DRIVER_STORAGE_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(DRIVER_STORAGE_EVENT, handleChange);
  };
}
