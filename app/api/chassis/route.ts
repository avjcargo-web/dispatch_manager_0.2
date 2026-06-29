import { createCollectionRouteHandlers } from "@/lib/api-route-factory";
import { createChassis, listChassis } from "@/lib/ops-crud";

export const dynamic = "force-dynamic";

const handlers = createCollectionRouteHandlers({
  create: createChassis,
  list: listChassis,
  resourceName: "chassis",
});

export const GET = handlers.GET;
export const POST = handlers.POST;
