import { createCollectionRouteHandlers } from "@/lib/api-route-factory";
import { createShippingLine, listShippingLines } from "@/lib/ops-crud";

export const dynamic = "force-dynamic";

const handlers = createCollectionRouteHandlers({
  create: createShippingLine,
  list: listShippingLines,
  resourceName: "shipping line",
});

export const GET = handlers.GET;
export const POST = handlers.POST;
