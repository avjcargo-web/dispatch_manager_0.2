import { createCollectionRouteHandlers } from "@/lib/api-route-factory";
import {
  createContainer,
  listContainers,
  type ContainerCreateInput,
  type ContainerRecord,
} from "@/lib/container-crud";

const handlers = createCollectionRouteHandlers<
  ContainerCreateInput,
  ContainerRecord
>({
  create: createContainer,
  list: listContainers,
  resourceName: "containers",
});

export const GET = handlers.GET;
export const POST = handlers.POST;
