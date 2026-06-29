import { createCollectionRouteHandlers } from "@/lib/api-route-factory";
import { createPort, listPorts } from "@/lib/ops-crud";

export const dynamic = "force-dynamic";

const handlers = createCollectionRouteHandlers({
  create: createPort,
  list: listPorts,
  resourceName: "port",
});

export const GET = handlers.GET;
export const POST = handlers.POST;
