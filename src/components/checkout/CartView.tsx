"use client";

import { ArrowLeft, Heart, Lock, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/LoadingSkeleton";
import { Breadcrumbs, Price, QuantitySelector } from "@/components/ui/Misc";
import { SmartImage } from "@/components/ui/SmartImage";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useWishlist } from "@/context/WishlistContext";
import { useIsClient } from "@/lib/persistent-store";
import { getArtisanById, getRegion } from "@/services/catalog";
import { SummaryRows } from "./OrderSummary";

export function CartView() {
  const { lines, count, subtotal, delivery, update, remove } = useCart();
  const { has, toggle } = useWishlist();
  const { toast } = useToast();
  const isClient = useIsClient();

  const moveToWishlist = (id: string, name: string) => {
    if (!has(id)) toggle(id);
    remove(id);
    toast({ title: "Moved to your wishlist", description: name, action: { label: "View wishlist", href: "/wishlist" } });
  };

  return (
    <div className="container-page py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
      <h1 className="mt-6 font-display text-5xl sm:text-6xl">Your Cart</h1>

      {!isClient ? (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-36 w-full" />
            <Skeleton className="h-36 w-full" />
          </div>
          <Skeleton className="h-72 w-full" />
        </div>
      ) : lines.length === 0 ? (
        <EmptyState
          className="mt-10"
          icon={<ShoppingBag className="size-6" aria-hidden />}
          title="Your cart is empty"
          description="When you find a piece you love, add it to your cart and it will wait for you here."
          action={
            <>
              <LinkButton href="/shop">Explore the Collection</LinkButton>
              <LinkButton href="/wishlist" variant="outline">
                View wishlist
              </LinkButton>
            </>
          }
        />
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
          <section aria-label="Cart items">
            <p className="border-b border-border pb-4 text-sm text-muted">
              {count} {count === 1 ? "item" : "items"} from{" "}
              {new Set(lines.map((l) => l.product.artisanId)).size} artisan(s)
            </p>
            <ul className="divide-y divide-border">
              {lines.map(({ product, quantity, lineTotal }) => {
                const artisan = getArtisanById(product.artisanId);
                return (
                  <li key={product.id} className="grid grid-cols-[96px_1fr] gap-4 py-6 sm:grid-cols-[128px_1fr] sm:gap-6">
                    <Link href={`/products/${product.slug}`} className="relative aspect-[4/5] overflow-hidden rounded-lg bg-surface-muted">
                      <SmartImage src={product.images[0].src} alt={product.images[0].alt} fill sizes="128px" className="object-cover" />
                    </Link>
                    <div className="flex min-w-0 flex-col">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                        <div className="min-w-0">
                          <Link href={`/products/${product.slug}`} className="font-serif text-2xl leading-tight font-semibold hover:text-primary">
                            {product.name}
                          </Link>
                          <p className="mt-1 text-sm text-muted">
                            by{" "}
                            <Link href={`/artisans/${artisan?.slug}`} className="font-semibold text-text hover:text-primary">
                              {artisan?.name}
                            </Link>{" "}
                            · {getRegion(product.region)?.name}
                          </p>
                          <p className="mt-1 text-sm text-muted">
                            Unit price: <Price amount={product.price} size="sm" />
                          </p>
                        </div>
                        <Price amount={lineTotal} size="lg" className="sm:mt-1" />
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 sm:mt-auto">
                        <QuantitySelector size="sm" value={quantity} max={product.stock} onChange={(v) => update(product.id, v)} label={`Quantity of ${product.name}`} />
                        <button
                          type="button"
                          onClick={() => moveToWishlist(product.id, product.name)}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-primary"
                        >
                          <Heart className="size-4" aria-hidden /> Move to wishlist
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            remove(product.id);
                            toast({ title: "Removed from cart", description: product.name, variant: "info" });
                          }}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-danger"
                        >
                          <Trash2 className="size-4" aria-hidden /> Remove
                        </button>
                      </div>
                      {quantity >= product.stock && (
                        <p className="mt-2 text-xs text-warning">Maximum available quantity reached ({product.stock}).</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
            <Link href="/shop" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold hover:text-primary">
              <ArrowLeft className="size-4" aria-hidden /> Continue shopping
            </Link>
          </section>

          <aside aria-label="Order summary" className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
            <div className="rounded-2xl border border-border bg-surface p-6 sm:p-7">
              <h2 className="font-serif text-3xl font-semibold">Order summary</h2>
              <div className="mt-6">
                <SummaryRows subtotal={subtotal} delivery={delivery} />
              </div>
              <LinkButton href="/checkout" size="lg" fullWidth className="mt-6">
                <Lock className="size-4" aria-hidden /> Proceed to Checkout
              </LinkButton>
              <p className="mt-4 text-center text-xs text-muted">
                Your payment is handled by a secure payment gateway. Heritage Loom never stores card details.
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
