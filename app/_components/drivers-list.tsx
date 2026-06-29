"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { getDrivers, subscribeDrivers } from "./driver-store";

function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));
}

export function DriversList({ created = false }: { created?: boolean }) {
  const drivers = useSyncExternalStore(
    subscribeDrivers,
    getDrivers,
    getDrivers,
  );

  return (
    <main className="space-y-6 p-5 md:p-7">
      <section className="rounded-[30px] border border-line bg-panel p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              Driver section
            </p>
            <h3 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              Driver list
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
              View driver availability, assigned vehicle types, base locations,
              and quickly onboard new drivers into the operations portal.
            </p>
          </div>

          <Link
            href="/dashboard/drivers/new"
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Add new driver
          </Link>
        </div>

        {created ? (
          <div className="mt-6 rounded-2xl border border-success/15 bg-success-soft px-4 py-3 text-sm text-success">
            Driver has been added successfully and is now available in the
            list.
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <article className="rounded-[24px] border border-line bg-panel-muted p-5">
            <p className="text-sm text-muted">Total drivers</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              {drivers.length}
            </p>
          </article>
          <article className="rounded-[24px] border border-line bg-panel-muted p-5">
            <p className="text-sm text-muted">Available now</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              {drivers.filter((driver) => driver.status === "Active").length}
            </p>
          </article>
          <article className="rounded-[24px] border border-line bg-panel-muted p-5">
            <p className="text-sm text-muted">New with zero trips</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              {drivers.filter((driver) => driver.trips === 0).length}
            </p>
          </article>
        </div>
      </section>

      <section className="rounded-[30px] border border-line bg-panel p-4 shadow-[0_20px_60px_rgba(15,23,42,0.06)] md:p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                <th className="px-4 py-2">Driver</th>
                <th className="px-4 py-2">License</th>
                <th className="px-4 py-2">Base</th>
                <th className="px-4 py-2">Vehicle</th>
                <th className="px-4 py-2">Experience</th>
                <th className="px-4 py-2">Trips</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Joined</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver) => (
                <tr
                  key={driver.id}
                  className="rounded-[24px] bg-panel-muted text-sm text-ink"
                >
                  <td className="rounded-l-[24px] px-4 py-4 align-top">
                    <p className="font-semibold">{driver.name}</p>
                    <p className="mt-1 text-xs text-muted">{driver.email}</p>
                    <p className="mt-1 text-xs text-muted">{driver.phone}</p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <p className="font-medium">{driver.licenseNumber}</p>
                    <p className="mt-1 text-xs text-muted">
                      Emergency: {driver.emergencyContact}
                    </p>
                  </td>
                  <td className="px-4 py-4 align-top text-muted">
                    {driver.baseLocation}
                  </td>
                  <td className="px-4 py-4 align-top text-muted">
                    {driver.vehicleType}
                  </td>
                  <td className="px-4 py-4 align-top text-muted">
                    {driver.experience}
                  </td>
                  <td className="px-4 py-4 align-top font-semibold text-ink">
                    {driver.trips}
                  </td>
                  <td className="px-4 py-4 align-top">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        driver.status === "Active"
                          ? "bg-success-soft text-success"
                          : driver.status === "On Route"
                            ? "bg-accent-soft text-accent-strong"
                            : "bg-signal-soft text-amber-700"
                      }`}
                    >
                      {driver.status}
                    </span>
                  </td>
                  <td className="rounded-r-[24px] px-4 py-4 align-top text-muted">
                    {formatDate(driver.createdAt)}
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
