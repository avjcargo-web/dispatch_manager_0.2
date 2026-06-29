import type { Metadata } from "next";
import { ContainerForm } from "@/app/_components/container-form";
import { listCustomers, listPorts, listWarehouses } from "@/lib/ops-crud";

export const metadata: Metadata = {
  title: "Add Container",
};

export default async function NewContainerPage() {
  const [customers, ports, warehouses] = await Promise.all([
    listCustomers(),
    listPorts(),
    listWarehouses(),
  ]);

  return (
    <ContainerForm
      customers={customers}
      ports={ports}
      warehouses={warehouses}
    />
  );
}
