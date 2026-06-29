import { createDetailRouteHandlers } from "@/lib/api-route-factory";
import { deleteYard, getYardById, updateYard } from "@/lib/ops-crud";

export const dynamic = "force-dynamic";

const handlers = createDetailRouteHandlers({
  getById: getYardById,
  remove: deleteYard,
  resourceName: "yard",
  update: updateYard,
});

export const DELETE = handlers.DELETE;
export const GET = handlers.GET;
export const PATCH = handlers.PATCH;
