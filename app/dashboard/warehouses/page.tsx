import type { Metadata } from "next";
import { WarehouseYardsList } from "@/app/_components/warehouse-yards-list";
import { listWarehouses } from "@/lib/ops-crud";

export const metadata: Metadata = {
  title: "Warehouses",
};

export default async function WarehousesPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string }>;
}) {
  const { created } = await searchParams;
  const warehouses = await listWarehouses();

  return (
    <WarehouseYardsList
      created={created === "1"}
      facilityType="Warehouse"
      warehouseYards={warehouses}
    />
  );
}
