import type { Metadata } from "next";
import { ContainersList } from "@/app/_components/containers-list";

export const metadata: Metadata = {
  title: "Containers",
};

export default async function ContainersPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string }>;
}) {
  const { created } = await searchParams;

  return <ContainersList created={created === "1"} />;
}
