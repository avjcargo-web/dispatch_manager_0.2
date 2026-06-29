export type CustomerRecord = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  status: "Active" | "Pending";
  billingTerms: string;
  industry: string;
  shipments: number;
  notes: string;
  documents: string[];
  createdAt: string;
};

export type CustomerInput = {
  name: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  billingTerms: string;
  industry: string;
  notes: string;
  documents: string[];
};

const STORAGE_KEY = "freightflow.customers";
const CUSTOMER_STORAGE_EVENT = "freightflow:customers-updated";

const seedCustomers: CustomerRecord[] = [
  {
    id: "CUST-1001",
    name: "Rohan Mehta",
    company: "Metro Retail Supply",
    email: "rohan.mehta@metroretail.com",
    phone: "+91 98765 00112",
    city: "Mumbai",
    status: "Active",
    billingTerms: "Net 30",
    industry: "Retail Distribution",
    shipments: 42,
    notes: "High-frequency metro deliveries with recurring weekend dispatch.",
    documents: ["Rate-Agreement.pdf", "GST-Certificate.pdf"],
    createdAt: "2026-06-03T09:15:00.000Z",
  },
  {
    id: "CUST-1002",
    name: "Ananya Sharma",
    company: "NorthFresh Foods",
    email: "ananya.sharma@northfresh.in",
    phone: "+91 98110 44556",
    city: "Delhi",
    status: "Active",
    billingTerms: "Net 21",
    industry: "Cold Chain",
    shipments: 31,
    notes: "Temperature-sensitive cargo with priority dock assignment.",
    documents: ["Cold-Chain-SLA.pdf", "Compliance-Sheet.xlsx"],
    createdAt: "2026-06-09T13:45:00.000Z",
  },
  {
    id: "CUST-1003",
    name: "Vikram Patel",
    company: "Westline Components",
    email: "vikram.patel@westline.co",
    phone: "+91 99240 77441",
    city: "Ahmedabad",
    status: "Pending",
    billingTerms: "Advance",
    industry: "Manufacturing",
    shipments: 12,
    notes: "Awaiting final GST and billing contact confirmation.",
    documents: ["Factory-License.pdf"],
    createdAt: "2026-06-17T16:10:00.000Z",
  },
];

const seedCustomersJson = JSON.stringify(seedCustomers);

let cachedCustomers: CustomerRecord[] = seedCustomers;
let cachedRawCustomers = seedCustomersJson;

function canUseStorage() {
  return typeof window !== "undefined";
}

function updateCustomerCache(rawCustomers: string) {
  try {
    const parsedCustomers = JSON.parse(rawCustomers) as CustomerRecord[];

    if (!Array.isArray(parsedCustomers) || parsedCustomers.length === 0) {
      cachedCustomers = seedCustomers;
      cachedRawCustomers = seedCustomersJson;
      return seedCustomersJson;
    }

    cachedCustomers = parsedCustomers;
    cachedRawCustomers = rawCustomers;
    return rawCustomers;
  } catch {
    cachedCustomers = seedCustomers;
    cachedRawCustomers = seedCustomersJson;
    return seedCustomersJson;
  }
}

export function getCustomers(): CustomerRecord[] {
  if (!canUseStorage()) {
    return seedCustomers;
  }

  const rawCustomers = window.localStorage.getItem(STORAGE_KEY);

  if (!rawCustomers) {
    window.localStorage.setItem(STORAGE_KEY, seedCustomersJson);
    cachedCustomers = seedCustomers;
    cachedRawCustomers = seedCustomersJson;
    return cachedCustomers;
  }

  if (rawCustomers === cachedRawCustomers) {
    return cachedCustomers;
  }

  const normalizedCustomers = updateCustomerCache(rawCustomers);

  if (normalizedCustomers !== rawCustomers) {
    window.localStorage.setItem(STORAGE_KEY, normalizedCustomers);
  }

  return cachedCustomers;
}

export function addCustomer(input: CustomerInput) {
  if (!canUseStorage()) {
    return;
  }

  const customers = getCustomers();
  const nextCustomer: CustomerRecord = {
    id: `CUST-${Math.floor(1000 + Date.now() % 9000)}`,
    name: input.name,
    company: input.company,
    email: input.email,
    phone: input.phone,
    city: input.city,
    status: "Active",
    billingTerms: input.billingTerms,
    industry: input.industry,
    shipments: 0,
    notes: input.notes,
    documents: input.documents,
    createdAt: new Date().toISOString(),
  };

  const nextCustomers = [nextCustomer, ...customers];
  const nextCustomersRaw = JSON.stringify(nextCustomers);

  cachedCustomers = nextCustomers;
  cachedRawCustomers = nextCustomersRaw;
  window.localStorage.setItem(STORAGE_KEY, nextCustomersRaw);
  window.dispatchEvent(new Event(CUSTOMER_STORAGE_EVENT));
}

export function subscribeCustomers(callback: () => void) {
  if (!canUseStorage()) {
    return () => undefined;
  }

  const handleChange = () => {
    callback();
  };

  window.addEventListener("storage", handleChange);
  window.addEventListener(CUSTOMER_STORAGE_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(CUSTOMER_STORAGE_EVENT, handleChange);
  };
}
