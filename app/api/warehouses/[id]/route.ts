import { createDetailRouteHandlers } from "@/lib/api-route-factory";
import {
  deleteWarehouse,
  getWarehouseById,
  updateWarehouse,
} from "@/lib/ops-crud";

export const dynamic = "force-dynamic";

const handlers = createDetailRouteHandlers({
  getById: getWarehouseById,
  remove: deleteWarehouse,
  resourceName: "warehouse",
  update: updateWarehouse,
});

export const DELETE = handlers.DELETE;
export const GET = handlers.GET;
export const PATCH = handlers.PATCH;
