import { createCollectionRouteHandlers } from "@/lib/api-route-factory";
import {
  createDispatch,
  listDispatches,
  type DispatchCreateInput,
  type DispatchRecord,
} from "@/lib/dispatch-crud";

const handlers = createCollectionRouteHandlers<
  DispatchCreateInput,
  DispatchRecord
>({
  create: createDispatch,
  list: listDispatches,
  resourceName: "dispatches",
});

export const GET = handlers.GET;
export const POST = handlers.POST;
