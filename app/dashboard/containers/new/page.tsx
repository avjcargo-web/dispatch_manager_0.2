import type { Metadata } from "next";
import { ContainerForm } from "@/app/_components/container-form";
import {
  listCustomers,
  listPorts,
  listShippingLines,
  listWarehouses,
} from "@/lib/ops-crud";

export const metadata: Metadata = {
  title: "Add Container",
};

export default async function NewContainerPage() {
  const [customers, ports, shippingLines, warehouses] = await Promise.all([
    listCustomers(),
    listPorts(),
    listShippingLines(),
    listWarehouses(),
  ]);

  return (
    <ContainerForm
      customers={customers}
      ports={ports}
      shippingLines={shippingLines}
      warehouses={warehouses}
    />
  );
}
