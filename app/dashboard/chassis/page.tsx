import type { Metadata } from "next";
import { ChassisList } from "@/app/_components/chassis-list";

export const metadata: Metadata = {
  title: "Chassis",
};

export default async function ChassisPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string }>;
}) {
  const { created } = await searchParams;

  return <ChassisList created={created === "1"} />;
}
