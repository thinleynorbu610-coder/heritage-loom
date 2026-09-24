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
    description: "Pay from your Bhutanese bank's mobile app. Connects to a local payment gateway once integrated.",
    status: "demo",
  },
  {
    id: "card",
    label: "Debit or credit card",
    description: "Visa or Mastercard via a secure hosted payment page. You will never enter card details on Heritage Loom.",
    status: "demo",
  },
  {
    id: "cash-on-delivery",
    label: "Cash on delivery",
    description: "Pay the courier when your order arrives. Available in selected dzongkhags.",
    status: "demo",
  },
];

export const DELIVERY_FEE = 150;
export const FREE_DELIVERY_THRESHOLD = 5000;

export function deliveryFeeFor(subtotal: number) {
  if (subtotal === 0) return 0;
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
}
