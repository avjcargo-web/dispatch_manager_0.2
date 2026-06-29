"use client";

import { useEffect, useSyncExternalStore } from "react";

type PortalTheme = "dark" | "light";

const STORAGE_KEY = "freightflow.portal-theme";
const THEME_EVENT = "freightflow:portal-theme-updated";
const DEFAULT_THEME: PortalTheme = "dark";

function subscribeTheme(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener("storage", callback);
  window.addEventListener(THEME_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(THEME_EVENT, callback);
  };
}

function getThemeSnapshot(): PortalTheme {
  if (typeof window === "undefined") {
    return DEFAULT_THEME;
  }

  return window.localStorage.getItem(STORAGE_KEY) === "light" ? "light" : DEFAULT_THEME;
}

function getThemeServerSnapshot(): PortalTheme {
  return DEFAULT_THEME;
}

function applyTheme(theme: PortalTheme) {
  document.documentElement.dataset.portalTheme = theme;
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getThemeServerSnapshot,
  );

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function updateTheme(nextTheme: PortalTheme) {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
    window.dispatchEvent(new Event(THEME_EVENT));
  }

  return (
    <div className="portal-theme-card rounded-[28px] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em]">
            Display Mode
          </p>
          <p className="portal-theme-muted mt-1 text-sm">
            Let users switch between dark and light.
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {(["dark", "light"] as const).map((option) => (
          <button
            key={option}
            type="button"
            data-active={theme === option}
            onClick={() => updateTheme(option)}
            className="portal-theme-button rounded-2xl px-4 py-3 text-sm font-semibold capitalize transition hover:opacity-90"
          >
            {option} mode
          </button>
        ))}
      </div>
    </div>
  );
}
