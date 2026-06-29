import type { Metadata } from "next";
import { PortsList } from "@/app/_components/ports-list";

export const metadata: Metadata = {
  title: "Ports",
};

export default async function PortsPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string }>;
}) {
  const { created } = await searchParams;

  return <PortsList created={created === "1"} />;
}
