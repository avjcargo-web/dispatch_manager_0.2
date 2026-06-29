import { createDetailRouteHandlers } from "@/lib/api-route-factory";
import {
  deleteContainer,
  getContainerById,
  updateContainer,
  type ContainerRecord,
  type ContainerUpdateInput,
} from "@/lib/container-crud";

const handlers = createDetailRouteHandlers<
  ContainerUpdateInput,
  ContainerRecord
>({
  getById: getContainerById,
  remove: deleteContainer,
  resourceName: "container",
  update: updateContainer,
});

export const GET = handlers.GET;
export const PATCH = handlers.PATCH;
export const DELETE = handlers.DELETE;
