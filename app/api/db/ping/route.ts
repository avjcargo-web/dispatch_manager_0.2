import { pingDatabase } from "@/lib/mysql";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await pingDatabase();

    return Response.json({
      connected: true,
      database: result?.current_database ?? process.env.DB_NAME ?? null,
      host: process.env.DB_HOST ?? null,
      port: process.env.DB_PORT ?? null,
      serverVersion: result?.server_version ?? null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown database error";

    return Response.json(
      {
        connected: false,
        error: message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
