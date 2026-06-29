"use client";

import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import {
  getAuthServerSnapshot,
  getAuthSnapshot,
  subscribeAuth,
} from "./auth-store";

export function DashboardAuthGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = useSyncExternalStore(
    subscribeAuth,
    getAuthSnapshot,
    getAuthServerSnapshot,
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[240px] items-center justify-center px-6 py-10">
        <div className="ops-detail-card rounded-[24px] px-6 py-5 text-center">
          <p className="ops-heading text-base font-semibold">Redirecting to login...</p>
          <p className="ops-copy mt-2 text-sm">
            Your session has ended. Please sign in again.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
