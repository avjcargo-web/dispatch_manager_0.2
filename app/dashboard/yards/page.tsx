import type { Metadata } from "next";
import { WarehouseYardsList } from "@/app/_components/warehouse-yards-list";
import { listYards } from "@/lib/ops-crud";

export const metadata: Metadata = {
  title: "Yards",
};

export default async function YardsPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string }>;
}) {
  const { created } = await searchParams;
  const yards = await listYards();

  return (
    <WarehouseYardsList
      created={created === "1"}
      facilityType="Yard"
      warehouseYards={yards}
    />
  );
}
