"use client";

import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";
import { OrdersProvider } from "./OrdersContext";
import { ToastProvider } from "./ToastContext";
import { WishlistProvider } from "./WishlistContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <OrdersProvider>
          <WishlistProvider>
            <CartProvider>{children}</CartProvider>
          </WishlistProvider>
        </OrdersProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
