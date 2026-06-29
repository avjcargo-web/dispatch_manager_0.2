"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  getCustomers,
  subscribeCustomers,
} from "./customer-store";

function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));
}

export function CustomersList({ created = false }: { created?: boolean }) {
  const customers = useSyncExternalStore(
    subscribeCustomers,
    getCustomers,
    getCustomers,
  );

  return (
    <main className="space-y-6 p-5 md:p-7">
      <section className="rounded-[30px] border border-line bg-panel p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              Customer section
            </p>
            <h3 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              Customer list
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
              View active customer accounts, monitor billing terms, and create
              new customer profiles for upcoming freight operations.
            </p>
          </div>

          <Link
            href="/dashboard/customers/new"
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Add new customer
          </Link>
        </div>

        {created ? (
          <div className="mt-6 rounded-2xl border border-success/15 bg-success-soft px-4 py-3 text-sm text-success">
            Customer has been added successfully and is now available in the
            list.
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <article className="rounded-[24px] border border-line bg-panel-muted p-5">
            <p className="text-sm text-muted">Total customers</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              {customers.length}
            </p>
          </article>
          <article className="rounded-[24px] border border-line bg-panel-muted p-5">
            <p className="text-sm text-muted">Active accounts</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              {customers.filter((customer) => customer.status === "Active").length}
            </p>
          </article>
          <article className="rounded-[24px] border border-line bg-panel-muted p-5">
            <p className="text-sm text-muted">Open with zero shipments</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              {customers.filter((customer) => customer.shipments === 0).length}
            </p>
          </article>
        </div>
      </section>

      <section className="rounded-[30px] border border-line bg-panel p-4 shadow-[0_20px_60px_rgba(15,23,42,0.06)] md:p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Company</th>
                <th className="px-4 py-2">City</th>
                <th className="px-4 py-2">Billing</th>
                <th className="px-4 py-2">Shipments</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="rounded-[24px] bg-panel-muted text-sm text-ink"
                >
                  <td className="rounded-l-[24px] px-4 py-4 align-top">
                    <p className="font-semibold">{customer.name}</p>
                    <p className="mt-1 text-xs text-muted">{customer.email}</p>
                    <p className="mt-1 text-xs text-muted">{customer.phone}</p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <p className="font-medium">{customer.company}</p>
                    <p className="mt-1 text-xs text-muted">{customer.industry}</p>
                  </td>
                  <td className="px-4 py-4 align-top text-muted">
                    {customer.city}
                  </td>
                  <td className="px-4 py-4 align-top text-muted">
                    {customer.billingTerms}
                  </td>
                  <td className="px-4 py-4 align-top font-semibold text-ink">
                    {customer.shipments}
                  </td>
                  <td className="px-4 py-4 align-top">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        customer.status === "Active"
                          ? "bg-success-soft text-success"
                          : "bg-signal-soft text-amber-700"
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="rounded-r-[24px] px-4 py-4 align-top text-muted">
                    {formatDate(customer.createdAt)}
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
