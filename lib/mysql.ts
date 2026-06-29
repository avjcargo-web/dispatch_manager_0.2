import "server-only";
import mysql, { type Pool, type RowDataPacket } from "mysql2/promise";

type DbConfig = {
  database: string;
  host: string;
  password: string;
  port: number;
  user: string;
};

type PingRow = RowDataPacket & {
  connection_id: number;
  current_database: string | null;
  server_version: string;
};

declare global {
  var __freightflow_mysql_pool__: Pool | undefined;
}

function readDatabaseConfig(): DbConfig {
  const host = process.env.DB_HOST?.trim() || "127.0.0.1";
  const port = Number(process.env.DB_PORT || "3306");
  const user = process.env.DB_USER?.trim() || "";
  const password = process.env.DB_PASSWORD ?? "";
  const database = process.env.DB_NAME?.trim() || "";

  if (!user) {
    throw new Error("Missing DB_USER environment variable.");
  }

  if (!database) {
    throw new Error("Missing DB_NAME environment variable.");
  }

  if (!Number.isFinite(port)) {
    throw new Error("DB_PORT must be a valid number.");
  }

  return {
    database,
    host,
    password,
    port,
    user,
  };
}

export function getMySqlPool() {
  if (!globalThis.__freightflow_mysql_pool__) {
    const config = readDatabaseConfig();

    globalThis.__freightflow_mysql_pool__ = mysql.createPool({
      database: config.database,
      host: config.host,
      namedPlaceholders: true,
      password: config.password,
      port: config.port,
      user: config.user,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  return globalThis.__freightflow_mysql_pool__;
}

export async function pingDatabase() {
  const pool = getMySqlPool();
  const [rows] = await pool.query<PingRow[]>(
    `
      SELECT
        CONNECTION_ID() AS connection_id,
        DATABASE() AS current_database,
        VERSION() AS server_version
    `,
  );

  return rows[0] ?? null;
}
