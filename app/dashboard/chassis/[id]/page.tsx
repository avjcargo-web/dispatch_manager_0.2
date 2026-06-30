import type { Metadata } from "next";
import Link from "next/link";
import { ChassisForm } from "@/app/_components/chassis-form";
import { getChassisById } from "@/lib/ops-crud";

export const metadata: Metadata = {
  title: "Edit Chassis",
};

export default async function EditChassisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const chassisId = decodeURIComponent(id);
  const chassis = await getChassisById(chassisId);

  if (!chassis) {
    return (
      <main className="space-y-6 p-5 md:p-7">
        <section className="rounded-[30px] border border-line bg-panel p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            Chassis section
          </p>
          <h3 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
            Chassis not found
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
            This chassis could not be found in the MySQL records.
          </p>
          <Link
            href="/dashboard/chassis"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-2xl border border-line px-5 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent"
          >
            Back to chassis list
          </Link>
        </section>
      </main>
    );
  }

  return <ChassisForm chassisId={chassisId} initialChassis={chassis} />;
}
