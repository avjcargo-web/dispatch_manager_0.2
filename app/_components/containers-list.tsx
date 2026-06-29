"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSyncExternalStore, useTransition } from "react";
import {
  deleteContainer,
  getContainers,
  subscribeContainers,
  updateContainerStatus,
} from "./container-store";

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
    return "ops-status-pill ops-status-available";
  }

  if (status === "In Transit") {
    return "ops-status-pill ops-status-transit";
  }

  if (status === "Cancelled") {
    return "ops-status-pill ops-status-cancelled";
  }

  return "ops-status-pill ops-status-inspection";
}

type ContainersListProps = {
  cancelled?: boolean;
  created?: boolean;
  deleted?: boolean;
  updated?: boolean;
};

export function ContainersList({
  cancelled = false,
  created = false,
  deleted = false,
  updated = false,
}: ContainersListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const containers = useSyncExternalStore(
    subscribeContainers,
    getContainers,
    getContainers,
  );

  function handleDelete(id: string, containerNumber: string) {
    const shouldDelete = window.confirm(
      `Delete container ${containerNumber}? This will remove it from the record list.`,
    );

    if (!shouldDelete) {
      return;
    }

    startTransition(() => {
      deleteContainer(id);
      router.push("/dashboard/containers?deleted=1");
    });
  }

  function handleCancel(id: string, containerNumber: string) {
    const shouldCancel = window.confirm(
      `Mark container ${containerNumber} as cancelled? The record will stay in your list.`,
    );

    if (!shouldCancel) {
      return;
    }

    startTransition(() => {
      updateContainerStatus(id, "Cancelled");
      router.push("/dashboard/containers?cancelled=1");
    });
  }

  return (
    <main className="space-y-6 p-4 sm:p-5 md:p-6 lg:p-7">
      <section className="ops-panel-primary rounded-[30px] p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="ops-kicker text-xs font-semibold uppercase tracking-[0.28em]">
              Container section
            </p>
            <h3 className="ops-heading mt-3 text-3xl font-semibold tracking-tight">
              Container list
            </h3>
            <p className="ops-copy mt-3 max-w-2xl text-sm leading-7">
              Track operational containers with ownership, location, inspection,
              and customer assignment details from one container control board.
            </p>
          </div>

          <Link
            href="/dashboard/containers/new"
            className="ops-action-primary inline-flex h-12 w-full items-center justify-center rounded-2xl px-5 text-sm font-semibold transition hover:opacity-90 sm:w-auto"
          >
            Add new container
          </Link>
        </div>

        {created ? (
          <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-500/12 px-4 py-3 text-sm text-emerald-200">
            Container has been added successfully and is now available in the
            list.
          </div>
        ) : null}
        {updated ? (
          <div className="mt-6 rounded-2xl border border-sky-400/20 bg-sky-500/12 px-4 py-3 text-sm text-sky-200">
            Container details have been updated successfully.
          </div>
        ) : null}
        {deleted ? (
          <div className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-500/12 px-4 py-3 text-sm text-rose-200">
            Container has been deleted from the active records list.
          </div>
        ) : null}
        {cancelled ? (
          <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-500/12 px-4 py-3 text-sm text-amber-200">
            Container has been marked as cancelled and kept in the records.
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
          <article className="ops-metric-card rounded-[24px] p-5">
            <p className="ops-copy text-sm">Total containers</p>
            <p className="ops-heading mt-3 text-3xl font-semibold tracking-tight">
              {containers.length}
            </p>
          </article>
          <article className="ops-metric-card rounded-[24px] p-5">
            <p className="ops-copy text-sm">Available</p>
            <p className="ops-heading mt-3 text-3xl font-semibold tracking-tight">
              {containers.filter((item) => item.status === "Available").length}
            </p>
          </article>
          <article className="ops-metric-card rounded-[24px] p-5">
            <p className="ops-copy text-sm">In transit</p>
            <p className="ops-heading mt-3 text-3xl font-semibold tracking-tight">
              {containers.filter((item) => item.status === "In Transit").length}
            </p>
          </article>
          <article className="ops-metric-card rounded-[24px] p-5">
            <p className="ops-copy text-sm">Under inspection</p>
            <p className="ops-heading mt-3 text-3xl font-semibold tracking-tight">
              {
                containers.filter((item) => item.status === "Under Inspection")
                  .length
              }
            </p>
          </article>
          <article className="ops-metric-card rounded-[24px] p-5">
            <p className="ops-copy text-sm">Cancelled</p>
            <p className="ops-heading mt-3 text-3xl font-semibold tracking-tight">
              {containers.filter((item) => item.status === "Cancelled").length}
            </p>
          </article>
        </div>
      </section>

      <section className="ops-panel-secondary rounded-[30px] p-4 md:p-6">
        <div className="grid gap-4 2xl:hidden">
          {containers.map((item) => (
            <article
              key={item.id}
              className="ops-detail-card rounded-[26px] p-5 shadow-[0_14px_36px_rgba(2,8,23,0.2)] lg:p-6"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="ops-heading text-xl font-semibold tracking-tight">
                      {item.containerNumber}
                    </p>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="ops-copy mt-2 text-sm">
                    {item.type} / {item.size} / {item.loadType}
                  </p>
                  <p className="ops-subtle mt-1 text-sm">
                    Booking: {item.bookingNumber || "Not added"}
                  </p>
                </div>

                <div className="grid gap-3 text-sm sm:grid-cols-2 lg:min-w-[22rem]">
                  <div className="ops-metric-card rounded-2xl px-4 py-3">
                    <p className="ops-kicker text-[11px] font-semibold uppercase tracking-[0.18em]">
                      Customer
                    </p>
                    <p className="ops-heading mt-2 font-medium">{item.customer}</p>
                    <p className="ops-subtle mt-1 text-xs">
                      {item.shippingLine || "Shipping line pending"}
                    </p>
                  </div>
                  <div className="ops-metric-card rounded-2xl px-4 py-3">
                    <p className="ops-kicker text-[11px] font-semibold uppercase tracking-[0.18em]">
                      Charges
                    </p>
                    <p className="ops-heading mt-2 font-medium">
                      {item.currencyType} {item.baseRate || "0"}
                    </p>
                    <p className="ops-subtle mt-1 text-xs">
                      {item.additionalCharges.length} extra charge(s)
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="ops-metric-card rounded-2xl px-4 py-3">
                  <p className="ops-kicker text-[11px] font-semibold uppercase tracking-[0.18em]">
                    Load plan
                  </p>
                  <p className="ops-heading mt-2 text-sm font-medium">
                    Ship ETA: {formatOptionalDate(item.shipEta)}
                  </p>
                  <p className="ops-subtle mt-1 text-xs">
                    LFD: {formatOptionalDate(item.lfd)}
                  </p>
                </div>
                <div className="ops-metric-card rounded-2xl px-4 py-3">
                  <p className="ops-kicker text-[11px] font-semibold uppercase tracking-[0.18em]">
                    Pickup
                  </p>
                  <p className="ops-heading mt-2 text-sm font-medium">
                    {item.pickupLocation || "Pickup location pending"}
                  </p>
                  <p className="ops-subtle mt-1 text-xs">
                    Slot: {formatOptionalDateTime(item.pickupBookingTime)}
                  </p>
                  <p className="ops-subtle mt-1 text-xs">
                    Seal: {item.sealNumber || "Not added"}
                  </p>
                </div>
                <div className="ops-metric-card rounded-2xl px-4 py-3">
                  <p className="ops-kicker text-[11px] font-semibold uppercase tracking-[0.18em]">
                    Warehouse
                  </p>
                  <p className="ops-heading mt-2 text-sm font-medium">
                    {item.warehouse || "Warehouse pending"}
                  </p>
                  <p className="ops-subtle mt-1 text-xs">
                    {item.warehouseAddress || "Address not added"}
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
                    {item.documents.length} file(s) attached
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/dashboard/containers/${encodeURIComponent(item.id)}`}
                  className="ops-action-chip ops-action-edit inline-flex h-11 items-center justify-center rounded-2xl px-4 text-sm font-semibold transition hover:opacity-90"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  disabled={isPending || item.status === "Cancelled"}
                  onClick={() => handleCancel(item.id, item.containerNumber)}
                  className="ops-action-chip ops-action-cancel inline-flex h-11 items-center justify-center rounded-2xl px-4 text-sm font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-55"
                >
                  {item.status === "Cancelled" ? "Cancelled" : "Cancel load"}
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleDelete(item.id, item.containerNumber)}
                  className="ops-action-chip ops-action-delete inline-flex h-11 items-center justify-center rounded-2xl px-4 text-sm font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-55"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="hidden overflow-x-auto 2xl:block">
          <table className="min-w-[1120px] border-separate border-spacing-y-3">
            <thead>
              <tr className="ops-subtle text-left text-xs font-semibold uppercase tracking-[0.2em]">
                <th className="px-4 py-2">Container</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Load</th>
                <th className="px-4 py-2">Pickup</th>
                <th className="px-4 py-2">Warehouse</th>
                <th className="px-4 py-2">Charges</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Added</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {containers.map((item) => (
                <tr
                  key={item.id}
                  className="ops-detail-card rounded-[24px] text-sm"
                >
                  <td className="rounded-l-[24px] px-4 py-4 align-top">
                    <p className="ops-heading font-semibold">{item.containerNumber}</p>
                    <p className="ops-subtle mt-1 text-xs">
                      {item.type} / {item.size}
                    </p>
                    <p className="ops-subtle mt-1 text-xs">
                      Booking: {item.bookingNumber || "Not added"}
                    </p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <p className="ops-heading font-medium">{item.customer}</p>
                    <p className="ops-subtle mt-1 text-xs">
                      {item.shippingLine || "Shipping line pending"}
                    </p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <span className="ops-table-pill rounded-full px-3 py-1 text-xs font-semibold shadow-sm">
                      {item.loadType}
                    </span>
                    <p className="ops-subtle mt-1 text-xs">
                      Ship ETA: {formatOptionalDate(item.shipEta)}
                    </p>
                    <p className="ops-subtle mt-1 text-xs">
                      LFD: {formatOptionalDate(item.lfd)}
                    </p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <p className="ops-heading font-medium">
                      {item.pickupLocation || "Pickup location pending"}
                    </p>
                    <p className="ops-subtle mt-1 text-xs">
                      Booking: {formatOptionalDateTime(item.pickupBookingTime)}
                    </p>
                    <p className="ops-subtle mt-1 text-xs">
                      Seal: {item.sealNumber || "Not added"}
                    </p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <p className="ops-heading font-medium">
                      {item.warehouse || "Warehouse pending"}
                    </p>
                    <p className="ops-subtle mt-1 text-xs">
                      {item.warehouseAddress || "Address not added"}
                    </p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <p className="ops-heading font-medium">
                      {item.currencyType} {item.baseRate || "0"}
                    </p>
                    <p className="ops-subtle mt-1 text-xs">
                      {item.additionalCharges.length} extra charge(s)
                    </p>
                    <p className="ops-subtle mt-1 text-xs">
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
                  <td className="ops-subtle px-4 py-4 align-top">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="rounded-r-[24px] px-4 py-4 align-top">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/dashboard/containers/${encodeURIComponent(item.id)}`}
                        className="ops-action-chip ops-action-edit inline-flex h-10 items-center justify-center rounded-2xl px-3 text-xs font-semibold uppercase tracking-[0.12em] transition hover:opacity-90"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        disabled={isPending || item.status === "Cancelled"}
                        onClick={() => handleCancel(item.id, item.containerNumber)}
                        className="ops-action-chip ops-action-cancel inline-flex h-10 items-center justify-center rounded-2xl px-3 text-xs font-semibold uppercase tracking-[0.12em] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-55"
                      >
                        {item.status === "Cancelled" ? "Cancelled" : "Cancel"}
                      </button>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleDelete(item.id, item.containerNumber)}
                        className="ops-action-chip ops-action-delete inline-flex h-10 items-center justify-center rounded-2xl px-3 text-xs font-semibold uppercase tracking-[0.12em] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-55"
                      >
                        Delete
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
