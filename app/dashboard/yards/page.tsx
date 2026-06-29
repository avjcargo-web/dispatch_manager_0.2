import type { Metadata } from "next";
import { WarehouseYardsList } from "@/app/_components/warehouse-yards-list";

export const metadata: Metadata = {
  title: "Yards",
};

export default async function YardsPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string }>;
}) {
  const { created } = await searchParams;

  return <WarehouseYardsList created={created === "1"} facilityType="Yard" />;
}
