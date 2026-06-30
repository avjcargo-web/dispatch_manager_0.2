import type { Metadata } from "next";
import { DriversList } from "@/app/_components/drivers-list";
import { listDrivers } from "@/lib/ops-crud";

export const metadata: Metadata = {
  title: "Drivers",
};

export default async function DriversPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; deleted?: string; updated?: string }>;
}) {
  const { created, deleted, updated } = await searchParams;
  const drivers = await listDrivers();

  return (
    <DriversList
      created={created === "1"}
      deleted={deleted === "1"}
      drivers={drivers}
      updated={updated === "1"}
    />
  );
}
