"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { createPersistentStore, useStore } from "@/lib/persistent-store";
import { getProductById } from "@/services/catalog";
import { deliveryFeeFor } from "@/services/payments";
import type { CartItem, Product } from "@/types";

const cartStore = createPersistentStore<CartItem[]>("hl.cart", []);

export interface CartLine {
  product: Product;
  quantity: number;
  lineTotal: number;
}

interface CartContextValue {
  items: CartItem[];
  lines: CartLine[];
  count: number;
  subtotal: number;
  delivery: number;
  total: number;
  add: (productId: string, quantity?: number) => void;
  update: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useStore(cartStore);
  const [isOpen, setIsOpen] = useState(false);

  const lines = useMemo<CartLine[]>(
    () =>
      items.flatMap((item) => {
        const product = getProductById(item.productId);
        return product ? [{ product, quantity: item.quantity, lineTotal: product.price * item.quantity }] : [];
      }),
    [items],
  );

  const count = lines.reduce((n, l) => n + l.quantity, 0);
  const subtotal = lines.reduce((n, l) => n + l.lineTotal, 0);
  const delivery = deliveryFeeFor(subtotal);

  const add = useCallback((productId: string, quantity = 1) => {
    const product = getProductById(productId);
    if (!product || product.stock === 0) return;
    cartStore.set((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId ? { ...i, quantity: Math.min(product.stock, i.quantity + quantity) } : i,
        );
      }
      return [...prev, { productId, quantity: Math.min(product.stock, quantity) }];
    });
  }, []);

  const update = useCallback((productId: string, quantity: number) => {
    const product = getProductById(productId);
    const max = product?.stock ?? 99;
    cartStore.set((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.productId !== productId)
        : prev.map((i) => (i.productId === productId ? { ...i, quantity: Math.min(max, quantity) } : i)),
    );
  }, []);

  const remove = useCallback((productId: string) => {
    cartStore.set((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clear = useCallback(() => cartStore.set([]), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({
      items,
      lines,
      count,
      subtotal,
      delivery,
      total: subtotal + delivery,
      add,
      update,
      remove,
      clear,
      isOpen,
      open,
      close,
    }),
    [items, lines, count, subtotal, delivery, add, update, remove, clear, isOpen, open, close],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
