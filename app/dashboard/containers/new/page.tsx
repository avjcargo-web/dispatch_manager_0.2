import type { Metadata } from "next";
import { ContainerForm } from "@/app/_components/container-form";

export const metadata: Metadata = {
  title: "Add Container",
};

export default function NewContainerPage() {
  return <ContainerForm />;
}
