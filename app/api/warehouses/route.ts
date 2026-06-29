import { createCollectionRouteHandlers } from "@/lib/api-route-factory";
import { createWarehouse, listWarehouses } from "@/lib/ops-crud";

export const dynamic = "force-dynamic";

const handlers = createCollectionRouteHandlers({
  create: createWarehouse,
  list: listWarehouses,
  resourceName: "warehouse",
});

export const GET = handlers.GET;
export const POST = handlers.POST;
