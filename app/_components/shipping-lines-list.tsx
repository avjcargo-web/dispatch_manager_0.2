"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ShippingLineRecord } from "./shipping-line-store";

function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));
}

type ShippingLinesListProps = {
  created?: boolean;
  deleted?: boolean;
  shippingLines: ShippingLineRecord[];
  updated?: boolean;
};

export function ShippingLinesList({
  created = false,
  deleted = false,
  shippingLines,
  updated = false,
}: ShippingLinesListProps) {
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
        throw new Error(error?.message || "Shipping line action failed.");
      }

      router.push(nextPath);
      router.refresh();
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Shipping line action failed.",
      );
    } finally {
      setActiveActionId(null);
    }
  }

  function handleDelete(id: string, name: string) {
    const shouldDelete = window.confirm(
      `Delete shipping line ${name}? This will remove the master record from the list.`,
    );

    if (!shouldDelete) {
      return;
    }

    void runAction(id, "/dashboard/shipping-lines?deleted=1", () =>
      fetch(`/api/shipping-lines/${encodeURIComponent(id)}`, {
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
              Shipping line section
            </p>
            <h3 className="ops-heading mt-3 text-3xl font-semibold tracking-tight">
              Shipping line list
            </h3>
            <p className="ops-copy mt-3 max-w-2xl text-sm leading-7">
              Maintain carrier master records so container operations can reuse
              consistent shipping line details across bookings and planning.
            </p>
          </div>

          <Link
            href="/dashboard/shipping-lines/new"
            className="ops-action-primary inline-flex h-12 items-center justify-center rounded-2xl px-5 text-sm font-semibold transition hover:opacity-90"
          >
            Add new shipping line
          </Link>
        </div>

        {created ? (
          <div className="mt-6 rounded-2xl border border-success/15 bg-success-soft px-4 py-3 text-sm text-success">
            Shipping line has been added successfully and is now available in the list.
          </div>
        ) : null}
        {updated ? (
          <div className="mt-6 rounded-2xl border border-sky-400/20 bg-sky-500/12 px-4 py-3 text-sm text-sky-200">
            Shipping line details have been updated successfully.
          </div>
        ) : null}
        {deleted ? (
          <div className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-500/12 px-4 py-3 text-sm text-rose-200">
            Shipping line has been deleted from the master list.
          </div>
        ) : null}
        {actionError ? (
          <div className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-500/12 px-4 py-3 text-sm text-rose-200">
            {actionError}
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 lg:grid-cols-4">
          <article className="ops-metric-card rounded-[24px] p-5">
            <p className="ops-copy text-sm">Total shipping lines</p>
            <p className="ops-heading mt-3 text-3xl font-semibold tracking-tight">
              {shippingLines.length}
            </p>
          </article>
          <article className="ops-metric-card rounded-[24px] p-5">
            <p className="ops-copy text-sm">Active</p>
            <p className="ops-heading mt-3 text-3xl font-semibold tracking-tight">
              {shippingLines.filter((item) => item.status === "Active").length}
            </p>
          </article>
          <article className="ops-metric-card rounded-[24px] p-5">
            <p className="ops-copy text-sm">Preferred</p>
            <p className="ops-heading mt-3 text-3xl font-semibold tracking-tight">
              {shippingLines.filter((item) => item.status === "Preferred").length}
            </p>
          </article>
          <article className="ops-metric-card rounded-[24px] p-5">
            <p className="ops-copy text-sm">Suspended</p>
            <p className="ops-heading mt-3 text-3xl font-semibold tracking-tight">
              {shippingLines.filter((item) => item.status === "Suspended").length}
            </p>
          </article>
        </div>
      </section>

      <section className="ops-panel-secondary rounded-[30px] p-4 md:p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="ops-subtle text-left text-xs font-semibold uppercase tracking-[0.2em]">
                <th className="px-4 py-2">Shipping line</th>
                <th className="px-4 py-2">SCAC</th>
                <th className="px-4 py-2">Service</th>
                <th className="px-4 py-2">Contact</th>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Added</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shippingLines.map((item) => (
                <tr
                  key={item.id}
                  className="ops-detail-card rounded-[24px] text-sm"
                >
                  <td className="rounded-l-[24px] px-4 py-4 align-top">
                    <p className="ops-heading font-semibold">{item.name}</p>
                    <p className="ops-subtle mt-1 text-xs">
                      {item.website || "Website not added"}
                    </p>
                    <p className="ops-subtle mt-1 text-xs">
                      {item.documents.length} file(s)
                    </p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <span className="ops-table-pill rounded-full px-3 py-1 text-xs font-semibold shadow-sm">
                      {item.scac}
                    </span>
                  </td>
                  <td className="ops-copy px-4 py-4 align-top">
                    {item.serviceMode}
                  </td>
                  <td className="px-4 py-4 align-top">
                    <p className="ops-heading font-medium">{item.contactEmail}</p>
                    <p className="ops-subtle mt-1 text-xs">{item.contactPhone}</p>
                  </td>
                  <td className="ops-copy px-4 py-4 align-top">
                    {item.city}, {item.country}
                  </td>
                  <td className="px-4 py-4 align-top">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        item.status === "Active"
                          ? "bg-success-soft text-success"
                          : item.status === "Preferred"
                            ? "bg-accent-soft text-accent-strong"
                            : "bg-signal-soft text-amber-700"
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
                        href={`/dashboard/shipping-lines/${encodeURIComponent(item.id)}`}
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
