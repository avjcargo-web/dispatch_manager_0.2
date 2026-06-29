import type { Metadata } from "next";
import { ContainersList } from "@/app/_components/containers-list";
import { listContainers } from "@/lib/container-crud";

export const metadata: Metadata = {
  title: "Containers",
};

export default async function ContainersPage({
  searchParams,
}: {
  searchParams: Promise<{
    cancelled?: string;
    created?: string;
    deleted?: string;
    updated?: string;
  }>;
}) {
  const { cancelled, created, deleted, updated } = await searchParams;
  const containers = await listContainers();

  return (
    <ContainersList
      cancelled={cancelled === "1"}
      containers={containers}
      created={created === "1"}
      deleted={deleted === "1"}
      updated={updated === "1"}
    />
  );
}
