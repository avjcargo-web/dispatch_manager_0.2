import type { Metadata } from "next";
import { CustomersList } from "@/app/_components/customers-list";

export const metadata: Metadata = {
  title: "Customers",
};

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string }>;
}) {
  const { created } = await searchParams;

  return <CustomersList created={created === "1"} />;
}
