import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Add Warehouse, Yard",
};

export default function NewWarehouseYardPage() {
  redirect("/dashboard/warehouses/new");
}
