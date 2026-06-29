import type { Metadata } from "next";
import { WarehouseYardForm } from "@/app/_components/warehouse-yard-form";

export const metadata: Metadata = {
  title: "Add Yard",
};

export default function NewYardPage() {
  return <WarehouseYardForm facilityType="Yard" />;
}
