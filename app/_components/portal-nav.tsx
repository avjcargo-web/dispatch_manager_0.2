"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

const navSections = [
  {
    label: "Section- 1",
    items: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Port", href: "/dashboard/ports" },
    ],
  },
  {
    label: "Section- 2",
    items: [
      { label: "Customer", href: "/dashboard/customers" },
      { label: "Container", href: "/dashboard/containers" },
      { label: "Dispatch", href: "/dashboard/dispatch" },
    ],
  },
  {
    label: "Section- 3",
    items: [
      { label: "Driver", href: "/dashboard/drivers" },
      { label: "Warehouse", href: "/dashboard/warehouses" },
      { label: "Yard", href: "/dashboard/yards" },
      { label: "Shipping line", href: "/dashboard/shipping-lines" },
      { label: "Chassis", href: "/dashboard/chassis" },
    ],
  },
  {
    label: "Section- 4",
    items: [{ label: "Invoices", href: "#" }],
  },
] as const;

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
      <div className="mt-6 space-y-5">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="portal-sidebar-muted px-1 text-[11px] font-semibold uppercase tracking-[0.24em]">
              {section.label}
            </p>
            <nav className="mt-3 space-y-2">
              {section.items.map((item) => {
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
          </div>
        ))}
      </div>
    </>
  );
}
