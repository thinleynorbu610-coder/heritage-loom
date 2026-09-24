"use client";

import { ShoppingBag, Trash2, Truck } from "lucide-react";
import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";
import { Price, QuantitySelector } from "@/components/ui/Misc";
import { Drawer } from "@/components/ui/Overlay";
import { SmartImage } from "@/components/ui/SmartImage";
import { useCart } from "@/context/CartContext";
import { useIsClient } from "@/lib/persistent-store";
import { formatNu } from "@/lib/utils";
import { getArtisanById } from "@/services/catalog";
import { FREE_DELIVERY_THRESHOLD } from "@/services/payments";

export function CartDrawer() {
  const { lines, count, subtotal, isOpen, close, update, remove } = useCart();
  const isClient = useIsClient();
  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);
  const empty = !isClient || lines.length === 0;

  return (
    <Drawer
      open={isOpen}
      onClose={close}
      title="Your Cart"
      headerExtra={!empty ? <span className="text-sm text-muted">({count} {count === 1 ? "item" : "items"})</span> : null}
      footer={
        !empty ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <span className="font-semibold">Subtotal</span>
              <Price amount={subtotal} size="lg" />
            </div>
            <p className="text-xs text-muted">Delivery is calculated at checkout.</p>
            <LinkButton href="/checkout" onClick={close} size="lg" fullWidth>
              Proceed to Checkout
            </LinkButton>
            <LinkButton href="/cart" onClick={close} variant="outline" fullWidth>
              View full cart
            </LinkButton>
          </div>
        ) : null
      }
    >
      {empty ? (
        <div className="flex h-full flex-col items-center justify-center px-8 py-16 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-surface-muted text-primary">
            <ShoppingBag className="size-7" aria-hidden />
          </div>
          <h3 className="mt-5 font-serif text-2xl font-semibold">Your cart is empty</h3>
          <p className="mt-2 text-muted">Discover pieces handmade by artisans across Bhutan.</p>
          <LinkButton href="/shop" onClick={close} className="mt-6">
            Explore the Collection
          </LinkButton>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="border-b border-border bg-secondary-soft/60 px-5 py-3.5">
            <p className="flex items-center gap-2 text-sm">
              <Truck className="size-4 text-accent" aria-hidden />
              {remaining > 0 ? (
                <span>
                  Add <strong>{formatNu(remaining)}</strong> more for free delivery
                </span>
              ) : (
                <span className="font-semibold text-success">You&apos;ve unlocked free delivery</span>
              )}
            </p>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white" aria-hidden>
              <div className="h-full bg-secondary transition-[width] duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <ul className="divide-y divide-border">
            {lines.map(({ product, quantity, lineTotal }) => (
              <li key={product.id} className="flex gap-4 px-5 py-5">
                <Link
                  href={`/products/${product.slug}`}
                  onClick={close}
                  className="relative h-28 w-22 shrink-0 overflow-hidden rounded-md bg-surface-muted"
                >
                  <SmartImage src={product.images[0].src} alt={product.images[0].alt} fill sizes="88px" className="object-cover" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link
                        href={`/products/${product.slug}`}
                        onClick={close}
                        className="font-serif text-lg leading-tight font-semibold hover:text-primary"
                      >
                        {product.name}
                      </Link>
                      <p className="text-sm text-muted">by {getArtisanById(product.artisanId)?.name}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(product.id)}
                      className="rounded-md p-1.5 text-subtle transition-colors hover:bg-danger-soft hover:text-danger"
                      aria-label={`Remove ${product.name} from cart`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-end justify-between pt-3">
                    <QuantitySelector
                      size="sm"
                      value={quantity}
                      max={product.stock}
                      onChange={(v) => update(product.id, v)}
                      label={`Quantity of ${product.name}`}
                    />
                    <Price amount={lineTotal} size="sm" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Drawer>
  );
}
