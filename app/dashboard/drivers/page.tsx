import type { Metadata } from "next";
import { DriversList } from "@/app/_components/drivers-list";

export const metadata: Metadata = {
  title: "Drivers",
};

export default async function DriversPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string }>;
}) {
  const { created } = await searchParams;

  return <DriversList created={created === "1"} />;
}
