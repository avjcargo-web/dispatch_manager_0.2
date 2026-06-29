"use client";

import Link from "next/link";
import { startTransition, useEffect, useEffectEvent, useState } from "react";
import type { DispatchRecord } from "./dispatch-store";

type DispatchTrackingViewProps = {
  initialDispatch: DispatchRecord;
};

function formatLocationTime(value: string | null) {
  if (!value) {
    return "Waiting for first location ping";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    second: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function formatCoordinate(value: number | null, emptyLabel: string) {
  return value === null ? emptyLabel : value.toFixed(6);
}

function createMapsUrl(latitude: number | null, longitude: number | null) {
  if (latitude === null || longitude === null) {
    return "";
  }

  return `https://www.google.com/maps?q=${latitude},${longitude}`;
}

export function DispatchTrackingView({
  initialDispatch,
}: DispatchTrackingViewProps) {
  const [dispatch, setDispatch] = useState(initialDispatch);
  const [errorMessage, setErrorMessage] = useState("");

  const refreshTracking = useEffectEvent(async () => {
    try {
      const response = await fetch(
        `/api/dispatches/${encodeURIComponent(initialDispatch.id)}`,
        {
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error("Unable to refresh tracking details.");
      }

      const nextDispatch = (await response.json()) as DispatchRecord;

      startTransition(() => {
        setDispatch(nextDispatch);
        setErrorMessage("");
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to refresh tracking details.",
      );
    }
  });

  useEffect(() => {
    const timer = window.setInterval(() => {
      void refreshTracking();
    }, 10000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const mapsUrl = createMapsUrl(
    dispatch.lastKnownLatitude,
    dispatch.lastKnownLongitude,
  );

  return (
    <main className="space-y-6 p-5 md:p-7">
      <section className="rounded-[30px] border border-line bg-panel p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              Dispatch tracking
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              {dispatch.containerNumber || dispatch.loadNumber}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
              Dispatcher live location view for the active driver device. This
              screen refreshes every 10 seconds while the driver app keeps
              sharing background GPS updates.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/dispatch"
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-line px-5 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent"
            >
              Back to dispatch board
            </Link>
            {mapsUrl ? (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Open map
              </a>
            ) : null}
          </div>
        </div>

        {errorMessage ? (
          <div className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-500/12 px-4 py-3 text-sm text-rose-200">
            {errorMessage}
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 lg:grid-cols-4">
          <article className="rounded-[24px] border border-line bg-panel-muted p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">
              Driver
            </p>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-ink">
              {dispatch.driver}
            </p>
            <p className="mt-2 text-sm text-muted">{dispatch.dispatcher}</p>
          </article>
          <article className="rounded-[24px] border border-line bg-panel-muted p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">
              Status
            </p>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-ink">
              {dispatch.trackingActive ? "Tracking live" : "Tracking idle"}
            </p>
            <p className="mt-2 text-sm text-muted">{dispatch.status}</p>
          </article>
          <article className="rounded-[24px] border border-line bg-panel-muted p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">
              Latitude
            </p>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-ink">
              {formatCoordinate(dispatch.lastKnownLatitude, "--")}
            </p>
            <p className="mt-2 text-sm text-muted">
              Container {dispatch.containerNumber || "Pending"}
            </p>
          </article>
          <article className="rounded-[24px] border border-line bg-panel-muted p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">
              Longitude
            </p>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-ink">
              {formatCoordinate(dispatch.lastKnownLongitude, "--")}
            </p>
            <p className="mt-2 text-sm text-muted">
              {formatLocationTime(dispatch.lastLocationRecordedAt)}
            </p>
          </article>
        </div>

        <div className="mt-8 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-[28px] border border-line bg-[linear-gradient(135deg,rgba(15,108,189,0.08),rgba(255,255,255,0.98),rgba(2,132,199,0.08))] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">
              Latest location ping
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-[22px] border border-line bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-ink">
                  Last reported time
                </p>
                <p className="mt-3 text-lg font-semibold text-ink">
                  {formatLocationTime(dispatch.lastLocationRecordedAt)}
                </p>
              </div>
              <div className="rounded-[22px] border border-line bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-ink">Route</p>
                <p className="mt-3 text-lg font-semibold text-ink">
                  {dispatch.origin} to {dispatch.destination}
                </p>
                <p className="mt-2 text-sm text-muted">
                  {dispatch.routeTrack || dispatch.dispatchType}
                </p>
              </div>
              <div className="rounded-[22px] border border-line bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-ink">Load number</p>
                <p className="mt-3 text-lg font-semibold text-ink">
                  {dispatch.loadNumber}
                </p>
              </div>
              <div className="rounded-[22px] border border-line bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-ink">Activated at</p>
                <p className="mt-3 text-lg font-semibold text-ink">
                  {formatLocationTime(dispatch.activatedAt)}
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-[28px] border border-slate-900/0 bg-slate-950 p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.14)]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-200/70">
              Dispatcher notes
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              Tracking summary
            </h2>
            <div className="mt-6 space-y-4">
              <div className="rounded-[22px] border border-white/10 bg-white/7 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-300">
                  Driver
                </p>
                <p className="mt-2 text-lg font-semibold">{dispatch.driver}</p>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-white/7 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-300">
                  Equipment
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {dispatch.equipmentType}
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  Chassis {dispatch.chassisNumber || "Pending"}
                </p>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-white/7 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-300">
                  GPS coordinates
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {formatCoordinate(dispatch.lastKnownLatitude, "--")},{" "}
                  {formatCoordinate(dispatch.lastKnownLongitude, "--")}
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
