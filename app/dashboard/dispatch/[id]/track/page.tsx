import type { Metadata } from "next";
import { DispatchTrackingView } from "@/app/_components/dispatch-tracking-view";
import { getDispatchById } from "@/lib/dispatch-crud";

export const metadata: Metadata = {
  title: "Track Dispatch",
};

export default async function DispatchTrackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dispatch = await getDispatchById(decodeURIComponent(id));

  if (!dispatch) {
    return (
      <main className="space-y-6 p-5 md:p-7">
        <section className="rounded-[30px] border border-line bg-panel p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            Dispatch tracking
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
            Dispatch not found
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
            This dispatch could not be found in the MySQL records.
          </p>
        </section>
      </main>
    );
  }

  return <DispatchTrackingView initialDispatch={dispatch} />;
}
