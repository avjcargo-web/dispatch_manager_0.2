import "server-only";
import { connection } from "next/server";
import { type ResultSetHeader, type RowDataPacket } from "mysql2/promise";
import { getMySqlPool } from "./mysql";

type CustomerStatus = "Active" | "Pending";
type PortStatus = "Active" | "Congested" | "Maintenance";
type FacilityType = "Warehouse" | "Yard";
type FacilityStatus = "Active" | "High Utilization" | "Maintenance";
type DriverStatus = "Active" | "On Route" | "Pending";
type ChassisStatus = "Available" | "In Use" | "Maintenance";
type ShippingLineStatus = "Active" | "Preferred" | "Suspended";

export type CustomerRecord = {
  billingTerms: string;
  city: string;
  company: string;
  createdAt: string;
  documents: string[];
  email: string;
  id: string;
  industry: string;
  name: string;
  notes: string;
  phone: string;
  shipments: number;
  status: CustomerStatus;
};

export type CustomerCreateInput = {
  billingTerms: string;
  city: string;
  company: string;
  documents?: string[];
  email: string;
  industry: string;
  name: string;
  notes: string;
  phone: string;
  shipments?: number;
  status?: CustomerStatus;
};

export type CustomerUpdateInput = Partial<CustomerCreateInput>;

export type PortRecord = {
  authority: string;
  capacity: string;
  city: string;
  code: string;
  contactEmail: string;
  contactPhone: string;
  country: string;
  createdAt: string;
  documents: string[];
  id: string;
  name: string;
  notes: string;
  operatingWindow: string;
  status: PortStatus;
  terminalType: string;
};

export type PortCreateInput = {
  authority: string;
  capacity: string;
  city: string;
  code: string;
  contactEmail: string;
  contactPhone: string;
  country: string;
  documents?: string[];
  name: string;
  notes: string;
  operatingWindow: string;
  status?: PortStatus;
  terminalType: string;
};

export type PortUpdateInput = Partial<PortCreateInput>;

export type FacilityRecord = {
  address: string;
  capacity: string;
  city: string;
  createdAt: string;
  docks: number;
  documents: string[];
  email: string;
  id: string;
  manager: string;
  name: string;
  notes: string;
  operatingWindow: string;
  phone: string;
  status: FacilityStatus;
  type: FacilityType;
};

export type FacilityCreateInput = {
  address: string;
  capacity: string;
  city: string;
  docks: number | string;
  documents?: string[];
  email: string;
  manager: string;
  name: string;
  notes: string;
  operatingWindow: string;
  phone: string;
  status?: FacilityStatus;
};

export type FacilityUpdateInput = Partial<FacilityCreateInput>;

export type DriverRecord = {
  baseLocation: string;
  createdAt: string;
  documents: string[];
  email: string;
  emergencyContact: string;
  experience: string;
  id: string;
  licenseNumber: string;
  name: string;
  notes: string;
  phone: string;
  status: DriverStatus;
  trips: number;
  vehicleType: string;
};

export type DriverCreateInput = {
  baseLocation: string;
  documents?: string[];
  email: string;
  emergencyContact: string;
  experience: string;
  licenseNumber: string;
  name: string;
  notes: string;
  phone: string;
  status?: DriverStatus;
  trips?: number;
  vehicleType: string;
};

export type DriverUpdateInput = Partial<DriverCreateInput>;

export type ChassisRecord = {
  assignedContainer: string;
  chassisNumber: string;
  condition: string;
  createdAt: string;
  currentLocation: string;
  documents: string[];
  id: string;
  lastInspection: string;
  notes: string;
  owner: string;
  sizeCompatibility: string;
  status: ChassisStatus;
  type: string;
};

export type ChassisCreateInput = {
  assignedContainer: string;
  chassisNumber: string;
  condition: string;
  currentLocation: string;
  documents?: string[];
  lastInspection: string;
  notes: string;
  owner: string;
  sizeCompatibility: string;
  status?: ChassisStatus;
  type: string;
};

export type ChassisUpdateInput = Partial<ChassisCreateInput>;

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

export type ShippingLineCreateInput = {
  city: string;
  contactEmail: string;
  contactPhone: string;
  country: string;
  documents?: string[];
  name: string;
  notes: string;
  scac: string;
  serviceMode: string;
  status?: ShippingLineStatus;
  website: string;
};

export type ShippingLineUpdateInput = Partial<ShippingLineCreateInput>;

type CustomerRow = RowDataPacket & {
  billing_terms: string;
  city: string;
  company: string;
  created_at: Date | string;
  documents: string | string[] | null;
  email: string;
  id: string;
  industry: string;
  name: string;
  notes: string;
  phone: string;
  shipments: number;
  status: CustomerStatus;
};

type PortRow = RowDataPacket & {
  authority: string;
  capacity: string;
  city: string;
  code: string;
  contact_email: string;
  contact_phone: string;
  country: string;
  created_at: Date | string;
  documents: string | string[] | null;
  id: string;
  name: string;
  notes: string;
  operating_window: string;
  status: PortStatus;
  terminal_type: string;
};

type FacilityRow = RowDataPacket & {
  address: string;
  capacity: string;
  city: string;
  created_at: Date | string;
  docks: number;
  documents: string | string[] | null;
  email: string;
  facility_type: FacilityType;
  id: string;
  manager: string;
  name: string;
  notes: string;
  operating_window: string;
  phone: string;
  status: FacilityStatus;
};

type DriverRow = RowDataPacket & {
  base_location: string;
  created_at: Date | string;
  documents: string | string[] | null;
  email: string;
  emergency_contact: string;
  experience: string;
  id: string;
  license_number: string;
  name: string;
  notes: string;
  phone: string;
  status: DriverStatus;
  trips: number;
  vehicle_type: string;
};

type ChassisRow = RowDataPacket & {
  assigned_container: string;
  chassis_number: string;
  chassis_condition: string;
  created_at: Date | string;
  current_location: string;
  documents: string | string[] | null;
  id: string;
  last_inspection: string;
  notes: string;
  owner: string;
  size_compatibility: string;
  status: ChassisStatus;
  type: string;
};

type ShippingLineRow = RowDataPacket & {
  city: string;
  contact_email: string;
  contact_phone: string;
  country: string;
  created_at: Date | string;
  documents: string | string[] | null;
  id: string;
  name: string;
  notes: string;
  scac: string;
  service_mode: string;
  status: ShippingLineStatus;
  website: string;
};

declare global {
  var __freightflow_core_tables_ready__: Promise<void> | undefined;
}

function asDocuments(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value) as unknown;
      return Array.isArray(parsed)
        ? parsed.filter((item): item is string => typeof item === "string")
        : [];
    } catch {
      return [];
    }
  }

  return [];
}

function asNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function toSqlDateTime(value: string) {
  return value.slice(0, 19).replace("T", " ");
}

function createId(prefix: string) {
  return `${prefix}-${Date.now().toString().slice(-6)}${Math.floor(
    Math.random() * 9,
  )}`;
}

async function ensureColumnExists(
  tableName: "facilities",
  columnName: "address",
  definitionSql: string,
) {
  const pool = getMySqlPool();
  const [rows] = await pool.execute<Array<RowDataPacket & { total: number }>>(
    `SELECT COUNT(*) AS total
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = :tableName
       AND COLUMN_NAME = :columnName`,
    { columnName, tableName },
  );

  if ((rows[0]?.total ?? 0) === 0) {
    await pool.query(`ALTER TABLE ${tableName} ADD COLUMN ${definitionSql}`);
  }
}

async function initializeCoreTables() {
  const pool = getMySqlPool();

  await pool.query(`
        CREATE TABLE IF NOT EXISTS customers (
          id VARCHAR(32) PRIMARY KEY,
          name VARCHAR(191) NOT NULL,
          company VARCHAR(191) NOT NULL,
          email VARCHAR(191) NOT NULL,
          phone VARCHAR(64) NOT NULL,
          city VARCHAR(191) NOT NULL,
          status ENUM('Active', 'Pending') NOT NULL DEFAULT 'Active',
          billing_terms VARCHAR(191) NOT NULL,
          industry VARCHAR(191) NOT NULL,
          shipments INT NOT NULL DEFAULT 0,
          notes TEXT NOT NULL,
          documents LONGTEXT NOT NULL,
          created_at DATETIME NOT NULL,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS ports (
          id VARCHAR(32) PRIMARY KEY,
          name VARCHAR(191) NOT NULL,
          code VARCHAR(64) NOT NULL,
          country VARCHAR(191) NOT NULL,
          city VARCHAR(191) NOT NULL,
          terminal_type VARCHAR(191) NOT NULL,
          authority VARCHAR(191) NOT NULL,
          contact_email VARCHAR(191) NOT NULL,
          contact_phone VARCHAR(64) NOT NULL,
          operating_window VARCHAR(191) NOT NULL,
          status ENUM('Active', 'Congested', 'Maintenance') NOT NULL DEFAULT 'Active',
          capacity VARCHAR(191) NOT NULL,
          notes TEXT NOT NULL,
          documents LONGTEXT NOT NULL,
          created_at DATETIME NOT NULL,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS facilities (
          id VARCHAR(32) PRIMARY KEY,
          facility_type ENUM('Warehouse', 'Yard') NOT NULL,
          name VARCHAR(191) NOT NULL,
          city VARCHAR(191) NOT NULL,
          address VARCHAR(255) NOT NULL DEFAULT '',
          manager VARCHAR(191) NOT NULL,
          phone VARCHAR(64) NOT NULL,
          email VARCHAR(191) NOT NULL,
          capacity VARCHAR(191) NOT NULL,
          docks INT NOT NULL DEFAULT 0,
          status ENUM('Active', 'High Utilization', 'Maintenance') NOT NULL DEFAULT 'Active',
          operating_window VARCHAR(191) NOT NULL,
          notes TEXT NOT NULL,
          documents LONGTEXT NOT NULL,
          created_at DATETIME NOT NULL,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);

  await ensureColumnExists(
    "facilities",
    "address",
    "address VARCHAR(255) NOT NULL DEFAULT '' AFTER city",
  );

  await pool.query(`
        CREATE TABLE IF NOT EXISTS drivers (
          id VARCHAR(32) PRIMARY KEY,
          name VARCHAR(191) NOT NULL,
          email VARCHAR(191) NOT NULL,
          phone VARCHAR(64) NOT NULL,
          base_location VARCHAR(191) NOT NULL,
          license_number VARCHAR(128) NOT NULL,
          vehicle_type VARCHAR(191) NOT NULL,
          experience VARCHAR(191) NOT NULL,
          emergency_contact VARCHAR(64) NOT NULL,
          status ENUM('Active', 'On Route', 'Pending') NOT NULL DEFAULT 'Active',
          trips INT NOT NULL DEFAULT 0,
          notes TEXT NOT NULL,
          documents LONGTEXT NOT NULL,
          created_at DATETIME NOT NULL,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS chassis (
          id VARCHAR(32) PRIMARY KEY,
          chassis_number VARCHAR(128) NOT NULL,
          type VARCHAR(191) NOT NULL,
          size_compatibility VARCHAR(191) NOT NULL,
          owner VARCHAR(191) NOT NULL,
          current_location VARCHAR(191) NOT NULL,
          assigned_container VARCHAR(191) NOT NULL,
          status ENUM('Available', 'In Use', 'Maintenance') NOT NULL DEFAULT 'Available',
          chassis_condition TEXT NOT NULL,
          last_inspection VARCHAR(64) NOT NULL,
          notes TEXT NOT NULL,
          documents LONGTEXT NOT NULL,
          created_at DATETIME NOT NULL,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS shipping_lines (
          id VARCHAR(32) PRIMARY KEY,
          name VARCHAR(191) NOT NULL,
          scac VARCHAR(64) NOT NULL,
          country VARCHAR(191) NOT NULL,
          city VARCHAR(191) NOT NULL,
          service_mode VARCHAR(191) NOT NULL,
          contact_email VARCHAR(191) NOT NULL,
          contact_phone VARCHAR(64) NOT NULL,
          website VARCHAR(191) NOT NULL,
          status ENUM('Active', 'Preferred', 'Suspended') NOT NULL DEFAULT 'Active',
          notes TEXT NOT NULL,
          documents LONGTEXT NOT NULL,
          created_at DATETIME NOT NULL,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
}

async function ensureCoreTables() {
  await connection();

  if (globalThis.__freightflow_core_tables_ready__) {
    try {
      await globalThis.__freightflow_core_tables_ready__;
      return;
    } catch {
      globalThis.__freightflow_core_tables_ready__ = undefined;
    }
  }

  globalThis.__freightflow_core_tables_ready__ = initializeCoreTables().catch(
    (error) => {
      globalThis.__freightflow_core_tables_ready__ = undefined;
      throw error;
    },
  );

  await globalThis.__freightflow_core_tables_ready__;
}

function toIsoString(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function mapCustomer(row: CustomerRow): CustomerRecord {
  return {
    billingTerms: row.billing_terms,
    city: row.city,
    company: row.company,
    createdAt: toIsoString(row.created_at),
    documents: asDocuments(row.documents),
    email: row.email,
    id: row.id,
    industry: row.industry,
    name: row.name,
    notes: row.notes,
    phone: row.phone,
    shipments: asNumber(row.shipments),
    status: row.status,
  };
}

function mapPort(row: PortRow): PortRecord {
  return {
    authority: row.authority,
    capacity: row.capacity,
    city: row.city,
    code: row.code,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    country: row.country,
    createdAt: toIsoString(row.created_at),
    documents: asDocuments(row.documents),
    id: row.id,
    name: row.name,
    notes: row.notes,
    operatingWindow: row.operating_window,
    status: row.status,
    terminalType: row.terminal_type,
  };
}

function mapFacility(row: FacilityRow): FacilityRecord {
  return {
    address: row.address,
    capacity: row.capacity,
    city: row.city,
    createdAt: toIsoString(row.created_at),
    docks: asNumber(row.docks),
    documents: asDocuments(row.documents),
    email: row.email,
    id: row.id,
    manager: row.manager,
    name: row.name,
    notes: row.notes,
    operatingWindow: row.operating_window,
    phone: row.phone,
    status: row.status,
    type: row.facility_type,
  };
}

function mapDriver(row: DriverRow): DriverRecord {
  return {
    baseLocation: row.base_location,
    createdAt: toIsoString(row.created_at),
    documents: asDocuments(row.documents),
    email: row.email,
    emergencyContact: row.emergency_contact,
    experience: row.experience,
    id: row.id,
    licenseNumber: row.license_number,
    name: row.name,
    notes: row.notes,
    phone: row.phone,
    status: row.status,
    trips: asNumber(row.trips),
    vehicleType: row.vehicle_type,
  };
}

function mapChassis(row: ChassisRow): ChassisRecord {
  return {
    assignedContainer: row.assigned_container,
    chassisNumber: row.chassis_number,
    condition: row.chassis_condition,
    createdAt: toIsoString(row.created_at),
    currentLocation: row.current_location,
    documents: asDocuments(row.documents),
    id: row.id,
    lastInspection: row.last_inspection,
    notes: row.notes,
    owner: row.owner,
    sizeCompatibility: row.size_compatibility,
    status: row.status,
    type: row.type,
  };
}

function mapShippingLine(row: ShippingLineRow): ShippingLineRecord {
  return {
    city: row.city,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    country: row.country,
    createdAt: toIsoString(row.created_at),
    documents: asDocuments(row.documents),
    id: row.id,
    name: row.name,
    notes: row.notes,
    scac: row.scac,
    serviceMode: row.service_mode,
    status: row.status,
    website: row.website,
  };
}

export async function listCustomers() {
  await ensureCoreTables();
  const pool = getMySqlPool();
  const [rows] = await pool.query<CustomerRow[]>(
    "SELECT * FROM customers ORDER BY created_at DESC",
  );
  return rows.map(mapCustomer);
}

export async function createCustomer(input: CustomerCreateInput) {
  await ensureCoreTables();
  const pool = getMySqlPool();
  const record: CustomerRecord = {
    billingTerms: asString(input.billingTerms),
    city: asString(input.city),
    company: asString(input.company),
    createdAt: new Date().toISOString(),
    documents: asDocuments(input.documents),
    email: asString(input.email),
    id: createId("CUST"),
    industry: asString(input.industry),
    name: asString(input.name),
    notes: asString(input.notes),
    phone: asString(input.phone),
    shipments: asNumber(input.shipments),
    status: input.status === "Pending" ? "Pending" : "Active",
  };

  await pool.execute(
    `INSERT INTO customers
      (id, name, company, email, phone, city, status, billing_terms, industry, shipments, notes, documents, created_at)
     VALUES
      (:id, :name, :company, :email, :phone, :city, :status, :billingTerms, :industry, :shipments, :notes, :documents, :createdAt)`,
    {
      ...record,
      createdAt: toSqlDateTime(record.createdAt),
      documents: JSON.stringify(record.documents),
    },
  );

  return record;
}

export async function getCustomerById(id: string) {
  await ensureCoreTables();
  const pool = getMySqlPool();
  const [rows] = await pool.execute<CustomerRow[]>(
    "SELECT * FROM customers WHERE id = :id LIMIT 1",
    { id },
  );
  return rows[0] ? mapCustomer(rows[0]) : null;
}

export async function updateCustomer(id: string, input: CustomerUpdateInput) {
  const current = await getCustomerById(id);

  if (!current) {
    return null;
  }

  const pool = getMySqlPool();
  const next: CustomerRecord = {
    ...current,
    billingTerms: input.billingTerms ?? current.billingTerms,
    city: input.city ?? current.city,
    company: input.company ?? current.company,
    documents: input.documents ? asDocuments(input.documents) : current.documents,
    email: input.email ?? current.email,
    industry: input.industry ?? current.industry,
    name: input.name ?? current.name,
    notes: input.notes ?? current.notes,
    phone: input.phone ?? current.phone,
    shipments:
      input.shipments !== undefined ? asNumber(input.shipments) : current.shipments,
    status: input.status ?? current.status,
  };

  await pool.execute(
    `UPDATE customers SET
      name = :name,
      company = :company,
      email = :email,
      phone = :phone,
      city = :city,
      status = :status,
      billing_terms = :billingTerms,
      industry = :industry,
      shipments = :shipments,
      notes = :notes,
      documents = :documents
     WHERE id = :id`,
    {
      ...next,
      documents: JSON.stringify(next.documents),
      id,
    },
  );

  return next;
}

export async function deleteCustomer(id: string) {
  await ensureCoreTables();
  const pool = getMySqlPool();
  const [result] = await pool.execute<ResultSetHeader>(
    "DELETE FROM customers WHERE id = :id",
    { id },
  );
  return result.affectedRows > 0;
}

export async function listPorts() {
  await ensureCoreTables();
  const pool = getMySqlPool();
  const [rows] = await pool.query<PortRow[]>("SELECT * FROM ports ORDER BY created_at DESC");
  return rows.map(mapPort);
}

export async function createPort(input: PortCreateInput) {
  await ensureCoreTables();
  const pool = getMySqlPool();
  const record: PortRecord = {
    authority: asString(input.authority),
    capacity: asString(input.capacity),
    city: asString(input.city),
    code: asString(input.code),
    contactEmail: asString(input.contactEmail),
    contactPhone: asString(input.contactPhone),
    country: asString(input.country),
    createdAt: new Date().toISOString(),
    documents: asDocuments(input.documents),
    id: createId("PORT"),
    name: asString(input.name),
    notes: asString(input.notes),
    operatingWindow: asString(input.operatingWindow),
    status: input.status ?? "Active",
    terminalType: asString(input.terminalType),
  };

  await pool.execute(
    `INSERT INTO ports
      (id, name, code, country, city, terminal_type, authority, contact_email, contact_phone, operating_window, status, capacity, notes, documents, created_at)
     VALUES
      (:id, :name, :code, :country, :city, :terminalType, :authority, :contactEmail, :contactPhone, :operatingWindow, :status, :capacity, :notes, :documents, :createdAt)`,
    {
      ...record,
      createdAt: toSqlDateTime(record.createdAt),
      documents: JSON.stringify(record.documents),
    },
  );

  return record;
}

export async function getPortById(id: string) {
  await ensureCoreTables();
  const pool = getMySqlPool();
  const [rows] = await pool.execute<PortRow[]>(
    "SELECT * FROM ports WHERE id = :id LIMIT 1",
    { id },
  );
  return rows[0] ? mapPort(rows[0]) : null;
}

export async function updatePort(id: string, input: PortUpdateInput) {
  const current = await getPortById(id);

  if (!current) {
    return null;
  }

  const pool = getMySqlPool();
  const next: PortRecord = {
    ...current,
    authority: input.authority ?? current.authority,
    capacity: input.capacity ?? current.capacity,
    city: input.city ?? current.city,
    code: input.code ?? current.code,
    contactEmail: input.contactEmail ?? current.contactEmail,
    contactPhone: input.contactPhone ?? current.contactPhone,
    country: input.country ?? current.country,
    documents: input.documents ? asDocuments(input.documents) : current.documents,
    name: input.name ?? current.name,
    notes: input.notes ?? current.notes,
    operatingWindow: input.operatingWindow ?? current.operatingWindow,
    status: input.status ?? current.status,
    terminalType: input.terminalType ?? current.terminalType,
  };

  await pool.execute(
    `UPDATE ports SET
      name = :name,
      code = :code,
      country = :country,
      city = :city,
      terminal_type = :terminalType,
      authority = :authority,
      contact_email = :contactEmail,
      contact_phone = :contactPhone,
      operating_window = :operatingWindow,
      status = :status,
      capacity = :capacity,
      notes = :notes,
      documents = :documents
     WHERE id = :id`,
    {
      ...next,
      documents: JSON.stringify(next.documents),
      id,
    },
  );

  return next;
}

export async function deletePort(id: string) {
  await ensureCoreTables();
  const pool = getMySqlPool();
  const [result] = await pool.execute<ResultSetHeader>(
    "DELETE FROM ports WHERE id = :id",
    { id },
  );
  return result.affectedRows > 0;
}

async function listFacilities(type: FacilityType) {
  await ensureCoreTables();
  const pool = getMySqlPool();
  const [rows] = await pool.execute<FacilityRow[]>(
    "SELECT * FROM facilities WHERE facility_type = :type ORDER BY created_at DESC",
    { type },
  );
  return rows.map(mapFacility);
}

async function createFacility(type: FacilityType, input: FacilityCreateInput) {
  await ensureCoreTables();
  const pool = getMySqlPool();
  const record: FacilityRecord = {
    address: asString(input.address),
    capacity: asString(input.capacity),
    city: asString(input.city),
    createdAt: new Date().toISOString(),
    docks: asNumber(
      typeof input.docks === "string" ? Number(input.docks) : input.docks,
    ),
    documents: asDocuments(input.documents),
    email: asString(input.email),
    id: createId("WHY"),
    manager: asString(input.manager),
    name: asString(input.name),
    notes: asString(input.notes),
    operatingWindow: asString(input.operatingWindow),
    phone: asString(input.phone),
    status: input.status ?? "Active",
    type,
  };

  await pool.execute(
    `INSERT INTO facilities
      (id, facility_type, name, city, address, manager, phone, email, capacity, docks, status, operating_window, notes, documents, created_at)
     VALUES
      (:id, :type, :name, :city, :address, :manager, :phone, :email, :capacity, :docks, :status, :operatingWindow, :notes, :documents, :createdAt)`,
    {
      ...record,
      createdAt: toSqlDateTime(record.createdAt),
      documents: JSON.stringify(record.documents),
    },
  );

  return record;
}

async function getFacilityById(type: FacilityType, id: string) {
  await ensureCoreTables();
  const pool = getMySqlPool();
  const [rows] = await pool.execute<FacilityRow[]>(
    "SELECT * FROM facilities WHERE facility_type = :type AND id = :id LIMIT 1",
    { id, type },
  );
  return rows[0] ? mapFacility(rows[0]) : null;
}

async function updateFacility(
  type: FacilityType,
  id: string,
  input: FacilityUpdateInput,
) {
  const current = await getFacilityById(type, id);

  if (!current) {
    return null;
  }

  const pool = getMySqlPool();
  const next: FacilityRecord = {
    ...current,
    address: input.address ?? current.address,
    capacity: input.capacity ?? current.capacity,
    city: input.city ?? current.city,
    docks:
      input.docks !== undefined
        ? asNumber(typeof input.docks === "string" ? Number(input.docks) : input.docks)
        : current.docks,
    documents: input.documents ? asDocuments(input.documents) : current.documents,
    email: input.email ?? current.email,
    manager: input.manager ?? current.manager,
    name: input.name ?? current.name,
    notes: input.notes ?? current.notes,
    operatingWindow: input.operatingWindow ?? current.operatingWindow,
    phone: input.phone ?? current.phone,
    status: input.status ?? current.status,
    type,
  };

  await pool.execute(
    `UPDATE facilities SET
      name = :name,
      city = :city,
      address = :address,
      manager = :manager,
      phone = :phone,
      email = :email,
      capacity = :capacity,
      docks = :docks,
      status = :status,
      operating_window = :operatingWindow,
      notes = :notes,
      documents = :documents
     WHERE facility_type = :type AND id = :id`,
    {
      ...next,
      documents: JSON.stringify(next.documents),
      id,
    },
  );

  return next;
}

async function deleteFacility(type: FacilityType, id: string) {
  await ensureCoreTables();
  const pool = getMySqlPool();
  const [result] = await pool.execute<ResultSetHeader>(
    "DELETE FROM facilities WHERE facility_type = :type AND id = :id",
    { id, type },
  );
  return result.affectedRows > 0;
}

export async function listWarehouses() {
  return listFacilities("Warehouse");
}

export async function createWarehouse(input: FacilityCreateInput) {
  return createFacility("Warehouse", input);
}

export async function getWarehouseById(id: string) {
  return getFacilityById("Warehouse", id);
}

export async function updateWarehouse(id: string, input: FacilityUpdateInput) {
  return updateFacility("Warehouse", id, input);
}

export async function deleteWarehouse(id: string) {
  return deleteFacility("Warehouse", id);
}

export async function listYards() {
  return listFacilities("Yard");
}

export async function createYard(input: FacilityCreateInput) {
  return createFacility("Yard", input);
}

export async function getYardById(id: string) {
  return getFacilityById("Yard", id);
}

export async function updateYard(id: string, input: FacilityUpdateInput) {
  return updateFacility("Yard", id, input);
}

export async function deleteYard(id: string) {
  return deleteFacility("Yard", id);
}

export async function listDrivers() {
  await ensureCoreTables();
  const pool = getMySqlPool();
  const [rows] = await pool.query<DriverRow[]>(
    "SELECT * FROM drivers ORDER BY created_at DESC",
  );
  return rows.map(mapDriver);
}

export async function createDriver(input: DriverCreateInput) {
  await ensureCoreTables();
  const pool = getMySqlPool();
  const record: DriverRecord = {
    baseLocation: asString(input.baseLocation),
    createdAt: new Date().toISOString(),
    documents: asDocuments(input.documents),
    email: asString(input.email),
    emergencyContact: asString(input.emergencyContact),
    experience: asString(input.experience),
    id: createId("DRV"),
    licenseNumber: asString(input.licenseNumber),
    name: asString(input.name),
    notes: asString(input.notes),
    phone: asString(input.phone),
    status: input.status ?? "Active",
    trips: asNumber(input.trips),
    vehicleType: asString(input.vehicleType),
  };

  await pool.execute(
    `INSERT INTO drivers
      (id, name, email, phone, base_location, license_number, vehicle_type, experience, emergency_contact, status, trips, notes, documents, created_at)
     VALUES
      (:id, :name, :email, :phone, :baseLocation, :licenseNumber, :vehicleType, :experience, :emergencyContact, :status, :trips, :notes, :documents, :createdAt)`,
    {
      ...record,
      createdAt: toSqlDateTime(record.createdAt),
      documents: JSON.stringify(record.documents),
    },
  );

  return record;
}

export async function getDriverById(id: string) {
  await ensureCoreTables();
  const pool = getMySqlPool();
  const [rows] = await pool.execute<DriverRow[]>(
    "SELECT * FROM drivers WHERE id = :id LIMIT 1",
    { id },
  );
  return rows[0] ? mapDriver(rows[0]) : null;
}

export async function updateDriver(id: string, input: DriverUpdateInput) {
  const current = await getDriverById(id);

  if (!current) {
    return null;
  }

  const pool = getMySqlPool();
  const next: DriverRecord = {
    ...current,
    baseLocation: input.baseLocation ?? current.baseLocation,
    documents: input.documents ? asDocuments(input.documents) : current.documents,
    email: input.email ?? current.email,
    emergencyContact: input.emergencyContact ?? current.emergencyContact,
    experience: input.experience ?? current.experience,
    licenseNumber: input.licenseNumber ?? current.licenseNumber,
    name: input.name ?? current.name,
    notes: input.notes ?? current.notes,
    phone: input.phone ?? current.phone,
    status: input.status ?? current.status,
    trips: input.trips !== undefined ? asNumber(input.trips) : current.trips,
    vehicleType: input.vehicleType ?? current.vehicleType,
  };

  await pool.execute(
    `UPDATE drivers SET
      name = :name,
      email = :email,
      phone = :phone,
      base_location = :baseLocation,
      license_number = :licenseNumber,
      vehicle_type = :vehicleType,
      experience = :experience,
      emergency_contact = :emergencyContact,
      status = :status,
      trips = :trips,
      notes = :notes,
      documents = :documents
     WHERE id = :id`,
    {
      ...next,
      documents: JSON.stringify(next.documents),
      id,
    },
  );

  return next;
}

export async function deleteDriver(id: string) {
  await ensureCoreTables();
  const pool = getMySqlPool();
  const [result] = await pool.execute<ResultSetHeader>(
    "DELETE FROM drivers WHERE id = :id",
    { id },
  );
  return result.affectedRows > 0;
}

export async function listChassis() {
  await ensureCoreTables();
  const pool = getMySqlPool();
  const [rows] = await pool.query<ChassisRow[]>(
    "SELECT * FROM chassis ORDER BY created_at DESC",
  );
  return rows.map(mapChassis);
}

export async function createChassis(input: ChassisCreateInput) {
  await ensureCoreTables();
  const pool = getMySqlPool();
  const record: ChassisRecord = {
    assignedContainer: asString(input.assignedContainer),
    chassisNumber: asString(input.chassisNumber),
    condition: asString(input.condition),
    createdAt: new Date().toISOString(),
    currentLocation: asString(input.currentLocation),
    documents: asDocuments(input.documents),
    id: createId("CHS"),
    lastInspection: asString(input.lastInspection),
    notes: asString(input.notes),
    owner: asString(input.owner),
    sizeCompatibility: asString(input.sizeCompatibility),
    status: input.status ?? "Available",
    type: asString(input.type),
  };

  await pool.execute(
    `INSERT INTO chassis
      (id, chassis_number, type, size_compatibility, owner, current_location, assigned_container, status, chassis_condition, last_inspection, notes, documents, created_at)
     VALUES
      (:id, :chassisNumber, :type, :sizeCompatibility, :owner, :currentLocation, :assignedContainer, :status, :condition, :lastInspection, :notes, :documents, :createdAt)`,
    {
      ...record,
      createdAt: toSqlDateTime(record.createdAt),
      documents: JSON.stringify(record.documents),
    },
  );

  return record;
}

export async function getChassisById(id: string) {
  await ensureCoreTables();
  const pool = getMySqlPool();
  const [rows] = await pool.execute<ChassisRow[]>(
    "SELECT * FROM chassis WHERE id = :id LIMIT 1",
    { id },
  );
  return rows[0] ? mapChassis(rows[0]) : null;
}

export async function updateChassis(id: string, input: ChassisUpdateInput) {
  const current = await getChassisById(id);

  if (!current) {
    return null;
  }

  const pool = getMySqlPool();
  const next: ChassisRecord = {
    ...current,
    assignedContainer: input.assignedContainer ?? current.assignedContainer,
    chassisNumber: input.chassisNumber ?? current.chassisNumber,
    condition: input.condition ?? current.condition,
    currentLocation: input.currentLocation ?? current.currentLocation,
    documents: input.documents ? asDocuments(input.documents) : current.documents,
    lastInspection: input.lastInspection ?? current.lastInspection,
    notes: input.notes ?? current.notes,
    owner: input.owner ?? current.owner,
    sizeCompatibility: input.sizeCompatibility ?? current.sizeCompatibility,
    status: input.status ?? current.status,
    type: input.type ?? current.type,
  };

  await pool.execute(
    `UPDATE chassis SET
      chassis_number = :chassisNumber,
      type = :type,
      size_compatibility = :sizeCompatibility,
      owner = :owner,
      current_location = :currentLocation,
      assigned_container = :assignedContainer,
      status = :status,
      chassis_condition = :condition,
      last_inspection = :lastInspection,
      notes = :notes,
      documents = :documents
     WHERE id = :id`,
    {
      ...next,
      documents: JSON.stringify(next.documents),
      id,
    },
  );

  return next;
}

export async function deleteChassis(id: string) {
  await ensureCoreTables();
  const pool = getMySqlPool();
  const [result] = await pool.execute<ResultSetHeader>(
    "DELETE FROM chassis WHERE id = :id",
    { id },
  );
  return result.affectedRows > 0;
}

export async function listShippingLines() {
  await ensureCoreTables();
  const pool = getMySqlPool();
  const [rows] = await pool.query<ShippingLineRow[]>(
    "SELECT * FROM shipping_lines ORDER BY created_at DESC",
  );
  return rows.map(mapShippingLine);
}

export async function createShippingLine(input: ShippingLineCreateInput) {
  await ensureCoreTables();
  const pool = getMySqlPool();
  const record: ShippingLineRecord = {
    city: asString(input.city),
    contactEmail: asString(input.contactEmail),
    contactPhone: asString(input.contactPhone),
    country: asString(input.country),
    createdAt: new Date().toISOString(),
    documents: asDocuments(input.documents),
    id: createId("SHIP"),
    name: asString(input.name),
    notes: asString(input.notes),
    scac: asString(input.scac),
    serviceMode: asString(input.serviceMode),
    status: input.status ?? "Active",
    website: asString(input.website),
  };

  await pool.execute(
    `INSERT INTO shipping_lines
      (id, name, scac, country, city, service_mode, contact_email, contact_phone, website, status, notes, documents, created_at)
     VALUES
      (:id, :name, :scac, :country, :city, :serviceMode, :contactEmail, :contactPhone, :website, :status, :notes, :documents, :createdAt)`,
    {
      ...record,
      createdAt: toSqlDateTime(record.createdAt),
      documents: JSON.stringify(record.documents),
    },
  );

  return record;
}

export async function getShippingLineById(id: string) {
  await ensureCoreTables();
  const pool = getMySqlPool();
  const [rows] = await pool.execute<ShippingLineRow[]>(
    "SELECT * FROM shipping_lines WHERE id = :id LIMIT 1",
    { id },
  );
  return rows[0] ? mapShippingLine(rows[0]) : null;
}

export async function updateShippingLine(
  id: string,
  input: ShippingLineUpdateInput,
) {
  const current = await getShippingLineById(id);

  if (!current) {
    return null;
  }

  const pool = getMySqlPool();
  const next: ShippingLineRecord = {
    ...current,
    city: input.city ?? current.city,
    contactEmail: input.contactEmail ?? current.contactEmail,
    contactPhone: input.contactPhone ?? current.contactPhone,
    country: input.country ?? current.country,
    documents: input.documents ? asDocuments(input.documents) : current.documents,
    name: input.name ?? current.name,
    notes: input.notes ?? current.notes,
    scac: input.scac ?? current.scac,
    serviceMode: input.serviceMode ?? current.serviceMode,
    status: input.status ?? current.status,
    website: input.website ?? current.website,
  };

  await pool.execute(
    `UPDATE shipping_lines SET
      name = :name,
      scac = :scac,
      country = :country,
      city = :city,
      service_mode = :serviceMode,
      contact_email = :contactEmail,
      contact_phone = :contactPhone,
      website = :website,
      status = :status,
      notes = :notes,
      documents = :documents
     WHERE id = :id`,
    {
      ...next,
      documents: JSON.stringify(next.documents),
      id,
    },
  );

  return next;
}

export async function deleteShippingLine(id: string) {
  await ensureCoreTables();
  const pool = getMySqlPool();
  const [result] = await pool.execute<ResultSetHeader>(
    "DELETE FROM shipping_lines WHERE id = :id",
    { id },
  );
  return result.affectedRows > 0;
}

export async function ensureSectionTables() {
  await ensureCoreTables();
}
