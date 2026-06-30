import type { Metadata } from "next";
import { ContainerForm } from "@/app/_components/container-form";
import { getContainerById } from "@/lib/container-crud";
import {
  listCustomers,
  listPorts,
  listShippingLines,
  listWarehouses,
} from "@/lib/ops-crud";

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
  const [customers, ports, shippingLines, warehouses, container] = await Promise.all([
    listCustomers(),
    listPorts(),
    listShippingLines(),
    listWarehouses(),
    getContainerById(containerId),
  ]);

  return (
    <ContainerForm
      containerId={containerId}
      customers={customers}
      initialContainer={container ?? undefined}
      ports={ports}
      shippingLines={shippingLines}
      warehouses={warehouses}
    />
  );
}
