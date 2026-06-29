import type { Metadata } from "next";
import { WarehouseYardsList } from "@/app/_components/warehouse-yards-list";

export const metadata: Metadata = {
  title: "Warehouses",
};

export default async function WarehousesPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string }>;
}) {
  const { created } = await searchParams;

  return (
    <WarehouseYardsList
      created={created === "1"}
      facilityType="Warehouse"
    />
  );
}
