"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

const primaryNav = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Customers", href: "/dashboard/customers" },
  { label: "Driver", href: "/dashboard/drivers" },
  { label: "Chassis", href: "/dashboard/chassis" },
  { label: "Container", href: "/dashboard/containers" },
  { label: "Port", href: "/dashboard/ports" },
  { label: "Warehouse", href: "/dashboard/warehouses" },
  { label: "Yard", href: "/dashboard/yards" },
  { label: "Shipments", href: "#" },
  { label: "Fleet", href: "#" },
  { label: "Invoices", href: "#" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "#") {
    return false;
  }

  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }

  return pathname.startsWith(href);
}

export function PortalNav() {
  const pathname = usePathname();

  return (
    <>
      <div className="mt-8">
        <ThemeToggle />
      </div>
      <nav className="mt-6 space-y-2">
        {primaryNav.map((item) => {
          const active = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              data-active={active}
              className="portal-nav-link flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition"
            >
              <span>{item.label}</span>
              <span className="portal-nav-dot h-2.5 w-2.5 rounded-full" />
            </Link>
          );
        })}
      </nav>
    </>
  );
}
