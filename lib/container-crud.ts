import "server-only";
import { connection } from "next/server";
import { type ResultSetHeader, type RowDataPacket } from "mysql2/promise";
import { getMySqlPool } from "./mysql";

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
  port: string;
  pickupBookingTime: string;
  pickupLocation: string;
  prepull: string;
  scac: string;
  sealNumber: string;
  shipEta: string;
  shippingLine: string;
  size: string;
  status: ContainerStatus;
  storage: string;
  type: string;
  waiting: string;
  warehouse: string;
  warehouseAddress: string;
  weightLbs: string;
};

export type ContainerCreateInput = {
  additionalCharges?: ContainerCharge[];
  baseRate: string;
  bookingNumber: string;
  chassis: string;
  checkedInNumber: string;
  containerNumber: string;
  currencyType: string;
  customer: string;
  documents?: string[];
  lfd: string;
  loadType: "Import" | "Export";
  notes: string;
  port: string;
  pickupBookingTime: string;
  pickupLocation: string;
  prepull: string;
  scac: string;
  sealNumber: string;
  shipEta: string;
  shippingLine: string;
  size: string;
  status?: ContainerStatus;
  storage: string;
  type: string;
  waiting: string;
  warehouse: string;
  warehouseAddress: string;
  weightLbs: string;
};

export type ContainerUpdateInput = Partial<ContainerCreateInput>;

type ContainerRow = RowDataPacket & {
  additional_charges: string | ContainerCharge[] | null;
  base_rate: string;
  booking_number: string;
  chassis: string;
  checked_in_number: string;
  container_number: string;
  created_at: Date | string;
  currency_type: string;
  customer: string;
  documents: string | string[] | null;
  id: string;
  lfd: string;
  load_type: "Import" | "Export";
  notes: string;
  port: string;
  pickup_booking_time: string;
  pickup_location: string;
  prepull: string;
  scac: string;
  seal_number: string;
  ship_eta: string;
  shipping_line: string;
  size: string;
  status: ContainerStatus;
  storage: string;
  type: string;
  waiting: string;
  warehouse: string;
  warehouse_address: string;
  weight_lbs: string;
};

declare global {
  var __freightflow_containers_table_ready__: Promise<void> | undefined;
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
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

function asCharges(value: unknown): ContainerCharge[] {
  const entries =
    Array.isArray(value)
      ? value
      : typeof value === "string" && value.trim()
        ? ((() => {
            try {
              return JSON.parse(value) as unknown;
            } catch {
              return [];
            }
          })() as unknown)
        : [];

  if (!Array.isArray(entries)) {
    return [];
  }

  return entries
    .map((entry, index) => {
      if (!entry || typeof entry !== "object") {
        return null;
      }

      const charge = entry as Partial<ContainerCharge>;
      return {
        amount: asString(charge.amount),
        id: asString(charge.id, `charge-${index + 1}`),
        label: asString(charge.label),
      };
    })
    .filter((entry): entry is ContainerCharge => entry !== null);
}

function createId(prefix: string) {
  return `${prefix}-${Date.now().toString().slice(-6)}${Math.floor(
    Math.random() * 9,
  )}`;
}

function toSqlDateTime(value: string) {
  return value.slice(0, 19).replace("T", " ");
}

function toIsoString(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

async function ensureColumnExists(
  tableName: "containers",
  columnName: "port",
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

async function initializeContainersTable() {
  const pool = getMySqlPool();

  await pool.query(`
        CREATE TABLE IF NOT EXISTS containers (
          id VARCHAR(32) PRIMARY KEY,
          container_number VARCHAR(128) NOT NULL,
          load_type ENUM('Import', 'Export') NOT NULL DEFAULT 'Import',
          customer VARCHAR(191) NOT NULL,
          port VARCHAR(191) NOT NULL DEFAULT '',
          booking_number VARCHAR(191) NOT NULL,
          type VARCHAR(191) NOT NULL,
          size VARCHAR(64) NOT NULL,
          shipping_line VARCHAR(191) NOT NULL,
          scac VARCHAR(64) NOT NULL,
          seal_number VARCHAR(128) NOT NULL,
          ship_eta VARCHAR(64) NOT NULL,
          lfd VARCHAR(64) NOT NULL,
          pickup_location VARCHAR(191) NOT NULL,
          pickup_booking_time VARCHAR(64) NOT NULL,
          warehouse VARCHAR(191) NOT NULL,
          warehouse_address VARCHAR(255) NOT NULL,
          checked_in_number VARCHAR(128) NOT NULL,
          weight_lbs VARCHAR(64) NOT NULL,
          currency_type VARCHAR(16) NOT NULL,
          base_rate VARCHAR(64) NOT NULL,
          prepull VARCHAR(64) NOT NULL,
          chassis VARCHAR(64) NOT NULL,
          storage VARCHAR(64) NOT NULL,
          waiting VARCHAR(64) NOT NULL,
          status ENUM('Available', 'In Transit', 'Under Inspection', 'Cancelled') NOT NULL DEFAULT 'Available',
          notes TEXT NOT NULL,
          additional_charges LONGTEXT NOT NULL,
          documents LONGTEXT NOT NULL,
          created_at DATETIME NOT NULL,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);

  await ensureColumnExists(
    "containers",
    "port",
    "port VARCHAR(191) NOT NULL DEFAULT '' AFTER customer",
  );
}

async function ensureContainersTable() {
  await connection();

  if (globalThis.__freightflow_containers_table_ready__) {
    try {
      await globalThis.__freightflow_containers_table_ready__;
      return;
    } catch {
      globalThis.__freightflow_containers_table_ready__ = undefined;
    }
  }

  globalThis.__freightflow_containers_table_ready__ =
    initializeContainersTable().catch((error) => {
      globalThis.__freightflow_containers_table_ready__ = undefined;
      throw error;
    });

  await globalThis.__freightflow_containers_table_ready__;
}

function mapContainer(row: ContainerRow): ContainerRecord {
  return {
    additionalCharges: asCharges(row.additional_charges),
    baseRate: row.base_rate,
    bookingNumber: row.booking_number,
    chassis: row.chassis,
    checkedInNumber: row.checked_in_number,
    containerNumber: row.container_number,
    createdAt: toIsoString(row.created_at),
    currencyType: row.currency_type,
    customer: row.customer,
    documents: asDocuments(row.documents),
    id: row.id,
    lfd: row.lfd,
    loadType: row.load_type,
    notes: row.notes,
    port: row.port,
    pickupBookingTime: row.pickup_booking_time,
    pickupLocation: row.pickup_location,
    prepull: row.prepull,
    scac: row.scac,
    sealNumber: row.seal_number,
    shipEta: row.ship_eta,
    shippingLine: row.shipping_line,
    size: row.size,
    status: row.status,
    storage: row.storage,
    type: row.type,
    waiting: row.waiting,
    warehouse: row.warehouse,
    warehouseAddress: row.warehouse_address,
    weightLbs: row.weight_lbs,
  };
}

export async function listContainers() {
  await ensureContainersTable();
  const pool = getMySqlPool();
  const [rows] = await pool.query<ContainerRow[]>(
    "SELECT * FROM containers ORDER BY created_at DESC",
  );
  return rows.map(mapContainer);
}

export async function createContainer(input: ContainerCreateInput) {
  await ensureContainersTable();
  const pool = getMySqlPool();
  const record: ContainerRecord = {
    additionalCharges: asCharges(input.additionalCharges),
    baseRate: asString(input.baseRate),
    bookingNumber: asString(input.bookingNumber),
    chassis: asString(input.chassis),
    checkedInNumber: asString(input.checkedInNumber),
    containerNumber: asString(input.containerNumber),
    createdAt: new Date().toISOString(),
    currencyType: asString(input.currencyType, "USD"),
    customer: asString(input.customer),
    documents: asDocuments(input.documents),
    id: createId("CONT"),
    lfd: asString(input.lfd),
    loadType: input.loadType === "Export" ? "Export" : "Import",
    notes: asString(input.notes),
    port: asString(input.port),
    pickupBookingTime: asString(input.pickupBookingTime),
    pickupLocation: asString(input.pickupLocation),
    prepull: asString(input.prepull),
    scac: asString(input.scac),
    sealNumber: asString(input.sealNumber),
    shipEta: asString(input.shipEta),
    shippingLine: asString(input.shippingLine),
    size: asString(input.size),
    status: input.status ?? "Available",
    storage: asString(input.storage),
    type: asString(input.type),
    waiting: asString(input.waiting),
    warehouse: asString(input.warehouse),
    warehouseAddress: asString(input.warehouseAddress),
    weightLbs: asString(input.weightLbs),
  };

  await pool.execute(
    `INSERT INTO containers
      (id, container_number, load_type, customer, port, booking_number, type, size, shipping_line, scac, seal_number, ship_eta, lfd, pickup_location, pickup_booking_time, warehouse, warehouse_address, checked_in_number, weight_lbs, currency_type, base_rate, prepull, chassis, storage, waiting, status, notes, additional_charges, documents, created_at)
     VALUES
      (:id, :containerNumber, :loadType, :customer, :port, :bookingNumber, :type, :size, :shippingLine, :scac, :sealNumber, :shipEta, :lfd, :pickupLocation, :pickupBookingTime, :warehouse, :warehouseAddress, :checkedInNumber, :weightLbs, :currencyType, :baseRate, :prepull, :chassis, :storage, :waiting, :status, :notes, :additionalCharges, :documents, :createdAt)`,
    {
      ...record,
      additionalCharges: JSON.stringify(record.additionalCharges),
      createdAt: toSqlDateTime(record.createdAt),
      documents: JSON.stringify(record.documents),
    },
  );

  return record;
}

export async function getContainerById(id: string) {
  await ensureContainersTable();
  const pool = getMySqlPool();
  const [rows] = await pool.execute<ContainerRow[]>(
    "SELECT * FROM containers WHERE id = :id LIMIT 1",
    { id },
  );
  return rows[0] ? mapContainer(rows[0]) : null;
}

export async function updateContainer(id: string, input: ContainerUpdateInput) {
  const current = await getContainerById(id);

  if (!current) {
    return null;
  }

  const pool = getMySqlPool();
  const next: ContainerRecord = {
    ...current,
    additionalCharges: input.additionalCharges
      ? asCharges(input.additionalCharges)
      : current.additionalCharges,
    baseRate: input.baseRate ?? current.baseRate,
    bookingNumber: input.bookingNumber ?? current.bookingNumber,
    chassis: input.chassis ?? current.chassis,
    checkedInNumber: input.checkedInNumber ?? current.checkedInNumber,
    containerNumber: input.containerNumber ?? current.containerNumber,
    currencyType: input.currencyType ?? current.currencyType,
    customer: input.customer ?? current.customer,
    documents: input.documents ? asDocuments(input.documents) : current.documents,
    lfd: input.lfd ?? current.lfd,
    loadType: input.loadType ?? current.loadType,
    notes: input.notes ?? current.notes,
    port: input.port ?? current.port,
    pickupBookingTime: input.pickupBookingTime ?? current.pickupBookingTime,
    pickupLocation: input.pickupLocation ?? current.pickupLocation,
    prepull: input.prepull ?? current.prepull,
    scac: input.scac ?? current.scac,
    sealNumber: input.sealNumber ?? current.sealNumber,
    shipEta: input.shipEta ?? current.shipEta,
    shippingLine: input.shippingLine ?? current.shippingLine,
    size: input.size ?? current.size,
    status: input.status ?? current.status,
    storage: input.storage ?? current.storage,
    type: input.type ?? current.type,
    waiting: input.waiting ?? current.waiting,
    warehouse: input.warehouse ?? current.warehouse,
    warehouseAddress: input.warehouseAddress ?? current.warehouseAddress,
    weightLbs: input.weightLbs ?? current.weightLbs,
  };

  await pool.execute(
    `UPDATE containers SET
      container_number = :containerNumber,
      load_type = :loadType,
      customer = :customer,
      port = :port,
      booking_number = :bookingNumber,
      type = :type,
      size = :size,
      shipping_line = :shippingLine,
      scac = :scac,
      seal_number = :sealNumber,
      ship_eta = :shipEta,
      lfd = :lfd,
      pickup_location = :pickupLocation,
      pickup_booking_time = :pickupBookingTime,
      warehouse = :warehouse,
      warehouse_address = :warehouseAddress,
      checked_in_number = :checkedInNumber,
      weight_lbs = :weightLbs,
      currency_type = :currencyType,
      base_rate = :baseRate,
      prepull = :prepull,
      chassis = :chassis,
      storage = :storage,
      waiting = :waiting,
      status = :status,
      notes = :notes,
      additional_charges = :additionalCharges,
      documents = :documents
     WHERE id = :id`,
    {
      ...next,
      additionalCharges: JSON.stringify(next.additionalCharges),
      documents: JSON.stringify(next.documents),
      id,
    },
  );

  return next;
}

export async function deleteContainer(id: string) {
  await ensureContainersTable();
  const pool = getMySqlPool();
  const [result] = await pool.execute<ResultSetHeader>(
    "DELETE FROM containers WHERE id = :id",
    { id },
  );
  return result.affectedRows > 0;
}
