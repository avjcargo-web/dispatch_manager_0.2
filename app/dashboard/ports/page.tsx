import type { Metadata } from "next";
import { PortsList } from "@/app/_components/ports-list";
import { listPorts } from "@/lib/ops-crud";

export const metadata: Metadata = {
  title: "Ports",
};

export default async function PortsPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; deleted?: string; updated?: string }>;
}) {
  const { created, deleted, updated } = await searchParams;
  const ports = await listPorts();

  return (
    <PortsList
      created={created === "1"}
      deleted={deleted === "1"}
      ports={ports}
      updated={updated === "1"}
    />
  );
}
