"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import type { WarehouseYardRecord } from "./warehouse-yard-store";
import {
  getWarehouseYards,
  subscribeWarehouseYards,
} from "./warehouse-yard-store";

type FacilityType = "Warehouse" | "Yard";

const facilityContent: Record<
  FacilityType,
  {
    addHref: string;
    buttonLabel: string;
    description: string;
    eyebrow: string;
    title: string;
  }
> = {
  Warehouse: {
    addHref: "/dashboard/warehouses/new",
    buttonLabel: "Add new warehouse",
    description:
      "Manage storage hubs, cross-docks, and warehouse facilities with capacity, dock, and operating status visibility.",
    eyebrow: "Warehouse section",
    title: "Warehouse list",
  },
  Yard: {
    addHref: "/dashboard/yards/new",
    buttonLabel: "Add new yard",
    description:
      "Manage staging yards and open movement zones with slot, dock, and operating status visibility.",
    eyebrow: "Yard section",
    title: "Yard list",
  },
};

function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));
}

export function WarehouseYardsList({
  created = false,
  facilityType,
}: {
  created?: boolean;
  facilityType: FacilityType;
}) {
  const warehouseYards = useSyncExternalStore(
    subscribeWarehouseYards,
    getWarehouseYards,
    getWarehouseYards,
  );
  const filteredItems = warehouseYards.filter(
    (item) => item.type === facilityType,
  );
  const content = facilityContent[facilityType];

  function statusCount(status: WarehouseYardRecord["status"]) {
    return filteredItems.filter((item) => item.status === status).length;
  }

  return (
    <main className="space-y-6 p-5 md:p-7">
      <section className="rounded-[30px] border border-line bg-panel p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              {content.eyebrow}
            </p>
            <h3 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              {content.title}
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
              {content.description}
            </p>
          </div>

          <Link
            href={content.addHref}
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {content.buttonLabel}
          </Link>
        </div>

        {created ? (
          <div className="mt-6 rounded-2xl border border-success/15 bg-success-soft px-4 py-3 text-sm text-success">
            {facilityType} has been added successfully and is now available in
            the list.
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 lg:grid-cols-4">
          <article className="rounded-[24px] border border-line bg-panel-muted p-5">
            <p className="text-sm text-muted">Total {facilityType.toLowerCase()}s</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              {filteredItems.length}
            </p>
          </article>
          <article className="rounded-[24px] border border-line bg-panel-muted p-5">
            <p className="text-sm text-muted">Active</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              {statusCount("Active")}
            </p>
          </article>
          <article className="rounded-[24px] border border-line bg-panel-muted p-5">
            <p className="text-sm text-muted">
              {facilityType === "Warehouse"
                ? "High utilization"
                : "High utilization"}
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              {statusCount("High Utilization")}
            </p>
          </article>
          <article className="rounded-[24px] border border-line bg-panel-muted p-5">
            <p className="text-sm text-muted">Maintenance</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              {statusCount("Maintenance")}
            </p>
          </article>
        </div>
      </section>

      <section className="rounded-[30px] border border-line bg-panel p-4 shadow-[0_20px_60px_rgba(15,23,42,0.06)] md:p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">City</th>
                <th className="px-4 py-2">Manager</th>
                <th className="px-4 py-2">Capacity</th>
                <th className="px-4 py-2">Docks</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Added</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="rounded-[24px] bg-panel-muted text-sm text-ink"
                >
                  <td className="rounded-l-[24px] px-4 py-4 align-top">
                    <p className="font-semibold">{item.name}</p>
                    <p className="mt-1 text-xs text-muted">{item.email}</p>
                    <p className="mt-1 text-xs text-muted">{item.phone}</p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink shadow-sm">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-4 py-4 align-top text-muted">{item.city}</td>
                  <td className="px-4 py-4 align-top">
                    <p className="font-medium text-ink">{item.manager}</p>
                    <p className="mt-1 text-xs text-muted">
                      {item.operatingWindow}
                    </p>
                  </td>
                  <td className="px-4 py-4 align-top text-muted">
                    {item.capacity}
                  </td>
                  <td className="px-4 py-4 align-top font-semibold text-ink">
                    {item.docks}
                  </td>
                  <td className="px-4 py-4 align-top">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        item.status === "Active"
                          ? "bg-success-soft text-success"
                          : item.status === "High Utilization"
                            ? "bg-signal-soft text-amber-700"
                            : "bg-accent-soft text-accent-strong"
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
