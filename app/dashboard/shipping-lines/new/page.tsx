import type { Metadata } from "next";
import { ShippingLineForm } from "@/app/_components/shipping-line-form";

export const metadata: Metadata = {
  title: "Add Shipping Line",
};

export default function NewShippingLinePage() {
  return <ShippingLineForm />;
}
