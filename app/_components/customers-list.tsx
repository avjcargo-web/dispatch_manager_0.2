"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  getCustomers,
  getCustomersServerSnapshot,
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
    getCustomersServerSnapshot,
  );

  return (
    <main className="space-y-6 p-5 md:p-7">
      <section className="ops-panel-primary rounded-[30px] p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="ops-kicker text-xs font-semibold uppercase tracking-[0.28em]">
              Customer section
            </p>
            <h3 className="ops-heading mt-3 text-3xl font-semibold tracking-tight">
              Customer list
            </h3>
            <p className="ops-copy mt-3 max-w-2xl text-sm leading-7">
              View active customer accounts, monitor billing terms, and create
              new customer profiles for upcoming freight operations.
            </p>
          </div>

          <Link
            href="/dashboard/customers/new"
            className="ops-action-primary inline-flex h-12 items-center justify-center rounded-2xl px-5 text-sm font-semibold transition hover:opacity-90"
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
          <article className="ops-metric-card rounded-[24px] p-5">
            <p className="ops-copy text-sm">Total customers</p>
            <p className="ops-heading mt-3 text-3xl font-semibold tracking-tight">
              {customers.length}
            </p>
          </article>
          <article className="ops-metric-card rounded-[24px] p-5">
            <p className="ops-copy text-sm">Active accounts</p>
            <p className="ops-heading mt-3 text-3xl font-semibold tracking-tight">
              {customers.filter((customer) => customer.status === "Active").length}
            </p>
          </article>
          <article className="ops-metric-card rounded-[24px] p-5">
            <p className="ops-copy text-sm">Open with zero shipments</p>
            <p className="ops-heading mt-3 text-3xl font-semibold tracking-tight">
              {customers.filter((customer) => customer.shipments === 0).length}
            </p>
          </article>
        </div>
      </section>

      <section className="ops-panel-secondary rounded-[30px] p-4 md:p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="ops-subtle text-left text-xs font-semibold uppercase tracking-[0.2em]">
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
                  className="ops-detail-card rounded-[24px] text-sm"
                >
                  <td className="rounded-l-[24px] px-4 py-4 align-top">
                    <p className="ops-heading font-semibold">{customer.name}</p>
                    <p className="ops-subtle mt-1 text-xs">{customer.email}</p>
                    <p className="ops-subtle mt-1 text-xs">{customer.phone}</p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <p className="ops-heading font-medium">{customer.company}</p>
                    <p className="ops-subtle mt-1 text-xs">{customer.industry}</p>
                  </td>
                  <td className="ops-copy px-4 py-4 align-top">
                    {customer.city}
                  </td>
                  <td className="ops-copy px-4 py-4 align-top">
                    {customer.billingTerms}
                  </td>
                  <td className="ops-heading px-4 py-4 align-top font-semibold">
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
                  <td className="ops-subtle rounded-r-[24px] px-4 py-4 align-top">
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
