import {
  createCustomer,
  listCustomers,
} from "@/lib/ops-crud";
import { createCollectionRouteHandlers } from "@/lib/api-route-factory";

export const dynamic = "force-dynamic";

const handlers = createCollectionRouteHandlers({
  create: createCustomer,
  list: listCustomers,
  resourceName: "customer",
});

export const GET = handlers.GET;
export const POST = handlers.POST;
