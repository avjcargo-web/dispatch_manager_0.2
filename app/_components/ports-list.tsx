"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { PortRecord } from "./port-store";

function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));
}

type PortsListProps = {
  created?: boolean;
  deleted?: boolean;
  ports: PortRecord[];
  updated?: boolean;
};

export function PortsList({
  created = false,
  deleted = false,
  ports,
  updated = false,
}: PortsListProps) {
  const router = useRouter();
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function runAction(
    id: string,
    nextPath: string,
    request: () => Promise<Response>,
  ) {
    setActiveActionId(id);
    setActionError(null);

    try {
      const response = await request();

      if (!response.ok) {
        const error = (await response.json().catch(() => null)) as
          | { message?: string }
          | null;
        throw new Error(error?.message || "Port action failed.");
      }

      router.push(nextPath);
      router.refresh();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Port action failed.");
    } finally {
      setActiveActionId(null);
    }
  }

  function handleDelete(id: string, name: string) {
    const shouldDelete = window.confirm(
      `Delete port ${name}? This will remove it from the port list.`,
    );

    if (!shouldDelete) {
      return;
    }

    void runAction(id, "/dashboard/ports?deleted=1", () =>
      fetch(`/api/ports/${encodeURIComponent(id)}`, {
        method: "DELETE",
      }),
    );
  }

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
        {updated ? (
          <div className="mt-6 rounded-2xl border border-sky-400/20 bg-sky-500/12 px-4 py-3 text-sm text-sky-200">
            Port details have been updated successfully.
          </div>
        ) : null}
        {deleted ? (
          <div className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-500/12 px-4 py-3 text-sm text-rose-200">
            Port has been deleted from the active list.
          </div>
        ) : null}
        {actionError ? (
          <div className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-500/12 px-4 py-3 text-sm text-rose-200">
            {actionError}
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
                <th className="px-4 py-2">Actions</th>
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
                  <td className="ops-subtle px-4 py-4 align-top">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="rounded-r-[24px] px-4 py-4 align-top">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/dashboard/ports/${encodeURIComponent(item.id)}`}
                        className="ops-action-chip ops-action-edit inline-flex h-10 items-center justify-center rounded-2xl px-3 text-xs font-semibold uppercase tracking-[0.12em] transition hover:opacity-90"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        disabled={activeActionId !== null}
                        onClick={() => handleDelete(item.id, item.name)}
                        className="ops-action-chip ops-action-delete inline-flex h-10 items-center justify-center rounded-2xl px-3 text-xs font-semibold uppercase tracking-[0.12em] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-55"
                      >
                        {activeActionId === item.id ? "Deleting" : "Delete"}
                      </button>
                    </div>
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
