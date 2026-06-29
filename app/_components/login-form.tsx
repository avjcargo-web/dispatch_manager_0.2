"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(() => {
      router.push("/dashboard");
    });
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-5">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-ink">Work email</span>
          <input
            type="email"
            placeholder="operations@freightflow.com"
            className="h-13 rounded-2xl border border-line bg-white px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10"
            defaultValue="ops.manager@freightflow.com"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-ink">Password</span>
          <input
            type="password"
            placeholder="Enter your password"
            className="h-13 rounded-2xl border border-line bg-white px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/10"
            defaultValue="portal-demo"
          />
        </label>
      </div>

      <div className="flex flex-col gap-3 rounded-[24px] border border-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-center gap-3 text-sm text-muted">
          <input
            type="checkbox"
            defaultChecked
            className="h-4 w-4 rounded border-line text-accent focus:ring-accent/20"
          />
          Keep this device trusted
        </label>
        <button
          type="button"
          className="text-sm font-medium text-accent transition hover:text-accent-strong"
        >
          Need help signing in?
        </button>
      </div>

      <button
        type="submit"
        className="flex h-13 w-full items-center justify-center rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isPending}
      >
        {isPending ? "Opening dashboard..." : "Enter control center"}
      </button>

      <div className="grid gap-3 rounded-[24px] border border-dashed border-line bg-white px-4 py-3 text-sm text-muted">
        <div className="flex items-center justify-between gap-3">
          <span>Region routing</span>
          <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-strong">
            APAC hub
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span>Last secure sync</span>
          <span className="font-medium text-ink">2 minutes ago</span>
        </div>
      </div>
    </form>
  );
}
