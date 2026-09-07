"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "promptlens.theme.v1";
const THEME_EVENT = "promptlens:theme-updated";

export type Theme = "light" | "dark";

function isBrowser() {
  return typeof window !== "undefined";
}

function systemTheme(): Theme {
  if (!isBrowser()) return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function readStored(): Theme | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw === "light" || raw === "dark" ? raw : null;
  } catch {
    return null;
  }
}

function applyTheme(theme: Theme) {
  if (!isBrowser()) return;
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

let cache: Theme = readStored() ?? systemTheme();

function getSnapshot(): Theme {
  return cache;
}

function getServerSnapshot(): Theme {
  return "dark";
}

function persist(theme: Theme) {
  cache = theme;
  applyTheme(theme);
  if (isBrowser()) {
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore quota errors
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  }
}

function subscribe(callback: () => void) {
  const onUpdate = () => callback();
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cache = readStored() ?? systemTheme();
      callback();
    }
  };
  window.addEventListener(THEME_EVENT, onUpdate);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(THEME_EVENT, onUpdate);
    window.removeEventListener("storage", onStorage);
  };
}

/** The inline script string injected into <head> to set the theme before
 *  first paint (avoids a flash of the wrong theme). Kept in sync with the
 *  logic above. */
export const THEME_INIT_SCRIPT = `
(function() {
  try {
    var stored = localStorage.getItem(${JSON.stringify(STORAGE_KEY)});
    var theme = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch (e) {}
})();
`;

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const toggle = useCallback(() => persist(cache === "dark" ? "light" : "dark"), []);
  const setTheme = useCallback((t: Theme) => persist(t), []);
  return { theme, toggle, setTheme };
}
