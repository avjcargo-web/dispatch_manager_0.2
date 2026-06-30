import "server-only";
import { connection } from "next/server";
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

export type DispatchTypeValue = DispatchType | "";
export type DeliveryType = "" | "Live" | "Drop" | "SOC";

export type DispatchPriority = "Standard" | "Priority" | "Critical";

export type DispatchRecord = {
  activatedAt: string | null;
  chassisNumber: string;
  containerNumber: string;
  createdAt: string;
  currencyType: string;
  customer: string;
  deliveryType: DeliveryType;
  deliveryWindow: string;
  destination: string;
  dispatchType: DispatchTypeValue;
  dispatcher: string;
  documents: string[];
  driver: string;
  equipmentType: string;
  gateCode: string;
  id: string;
  checkedInNumber: string;
  loadNumber: string;
  loadType: DispatchLoadType;
  notes: string;
  origin: string;
  pin: string;
  pickupWindow: string;
  priority: DispatchPriority;
  rate: string;
  routeTrack: string;
  scac: string;
  sealNumber: string;
  shippingLine: string;
  size: string;
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
  deliveryType: DeliveryType;
  deliveryWindow: string;
  destination: string;
  dispatchType: DispatchTypeValue;
  dispatcher: string;
  documents?: string[];
  driver: string;
  equipmentType: string;
  gateCode: string;
  checkedInNumber: string;
  loadNumber: string;
  loadType: DispatchLoadType;
  notes: string;
  origin: string;
  pin: string;
  pickupWindow: string;
  priority: DispatchPriority;
  rate: string;
  routeTrack: string;
  scac: string;
  sealNumber: string;
  shippingLine: string;
  size: string;
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
  delivery_type: DeliveryType;
  delivery_window: string;
  destination: string;
  dispatch_type: DispatchTypeValue;
  dispatcher: string;
  documents: string | string[] | null;
  driver: string;
  equipment_type: string;
  gate_code: string;
  id: string;
  checked_in_number: string;
  load_number: string;
  load_type: DispatchLoadType;
  notes: string;
  origin: string;
  pin: string;
  pickup_window: string;
  priority: DispatchPriority;
  rate: string;
  route_track: string;
  scac: string;
  seal_number: string;
  shipping_line: string;
  size: string;
  last_known_latitude: number | string | null;
  last_known_longitude: number | string | null;
  last_location_recorded_at: Date | string | null;
  status: DispatchStatus;
  tracking_active: number | boolean;
};

declare global {
  var __freightflow_dispatch_table_ready_v2__: Promise<void> | undefined;
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

function toSqlDateTime(value: string) {
  return value.slice(0, 19).replace("T", " ");
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

function normalizeDeliveryType(value: unknown): DeliveryType {
  if (value === "Live" || value === "Drop" || value === "SOC") {
    return value;
  }

  return "";
}

function normalizeDispatchType(value: unknown): DispatchTypeValue {
  if (
    value === "Port to Warehouse" ||
    value === "Port to Yard" ||
    value === "Yard to Warehouse" ||
    value === "Yard to Port"
  ) {
    return value;
  }

  return "";
}

async function ensureColumnExists(
  tableName: "dispatches",
  columnName:
    | "checked_in_number"
    | "delivery_type"
    | "gate_code"
    | "route_track"
    | "scac"
    | "seal_number"
    | "shipping_line"
    | "size"
    | "tracking_active"
    | "activated_at"
    | "last_known_latitude"
    | "last_known_longitude"
    | "last_location_recorded_at"
    | "pin",
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

async function ensureUpdatedAtColumn() {
  const pool = getMySqlPool();
  const [rows] = await pool.execute<
    Array<
      RowDataPacket & {
        column_default: string | null;
        data_type: string;
        extra: string;
      }
    >
  >(
    `SELECT
       DATA_TYPE AS data_type,
       COLUMN_DEFAULT AS column_default,
       EXTRA AS extra
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'dispatches'
       AND COLUMN_NAME = 'updated_at'
     LIMIT 1`,
  );

  const column = rows[0];

  if (
    !column ||
    column.data_type !== "timestamp" ||
    column.column_default !== "CURRENT_TIMESTAMP" ||
    !column.extra.toLowerCase().includes("on update current_timestamp")
  ) {
    await pool.query(`
      ALTER TABLE dispatches
      MODIFY COLUMN updated_at TIMESTAMP NOT NULL
      DEFAULT CURRENT_TIMESTAMP
      ON UPDATE CURRENT_TIMESTAMP
    `);
  }
}

async function ensureDispatchTypeColumn() {
  const pool = getMySqlPool();
  const [rows] = await pool.execute<
    Array<
      RowDataPacket & {
        column_default: string | null;
        data_type: string;
      }
    >
  >(
    `SELECT
       DATA_TYPE AS data_type,
       COLUMN_DEFAULT AS column_default
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'dispatches'
       AND COLUMN_NAME = 'dispatch_type'
     LIMIT 1`,
  );

  const column = rows[0];

  if (
    !column ||
    column.data_type !== "varchar" ||
    column.column_default !== ""
  ) {
    await pool.query(`
      ALTER TABLE dispatches
      MODIFY COLUMN dispatch_type VARCHAR(191) NOT NULL DEFAULT ''
    `);
  }
}

async function initializeDispatchesTable() {
  const pool = getMySqlPool();

  await pool.query(`
        CREATE TABLE IF NOT EXISTS dispatches (
          id VARCHAR(32) PRIMARY KEY,
          load_number VARCHAR(128) NOT NULL,
          container_number VARCHAR(128) NOT NULL,
          dispatch_type VARCHAR(191) NOT NULL DEFAULT '',
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
          delivery_type VARCHAR(32) NOT NULL DEFAULT '',
          gate_code VARCHAR(128) NOT NULL DEFAULT '',
          pin VARCHAR(64) NOT NULL DEFAULT '',
          size VARCHAR(64) NOT NULL DEFAULT '',
          shipping_line VARCHAR(191) NOT NULL DEFAULT '',
          seal_number VARCHAR(128) NOT NULL DEFAULT '',
          checked_in_number VARCHAR(128) NOT NULL DEFAULT '',
          scac VARCHAR(64) NOT NULL DEFAULT '',
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
          documents LONGTEXT NOT NULL,
          created_at DATETIME NOT NULL,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);

  await ensureDispatchTypeColumn();

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
    "delivery_type",
    "delivery_type VARCHAR(32) NOT NULL DEFAULT '' AFTER delivery_window",
  );
  await ensureColumnExists(
    "dispatches",
    "gate_code",
    "gate_code VARCHAR(128) NOT NULL DEFAULT '' AFTER delivery_type",
  );
  await ensureColumnExists(
    "dispatches",
    "pin",
    "pin VARCHAR(64) NOT NULL DEFAULT '' AFTER gate_code",
  );
  await ensureColumnExists(
    "dispatches",
    "size",
    "size VARCHAR(64) NOT NULL DEFAULT '' AFTER pin",
  );
  await ensureColumnExists(
    "dispatches",
    "shipping_line",
    "shipping_line VARCHAR(191) NOT NULL DEFAULT '' AFTER size",
  );
  await ensureColumnExists(
    "dispatches",
    "seal_number",
    "seal_number VARCHAR(128) NOT NULL DEFAULT '' AFTER shipping_line",
  );
  await ensureColumnExists(
    "dispatches",
    "checked_in_number",
    "checked_in_number VARCHAR(128) NOT NULL DEFAULT '' AFTER seal_number",
  );
  await ensureColumnExists(
    "dispatches",
    "scac",
    "scac VARCHAR(64) NOT NULL DEFAULT '' AFTER checked_in_number",
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
  await ensureUpdatedAtColumn();
}

async function ensureDispatchesSchema() {
  await ensureDispatchTypeColumn();
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
    "delivery_type",
    "delivery_type VARCHAR(32) NOT NULL DEFAULT '' AFTER delivery_window",
  );
  await ensureColumnExists(
    "dispatches",
    "gate_code",
    "gate_code VARCHAR(128) NOT NULL DEFAULT '' AFTER delivery_type",
  );
  await ensureColumnExists(
    "dispatches",
    "pin",
    "pin VARCHAR(64) NOT NULL DEFAULT '' AFTER gate_code",
  );
  await ensureColumnExists(
    "dispatches",
    "size",
    "size VARCHAR(64) NOT NULL DEFAULT '' AFTER pin",
  );
  await ensureColumnExists(
    "dispatches",
    "shipping_line",
    "shipping_line VARCHAR(191) NOT NULL DEFAULT '' AFTER size",
  );
  await ensureColumnExists(
    "dispatches",
    "seal_number",
    "seal_number VARCHAR(128) NOT NULL DEFAULT '' AFTER shipping_line",
  );
  await ensureColumnExists(
    "dispatches",
    "checked_in_number",
    "checked_in_number VARCHAR(128) NOT NULL DEFAULT '' AFTER seal_number",
  );
  await ensureColumnExists(
    "dispatches",
    "scac",
    "scac VARCHAR(64) NOT NULL DEFAULT '' AFTER checked_in_number",
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
  await ensureUpdatedAtColumn();
}

async function ensureDispatchesTable() {
  await connection();

  if (globalThis.__freightflow_dispatch_table_ready_v2__) {
    try {
      await globalThis.__freightflow_dispatch_table_ready_v2__;
      await ensureDispatchesSchema();
      return;
    } catch {
      globalThis.__freightflow_dispatch_table_ready_v2__ = undefined;
    }
  }

  globalThis.__freightflow_dispatch_table_ready_v2__ =
    initializeDispatchesTable().catch((error) => {
      globalThis.__freightflow_dispatch_table_ready_v2__ = undefined;
      throw error;
    });

  await globalThis.__freightflow_dispatch_table_ready_v2__;
  await ensureDispatchesSchema();
}

function mapDispatch(row: DispatchRow): DispatchRecord {
  return {
    activatedAt: toNullableIsoString(row.activated_at),
    chassisNumber: row.chassis_number,
    containerNumber: row.container_number,
    createdAt: toIsoString(row.created_at),
    currencyType: row.currency_type,
    customer: row.customer,
    deliveryType: normalizeDeliveryType(row.delivery_type),
    deliveryWindow: row.delivery_window,
    destination: row.destination,
    dispatchType: normalizeDispatchType(row.dispatch_type),
    dispatcher: row.dispatcher,
    documents: asDocuments(row.documents),
    driver: row.driver,
    equipmentType: row.equipment_type,
    gateCode: row.gate_code,
    id: row.id,
    checkedInNumber: row.checked_in_number,
    loadNumber: row.load_number,
    loadType: row.load_type,
    notes: row.notes,
    origin: row.origin,
    pin: row.pin,
    pickupWindow: row.pickup_window,
    priority: row.priority,
    rate: row.rate,
    routeTrack: row.route_track,
    scac: row.scac,
    sealNumber: row.seal_number,
    shippingLine: row.shipping_line,
    size: row.size,
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
    deliveryType: normalizeDeliveryType(input.deliveryType),
    deliveryWindow: asString(input.deliveryWindow),
    destination: asString(input.destination),
    dispatchType: normalizeDispatchType(input.dispatchType),
    dispatcher: asString(input.dispatcher),
    documents: asDocuments(input.documents),
    driver: asString(input.driver),
    equipmentType: asString(input.equipmentType),
    gateCode: asString(input.gateCode),
    id: createId("DSP"),
    checkedInNumber: asString(input.checkedInNumber),
    loadNumber: asString(
      input.loadNumber,
      `LOAD-${Math.floor(10000 + (Date.now() % 90000))}`,
    ),
    loadType: input.loadType === "Export" ? "Export" : "Import",
    notes: asString(input.notes),
    origin: asString(input.origin),
    pin: asString(input.pin),
    pickupWindow: asString(input.pickupWindow),
    priority:
      input.priority === "Priority" || input.priority === "Critical"
        ? input.priority
        : "Standard",
    rate: asString(input.rate),
    routeTrack: asString(input.routeTrack),
    scac: asString(input.scac),
    sealNumber: asString(input.sealNumber),
    shippingLine: asString(input.shippingLine),
    size: asString(input.size),
    lastKnownLatitude: asNullableNumber(input.lastKnownLatitude),
    lastKnownLongitude: asNullableNumber(input.lastKnownLongitude),
    lastLocationRecordedAt: input.lastLocationRecordedAt
      ? toNullableIsoString(input.lastLocationRecordedAt)
      : null,
    status: input.status ?? "Scheduled",
    trackingActive: Boolean(input.trackingActive),
  };
  const sqlRecord = {
    activatedAt: record.activatedAt
      ? record.activatedAt.slice(0, 19).replace("T", " ")
      : null,
    chassisNumber: record.chassisNumber,
    checkedInNumber: record.checkedInNumber,
    containerNumber: record.containerNumber,
    createdAt: toSqlDateTime(record.createdAt),
    currencyType: record.currencyType,
    customer: record.customer,
    deliveryType: record.deliveryType,
    deliveryWindow: record.deliveryWindow,
    destination: record.destination,
    dispatchType: record.dispatchType,
    dispatcher: record.dispatcher,
    documents: JSON.stringify(record.documents),
    driver: record.driver,
    equipmentType: record.equipmentType,
    gateCode: record.gateCode,
    id: record.id,
    lastKnownLatitude: record.lastKnownLatitude,
    lastKnownLongitude: record.lastKnownLongitude,
    lastLocationRecordedAt: record.lastLocationRecordedAt,
    loadNumber: record.loadNumber,
    loadType: record.loadType,
    notes: record.notes,
    origin: record.origin,
    pickupWindow: record.pickupWindow,
    pin: record.pin,
    priority: record.priority,
    rate: record.rate,
    routeTrack: record.routeTrack,
    scac: record.scac,
    sealNumber: record.sealNumber,
    shippingLine: record.shippingLine,
    size: record.size,
    status: record.status,
    trackingActive: record.trackingActive ? 1 : 0,
  };

  await pool.execute(
    `INSERT INTO dispatches
      (id, load_number, container_number, dispatch_type, load_type, customer, driver, dispatcher, equipment_type, chassis_number, origin, destination, pickup_window, delivery_window, delivery_type, gate_code, pin, size, shipping_line, seal_number, checked_in_number, scac, currency_type, rate, priority, status, route_track, tracking_active, activated_at, last_known_latitude, last_known_longitude, last_location_recorded_at, notes, documents, created_at)
     VALUES
      (:id, :loadNumber, :containerNumber, :dispatchType, :loadType, :customer, :driver, :dispatcher, :equipmentType, :chassisNumber, :origin, :destination, :pickupWindow, :deliveryWindow, :deliveryType, :gateCode, :pin, :size, :shippingLine, :sealNumber, :checkedInNumber, :scac, :currencyType, :rate, :priority, :status, :routeTrack, :trackingActive, :activatedAt, :lastKnownLatitude, :lastKnownLongitude, :lastLocationRecordedAt, :notes, :documents, :createdAt)`,
    sqlRecord,
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
    activatedAt:
      input.activatedAt !== undefined
        ? toNullableIsoString(input.activatedAt ?? null)
        : current.activatedAt,
    chassisNumber: asString(input.chassisNumber ?? current.chassisNumber),
    containerNumber: asString(input.containerNumber ?? current.containerNumber),
    currencyType: asString(input.currencyType ?? current.currencyType),
    customer: asString(input.customer ?? current.customer),
    deliveryType:
      input.deliveryType !== undefined
        ? normalizeDeliveryType(input.deliveryType)
        : normalizeDeliveryType(current.deliveryType),
    deliveryWindow: asString(input.deliveryWindow ?? current.deliveryWindow),
    destination: asString(input.destination ?? current.destination),
    dispatchType:
      input.dispatchType !== undefined
        ? normalizeDispatchType(input.dispatchType)
        : normalizeDispatchType(current.dispatchType),
    dispatcher: asString(input.dispatcher ?? current.dispatcher),
    documents: input.documents ? asDocuments(input.documents) : current.documents,
    driver: asString(input.driver ?? current.driver),
    equipmentType: asString(input.equipmentType ?? current.equipmentType),
    gateCode: asString(input.gateCode ?? current.gateCode),
    checkedInNumber: asString(input.checkedInNumber ?? current.checkedInNumber),
    loadNumber: asString(input.loadNumber ?? current.loadNumber),
    loadType: input.loadType ?? current.loadType,
    notes: asString(input.notes ?? current.notes),
    origin: asString(input.origin ?? current.origin),
    pin: asString(input.pin ?? current.pin),
    pickupWindow: asString(input.pickupWindow ?? current.pickupWindow),
    priority: input.priority ?? current.priority,
    rate: asString(input.rate ?? current.rate),
    routeTrack: asString(input.routeTrack ?? current.routeTrack),
    scac: asString(input.scac ?? current.scac),
    sealNumber: asString(input.sealNumber ?? current.sealNumber),
    shippingLine: asString(input.shippingLine ?? current.shippingLine),
    size: asString(input.size ?? current.size),
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
  const sqlRecord = {
    activatedAt: next.activatedAt
      ? next.activatedAt.slice(0, 19).replace("T", " ")
      : null,
    chassisNumber: next.chassisNumber,
    checkedInNumber: next.checkedInNumber,
    containerNumber: next.containerNumber,
    currencyType: next.currencyType,
    customer: next.customer,
    deliveryType: next.deliveryType,
    deliveryWindow: next.deliveryWindow,
    destination: next.destination,
    dispatchType: next.dispatchType,
    dispatcher: next.dispatcher,
    documents: JSON.stringify(next.documents),
    driver: next.driver,
    equipmentType: next.equipmentType,
    gateCode: next.gateCode,
    id,
    lastKnownLatitude: next.lastKnownLatitude,
    lastKnownLongitude: next.lastKnownLongitude,
    lastLocationRecordedAt: next.lastLocationRecordedAt,
    loadNumber: next.loadNumber,
    loadType: next.loadType,
    notes: next.notes,
    origin: next.origin,
    pickupWindow: next.pickupWindow,
    pin: next.pin,
    priority: next.priority,
    rate: next.rate,
    routeTrack: next.routeTrack,
    scac: next.scac,
    sealNumber: next.sealNumber,
    shippingLine: next.shippingLine,
    size: next.size,
    status: next.status,
    trackingActive: next.trackingActive ? 1 : 0,
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
      delivery_type = :deliveryType,
      gate_code = :gateCode,
      pin = :pin,
      size = :size,
      shipping_line = :shippingLine,
      seal_number = :sealNumber,
      checked_in_number = :checkedInNumber,
      scac = :scac,
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
    sqlRecord,
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
