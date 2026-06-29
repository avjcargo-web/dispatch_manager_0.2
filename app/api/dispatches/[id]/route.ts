import { createDetailRouteHandlers } from "@/lib/api-route-factory";
import {
  deleteDispatch,
  getDispatchById,
  updateDispatch,
  type DispatchRecord,
  type DispatchUpdateInput,
} from "@/lib/dispatch-crud";

const handlers = createDetailRouteHandlers<
  DispatchUpdateInput,
  DispatchRecord
>({
  getById: getDispatchById,
  remove: deleteDispatch,
  resourceName: "dispatch",
  update: updateDispatch,
});

export const GET = handlers.GET;
export const PATCH = handlers.PATCH;
export const DELETE = handlers.DELETE;
