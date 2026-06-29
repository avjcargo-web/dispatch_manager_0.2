import type { Metadata } from "next";
import { CustomerForm } from "@/app/_components/customer-form";

export const metadata: Metadata = {
  title: "Add Customer",
};

export default function NewCustomerPage() {
  return <CustomerForm />;
}
