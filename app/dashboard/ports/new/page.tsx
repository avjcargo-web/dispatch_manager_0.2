import type { Metadata } from "next";
import { PortForm } from "@/app/_components/port-form";

export const metadata: Metadata = {
  title: "Add Port",
};

export default function NewPortPage() {
  return <PortForm />;
}
