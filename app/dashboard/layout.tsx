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
      <div className="grid min-h-[calc(100vh-1rem)] w-full overflow-hidden rounded-[32px] border border-white/85 bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(241,247,255,0.98))] shadow-[0_36px_100px_rgba(15,23,42,0.12)] backdrop-blur-xl lg:min-h-[calc(100vh-2rem)] lg:grid-cols-[272px_minmax(0,1fr)]">
        <aside className="border-b border-white/10 bg-[linear-gradient(180deg,#08172b_0%,#0c2744_54%,#123a60_100%)] px-4 py-5 text-white sm:px-5 sm:py-6 lg:border-b-0 lg:border-r lg:border-r-white/10">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-100/80">
                Logistics Portal
              </p>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight">
                FreightFlow
              </h1>
            </div>
            <Link
              href="/"
              className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-white/35 hover:text-white"
            >
              Log out
            </Link>
          </div>

          <div className="mt-8 rounded-[28px] border border-sky-200/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.11),rgba(255,255,255,0.05))] p-5 shadow-[0_18px_50px_rgba(4,10,24,0.22)]">
            <p className="text-sm text-sky-50/90">Network status</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
              Stable
            </p>
            <p className="mt-3 text-sm leading-6 text-sky-50/70">
              Dispatch, fleet telemetry, and dock updates are synchronized
              across all operating hubs.
            </p>
          </div>

          <PortalNav />

          <div className="mt-8 rounded-[28px] border border-white/12 bg-[linear-gradient(180deg,rgba(4,18,34,0.45),rgba(11,28,52,0.78))] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-100/80">
              Quick Board
            </p>
            <div className="mt-5 space-y-4">
              {quickBoard.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-4 text-sm"
                >
                  <span className="text-sky-50/80">{item.label}</span>
                  <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex min-h-0 min-w-0 flex-col">
          <header className="border-b border-line bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(242,247,255,0.96))] px-4 py-4 backdrop-blur-sm sm:px-5 md:px-6 lg:px-7">
            <PortalPageHeader />
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
