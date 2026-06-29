import type { Metadata } from "next";
import { DispatchForm } from "@/app/_components/dispatch-form";
import { listContainers } from "@/lib/container-crud";
import { getDispatchById } from "@/lib/dispatch-crud";
import { listDrivers, listYards } from "@/lib/ops-crud";

export const metadata: Metadata = {
  title: "Edit Dispatch",
};

export default async function EditDispatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dispatchId = decodeURIComponent(id);
  const [containers, dispatch, drivers, yards] = await Promise.all([
    listContainers(),
    getDispatchById(dispatchId),
    listDrivers(),
    listYards(),
  ]);

  return (
    <DispatchForm
      containers={containers}
      dispatchId={dispatchId}
      drivers={drivers}
      initialDispatch={dispatch ?? undefined}
      yards={yards}
    />
  );
}
