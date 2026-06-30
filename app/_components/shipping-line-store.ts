export type ShippingLineStatus = "Active" | "Preferred" | "Suspended";

export type ShippingLineRecord = {
  city: string;
  contactEmail: string;
  contactPhone: string;
  country: string;
  createdAt: string;
  documents: string[];
  id: string;
  name: string;
  notes: string;
  scac: string;
  serviceMode: string;
  status: ShippingLineStatus;
  website: string;
};
