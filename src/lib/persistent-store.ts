"use client";

import { useSyncExternalStore } from "react";

/**
 * Tiny localStorage-backed store for demo state (cart, wishlist, session,
 * orders). Uses useSyncExternalStore so server and client renders agree and
 * no effects are needed. Replace with server state once the API exists.
 */
export interface PersistentStore<T> {
  get: () => T;
  getServer: () => T;
  set: (next: T | ((prev: T) => T)) => void;
  subscribe: (listener: () => void) => () => void;
}

export function createPersistentStore<T>(key: string, initial: T): PersistentStore<T> {
  let state = initial;
  let loaded = false;
  const listeners = new Set<() => void>();

  const load = () => {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) state = JSON.parse(raw) as T;
    } catch {
      /* storage unavailable — keep in-memory state */
    }
  };

  return {
    get: () => {
      load();
      return state;
    },
    getServer: () => initial,
    set: (next) => {
      load();
      state = typeof next === "function" ? (next as (prev: T) => T)(state) : next;
      try {
        window.localStorage.setItem(key, JSON.stringify(state));
      } catch {
        /* ignore quota / privacy mode errors */
      }
      listeners.forEach((l) => l());
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export function useStore<T>(store: PersistentStore<T>) {
  return useSyncExternalStore(store.subscribe, store.get, store.getServer);
}

const noopSubscribe = () => () => {};

/** True only after hydration on the client. */
export function useIsClient() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
