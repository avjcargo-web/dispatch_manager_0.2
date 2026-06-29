import { createDetailRouteHandlers } from "@/lib/api-route-factory";
import { deleteDriver, getDriverById, updateDriver } from "@/lib/ops-crud";

export const dynamic = "force-dynamic";

const handlers = createDetailRouteHandlers({
  getById: getDriverById,
  remove: deleteDriver,
  resourceName: "driver",
  update: updateDriver,
});

export const DELETE = handlers.DELETE;
export const GET = handlers.GET;
export const PATCH = handlers.PATCH;
