import { createDetailRouteHandlers } from "@/lib/api-route-factory";
import { deleteChassis, getChassisById, updateChassis } from "@/lib/ops-crud";

export const dynamic = "force-dynamic";

const handlers = createDetailRouteHandlers({
  getById: getChassisById,
  remove: deleteChassis,
  resourceName: "chassis",
  update: updateChassis,
});

export const DELETE = handlers.DELETE;
export const GET = handlers.GET;
export const PATCH = handlers.PATCH;
