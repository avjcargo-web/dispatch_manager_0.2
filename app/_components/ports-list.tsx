"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { getPorts, subscribePorts } from "./port-store";

function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));
}

export function PortsList({ created = false }: { created?: boolean }) {
  const ports = useSyncExternalStore(subscribePorts, getPorts, getPorts);

  return (
    <main className="space-y-6 p-5 md:p-7">
      <section className="ops-panel-primary rounded-[30px] p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="ops-kicker text-xs font-semibold uppercase tracking-[0.28em]">
              Port section
            </p>
            <h3 className="ops-heading mt-3 text-3xl font-semibold tracking-tight">
              Port list
            </h3>
            <p className="ops-copy mt-3 max-w-2xl text-sm leading-7">
              Manage port locations, contact authorities, and terminal readiness
              from one maritime operations workspace.
            </p>
          </div>

          <Link
            href="/dashboard/ports/new"
            className="ops-action-primary inline-flex h-12 items-center justify-center rounded-2xl px-5 text-sm font-semibold transition hover:opacity-90"
          >
            Add new port
          </Link>
        </div>

        {created ? (
          <div className="mt-6 rounded-2xl border border-success/15 bg-success-soft px-4 py-3 text-sm text-success">
            Port has been added successfully and is now available in the list.
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 lg:grid-cols-4">
          <article className="ops-metric-card rounded-[24px] p-5">
            <p className="ops-copy text-sm">Total ports</p>
            <p className="ops-heading mt-3 text-3xl font-semibold tracking-tight">
              {ports.length}
            </p>
          </article>
          <article className="ops-metric-card rounded-[24px] p-5">
            <p className="ops-copy text-sm">Active</p>
            <p className="ops-heading mt-3 text-3xl font-semibold tracking-tight">
              {ports.filter((item) => item.status === "Active").length}
            </p>
          </article>
          <article className="ops-metric-card rounded-[24px] p-5">
            <p className="ops-copy text-sm">Congested</p>
            <p className="ops-heading mt-3 text-3xl font-semibold tracking-tight">
              {ports.filter((item) => item.status === "Congested").length}
            </p>
          </article>
          <article className="ops-metric-card rounded-[24px] p-5">
            <p className="ops-copy text-sm">Maintenance</p>
            <p className="ops-heading mt-3 text-3xl font-semibold tracking-tight">
              {ports.filter((item) => item.status === "Maintenance").length}
            </p>
          </article>
        </div>
      </section>

      <section className="ops-panel-secondary rounded-[30px] p-4 md:p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="ops-subtle text-left text-xs font-semibold uppercase tracking-[0.2em]">
                <th className="px-4 py-2">Port</th>
                <th className="px-4 py-2">Code</th>
                <th className="px-4 py-2">Terminal</th>
                <th className="px-4 py-2">Authority</th>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">Capacity</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Added</th>
              </tr>
            </thead>
            <tbody>
              {ports.map((item) => (
                <tr
                  key={item.id}
                  className="ops-detail-card rounded-[24px] text-sm"
                >
                  <td className="rounded-l-[24px] px-4 py-4 align-top">
                    <p className="ops-heading font-semibold">{item.name}</p>
                    <p className="ops-subtle mt-1 text-xs">
                      {item.contactEmail}
                    </p>
                    <p className="ops-subtle mt-1 text-xs">
                      {item.contactPhone}
                    </p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <span className="ops-table-pill rounded-full px-3 py-1 text-xs font-semibold shadow-sm">
                      {item.code}
                    </span>
                  </td>
                  <td className="ops-copy px-4 py-4 align-top">
                    {item.terminalType}
                  </td>
                  <td className="px-4 py-4 align-top">
                    <p className="ops-heading font-medium">{item.authority}</p>
                    <p className="ops-subtle mt-1 text-xs">
                      {item.operatingWindow}
                    </p>
                  </td>
                  <td className="ops-copy px-4 py-4 align-top">
                    {item.city}, {item.country}
                  </td>
                  <td className="px-4 py-4 align-top">
                    <p className="ops-heading font-medium">{item.capacity}</p>
                    <p className="ops-subtle mt-1 text-xs">
                      {item.documents.length} file(s)
                    </p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        item.status === "Active"
                          ? "bg-success-soft text-success"
                          : item.status === "Congested"
                            ? "bg-signal-soft text-amber-700"
                            : "bg-accent-soft text-accent-strong"
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
