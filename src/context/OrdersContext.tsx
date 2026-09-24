"use client";

/**
 * Orders placed in demo mode are stored locally so the full flow
 * (checkout → confirmation → tracking) can be demonstrated.
 * Will be replaced by `POST /api/v1/orders` and `GET /api/v1/me/orders`.
 */
import { createContext, useCallback, useContext, useMemo } from "react";
import { demoOrders } from "@/data/orders";
import { createPersistentStore, useStore } from "@/lib/persistent-store";
import { addDays, todayISO } from "@/lib/utils";
import type { DeliveryAddress, Order, OrderLine, PaymentMethodId, PaymentProof } from "@/types";

const placedStore = createPersistentStore<Order[]>("hl.orders", []);

interface PlaceOrderInput {
  customerName: string;
  lines: OrderLine[];
  subtotal: number;
  delivery: number;
  address: DeliveryAddress;
  paymentMethod: PaymentMethodId;
  paymentProof?: PaymentProof;
}

interface OrdersContextValue {
  orders: Order[];
  getByNumber: (number: string) => Order | undefined;
  placeOrder: (input: PlaceOrderInput) => Order;
  /** Admin action: verifies payment evidence (if any) and confirms the order. */
  confirmOrder: (orderId: string) => void;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);

const pad = (n: number) => String(n).padStart(4, "0");

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const placed = useStore(placedStore);
  const orders = useMemo(() => [...placed, ...demoOrders], [placed]);

  const getByNumber = useCallback(
    (number: string) => orders.find((o) => o.number.toLowerCase() === number.replace(/^#/, "").toLowerCase()),
    [orders],
  );

  const placeOrder = useCallback((input: PlaceOrderInput) => {
    const all = [...placedStore.get(), ...demoOrders];
    const next = Math.max(0, ...all.map((o) => Number(o.number.split("-").pop()))) + 1;
    const today = todayISO();
    const isCod = input.paymentMethod === "cash-on-delivery";
    const order: Order = {
      id: `ord-${Date.now()}`,
      number: `HL-${today.slice(0, 4)}-${pad(next)}`,
      customerName: input.customerName,
      lines: input.lines,
      subtotal: input.subtotal,
      delivery: input.delivery,
      total: input.subtotal + input.delivery,
      // Every order starts as "placed" — an admin must confirm it before it
      // moves to "paid". Mobile-banking orders additionally need their
      // payment evidence checked first; cash-on-delivery does not.
      status: "placed",
      paymentMethod: input.paymentMethod,
      paymentVerification: isCod ? "not-required" : "awaiting-verification",
      paymentProof: input.paymentProof,
      address: input.address,
      placedAt: today,
      estimatedDelivery: addDays(today, 6),
      history: [{ status: "placed", date: today }],
    };
    placedStore.set((prev) => [order, ...prev]);
    return order;
  }, []);

  const confirmOrder = useCallback((orderId: string) => {
    const today = todayISO();
    placedStore.set((prev) =>
      prev.map((o) =>
        o.id === orderId && o.status === "placed"
          ? {
              ...o,
              status: "paid",
              paymentVerification: o.paymentVerification === "awaiting-verification" ? "verified" : o.paymentVerification,
              history: [...o.history, { status: "paid", date: today }],
            }
          : o,
      ),
    );
  }, []);

  const value = useMemo(
    () => ({ orders, getByNumber, placeOrder, confirmOrder }),
    [orders, getByNumber, placeOrder, confirmOrder],
  );
  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used inside <OrdersProvider>");
  return ctx;
}
