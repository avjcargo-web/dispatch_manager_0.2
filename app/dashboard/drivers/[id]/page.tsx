import type { Metadata } from "next";
import Link from "next/link";
import { DriverForm } from "@/app/_components/driver-form";
import { getDriverById } from "@/lib/ops-crud";

export const metadata: Metadata = {
  title: "Edit Driver",
};

export default async function EditDriverPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const driverId = decodeURIComponent(id);
  const driver = await getDriverById(driverId);

  if (!driver) {
    return (
      <main className="space-y-6 p-5 md:p-7">
        <section className="rounded-[30px] border border-line bg-panel p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            Driver section
          </p>
          <h3 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
            Driver not found
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
            This driver could not be found in the MySQL records.
          </p>
          <Link
            href="/dashboard/drivers"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-2xl border border-line px-5 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent"
          >
            Back to driver list
          </Link>
        </section>
      </main>
    );
  }

  return <DriverForm driverId={driverId} initialDriver={driver} />;
}
