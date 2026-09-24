"use client";

/**
 * Wishlist — Phase 2 feature. Stored locally for the demo; will sync to
 * `/api/v1/me/wishlist` once accounts are backed by the API.
 */
import { createContext, useCallback, useContext, useMemo } from "react";
import { createPersistentStore, useStore } from "@/lib/persistent-store";

const wishlistStore = createPersistentStore<string[]>("hl.wishlist", []);

interface WishlistContextValue {
  ids: string[];
  has: (productId: string) => boolean;
  toggle: (productId: string) => boolean; // returns new state
  remove: (productId: string) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const ids = useStore(wishlistStore);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  const toggle = useCallback((id: string) => {
    const willAdd = !wishlistStore.get().includes(id);
    wishlistStore.set((prev) => (willAdd ? [...prev, id] : prev.filter((x) => x !== id)));
    return willAdd;
  }, []);

  const remove = useCallback((id: string) => {
    wishlistStore.set((prev) => prev.filter((x) => x !== id));
  }, []);

  const value = useMemo(() => ({ ids, has, toggle, remove }), [ids, has, toggle, remove]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside <WishlistProvider>");
  return ctx;
}
