import type { Metadata } from "next";
import { ContainersList } from "@/app/_components/containers-list";

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

  return (
    <ContainersList
      cancelled={cancelled === "1"}
      created={created === "1"}
      deleted={deleted === "1"}
      updated={updated === "1"}
    />
  );
}
