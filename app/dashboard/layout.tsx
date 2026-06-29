import Link from "next/link";
import { PortalNav } from "@/app/_components/portal-nav";
import { PortalPageHeader } from "@/app/_components/portal-page-header";

const quickBoard = [
  { label: "ETA exceptions", value: "09" },
  { label: "Pending PODs", value: "14" },
  { label: "Fuel alerts", value: "03" },
];

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen p-2 sm:p-3 lg:p-4">
      <div className="portal-shell grid min-h-[calc(100vh-1rem)] w-full overflow-hidden rounded-[32px] shadow-[0_36px_100px_rgba(15,23,42,0.12)] backdrop-blur-xl lg:min-h-[calc(100vh-2rem)] lg:grid-cols-[272px_minmax(0,1fr)]">
        <aside className="portal-sidebar border-b px-4 py-5 sm:px-5 sm:py-6 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="portal-sidebar-muted text-xs font-semibold uppercase tracking-[0.3em]">
                Logistics Portal
              </p>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight">
                FreightFlow
              </h1>
            </div>
            <Link
              href="/"
              className="portal-theme-button rounded-full px-3 py-1.5 text-xs font-medium transition hover:opacity-90"
            >
              Log out
            </Link>
          </div>

          <div className="portal-sidebar-card mt-8 rounded-[28px] p-5">
            <p className="text-sm">Network status</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">
              Stable
            </p>
            <p className="portal-sidebar-muted mt-3 text-sm leading-6">
              Dispatch, fleet telemetry, and dock updates are synchronized
              across all operating hubs.
            </p>
          </div>

          <PortalNav />

          <div className="portal-sidebar-card mt-8 rounded-[28px] p-5">
            <p className="portal-sidebar-muted text-xs font-semibold uppercase tracking-[0.24em]">
              Quick Board
            </p>
            <div className="mt-5 space-y-4">
              {quickBoard.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-4 text-sm"
                >
                  <span className="portal-sidebar-muted">{item.label}</span>
                  <span className="portal-theme-card rounded-full px-3 py-1 text-xs font-semibold shadow-sm">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex min-h-0 min-w-0 flex-col">
          <header className="portal-header-surface border-b px-4 py-4 backdrop-blur-sm sm:px-5 md:px-6 lg:px-7">
            <PortalPageHeader />
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
