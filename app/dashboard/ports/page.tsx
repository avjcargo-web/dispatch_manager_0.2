import type { Metadata } from "next";
import { PortsList } from "@/app/_components/ports-list";
import { listPorts } from "@/lib/ops-crud";

export const metadata: Metadata = {
  title: "Ports",
};

export default async function PortsPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string }>;
}) {
  const { created } = await searchParams;
  const ports = await listPorts();

  return <PortsList created={created === "1"} ports={ports} />;
}
