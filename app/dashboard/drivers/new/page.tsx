import type { Metadata } from "next";
import { DriverForm } from "@/app/_components/driver-form";

export const metadata: Metadata = {
  title: "Add Driver",
};

export default function NewDriverPage() {
  return <DriverForm />;
}
