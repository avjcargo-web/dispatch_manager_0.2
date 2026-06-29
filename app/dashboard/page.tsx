import type { Metadata } from "next";

const metrics = [
  {
    label: "Loads in transit",
    value: "128",
    delta: "+8 since last shift",
    tone: "bg-accent-soft text-accent-strong",
  },
  {
    label: "On-time departures",
    value: "94%",
    delta: "Above weekly target",
    tone: "bg-success-soft text-success",
  },
  {
    label: "Dock utilization",
    value: "76%",
    delta: "3 bays available now",
    tone: "bg-signal-soft text-amber-700",
  },
  {
    label: "Invoice holds",
    value: "11",
    delta: "4 need manual review",
    tone: "bg-slate-100 text-slate-700",
  },
];

const laneHealth = [
  { route: "Delhi to Mumbai", progress: 88, status: "Strong flow" },
  { route: "Pune to Chennai", progress: 64, status: "Monitor dwell time" },
  { route: "Bengaluru to Hyderabad", progress: 79, status: "Driver swap ready" },
  { route: "Jaipur to Ahmedabad", progress: 53, status: "Awaiting dock slot" },
];

const activityFeed = [
  "Trailer FF-204 checked in at East Hub and is ready for bay assignment.",
  "Cold-chain shipment CX-88 cleared exception review with updated ETA.",
  "Driver documentation batch for North Zone was approved by compliance.",
  "Two high-value deliveries were moved to escorted dispatch priority.",
];

const dispatchBoard = [
  {
    title: "Fleet availability",
    value: "58 / 61 units",
    note: "Three vehicles are in preventive maintenance this afternoon.",
  },
  {
    title: "Warehouse workload",
    value: "2,430 cartons",
    note: "Inbound volume is concentrated at Central Cross-Dock and South Yard.",
  },
  {
    title: "Collections pending",
    value: "17 stops",
    note: "Finance requested POD confirmation before final release.",
  },
];

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <main className="space-y-6 p-5 md:p-7">
      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <article className="rounded-[30px] border border-line bg-[linear-gradient(180deg,#ffffff,#f5f9ff)] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
                Control tower
              </p>
              <h3 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
                Today&apos;s workspace
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
                Keep dispatch, warehouse, fleet, and finance aligned with a
                single operational picture and clear exception handling.
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-white px-4 py-3 text-sm font-medium text-muted shadow-sm">
              Shift window: 06:00 to 18:00
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((item) => (
              <article
                key={item.label}
                className="rounded-[24px] border border-line bg-[linear-gradient(180deg,#ffffff,#eef5ff)] p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]"
              >
                <p className="text-sm text-muted">{item.label}</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">
                  {item.value}
                </p>
                <span
                  className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${item.tone}`}
                >
                  {item.delta}
                </span>
              </article>
            ))}
          </div>
        </article>

        <article className="rounded-[30px] border border-sky-900/10 bg-[linear-gradient(160deg,#0b213a_0%,#12385b_58%,#15507a_100%)] p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.16)]">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-sky-100/80">
            Dispatch focus
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight">
            Lane health and exceptions
          </h3>

          <div className="mt-6 space-y-4">
            {laneHealth.map((lane) => (
              <div
                key={lane.route}
                className="rounded-[24px] border border-white/10 bg-white/8 p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-white">{lane.route}</p>
                    <p className="mt-1 text-xs text-slate-300">{lane.status}</p>
                  </div>
                  <span className="text-sm font-semibold text-amber-300">
                    {lane.progress}%
                  </span>
                </div>
                <div className="mt-4 h-2 rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-sky-400 to-amber-300"
                    style={{ width: `${lane.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-[30px] border border-line bg-[linear-gradient(180deg,#ffffff,#f6faff)] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                Live activity
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
                Movement timeline
              </h3>
            </div>
            <span className="rounded-full bg-success-soft px-3 py-1 text-xs font-semibold text-success">
              17 updates in queue
            </span>
          </div>

          <div className="mt-7 space-y-4">
            {activityFeed.map((item, index) => (
              <div
                key={item}
                className="flex gap-4 rounded-[24px] border border-line bg-panel-muted p-4"
              >
                <div className="flex flex-col items-center">
                  <span className="h-3 w-3 rounded-full bg-accent" />
                  {index < activityFeed.length - 1 ? (
                    <span className="mt-2 h-full w-px bg-line" />
                  ) : null}
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">
                    {["07:10", "08:35", "09:05", "09:42"][index]}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-muted">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[30px] border border-line bg-[linear-gradient(180deg,#ffffff,#f6faff)] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
            Team board
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
            Operational checkpoints
          </h3>

          <div className="mt-7 space-y-4">
            {dispatchBoard.map((item) => (
              <div
                key={item.title}
                className="rounded-[24px] border border-line bg-panel-muted p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm text-muted">{item.title}</p>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink shadow-sm">
                    Live
                  </span>
                </div>
                <p className="mt-3 text-2xl font-semibold tracking-tight text-ink">
                  {item.value}
                </p>
                <p className="mt-3 text-sm leading-6 text-muted">{item.note}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
