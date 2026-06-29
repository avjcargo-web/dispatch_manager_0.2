import type { Metadata } from "next";
import { ContainerForm } from "@/app/_components/container-form";

export const metadata: Metadata = {
  title: "Edit Container",
};

export default async function EditContainerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ContainerForm containerId={decodeURIComponent(id)} />;
}
