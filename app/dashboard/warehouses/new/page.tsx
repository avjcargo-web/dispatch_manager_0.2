import type { Metadata } from "next";
import { WarehouseYardForm } from "@/app/_components/warehouse-yard-form";

export const metadata: Metadata = {
  title: "Add Warehouse",
};

export default function NewWarehousePage() {
  return <WarehouseYardForm facilityType="Warehouse" />;
}
