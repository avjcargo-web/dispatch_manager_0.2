import type { Metadata } from "next";
import { DispatchList } from "@/app/_components/dispatch-list";
import { listDispatches } from "@/lib/dispatch-crud";

export const metadata: Metadata = {
  title: "Dispatch",
};

export default async function DispatchPage({
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
  const dispatches = await listDispatches();

  return (
    <DispatchList
      cancelled={cancelled === "1"}
      created={created === "1"}
      dispatches={dispatches}
      deleted={deleted === "1"}
      updated={updated === "1"}
    />
  );
}
