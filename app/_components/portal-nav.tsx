"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
    <nav className="mt-8 space-y-2">
      {primaryNav.map((item) => {
        const active = isActivePath(pathname, item.href);

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition ${
              active
                ? "border-sky-200/25 bg-[linear-gradient(135deg,rgba(53,167,255,0.92),rgba(15,108,189,1))] text-white shadow-[0_16px_30px_rgba(8,60,112,0.38)]"
                : "border-white/8 bg-white/[0.03] text-sky-50/86 hover:border-white/14 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span>{item.label}</span>
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                active ? "bg-white" : "bg-sky-100/35"
              }`}
            />
          </Link>
        );
      })}
    </nav>
  );
}
