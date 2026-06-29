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

function getStatusClasses(status: string) {
  if (status === "Available") {
    return "bg-success-soft text-success";
  }

  if (status === "In Transit") {
    return "bg-accent-soft text-accent-strong";
  }

  return "bg-signal-soft text-amber-700";
}

export function ContainersList({ created = false }: { created?: boolean }) {
  const containers = useSyncExternalStore(
    subscribeContainers,
    getContainers,
    getContainers,
  );

  return (
    <main className="space-y-6 p-4 sm:p-5 md:p-6 lg:p-7">
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
            className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
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

        <div className="mt-8 grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
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
        <div className="grid gap-4 2xl:hidden">
          {containers.map((item) => (
            <article
              key={item.id}
              className="rounded-[26px] border border-line bg-panel-muted p-5 shadow-[0_14px_36px_rgba(15,23,42,0.05)] lg:p-6"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-xl font-semibold tracking-tight text-ink">
                      {item.containerNumber}
                    </p>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    {item.type} / {item.size} / {item.loadType}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    Booking: {item.bookingNumber || "Not added"}
                  </p>
                </div>

                <div className="grid gap-3 text-sm text-muted sm:grid-cols-2 lg:min-w-[22rem]">
                  <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-strong">
                      Customer
                    </p>
                    <p className="mt-2 font-medium text-ink">{item.customer}</p>
                    <p className="mt-1 text-xs text-muted">
                      {item.shippingLine || "Shipping line pending"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-strong">
                      Charges
                    </p>
                    <p className="mt-2 font-medium text-ink">
                      {item.currencyType} {item.baseRate || "0"}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {item.additionalCharges.length} extra charge(s)
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-strong">
                    Load plan
                  </p>
                  <p className="mt-2 text-sm font-medium text-ink">
                    Ship ETA: {formatOptionalDate(item.shipEta)}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    LFD: {formatOptionalDate(item.lfd)}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-strong">
                    Pickup
                  </p>
                  <p className="mt-2 text-sm font-medium text-ink">
                    {item.pickupLocation || "Pickup location pending"}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    Slot: {formatOptionalDateTime(item.pickupBookingTime)}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    Seal: {item.sealNumber || "Not added"}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-strong">
                    Warehouse
                  </p>
                  <p className="mt-2 text-sm font-medium text-ink">
                    {item.warehouse || "Warehouse pending"}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {item.warehouseAddress || "Address not added"}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-strong">
                    Admin
                  </p>
                  <p className="mt-2 text-sm font-medium text-ink">
                    Added {formatDate(item.createdAt)}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {item.documents.length} file(s) attached
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="hidden overflow-x-auto 2xl:block">
          <table className="min-w-[1120px] border-separate border-spacing-y-3">
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
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(item.status)}`}
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
