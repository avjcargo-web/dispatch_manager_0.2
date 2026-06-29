import { createCollectionRouteHandlers } from "@/lib/api-route-factory";
import { createYard, listYards } from "@/lib/ops-crud";

export const dynamic = "force-dynamic";

const handlers = createCollectionRouteHandlers({
  create: createYard,
  list: listYards,
  resourceName: "yard",
});

export const GET = handlers.GET;
export const POST = handlers.POST;
