import type { Metadata } from "next";
import { DispatchForm } from "@/app/_components/dispatch-form";
import { listContainers } from "@/lib/container-crud";
import { listDrivers, listYards } from "@/lib/ops-crud";

export const metadata: Metadata = {
  title: "Add Dispatch",
};

export default async function NewDispatchPage() {
  const [containers, drivers, yards] = await Promise.all([
    listContainers(),
    listDrivers(),
    listYards(),
  ]);

  return <DispatchForm containers={containers} drivers={drivers} yards={yards} />;
}
