"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { signOut } from "./auth-store";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(() => {
      signOut();
      router.replace("/");
    });
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      className="portal-theme-button rounded-full px-3 py-1.5 text-xs font-medium transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isPending ? "Signing out..." : "Log out"}
    </button>
  );
}
