"use client";

import { usePathname } from "next/navigation";

const pageMap: Record<
  string,
  { eyebrow: string; title: string; searchLabel: string }
> = {
  "/dashboard": {
    eyebrow: "Operations workspace",
    title: "Dashboard overview",
    searchLabel: "Search loads, vehicles, warehouses",
  },
  "/dashboard/customers": {
    eyebrow: "Customer management",
    title: "Customer directory",
    searchLabel: "Search customer, company, city",
  },
  "/dashboard/customers/new": {
    eyebrow: "Customer management",
    title: "Add new customer",
    searchLabel: "Search customer, company, city",
  },
  "/dashboard/shipping-lines": {
    eyebrow: "Shipping line management",
    title: "Shipping line directory",
    searchLabel: "Search carrier, SCAC, city, contact",
  },
  "/dashboard/shipping-lines/new": {
    eyebrow: "Shipping line management",
    title: "Add new shipping line",
    searchLabel: "Search carrier, SCAC, city, contact",
  },
  "/dashboard/drivers": {
    eyebrow: "Driver management",
    title: "Driver directory",
    searchLabel: "Search driver, license, base location",
  },
  "/dashboard/drivers/new": {
    eyebrow: "Driver management",
    title: "Add new driver",
    searchLabel: "Search driver, license, base location",
  },
  "/dashboard/chassis": {
    eyebrow: "Chassis management",
    title: "Chassis directory",
    searchLabel: "Search chassis, owner, location, container",
  },
  "/dashboard/chassis/new": {
    eyebrow: "Chassis management",
    title: "Add new chassis",
    searchLabel: "Search chassis, owner, location, container",
  },
  "/dashboard/containers": {
    eyebrow: "Container management",
    title: "Container directory",
    searchLabel: "Search container, owner, location, customer",
  },
  "/dashboard/containers/new": {
    eyebrow: "Container management",
    title: "Add new container",
    searchLabel: "Search container, owner, location, customer",
  },
  "/dashboard/dispatch": {
    eyebrow: "Dispatch management",
    title: "Dispatch board",
    searchLabel: "Search load, driver, route, customer",
  },
  "/dashboard/dispatch/new": {
    eyebrow: "Dispatch management",
    title: "Add new dispatch",
    searchLabel: "Search load, driver, route, customer",
  },
  "/dashboard/ports": {
    eyebrow: "Port management",
    title: "Port directory",
    searchLabel: "Search port, code, city, authority",
  },
  "/dashboard/ports/new": {
    eyebrow: "Port management",
    title: "Add new port",
    searchLabel: "Search port, code, city, authority",
  },
  "/dashboard/warehouses": {
    eyebrow: "Warehouse management",
    title: "Warehouse directory",
    searchLabel: "Search site, city, manager, capacity",
  },
  "/dashboard/warehouses/new": {
    eyebrow: "Warehouse management",
    title: "Add new warehouse",
    searchLabel: "Search site, city, manager, capacity",
  },
  "/dashboard/yards": {
    eyebrow: "Yard management",
    title: "Yard directory",
    searchLabel: "Search site, city, manager, capacity",
  },
  "/dashboard/yards/new": {
    eyebrow: "Yard management",
    title: "Add new yard",
    searchLabel: "Search site, city, manager, capacity",
  },
};

export function PortalPageHeader() {
  const pathname = usePathname();
  const content =
    pageMap[pathname] ??
    (pathname.startsWith("/dashboard/dispatch/") &&
    pathname !== "/dashboard/dispatch/new"
      ? {
          eyebrow: "Dispatch management",
          title: "Edit dispatch",
          searchLabel: "Search load, driver, route, customer",
        }
      : null) ??
    (pathname.startsWith("/dashboard/customers/") &&
    pathname !== "/dashboard/customers/new"
      ? {
          eyebrow: "Customer management",
          title: "Edit customer",
          searchLabel: "Search customer, company, city",
        }
      : null) ??
    (pathname.startsWith("/dashboard/containers/") &&
    pathname !== "/dashboard/containers/new"
      ? {
          eyebrow: "Container management",
          title: "Edit container",
          searchLabel: "Search container, owner, location, customer",
        }
      : null) ??
    (pathname.startsWith("/dashboard/ports/") &&
    pathname !== "/dashboard/ports/new"
      ? {
          eyebrow: "Port management",
          title: "Edit port",
          searchLabel: "Search port, code, city, authority",
        }
      : null) ??
    (pathname.startsWith("/dashboard/drivers/") &&
    pathname !== "/dashboard/drivers/new"
      ? {
          eyebrow: "Driver management",
          title: "Edit driver",
          searchLabel: "Search driver, license, base location",
        }
      : null) ??
    (pathname.startsWith("/dashboard/warehouses/") &&
    pathname !== "/dashboard/warehouses/new"
      ? {
          eyebrow: "Warehouse management",
          title: "Edit warehouse",
          searchLabel: "Search site, city, manager, capacity",
        }
      : null) ??
    (pathname.startsWith("/dashboard/yards/") &&
    pathname !== "/dashboard/yards/new"
      ? {
          eyebrow: "Yard management",
          title: "Edit yard",
          searchLabel: "Search site, city, manager, capacity",
        }
      : null) ??
    (pathname.startsWith("/dashboard/chassis/") &&
    pathname !== "/dashboard/chassis/new"
      ? {
          eyebrow: "Chassis management",
          title: "Edit chassis",
          searchLabel: "Search chassis, owner, location, container",
        }
      : null) ??
    (pathname.startsWith("/dashboard/shipping-lines/") &&
    pathname !== "/dashboard/shipping-lines/new"
      ? {
          eyebrow: "Shipping line management",
          title: "Edit shipping line",
          searchLabel: "Search carrier, SCAC, city, contact",
        }
      : pageMap["/dashboard"]);

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent-strong">
          {content.eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          {content.title}
        </h2>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-stretch lg:max-w-[58rem] lg:flex-1 lg:justify-end">
        <div className="flex min-h-11 min-w-0 flex-1 items-center gap-3 rounded-[22px] border border-line bg-[linear-gradient(180deg,#ffffff,#f4f8ff)] px-4 py-3 text-sm shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
          <span className="h-2.5 w-2.5 rounded-full bg-accent" />
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-strong">
              Search Workspace
            </p>
            <p className="truncate text-sm text-muted">{content.searchLabel}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-[22px] border border-line bg-[linear-gradient(180deg,#ffffff,#f4f8ff)] px-4 py-2.5 shadow-[0_8px_24px_rgba(15,23,42,0.05)] md:self-start">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#d9ecff,#8fd0ff)] text-sm font-semibold text-accent-strong shadow-sm">
            AK
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Ayesha Khan</p>
            <p className="text-xs text-muted">Regional Operations</p>
          </div>
        </div>
      </div>
    </div>
  );
}
