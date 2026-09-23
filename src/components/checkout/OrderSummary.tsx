"use client";

import { Info } from "lucide-react";
import { SmartImage } from "@/components/ui/SmartImage";
import type { CartLine } from "@/context/CartContext";
import { formatNu } from "@/lib/utils";
import { getArtisanById } from "@/services/catalog";
import { FREE_DELIVERY_THRESHOLD } from "@/services/payments";

export function SummaryRows({ subtotal, delivery }: { subtotal: number; delivery: number }) {
  return (
    <dl className="flex flex-col gap-3 text-[0.95rem]">
      <div className="flex justify-between">
        <dt className="text-muted">Subtotal</dt>
        <dd className="font-semibold tabular-nums">{formatNu(subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-muted">Delivery</dt>
        <dd className="font-semibold tabular-nums">{delivery === 0 ? <span className="text-success">Free</span> : formatNu(delivery)}</dd>
      </div>
      {delivery > 0 && (
        <p className="flex items-start gap-1.5 text-xs text-muted">
          <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          Free delivery on orders over {formatNu(FREE_DELIVERY_THRESHOLD)}.
        </p>
      )}
      <div className="mt-2 flex items-baseline justify-between border-t border-border pt-4">
        <dt className="font-semibold">Total</dt>
        <dd className="text-2xl font-bold tabular-nums">{formatNu(subtotal + delivery)}</dd>
      </div>
    </dl>
  );
}

/** Compact item list used in checkout sidebar. */
export function OrderItems({ lines }: { lines: CartLine[] }) {
  return (
    <ul className="flex flex-col gap-4">
      {lines.map(({ product, quantity, lineTotal }) => (
        <li key={product.id} className="flex items-center gap-3">
          <span className="relative size-16 shrink-0 overflow-hidden rounded-md bg-surface-muted">
            <SmartImage src={product.images[0].src} alt="" fill sizes="64px" className="object-cover" />
            <span className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-ink text-[0.65rem] font-bold text-white">
              {quantity}
            </span>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold">{product.name}</span>
            <span className="block text-xs text-muted">by {getArtisanById(product.artisanId)?.name}</span>
          </span>
          <span className="text-sm font-semibold tabular-nums">{formatNu(lineTotal)}</span>
        </li>
      ))}
    </ul>
  );
}
