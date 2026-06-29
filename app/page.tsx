import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./_components/login-form";

const highlights = [
  {
    label: "Active Loads",
    value: "128",
    detail: "12 priority consignments are due before 18:00.",
  },
  {
    label: "Fleet Readiness",
    value: "96%",
    detail: "Only 3 trucks are waiting on fueling and gate clearance.",
  },
  {
    label: "Dock Throughput",
    value: "42/hr",
    detail: "Cross-dock cycle time is down by 14 minutes today.",
  },
];

const trustPoints = [
  "Real-time shipment visibility",
  "Driver, dock, and dispatch alignment",
  "Clear operational alerts and task ownership",
];

export const metadata: Metadata = {
  title: "Login",
};

export default function Home() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(15,115,216,0.2),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(14,165,233,0.14),transparent_18%),radial-gradient(circle_at_bottom_right,rgba(211,138,18,0.18),transparent_22%)]" />
      <div className="grid min-h-screen w-full gap-8 px-4 py-4 lg:grid-cols-[1.1fr_0.9fr] lg:px-6 lg:py-6 2xl:px-8">
        <section className="flex flex-col justify-between rounded-[32px] border border-white/35 bg-[linear-gradient(180deg,#071829_0%,#0c2944_54%,#11456a_100%)] px-7 py-8 text-white shadow-[0_32px_90px_rgba(15,23,42,0.2)] lg:px-10 lg:py-10">
          <div className="space-y-10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-sky-100/85">
                  FreightFlow Control
                </p>
                <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Run dispatch, warehousing, and fleet visibility from one
                  calm command center.
                </h1>
              </div>
              <div className="hidden rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-medium text-slate-200 lg:block">
                24/7 live operations
              </div>
            </div>

            <p className="max-w-2xl text-base leading-8 text-sky-50/78 sm:text-lg">
              A logistics workspace designed for quick decisions, clear lane
              health, and fewer handoff delays across transport, dock, and
              finance teams.
            </p>

            <div className="grid gap-4 md:grid-cols-3">
              {highlights.map((item) => (
                <article
                  key={item.label}
                  className="rounded-3xl border border-white/10 bg-white/8 p-5 backdrop-blur-sm"
                >
                  <p className="text-sm text-sky-50/80">{item.label}</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
                    {item.value}
                  </p>
                  <p className="mt-4 text-sm leading-6 text-sky-50/72">
                    {item.detail}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-6 rounded-[28px] border border-white/10 bg-white/6 p-6 sm:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-100/80">
                Platform Advantages
              </p>
              <div className="mt-5 space-y-4">
                {trustPoints.map((point) => (
                  <div
                    key={point}
                    className="flex items-start gap-3 text-sm text-sky-50/82"
                  >
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-300" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(7,24,41,0.74),rgba(10,34,58,0.92))] p-5">
              <p className="text-sm text-sky-50/80">Today&apos;s dispatch pulse</p>
              <div className="mt-5 flex items-end gap-2">
                {[42, 56, 38, 70, 62, 84, 74].map((height, index) => (
                  <div key={height} className="flex flex-1 flex-col gap-2">
                    <div
                      className={`rounded-t-2xl ${
                        index === 5 ? "bg-amber-300" : "bg-sky-400/80"
                      }`}
                      style={{ height: `${height * 1.1}px` }}
                    />
                    <span className="text-center text-[10px] uppercase tracking-[0.2em] text-slate-400">
                      {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"][index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center">
          <div className="w-full rounded-[32px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(244,249,255,0.98))] p-6 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
                  Portal Login
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
                  Welcome back to operations.
                </h2>
              </div>
              <Link
                href="/dashboard"
                className="hidden rounded-full border border-line px-4 py-2 text-sm font-medium text-muted transition hover:border-accent hover:text-accent md:inline-flex"
              >
                Preview dashboard
              </Link>
            </div>

            <p className="mt-4 max-w-xl text-sm leading-7 text-muted">
              Sign in to access dispatch control, warehouse updates, finance
              approvals, and live shipment movement from a single workspace.
            </p>

            <div className="mt-8 rounded-[28px] border border-line bg-[linear-gradient(180deg,#ffffff,#edf5ff)] p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:p-5">
              <LoginForm />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
