import type { Metadata } from "next";
import { ContainerForm } from "@/app/_components/container-form";
import { getContainerById } from "@/lib/container-crud";
import { listCustomers, listPorts, listWarehouses } from "@/lib/ops-crud";

export const metadata: Metadata = {
  title: "Edit Container",
};

export default async function EditContainerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const containerId = decodeURIComponent(id);
  const [customers, ports, warehouses, container] = await Promise.all([
    listCustomers(),
    listPorts(),
    listWarehouses(),
    getContainerById(containerId),
  ]);

  return (
    <ContainerForm
      containerId={containerId}
      customers={customers}
      initialContainer={container ?? undefined}
      ports={ports}
      warehouses={warehouses}
    />
  );
}
