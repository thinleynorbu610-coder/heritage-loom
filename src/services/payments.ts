/**
 * Payment integration boundary.
 *
 * There is NO live payment gateway in this frontend. The checkout collects a
 * payment *method choice* only. When the Go backend is ready, it will:
 *   1. create a payment intent with the chosen external gateway,
 *   2. return a redirect URL or in-app confirmation payload,
 *   3. confirm the order via webhook.
 * The frontend will then call something like `POST /api/v1/orders/{id}/pay`
 * and follow the gateway's redirect. Until then, orders are recorded locally
 * in demo mode and nothing is charged.
 */
import type { PaymentMethodId } from "@/types";

export interface PaymentMethodOption {
  id: PaymentMethodId;
  label: string;
  description: string;
  status: "demo" | "planned";
}

export const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: "mobile-banking",
    label: "Mobile banking",
    description: "Scan a QR code with your bank's mobile app, then upload proof of payment.",
    status: "demo",
  },
  {
    id: "cash-on-delivery",
    label: "Cash on delivery",
    description: "Pay the courier when your order arrives. Available in selected dzongkhags.",
    status: "demo",
  },
];

/**
 * Static demo QR code — encodes a placeholder payee string, not a real bank
 * account. The real gateway will generate an order-specific QR per bank API.
 */
export const MOBILE_BANKING_QR_URL =
  "https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=10&data=" +
  encodeURIComponent("Heritage Loom | Payee: Heritage Loom Pvt. Ltd. | Acc: 100-1000-0000-01");
export const MOBILE_BANKING_ACCOUNT_NAME = "Heritage Loom Pvt. Ltd.";
export const MOBILE_BANKING_ACCOUNT_NUMBER = "100 1000 0000 01";

export const DELIVERY_FEE = 150;
export const FREE_DELIVERY_THRESHOLD = 5000;

export function deliveryFeeFor(subtotal: number) {
  if (subtotal === 0) return 0;
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
}
