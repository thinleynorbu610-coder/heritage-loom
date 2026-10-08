"use client";

import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";
import { OrdersProvider } from "./OrdersContext";
import { ProductSubmissionsProvider } from "./ProductSubmissionsContext";
import { ToastProvider } from "./ToastContext";
import { WishlistProvider } from "./WishlistContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <OrdersProvider>
          <ProductSubmissionsProvider>
            <WishlistProvider>
              <CartProvider>{children}</CartProvider>
            </WishlistProvider>
          </ProductSubmissionsProvider>
        </OrdersProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
