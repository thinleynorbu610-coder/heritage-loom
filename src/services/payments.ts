/**
 * Demo payment options only. The checkout records a payment method locally;
 * no payment gateway is connected and nothing is charged.
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
