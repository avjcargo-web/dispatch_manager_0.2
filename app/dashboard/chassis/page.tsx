import type { Metadata } from "next";
import { ChassisList } from "@/app/_components/chassis-list";
import { listChassis } from "@/lib/ops-crud";

export const metadata: Metadata = {
  title: "Chassis",
};

export default async function ChassisPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; deleted?: string; updated?: string }>;
}) {
  const { created, deleted, updated } = await searchParams;
  const chassis = await listChassis();

  return (
    <ChassisList
      chassis={chassis}
      created={created === "1"}
      deleted={deleted === "1"}
      updated={updated === "1"}
    />
  );
}
