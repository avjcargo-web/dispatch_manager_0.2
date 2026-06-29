import type { Metadata } from "next";
import { ChassisForm } from "@/app/_components/chassis-form";

export const metadata: Metadata = {
  title: "Add Chassis",
};

export default function NewChassisPage() {
  return <ChassisForm />;
}
