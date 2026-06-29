"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  getDrivers,
  getDriversServerSnapshot,
  subscribeDrivers,
} from "./driver-store";

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
    getDriversServerSnapshot,
  );

  return (
    <main className="space-y-6 p-5 md:p-7">
      <section className="ops-panel-primary rounded-[30px] p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="ops-kicker text-xs font-semibold uppercase tracking-[0.28em]">
              Driver section
            </p>
            <h3 className="ops-heading mt-3 text-3xl font-semibold tracking-tight">
              Driver list
            </h3>
            <p className="ops-copy mt-3 max-w-2xl text-sm leading-7">
              View driver availability, assigned vehicle types, base locations,
              and quickly onboard new drivers into the operations portal.
            </p>
          </div>

          <Link
            href="/dashboard/drivers/new"
            className="ops-action-primary inline-flex h-12 items-center justify-center rounded-2xl px-5 text-sm font-semibold transition hover:opacity-90"
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
          <article className="ops-metric-card rounded-[24px] p-5">
            <p className="ops-copy text-sm">Total drivers</p>
            <p className="ops-heading mt-3 text-3xl font-semibold tracking-tight">
              {drivers.length}
            </p>
          </article>
          <article className="ops-metric-card rounded-[24px] p-5">
            <p className="ops-copy text-sm">Available now</p>
            <p className="ops-heading mt-3 text-3xl font-semibold tracking-tight">
              {drivers.filter((driver) => driver.status === "Active").length}
            </p>
          </article>
          <article className="ops-metric-card rounded-[24px] p-5">
            <p className="ops-copy text-sm">New with zero trips</p>
            <p className="ops-heading mt-3 text-3xl font-semibold tracking-tight">
              {drivers.filter((driver) => driver.trips === 0).length}
            </p>
          </article>
        </div>
      </section>

      <section className="ops-panel-secondary rounded-[30px] p-4 md:p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="ops-subtle text-left text-xs font-semibold uppercase tracking-[0.2em]">
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
                  className="ops-detail-card rounded-[24px] text-sm"
                >
                  <td className="rounded-l-[24px] px-4 py-4 align-top">
                    <p className="ops-heading font-semibold">{driver.name}</p>
                    <p className="ops-subtle mt-1 text-xs">{driver.email}</p>
                    <p className="ops-subtle mt-1 text-xs">{driver.phone}</p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <p className="ops-heading font-medium">{driver.licenseNumber}</p>
                    <p className="ops-subtle mt-1 text-xs">
                      Emergency: {driver.emergencyContact}
                    </p>
                  </td>
                  <td className="ops-copy px-4 py-4 align-top">
                    {driver.baseLocation}
                  </td>
                  <td className="ops-copy px-4 py-4 align-top">
                    {driver.vehicleType}
                  </td>
                  <td className="ops-copy px-4 py-4 align-top">
                    {driver.experience}
                  </td>
                  <td className="ops-heading px-4 py-4 align-top font-semibold">
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
                  <td className="ops-subtle rounded-r-[24px] px-4 py-4 align-top">
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
