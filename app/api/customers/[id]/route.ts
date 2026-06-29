import {
  deleteCustomer,
  getCustomerById,
  updateCustomer,
} from "@/lib/ops-crud";
import { createDetailRouteHandlers } from "@/lib/api-route-factory";

export const dynamic = "force-dynamic";

const handlers = createDetailRouteHandlers({
  getById: getCustomerById,
  remove: deleteCustomer,
  resourceName: "customer",
  update: updateCustomer,
});

export const DELETE = handlers.DELETE;
export const GET = handlers.GET;
export const PATCH = handlers.PATCH;
