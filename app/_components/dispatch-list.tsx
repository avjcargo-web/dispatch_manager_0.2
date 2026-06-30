"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { DispatchRecord } from "./dispatch-store";

function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));
}

function formatOptionalDateTime(value: string) {
  if (!value) {
    return "Not scheduled";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
  }).format(new Date(value));
}

function formatTrackingTime(value: string | null) {
  if (!value) {
    return "Waiting for driver location";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
  }).format(new Date(value));
}

function getStatusClasses(status: string) {
  if (status === "Scheduled") {
    return "ops-status-pill bg-sky-100 text-sky-700";
  }

  if (status === "In Transit") {
    return "ops-status-pill ops-status-transit";
  }

  if (status === "Delivered") {
    return "ops-status-pill ops-status-available";
  }

  return "ops-status-pill ops-status-cancelled";
}

function getPriorityClasses(priority: string) {
  if (priority === "Critical") {
    return "bg-rose-100 text-rose-700";
  }

  if (priority === "Priority") {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-slate-100 text-slate-700";
}

type DispatchListProps = {
  cancelled?: boolean;
  created?: boolean;
  dispatches: DispatchRecord[];
  deleted?: boolean;
  updated?: boolean;
};

export function DispatchList({
  cancelled = false,
  created = false,
  dispatches,
  deleted = false,
  updated = false,
}: DispatchListProps) {
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
        throw new Error(error?.message || "Dispatch action failed.");
      }

      router.push(nextPath);
      router.refresh();
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Dispatch action failed.",
      );
    } finally {
      setActiveActionId(null);
    }
  }

  function handleDelete(id: string, loadNumber: string) {
    const shouldDelete = window.confirm(
      `Delete dispatch ${loadNumber}? This will remove it from the dispatch board.`,
    );

    if (!shouldDelete) {
      return;
    }

    void runAction(id, "/dashboard/dispatch?deleted=1", () =>
      fetch(`/api/dispatches/${encodeURIComponent(id)}`, {
        method: "DELETE",
      }),
    );
  }

  function handleCancel(id: string, loadNumber: string) {
    const shouldCancel = window.confirm(
      `Mark dispatch ${loadNumber} as cancelled? The record will stay on the dispatch board.`,
    );

    if (!shouldCancel) {
      return;
    }

    void runAction(id, "/dashboard/dispatch?cancelled=1", () =>
      fetch(`/api/dispatches/${encodeURIComponent(id)}`, {
        body: JSON.stringify({ status: "Cancelled" }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
      }),
    );
  }

  return (
    <main className="space-y-6 p-4 sm:p-5 md:p-6 lg:p-7">
      <section className="ops-panel-primary rounded-[30px] p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="ops-kicker text-xs font-semibold uppercase tracking-[0.28em]">
              Dispatch section
            </p>
            <h3 className="ops-heading mt-3 text-3xl font-semibold tracking-tight">
              Dispatch board
            </h3>
            <p className="ops-copy mt-3 max-w-2xl text-sm leading-7">
              Manage driver-safe dispatch moves with pickup, delivery, gate, and
              container instructions without exposing extra commercial context.
            </p>
          </div>

          <Link
            href="/dashboard/dispatch/new"
            className="ops-action-primary inline-flex h-12 w-full items-center justify-center rounded-2xl px-5 text-sm font-semibold transition hover:opacity-90 sm:w-auto"
          >
            Add new dispatch
          </Link>
        </div>

        {created ? (
          <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-500/12 px-4 py-3 text-sm text-emerald-200">
            Dispatch has been added successfully and is now available on the
            board.
          </div>
        ) : null}
        {updated ? (
          <div className="mt-6 rounded-2xl border border-sky-400/20 bg-sky-500/12 px-4 py-3 text-sm text-sky-200">
            Dispatch details have been updated successfully.
          </div>
        ) : null}
        {deleted ? (
          <div className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-500/12 px-4 py-3 text-sm text-rose-200">
            Dispatch has been deleted from the active board.
          </div>
        ) : null}
        {cancelled ? (
          <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-500/12 px-4 py-3 text-sm text-amber-200">
            Dispatch has been marked as cancelled and kept for reference.
          </div>
        ) : null}
        {actionError ? (
          <div className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-500/12 px-4 py-3 text-sm text-rose-200">
            {actionError}
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
          <article className="ops-metric-card rounded-[24px] p-5">
            <p className="ops-copy text-sm">Total dispatches</p>
            <p className="ops-heading mt-3 text-3xl font-semibold tracking-tight">
              {dispatches.length}
            </p>
          </article>
          <article className="ops-metric-card rounded-[24px] p-5">
            <p className="ops-copy text-sm">Scheduled</p>
            <p className="ops-heading mt-3 text-3xl font-semibold tracking-tight">
              {dispatches.filter((item) => item.status === "Scheduled").length}
            </p>
          </article>
          <article className="ops-metric-card rounded-[24px] p-5">
            <p className="ops-copy text-sm">In transit</p>
            <p className="ops-heading mt-3 text-3xl font-semibold tracking-tight">
              {dispatches.filter((item) => item.status === "In Transit").length}
            </p>
          </article>
          <article className="ops-metric-card rounded-[24px] p-5">
            <p className="ops-copy text-sm">Delivered</p>
            <p className="ops-heading mt-3 text-3xl font-semibold tracking-tight">
              {dispatches.filter((item) => item.status === "Delivered").length}
            </p>
          </article>
          <article className="ops-metric-card rounded-[24px] p-5">
            <p className="ops-copy text-sm">Cancelled</p>
            <p className="ops-heading mt-3 text-3xl font-semibold tracking-tight">
              {dispatches.filter((item) => item.status === "Cancelled").length}
            </p>
          </article>
        </div>
      </section>

      <section className="ops-panel-secondary rounded-[30px] p-4 md:p-6">
        <div className="grid gap-4 2xl:hidden">
          {dispatches.map((item) => (
            <article
              key={item.id}
              className="ops-detail-card rounded-[26px] p-5 shadow-[0_14px_36px_rgba(2,8,23,0.2)] lg:p-6"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="ops-heading text-xl font-semibold tracking-tight">
                      {item.loadNumber}
                    </p>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(item.status)}`}
                    >
                      {item.status}
                    </span>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPriorityClasses(item.priority)}`}
                    >
                      {item.priority}
                    </span>
                  </div>
                  <p className="ops-copy mt-2 text-sm">
                    {(item.dispatchType || "Assign later")} / {item.loadType}
                  </p>
                  <p className="ops-subtle mt-1 text-sm">
                    {item.deliveryType || "Delivery type pending"}
                  </p>
                </div>

                <div className="grid gap-3 text-sm sm:grid-cols-2 lg:min-w-[22rem]">
                  <div className="ops-metric-card rounded-2xl px-4 py-3">
                    <p className="ops-kicker text-[11px] font-semibold uppercase tracking-[0.18em]">
                      Assignment
                    </p>
                    <p className="ops-heading mt-2 font-medium">
                      {item.driver || "Assign later"}
                    </p>
                    <p className="ops-subtle mt-1 text-xs">
                      {item.equipmentType || "Vehicle pending"}
                    </p>
                    <p className="ops-subtle mt-1 text-xs">
                      Dispatcher: {item.dispatcher}
                    </p>
                  </div>
                  <div className="ops-metric-card rounded-2xl px-4 py-3">
                    <p className="ops-kicker text-[11px] font-semibold uppercase tracking-[0.18em]">
                      Container
                    </p>
                    <p className="ops-heading mt-2 font-medium">
                      {item.containerNumber || "Pending"}
                    </p>
                    <p className="ops-subtle mt-1 text-xs">
                      {item.size || "Size pending"} /{" "}
                      {item.shippingLine || "Shipping line pending"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="ops-metric-card rounded-2xl px-4 py-3">
                  <p className="ops-kicker text-[11px] font-semibold uppercase tracking-[0.18em]">
                    Pickup
                  </p>
                  <p className="ops-heading mt-2 text-sm font-medium">
                    {formatOptionalDateTime(item.pickupWindow)}
                  </p>
                  <p className="ops-subtle mt-1 text-xs">{item.origin}</p>
                  <p className="ops-subtle mt-1 text-xs">
                    Gate: {item.gateCode || "Pending"} / PIN: {item.pin || "Pending"}
                  </p>
                </div>
                <div className="ops-metric-card rounded-2xl px-4 py-3">
                  <p className="ops-kicker text-[11px] font-semibold uppercase tracking-[0.18em]">
                    Delivery
                  </p>
                  <p className="ops-heading mt-2 text-sm font-medium">
                    {formatOptionalDateTime(item.deliveryWindow)}
                  </p>
                  <p className="ops-subtle mt-1 text-xs">{item.destination}</p>
                  <p className="ops-subtle mt-1 text-xs">
                    {item.deliveryType || "Delivery type pending"}
                  </p>
                </div>
                <div className="ops-metric-card rounded-2xl px-4 py-3">
                  <p className="ops-kicker text-[11px] font-semibold uppercase tracking-[0.18em]">
                    Container refs
                  </p>
                  <p className="ops-heading mt-2 text-sm font-medium">
                    Seal: {item.sealNumber || "Pending"}
                  </p>
                  <p className="ops-subtle mt-1 text-xs">
                    Check-in: {item.checkedInNumber || "Pending"}
                  </p>
                  <p className="ops-subtle mt-1 text-xs">
                    SCAC: {item.scac || "Pending"}
                  </p>
                </div>
                <div className="ops-metric-card rounded-2xl px-4 py-3">
                  <p className="ops-kicker text-[11px] font-semibold uppercase tracking-[0.18em]">
                    Admin
                  </p>
                  <p className="ops-heading mt-2 text-sm font-medium">
                    Added {formatDate(item.createdAt)}
                  </p>
                  <p className="ops-subtle mt-1 text-xs">
                    GPS: {formatTrackingTime(item.lastLocationRecordedAt)}
                  </p>
                  <p className="ops-subtle mt-1 text-xs">{item.id}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/dashboard/dispatch/${encodeURIComponent(item.id)}/track`}
                  className="ops-action-chip inline-flex h-11 items-center justify-center rounded-2xl border border-sky-400/30 bg-sky-500/14 px-4 text-sm font-semibold text-sky-100 transition hover:opacity-90"
                >
                  Track
                </Link>
                <Link
                  href={`/dashboard/dispatch/${encodeURIComponent(item.id)}`}
                  className="ops-action-chip ops-action-edit inline-flex h-11 items-center justify-center rounded-2xl px-4 text-sm font-semibold transition hover:opacity-90"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  disabled={activeActionId !== null || item.status === "Cancelled"}
                  onClick={() => handleCancel(item.id, item.loadNumber)}
                  className="ops-action-chip ops-action-cancel inline-flex h-11 items-center justify-center rounded-2xl px-4 text-sm font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-55"
                >
                  {activeActionId === item.id && item.status !== "Cancelled"
                    ? "Updating..."
                    : item.status === "Cancelled"
                      ? "Cancelled"
                      : "Cancel load"}
                </button>
                <button
                  type="button"
                  disabled={activeActionId !== null}
                  onClick={() => handleDelete(item.id, item.loadNumber)}
                  className="ops-action-chip ops-action-delete inline-flex h-11 items-center justify-center rounded-2xl px-4 text-sm font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-55"
                >
                  {activeActionId === item.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="hidden overflow-x-auto 2xl:block">
          <table className="min-w-[1220px] border-separate border-spacing-y-3">
            <thead>
              <tr className="ops-subtle text-left text-xs font-semibold uppercase tracking-[0.2em]">
                <th className="px-4 py-2">Load</th>
                <th className="px-4 py-2">Assignment</th>
                <th className="px-4 py-2">Move</th>
                <th className="px-4 py-2">Pickup</th>
                <th className="px-4 py-2">Delivery</th>
                <th className="px-4 py-2">Container</th>
                <th className="px-4 py-2">Refs</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Added</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dispatches.map((item) => (
                <tr
                  key={item.id}
                  className="ops-detail-card rounded-[24px] text-sm"
                >
                  <td className="rounded-l-[24px] px-4 py-4 align-top">
                    <p className="ops-heading font-semibold">{item.loadNumber}</p>
                    <p className="ops-subtle mt-1 text-xs">
                      Dispatcher: {item.dispatcher}
                    </p>
                    <p className="ops-subtle mt-1 text-xs">
                      {item.containerNumber || "Container pending"}
                    </p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <p className="ops-heading font-medium">
                      {item.driver || "Assign later"}
                    </p>
                    <p className="ops-subtle mt-1 text-xs">
                      {item.equipmentType || "Vehicle pending"}
                    </p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <p className="ops-heading font-medium">
                      {item.dispatchType || "Assign later"}
                    </p>
                    <p className="ops-subtle mt-1 text-xs">
                      {item.deliveryType || "Delivery type pending"}
                    </p>
                    <p className="ops-subtle mt-1 text-xs">{item.loadType}</p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <p className="ops-heading font-medium">
                      {formatOptionalDateTime(item.pickupWindow)}
                    </p>
                    <p className="ops-subtle mt-1 text-xs">{item.origin}</p>
                    <p className="ops-subtle mt-1 text-xs">
                      Gate: {item.gateCode || "Pending"} / PIN: {item.pin || "Pending"}
                    </p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <p className="ops-heading font-medium">
                      {formatOptionalDateTime(item.deliveryWindow)}
                    </p>
                    <p className="ops-subtle mt-1 text-xs">{item.destination}</p>
                    <p className="ops-subtle mt-1 text-xs">{item.routeTrack || "-"}</p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <p className="ops-heading font-medium">
                      {item.size || "Size pending"}
                    </p>
                    <p className="ops-subtle mt-1 text-xs">
                      {item.shippingLine || "Shipping line pending"}
                    </p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <p className="ops-heading font-medium">
                      Seal: {item.sealNumber || "Pending"}
                    </p>
                    <p className="ops-subtle mt-1 text-xs">
                      Check-in: {item.checkedInNumber || "Pending"}
                    </p>
                    <p className="ops-subtle mt-1 text-xs">
                      SCAC: {item.scac || "Pending"}
                    </p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="ops-subtle px-4 py-4 align-top">
                    {formatDate(item.createdAt)}
                    <p className="mt-1 text-xs">
                      GPS: {formatTrackingTime(item.lastLocationRecordedAt)}
                    </p>
                  </td>
                  <td className="rounded-r-[24px] px-4 py-4 align-top">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/dashboard/dispatch/${encodeURIComponent(item.id)}/track`}
                        className="ops-action-chip inline-flex h-10 items-center justify-center rounded-2xl border border-sky-400/30 bg-sky-500/14 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-sky-100 transition hover:opacity-90"
                      >
                        Track
                      </Link>
                      <Link
                        href={`/dashboard/dispatch/${encodeURIComponent(item.id)}`}
                        className="ops-action-chip ops-action-edit inline-flex h-10 items-center justify-center rounded-2xl px-3 text-xs font-semibold uppercase tracking-[0.12em] transition hover:opacity-90"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        disabled={
                          activeActionId !== null || item.status === "Cancelled"
                        }
                        onClick={() => handleCancel(item.id, item.loadNumber)}
                        className="ops-action-chip ops-action-cancel inline-flex h-10 items-center justify-center rounded-2xl px-3 text-xs font-semibold uppercase tracking-[0.12em] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-55"
                      >
                        {activeActionId === item.id && item.status !== "Cancelled"
                          ? "Updating"
                          : item.status === "Cancelled"
                            ? "Cancelled"
                            : "Cancel"}
                      </button>
                      <button
                        type="button"
                        disabled={activeActionId !== null}
                        onClick={() => handleDelete(item.id, item.loadNumber)}
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
