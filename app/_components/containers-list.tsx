"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { getContainers, subscribeContainers } from "./container-store";

function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));
}

function formatOptionalDate(value: string) {
  if (!value) {
    return "Not set";
  }

  return formatDate(value);
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

export function ContainersList({ created = false }: { created?: boolean }) {
  const containers = useSyncExternalStore(
    subscribeContainers,
    getContainers,
    getContainers,
  );

  return (
    <main className="space-y-6 p-5 md:p-7">
      <section className="rounded-[30px] border border-line bg-panel p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              Container section
            </p>
            <h3 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              Container list
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
              Track operational containers with ownership, location, inspection,
              and customer assignment details from one container control board.
            </p>
          </div>

          <Link
            href="/dashboard/containers/new"
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Add new container
          </Link>
        </div>

        {created ? (
          <div className="mt-6 rounded-2xl border border-success/15 bg-success-soft px-4 py-3 text-sm text-success">
            Container has been added successfully and is now available in the
            list.
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 lg:grid-cols-4">
          <article className="rounded-[24px] border border-line bg-panel-muted p-5">
            <p className="text-sm text-muted">Total containers</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              {containers.length}
            </p>
          </article>
          <article className="rounded-[24px] border border-line bg-panel-muted p-5">
            <p className="text-sm text-muted">Available</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              {containers.filter((item) => item.status === "Available").length}
            </p>
          </article>
          <article className="rounded-[24px] border border-line bg-panel-muted p-5">
            <p className="text-sm text-muted">In transit</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              {containers.filter((item) => item.status === "In Transit").length}
            </p>
          </article>
          <article className="rounded-[24px] border border-line bg-panel-muted p-5">
            <p className="text-sm text-muted">Under inspection</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              {
                containers.filter((item) => item.status === "Under Inspection")
                  .length
              }
            </p>
          </article>
        </div>
      </section>

      <section className="rounded-[30px] border border-line bg-panel p-4 shadow-[0_20px_60px_rgba(15,23,42,0.06)] md:p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                <th className="px-4 py-2">Container</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Load</th>
                <th className="px-4 py-2">Pickup</th>
                <th className="px-4 py-2">Warehouse</th>
                <th className="px-4 py-2">Charges</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Added</th>
              </tr>
            </thead>
            <tbody>
              {containers.map((item) => (
                <tr
                  key={item.id}
                  className="rounded-[24px] bg-panel-muted text-sm text-ink"
                >
                  <td className="rounded-l-[24px] px-4 py-4 align-top">
                    <p className="font-semibold">{item.containerNumber}</p>
                    <p className="mt-1 text-xs text-muted">
                      {item.type} / {item.size}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      Booking: {item.bookingNumber || "Not added"}
                    </p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <p className="font-medium text-ink">{item.customer}</p>
                    <p className="mt-1 text-xs text-muted">
                      {item.shippingLine || "Shipping line pending"}
                    </p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink shadow-sm">
                      {item.loadType}
                    </span>
                    <p className="mt-1 text-xs text-muted">
                      Ship ETA: {formatOptionalDate(item.shipEta)}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      LFD: {formatOptionalDate(item.lfd)}
                    </p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <p className="font-medium text-ink">
                      {item.pickupLocation || "Pickup location pending"}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      Booking: {formatOptionalDateTime(item.pickupBookingTime)}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      Seal: {item.sealNumber || "Not added"}
                    </p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <p className="font-medium text-ink">
                      {item.warehouse || "Warehouse pending"}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {item.warehouseAddress || "Address not added"}
                    </p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <p className="font-medium text-ink">
                      {item.currencyType} {item.baseRate || "0"}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {item.additionalCharges.length} extra charge(s)
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {item.documents.length} file(s)
                    </p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        item.status === "Available"
                          ? "bg-success-soft text-success"
                          : item.status === "In Transit"
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
