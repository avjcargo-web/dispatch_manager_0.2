"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { getChassis, subscribeChassis } from "./chassis-store";

function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));
}

export function ChassisList({ created = false }: { created?: boolean }) {
  const chassis = useSyncExternalStore(
    subscribeChassis,
    getChassis,
    getChassis,
  );

  return (
    <main className="space-y-6 p-5 md:p-7">
      <section className="rounded-[30px] border border-line bg-panel p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              Chassis section
            </p>
            <h3 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              Chassis list
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
              Track chassis assets with compatibility, location, inspection, and
              assignment details from one equipment operations board.
            </p>
          </div>

          <Link
            href="/dashboard/chassis/new"
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Add new chassis
          </Link>
        </div>

        {created ? (
          <div className="mt-6 rounded-2xl border border-success/15 bg-success-soft px-4 py-3 text-sm text-success">
            Chassis has been added successfully and is now available in the
            list.
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 lg:grid-cols-4">
          <article className="rounded-[24px] border border-line bg-panel-muted p-5">
            <p className="text-sm text-muted">Total chassis</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              {chassis.length}
            </p>
          </article>
          <article className="rounded-[24px] border border-line bg-panel-muted p-5">
            <p className="text-sm text-muted">Available</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              {chassis.filter((item) => item.status === "Available").length}
            </p>
          </article>
          <article className="rounded-[24px] border border-line bg-panel-muted p-5">
            <p className="text-sm text-muted">In use</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              {chassis.filter((item) => item.status === "In Use").length}
            </p>
          </article>
          <article className="rounded-[24px] border border-line bg-panel-muted p-5">
            <p className="text-sm text-muted">Maintenance</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              {chassis.filter((item) => item.status === "Maintenance").length}
            </p>
          </article>
        </div>
      </section>

      <section className="rounded-[30px] border border-line bg-panel p-4 shadow-[0_20px_60px_rgba(15,23,42,0.06)] md:p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                <th className="px-4 py-2">Chassis</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Owner</th>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">Assigned Container</th>
                <th className="px-4 py-2">Condition</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Added</th>
              </tr>
            </thead>
            <tbody>
              {chassis.map((item) => (
                <tr
                  key={item.id}
                  className="rounded-[24px] bg-panel-muted text-sm text-ink"
                >
                  <td className="rounded-l-[24px] px-4 py-4 align-top">
                    <p className="font-semibold">{item.chassisNumber}</p>
                    <p className="mt-1 text-xs text-muted">
                      {item.sizeCompatibility}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      Last inspection: {item.lastInspection}
                    </p>
                  </td>
                  <td className="px-4 py-4 align-top text-muted">{item.type}</td>
                  <td className="px-4 py-4 align-top text-muted">{item.owner}</td>
                  <td className="px-4 py-4 align-top text-muted">
                    {item.currentLocation}
                  </td>
                  <td className="px-4 py-4 align-top text-muted">
                    {item.assignedContainer}
                  </td>
                  <td className="px-4 py-4 align-top">
                    <p className="font-medium text-ink">{item.condition}</p>
                    <p className="mt-1 text-xs text-muted">
                      {item.documents.length} file(s)
                    </p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        item.status === "Available"
                          ? "bg-success-soft text-success"
                          : item.status === "In Use"
                            ? "bg-accent-soft text-accent-strong"
                            : "bg-signal-soft text-amber-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="rounded-r-[24px] px-4 py-4 align-top text-muted">
                    {formatDate(item.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
