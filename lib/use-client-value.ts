"use client";

import { useCallback, useState, useSyncExternalStore } from "react";

type Listener = () => void;

/**
 * Small external store used to compute a value once, on the client only
 * (e.g. a random pick), without ever mismatching server-rendered HTML.
 * `getSnapshot` computes lazily on first client read, which
 * `useSyncExternalStore` treats as the post-hydration client sync — no
 * `useEffect` + `setState` required.
 */
class ClientValueStore<T> {
  private value: T | null = null;
  private listeners = new Set<Listener>();

  constructor(private factory: () => T) {}

  getSnapshot = (): T => {
    if (this.value === null) this.value = this.factory();
    return this.value;
  };

  getServerSnapshot = (): T | null => null;

  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  regenerate = () => {
    this.value = this.factory();
    this.listeners.forEach((l) => l());
  };
}

/**
 * Returns a value computed once on the client (never during SSR), plus a
 * `regenerate` function to recompute it on demand (e.g. "Next round").
 * Pass `resetKey` to swap in a brand new store when it changes.
 */
export function useClientValue<T>(factory: () => T, resetKey?: unknown) {
  const [store, setStore] = useState(() => new ClientValueStore(factory));
  const [prevKey, setPrevKey] = useState(resetKey);

  // Swap in a fresh store when resetKey changes — React's documented
  // "adjusting state during render" pattern, so no effect is needed.
  let activeStore = store;
  if (prevKey !== resetKey) {
    activeStore = new ClientValueStore(factory);
    setPrevKey(resetKey);
    setStore(activeStore);
  }

  const value = useSyncExternalStore(activeStore.subscribe, activeStore.getSnapshot, activeStore.getServerSnapshot);
  const regenerate = useCallback(() => activeStore.regenerate(), [activeStore]);

  return [value, regenerate] as const;
}
