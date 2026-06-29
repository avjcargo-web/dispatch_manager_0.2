"use client";

export type AuthState = boolean;

const STORAGE_KEY = "freightflow.auth";
const AUTH_EVENT = "freightflow:auth-updated";

function canUseStorage() {
  return typeof window !== "undefined";
}

function readAuthState(): AuthState {
  if (!canUseStorage()) {
    return false;
  }

  return window.localStorage.getItem(STORAGE_KEY) === "true";
}

export function getAuthSnapshot() {
  return readAuthState();
}

export function getAuthServerSnapshot() {
  return false;
}

export function subscribeAuth(callback: () => void) {
  if (!canUseStorage()) {
    return () => undefined;
  }

  window.addEventListener("storage", callback);
  window.addEventListener(AUTH_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(AUTH_EVENT, callback);
  };
}

export function signIn() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, "true");
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function signOut() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(AUTH_EVENT));
}
