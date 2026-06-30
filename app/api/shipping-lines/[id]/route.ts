import { createDetailRouteHandlers } from "@/lib/api-route-factory";
import {
  deleteShippingLine,
  getShippingLineById,
  updateShippingLine,
} from "@/lib/ops-crud";

export const dynamic = "force-dynamic";

const handlers = createDetailRouteHandlers({
  getById: getShippingLineById,
  remove: deleteShippingLine,
  resourceName: "shipping line",
  update: updateShippingLine,
});

export const GET = handlers.GET;
export const PATCH = handlers.PATCH;
export const DELETE = handlers.DELETE;
