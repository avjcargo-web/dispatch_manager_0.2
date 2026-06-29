import type { Metadata } from "next";
import { ChassisList } from "@/app/_components/chassis-list";
import { listChassis } from "@/lib/ops-crud";

export const metadata: Metadata = {
  title: "Chassis",
};

export default async function ChassisPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string }>;
}) {
  const { created } = await searchParams;
  const chassis = await listChassis();

  return <ChassisList chassis={chassis} created={created === "1"} />;
}
