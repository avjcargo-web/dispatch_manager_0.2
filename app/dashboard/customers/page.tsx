import type { Metadata } from "next";
import { CustomersList } from "@/app/_components/customers-list";
import { listCustomers } from "@/lib/ops-crud";

export const metadata: Metadata = {
  title: "Customers",
};

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string }>;
}) {
  const { created } = await searchParams;
  const customers = await listCustomers();

  return <CustomersList created={created === "1"} customers={customers} />;
}
