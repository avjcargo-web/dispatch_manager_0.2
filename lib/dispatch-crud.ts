import "server-only";
import { type ResultSetHeader, type RowDataPacket } from "mysql2/promise";
import { getMySqlPool } from "./mysql";

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

export type DispatchPriority = "Standard" | "Priority" | "Critical";

export type DispatchRecord = {
  activatedAt: string | null;
  chassisNumber: string;
  containerNumber: string;
  createdAt: string;
  currencyType: string;
  customer: string;
  deliveryWindow: string;
  destination: string;
  dispatchType: DispatchType;
  dispatcher: string;
  documents: string[];
  driver: string;
  equipmentType: string;
  id: string;
  loadNumber: string;
  loadType: DispatchLoadType;
  notes: string;
  origin: string;
  pickupWindow: string;
  priority: DispatchPriority;
  rate: string;
  routeTrack: string;
  lastKnownLatitude: number | null;
  lastKnownLongitude: number | null;
  lastLocationRecordedAt: string | null;
  status: DispatchStatus;
  trackingActive: boolean;
};

export type DispatchCreateInput = {
  activatedAt?: string | null;
  chassisNumber: string;
  containerNumber: string;
  currencyType: string;
  customer: string;
  deliveryWindow: string;
  destination: string;
  dispatchType: DispatchType;
  dispatcher: string;
  documents?: string[];
  driver: string;
  equipmentType: string;
  loadNumber: string;
  loadType: DispatchLoadType;
  notes: string;
  origin: string;
  pickupWindow: string;
  priority: DispatchPriority;
  rate: string;
  routeTrack: string;
  lastKnownLatitude?: number | null;
  lastKnownLongitude?: number | null;
  lastLocationRecordedAt?: string | null;
  status?: DispatchStatus;
  trackingActive?: boolean;
};

export type DispatchUpdateInput = Partial<DispatchCreateInput>;

export type DispatchLocationUpdateInput = {
  latitude: number;
  longitude: number;
  recordedAt?: string;
};

type DispatchRow = RowDataPacket & {
  activated_at: Date | string | null;
  chassis_number: string;
  container_number: string;
  created_at: Date | string;
  currency_type: string;
  customer: string;
  delivery_window: string;
  destination: string;
  dispatch_type: DispatchType;
  dispatcher: string;
  documents: string | string[] | null;
  driver: string;
  equipment_type: string;
  id: string;
  load_number: string;
  load_type: DispatchLoadType;
  notes: string;
  origin: string;
  pickup_window: string;
  priority: DispatchPriority;
  rate: string;
  route_track: string;
  last_known_latitude: number | string | null;
  last_known_longitude: number | string | null;
  last_location_recorded_at: Date | string | null;
  status: DispatchStatus;
  tracking_active: number | boolean;
};

declare global {
  var __freightflow_dispatch_table_ready__: Promise<void> | undefined;
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

function asNullableNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function createId(prefix: string) {
  return `${prefix}-${Date.now().toString().slice(-6)}${Math.floor(
    Math.random() * 9,
  )}`;
}

function toIsoString(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function toNullableIsoString(value: Date | string | null) {
  if (!value) {
    return null;
  }

  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

async function ensureColumnExists(
  tableName: "dispatches",
  columnName:
    | "route_track"
    | "tracking_active"
    | "activated_at"
    | "last_known_latitude"
    | "last_known_longitude"
    | "last_location_recorded_at",
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

async function ensureDispatchesTable() {
  if (!globalThis.__freightflow_dispatch_table_ready__) {
    globalThis.__freightflow_dispatch_table_ready__ = (async () => {
      const pool = getMySqlPool();

      await pool.query(`
        CREATE TABLE IF NOT EXISTS dispatches (
          id VARCHAR(32) PRIMARY KEY,
          load_number VARCHAR(128) NOT NULL,
          container_number VARCHAR(128) NOT NULL,
          dispatch_type ENUM('Port to Warehouse', 'Port to Yard', 'Yard to Warehouse', 'Yard to Port') NOT NULL,
          load_type ENUM('Import', 'Export') NOT NULL DEFAULT 'Import',
          customer VARCHAR(191) NOT NULL,
          driver VARCHAR(191) NOT NULL,
          dispatcher VARCHAR(191) NOT NULL,
          equipment_type VARCHAR(191) NOT NULL,
          chassis_number VARCHAR(128) NOT NULL,
          origin VARCHAR(255) NOT NULL,
          destination VARCHAR(255) NOT NULL,
          pickup_window VARCHAR(64) NOT NULL,
          delivery_window VARCHAR(64) NOT NULL,
          currency_type VARCHAR(16) NOT NULL,
          rate VARCHAR(64) NOT NULL,
          priority ENUM('Standard', 'Priority', 'Critical') NOT NULL DEFAULT 'Standard',
          status ENUM('Scheduled', 'In Transit', 'Delivered', 'Cancelled') NOT NULL DEFAULT 'Scheduled',
          route_track VARCHAR(255) NOT NULL DEFAULT '',
          tracking_active TINYINT(1) NOT NULL DEFAULT 0,
          activated_at DATETIME NULL,
          last_known_latitude DECIMAL(10, 7) NULL,
          last_known_longitude DECIMAL(10, 7) NULL,
          last_location_recorded_at DATETIME NULL,
          notes TEXT NOT NULL,
          documents JSON NOT NULL,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);

      await ensureColumnExists(
        "dispatches",
        "route_track",
        "route_track VARCHAR(255) NOT NULL DEFAULT '' AFTER status",
      );
      await ensureColumnExists(
        "dispatches",
        "tracking_active",
        "tracking_active TINYINT(1) NOT NULL DEFAULT 0 AFTER route_track",
      );
      await ensureColumnExists(
        "dispatches",
        "activated_at",
        "activated_at DATETIME NULL AFTER tracking_active",
      );
      await ensureColumnExists(
        "dispatches",
        "last_known_latitude",
        "last_known_latitude DECIMAL(10, 7) NULL AFTER activated_at",
      );
      await ensureColumnExists(
        "dispatches",
        "last_known_longitude",
        "last_known_longitude DECIMAL(10, 7) NULL AFTER last_known_latitude",
      );
      await ensureColumnExists(
        "dispatches",
        "last_location_recorded_at",
        "last_location_recorded_at DATETIME NULL AFTER last_known_longitude",
      );
    })();
  }

  await globalThis.__freightflow_dispatch_table_ready__;
}

function mapDispatch(row: DispatchRow): DispatchRecord {
  return {
    activatedAt: toNullableIsoString(row.activated_at),
    chassisNumber: row.chassis_number,
    containerNumber: row.container_number,
    createdAt: toIsoString(row.created_at),
    currencyType: row.currency_type,
    customer: row.customer,
    deliveryWindow: row.delivery_window,
    destination: row.destination,
    dispatchType: row.dispatch_type,
    dispatcher: row.dispatcher,
    documents: asDocuments(row.documents),
    driver: row.driver,
    equipmentType: row.equipment_type,
    id: row.id,
    loadNumber: row.load_number,
    loadType: row.load_type,
    notes: row.notes,
    origin: row.origin,
    pickupWindow: row.pickup_window,
    priority: row.priority,
    rate: row.rate,
    routeTrack: row.route_track,
    lastKnownLatitude: asNullableNumber(row.last_known_latitude),
    lastKnownLongitude: asNullableNumber(row.last_known_longitude),
    lastLocationRecordedAt: toNullableIsoString(row.last_location_recorded_at),
    status: row.status,
    trackingActive: Boolean(row.tracking_active),
  };
}

export async function listDispatches() {
  await ensureDispatchesTable();
  const pool = getMySqlPool();
  const [rows] = await pool.query<DispatchRow[]>(
    "SELECT * FROM dispatches ORDER BY created_at DESC",
  );
  return rows.map(mapDispatch);
}

export async function createDispatch(input: DispatchCreateInput) {
  await ensureDispatchesTable();
  const pool = getMySqlPool();
  const record: DispatchRecord = {
    activatedAt: input.activatedAt
      ? toNullableIsoString(input.activatedAt)
      : null,
    chassisNumber: asString(input.chassisNumber),
    containerNumber: asString(input.containerNumber),
    createdAt: new Date().toISOString(),
    currencyType: asString(input.currencyType, "USD"),
    customer: asString(input.customer),
    deliveryWindow: asString(input.deliveryWindow),
    destination: asString(input.destination),
    dispatchType: input.dispatchType,
    dispatcher: asString(input.dispatcher),
    documents: asDocuments(input.documents),
    driver: asString(input.driver),
    equipmentType: asString(input.equipmentType),
    id: createId("DSP"),
    loadNumber: asString(
      input.loadNumber,
      `LOAD-${Math.floor(10000 + (Date.now() % 90000))}`,
    ),
    loadType: input.loadType === "Export" ? "Export" : "Import",
    notes: asString(input.notes),
    origin: asString(input.origin),
    pickupWindow: asString(input.pickupWindow),
    priority:
      input.priority === "Priority" || input.priority === "Critical"
        ? input.priority
        : "Standard",
    rate: asString(input.rate),
    routeTrack: asString(input.routeTrack),
    lastKnownLatitude: asNullableNumber(input.lastKnownLatitude),
    lastKnownLongitude: asNullableNumber(input.lastKnownLongitude),
    lastLocationRecordedAt: input.lastLocationRecordedAt
      ? toNullableIsoString(input.lastLocationRecordedAt)
      : null,
    status: input.status ?? "Scheduled",
    trackingActive: Boolean(input.trackingActive),
  };

  await pool.execute(
    `INSERT INTO dispatches
      (id, load_number, container_number, dispatch_type, load_type, customer, driver, dispatcher, equipment_type, chassis_number, origin, destination, pickup_window, delivery_window, currency_type, rate, priority, status, route_track, tracking_active, activated_at, last_known_latitude, last_known_longitude, last_location_recorded_at, notes, documents)
     VALUES
      (:id, :loadNumber, :containerNumber, :dispatchType, :loadType, :customer, :driver, :dispatcher, :equipmentType, :chassisNumber, :origin, :destination, :pickupWindow, :deliveryWindow, :currencyType, :rate, :priority, :status, :routeTrack, :trackingActive, :activatedAt, :lastKnownLatitude, :lastKnownLongitude, :lastLocationRecordedAt, :notes, :documents)`,
    {
      ...record,
      activatedAt: record.activatedAt
        ? record.activatedAt.slice(0, 19).replace("T", " ")
        : null,
      documents: JSON.stringify(record.documents),
      trackingActive: record.trackingActive ? 1 : 0,
    },
  );

  return record;
}

export async function getDispatchById(id: string) {
  await ensureDispatchesTable();
  const pool = getMySqlPool();
  const [rows] = await pool.execute<DispatchRow[]>(
    "SELECT * FROM dispatches WHERE id = :id LIMIT 1",
    { id },
  );
  return rows[0] ? mapDispatch(rows[0]) : null;
}

export async function updateDispatch(id: string, input: DispatchUpdateInput) {
  const current = await getDispatchById(id);

  if (!current) {
    return null;
  }

  const pool = getMySqlPool();
  const next: DispatchRecord = {
    ...current,
    activatedAt: input.activatedAt ?? current.activatedAt,
    chassisNumber: input.chassisNumber ?? current.chassisNumber,
    containerNumber: input.containerNumber ?? current.containerNumber,
    currencyType: input.currencyType ?? current.currencyType,
    customer: input.customer ?? current.customer,
    deliveryWindow: input.deliveryWindow ?? current.deliveryWindow,
    destination: input.destination ?? current.destination,
    dispatchType: input.dispatchType ?? current.dispatchType,
    dispatcher: input.dispatcher ?? current.dispatcher,
    documents: input.documents ? asDocuments(input.documents) : current.documents,
    driver: input.driver ?? current.driver,
    equipmentType: input.equipmentType ?? current.equipmentType,
    loadNumber: input.loadNumber ?? current.loadNumber,
    loadType: input.loadType ?? current.loadType,
    notes: input.notes ?? current.notes,
    origin: input.origin ?? current.origin,
    pickupWindow: input.pickupWindow ?? current.pickupWindow,
    priority: input.priority ?? current.priority,
    rate: input.rate ?? current.rate,
    routeTrack: input.routeTrack ?? current.routeTrack,
    lastKnownLatitude:
      input.lastKnownLatitude !== undefined
        ? asNullableNumber(input.lastKnownLatitude)
        : current.lastKnownLatitude,
    lastKnownLongitude:
      input.lastKnownLongitude !== undefined
        ? asNullableNumber(input.lastKnownLongitude)
        : current.lastKnownLongitude,
    lastLocationRecordedAt:
      input.lastLocationRecordedAt !== undefined
        ? toNullableIsoString(input.lastLocationRecordedAt ?? null)
        : current.lastLocationRecordedAt,
    status: input.status ?? current.status,
    trackingActive:
      typeof input.trackingActive === "boolean"
        ? input.trackingActive
        : input.status === "Delivered" || input.status === "Cancelled"
          ? false
          : current.trackingActive,
  };

  await pool.execute(
    `UPDATE dispatches SET
      load_number = :loadNumber,
      container_number = :containerNumber,
      dispatch_type = :dispatchType,
      load_type = :loadType,
      customer = :customer,
      driver = :driver,
      dispatcher = :dispatcher,
      equipment_type = :equipmentType,
      chassis_number = :chassisNumber,
      origin = :origin,
      destination = :destination,
      pickup_window = :pickupWindow,
      delivery_window = :deliveryWindow,
      currency_type = :currencyType,
      rate = :rate,
      priority = :priority,
      status = :status,
      route_track = :routeTrack,
      tracking_active = :trackingActive,
      activated_at = :activatedAt,
      last_known_latitude = :lastKnownLatitude,
      last_known_longitude = :lastKnownLongitude,
      last_location_recorded_at = :lastLocationRecordedAt,
      notes = :notes,
      documents = :documents
     WHERE id = :id`,
    {
      ...next,
      activatedAt: next.activatedAt
        ? next.activatedAt.slice(0, 19).replace("T", " ")
        : null,
      documents: JSON.stringify(next.documents),
      id,
      trackingActive: next.trackingActive ? 1 : 0,
    },
  );

  return next;
}

export async function activateDispatch(id: string) {
  const current = await getDispatchById(id);

  if (!current) {
    return null;
  }

  const activatedAt = current.activatedAt ?? new Date().toISOString();
  return updateDispatch(id, {
    activatedAt,
    status: "In Transit",
    trackingActive: true,
  });
}

export async function updateDispatchLocation(
  id: string,
  input: DispatchLocationUpdateInput,
) {
  const latitude = asNullableNumber(input.latitude);
  const longitude = asNullableNumber(input.longitude);

  if (latitude === null || longitude === null) {
    throw new Error("Latitude and longitude are required numeric values.");
  }

  if (latitude < -90 || latitude > 90) {
    throw new Error("Latitude must be between -90 and 90.");
  }

  if (longitude < -180 || longitude > 180) {
    throw new Error("Longitude must be between -180 and 180.");
  }

  const current = await getDispatchById(id);

  if (!current) {
    return null;
  }

  const recordedAt = input.recordedAt
    ? new Date(input.recordedAt).toISOString()
    : new Date().toISOString();

  return updateDispatch(id, {
    activatedAt: current.activatedAt ?? recordedAt,
    lastKnownLatitude: latitude,
    lastKnownLongitude: longitude,
    lastLocationRecordedAt: recordedAt,
    status: "In Transit",
    trackingActive: true,
  });
}

export async function deleteDispatch(id: string) {
  await ensureDispatchesTable();
  const pool = getMySqlPool();
  const [result] = await pool.execute<ResultSetHeader>(
    "DELETE FROM dispatches WHERE id = :id",
    { id },
  );
  return result.affectedRows > 0;
}
