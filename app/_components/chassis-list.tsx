"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  getChassis,
  getChassisServerSnapshot,
  subscribeChassis,
} from "./chassis-store";

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
    getChassisServerSnapshot,
  );

  return (
    <main className="space-y-6 p-5 md:p-7">
      <section className="ops-panel-primary rounded-[30px] p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="ops-kicker text-xs font-semibold uppercase tracking-[0.28em]">
              Chassis section
            </p>
            <h3 className="ops-heading mt-3 text-3xl font-semibold tracking-tight">
              Chassis list
            </h3>
            <p className="ops-copy mt-3 max-w-2xl text-sm leading-7">
              Track chassis assets with compatibility, location, inspection, and
              assignment details from one equipment operations board.
            </p>
          </div>

          <Link
            href="/dashboard/chassis/new"
            className="ops-action-primary inline-flex h-12 items-center justify-center rounded-2xl px-5 text-sm font-semibold transition hover:opacity-90"
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
          <article className="ops-metric-card rounded-[24px] p-5">
            <p className="ops-copy text-sm">Total chassis</p>
            <p className="ops-heading mt-3 text-3xl font-semibold tracking-tight">
              {chassis.length}
            </p>
          </article>
          <article className="ops-metric-card rounded-[24px] p-5">
            <p className="ops-copy text-sm">Available</p>
            <p className="ops-heading mt-3 text-3xl font-semibold tracking-tight">
              {chassis.filter((item) => item.status === "Available").length}
            </p>
          </article>
          <article className="ops-metric-card rounded-[24px] p-5">
            <p className="ops-copy text-sm">In use</p>
            <p className="ops-heading mt-3 text-3xl font-semibold tracking-tight">
              {chassis.filter((item) => item.status === "In Use").length}
            </p>
          </article>
          <article className="ops-metric-card rounded-[24px] p-5">
            <p className="ops-copy text-sm">Maintenance</p>
            <p className="ops-heading mt-3 text-3xl font-semibold tracking-tight">
              {chassis.filter((item) => item.status === "Maintenance").length}
            </p>
          </article>
        </div>
      </section>

      <section className="ops-panel-secondary rounded-[30px] p-4 md:p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="ops-subtle text-left text-xs font-semibold uppercase tracking-[0.2em]">
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
                  className="ops-detail-card rounded-[24px] text-sm"
                >
                  <td className="rounded-l-[24px] px-4 py-4 align-top">
                    <p className="ops-heading font-semibold">{item.chassisNumber}</p>
                    <p className="ops-subtle mt-1 text-xs">
                      {item.sizeCompatibility}
                    </p>
                    <p className="ops-subtle mt-1 text-xs">
                      Last inspection: {item.lastInspection}
                    </p>
                  </td>
                  <td className="ops-copy px-4 py-4 align-top">{item.type}</td>
                  <td className="ops-copy px-4 py-4 align-top">{item.owner}</td>
                  <td className="ops-copy px-4 py-4 align-top">
                    {item.currentLocation}
                  </td>
                  <td className="ops-copy px-4 py-4 align-top">
                    {item.assignedContainer}
                  </td>
                  <td className="px-4 py-4 align-top">
                    <p className="ops-heading font-medium">{item.condition}</p>
                    <p className="ops-subtle mt-1 text-xs">
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
                  <td className="ops-subtle rounded-r-[24px] px-4 py-4 align-top">
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
