import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Warehouse, Yard",
};

export default function WarehouseYardsPage() {
  redirect("/dashboard/warehouses");
}
