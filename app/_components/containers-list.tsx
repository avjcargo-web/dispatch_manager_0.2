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

function getDarkStatusClasses(status: string) {
  if (status === "Available") {
    return "bg-emerald-500/18 text-emerald-200 ring-1 ring-emerald-400/25";
  }

  if (status === "In Transit") {
    return "bg-sky-500/18 text-sky-200 ring-1 ring-sky-400/25";
  }

  if (status === "Cancelled") {
    return "bg-rose-500/18 text-rose-200 ring-1 ring-rose-400/25";
  }

  return "bg-amber-500/18 text-amber-200 ring-1 ring-amber-400/25";
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
      <section className="rounded-[30px] border border-slate-800/70 bg-[linear-gradient(180deg,#091423_0%,#0d2138_55%,#102944_100%)] p-6 text-white shadow-[0_24px_70px_rgba(2,8,23,0.34)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-200/75">
              Container section
            </p>
            <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              Container list
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Track operational containers with ownership, location, inspection,
              and customer assignment details from one container control board.
            </p>
          </div>

          <Link
            href="/dashboard/containers/new"
            className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-white px-5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 sm:w-auto"
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
          <article className="rounded-[24px] border border-white/8 bg-white/6 p-5 backdrop-blur-sm">
            <p className="text-sm text-slate-300">Total containers</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
              {containers.length}
            </p>
          </article>
          <article className="rounded-[24px] border border-white/8 bg-white/6 p-5 backdrop-blur-sm">
            <p className="text-sm text-slate-300">Available</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
              {containers.filter((item) => item.status === "Available").length}
            </p>
          </article>
          <article className="rounded-[24px] border border-white/8 bg-white/6 p-5 backdrop-blur-sm">
            <p className="text-sm text-slate-300">In transit</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
              {containers.filter((item) => item.status === "In Transit").length}
            </p>
          </article>
          <article className="rounded-[24px] border border-white/8 bg-white/6 p-5 backdrop-blur-sm">
            <p className="text-sm text-slate-300">Under inspection</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
              {
                containers.filter((item) => item.status === "Under Inspection")
                  .length
              }
            </p>
          </article>
          <article className="rounded-[24px] border border-white/8 bg-white/6 p-5 backdrop-blur-sm">
            <p className="text-sm text-slate-300">Cancelled</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
              {containers.filter((item) => item.status === "Cancelled").length}
            </p>
          </article>
        </div>
      </section>

      <section className="rounded-[30px] border border-slate-800/70 bg-[linear-gradient(180deg,#081220_0%,#0c1d33_100%)] p-4 text-white shadow-[0_24px_70px_rgba(2,8,23,0.34)] md:p-6">
        <div className="grid gap-4 2xl:hidden">
          {containers.map((item) => (
            <article
              key={item.id}
              className="rounded-[26px] border border-white/8 bg-white/[0.04] p-5 shadow-[0_14px_36px_rgba(2,8,23,0.2)] lg:p-6"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-xl font-semibold tracking-tight text-white">
                      {item.containerNumber}
                    </p>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getDarkStatusClasses(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">
                    {item.type} / {item.size} / {item.loadType}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Booking: {item.bookingNumber || "Not added"}
                  </p>
                </div>

                <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-2 lg:min-w-[22rem]">
                  <div className="rounded-2xl border border-white/8 bg-slate-950/35 px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-200/70">
                      Customer
                    </p>
                    <p className="mt-2 font-medium text-white">{item.customer}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {item.shippingLine || "Shipping line pending"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-slate-950/35 px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-200/70">
                      Charges
                    </p>
                    <p className="mt-2 font-medium text-white">
                      {item.currencyType} {item.baseRate || "0"}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {item.additionalCharges.length} extra charge(s)
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-white/8 bg-slate-950/35 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-200/70">
                    Load plan
                  </p>
                  <p className="mt-2 text-sm font-medium text-white">
                    Ship ETA: {formatOptionalDate(item.shipEta)}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    LFD: {formatOptionalDate(item.lfd)}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-slate-950/35 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-200/70">
                    Pickup
                  </p>
                  <p className="mt-2 text-sm font-medium text-white">
                    {item.pickupLocation || "Pickup location pending"}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Slot: {formatOptionalDateTime(item.pickupBookingTime)}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Seal: {item.sealNumber || "Not added"}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-slate-950/35 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-200/70">
                    Warehouse
                  </p>
                  <p className="mt-2 text-sm font-medium text-white">
                    {item.warehouse || "Warehouse pending"}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {item.warehouseAddress || "Address not added"}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-slate-950/35 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-200/70">
                    Admin
                  </p>
                  <p className="mt-2 text-sm font-medium text-white">
                    Added {formatDate(item.createdAt)}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {item.documents.length} file(s) attached
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/dashboard/containers/${encodeURIComponent(item.id)}`}
                  className="inline-flex h-11 items-center justify-center rounded-2xl border border-sky-400/25 bg-sky-500/12 px-4 text-sm font-semibold text-sky-100 transition hover:border-sky-300/45 hover:bg-sky-500/18"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  disabled={isPending || item.status === "Cancelled"}
                  onClick={() => handleCancel(item.id, item.containerNumber)}
                  className="inline-flex h-11 items-center justify-center rounded-2xl border border-amber-400/25 bg-amber-500/12 px-4 text-sm font-semibold text-amber-100 transition hover:border-amber-300/45 hover:bg-amber-500/18 disabled:cursor-not-allowed disabled:opacity-55"
                >
                  {item.status === "Cancelled" ? "Cancelled" : "Cancel load"}
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleDelete(item.id, item.containerNumber)}
                  className="inline-flex h-11 items-center justify-center rounded-2xl border border-rose-400/25 bg-rose-500/12 px-4 text-sm font-semibold text-rose-100 transition hover:border-rose-300/45 hover:bg-rose-500/18 disabled:cursor-not-allowed disabled:opacity-55"
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
              <tr className="text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
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
                  className="rounded-[24px] bg-white/[0.04] text-sm text-slate-200"
                >
                  <td className="rounded-l-[24px] px-4 py-4 align-top">
                    <p className="font-semibold text-white">{item.containerNumber}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {item.type} / {item.size}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Booking: {item.bookingNumber || "Not added"}
                    </p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <p className="font-medium text-white">{item.customer}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {item.shippingLine || "Shipping line pending"}
                    </p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100 shadow-sm">
                      {item.loadType}
                    </span>
                    <p className="mt-1 text-xs text-slate-400">
                      Ship ETA: {formatOptionalDate(item.shipEta)}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      LFD: {formatOptionalDate(item.lfd)}
                    </p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <p className="font-medium text-white">
                      {item.pickupLocation || "Pickup location pending"}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Booking: {formatOptionalDateTime(item.pickupBookingTime)}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Seal: {item.sealNumber || "Not added"}
                    </p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <p className="font-medium text-white">
                      {item.warehouse || "Warehouse pending"}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {item.warehouseAddress || "Address not added"}
                    </p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <p className="font-medium text-white">
                      {item.currencyType} {item.baseRate || "0"}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {item.additionalCharges.length} extra charge(s)
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {item.documents.length} file(s)
                    </p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getDarkStatusClasses(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 align-top text-slate-400">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="rounded-r-[24px] px-4 py-4 align-top">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/dashboard/containers/${encodeURIComponent(item.id)}`}
                        className="inline-flex h-10 items-center justify-center rounded-2xl border border-sky-400/25 bg-sky-500/12 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-sky-100 transition hover:border-sky-300/45 hover:bg-sky-500/18"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        disabled={isPending || item.status === "Cancelled"}
                        onClick={() => handleCancel(item.id, item.containerNumber)}
                        className="inline-flex h-10 items-center justify-center rounded-2xl border border-amber-400/25 bg-amber-500/12 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-amber-100 transition hover:border-amber-300/45 hover:bg-amber-500/18 disabled:cursor-not-allowed disabled:opacity-55"
                      >
                        {item.status === "Cancelled" ? "Cancelled" : "Cancel"}
                      </button>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleDelete(item.id, item.containerNumber)}
                        className="inline-flex h-10 items-center justify-center rounded-2xl border border-rose-400/25 bg-rose-500/12 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-rose-100 transition hover:border-rose-300/45 hover:bg-rose-500/18 disabled:cursor-not-allowed disabled:opacity-55"
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
