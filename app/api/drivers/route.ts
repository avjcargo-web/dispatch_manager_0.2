import { createCollectionRouteHandlers } from "@/lib/api-route-factory";
import { createDriver, listDrivers } from "@/lib/ops-crud";

export const dynamic = "force-dynamic";

const handlers = createCollectionRouteHandlers({
  create: createDriver,
  list: listDrivers,
  resourceName: "driver",
});

export const GET = handlers.GET;
export const POST = handlers.POST;
