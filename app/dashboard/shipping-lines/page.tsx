import type { Metadata } from "next";
import { ShippingLinesList } from "@/app/_components/shipping-lines-list";
import { listShippingLines } from "@/lib/ops-crud";

export const metadata: Metadata = {
  title: "Shipping Lines",
};

export default async function ShippingLinesPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; deleted?: string; updated?: string }>;
}) {
  const { created, deleted, updated } = await searchParams;
  const shippingLines = await listShippingLines();

  return (
    <ShippingLinesList
      created={created === "1"}
      deleted={deleted === "1"}
      shippingLines={shippingLines}
      updated={updated === "1"}
    />
  );
}
