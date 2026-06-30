import type { Metadata } from "next";
import { WarehouseYardsList } from "@/app/_components/warehouse-yards-list";
import { listYards } from "@/lib/ops-crud";

export const metadata: Metadata = {
  title: "Yards",
};

export default async function YardsPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; deleted?: string; updated?: string }>;
}) {
  const { created, deleted, updated } = await searchParams;
  const yards = await listYards();

  return (
    <WarehouseYardsList
      created={created === "1"}
      deleted={deleted === "1"}
      facilityType="Yard"
      updated={updated === "1"}
      warehouseYards={yards}
    />
  );
}
