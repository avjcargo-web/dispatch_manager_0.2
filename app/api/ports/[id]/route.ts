import { createDetailRouteHandlers } from "@/lib/api-route-factory";
import { deletePort, getPortById, updatePort } from "@/lib/ops-crud";

export const dynamic = "force-dynamic";

const handlers = createDetailRouteHandlers({
  getById: getPortById,
  remove: deletePort,
  resourceName: "port",
  update: updatePort,
});

export const DELETE = handlers.DELETE;
export const GET = handlers.GET;
export const PATCH = handlers.PATCH;
