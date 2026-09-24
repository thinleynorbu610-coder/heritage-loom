"use client";

import { MapPin, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Price } from "@/components/ui/Misc";
import { Rating } from "@/components/ui/Rating";
import { SmartImage } from "@/components/ui/SmartImage";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/utils";
import { getArtisanById, getRegion } from "@/services/catalog";
import type { Product } from "@/types";
import { QuickViewButton } from "./QuickView";
import { WishlistButton } from "./WishlistButton";

const NEW_WINDOW_DAYS = 21;
const REFERENCE_DATE = new Date("2026-09-23T00:00:00");

export function ProductCard({ product, priority, className }: { product: Product; priority?: boolean; className?: string }) {
  const { add } = useCart();
  const { toast } = useToast();
  const artisan = getArtisanById(product.artisanId);
  const region = getRegion(product.region);
  const href = `/products/${product.slug}`;
  const soldOut = product.stock === 0;
  const lowStock = !soldOut && product.stock <= 3;
  const isNew =
    (REFERENCE_DATE.getTime() - new Date(product.createdAt + "T00:00:00").getTime()) / 86_400_000 <= NEW_WINDOW_DAYS;

  const onAdd = () => {
    add(product.id);
    toast({
      title: "Added to your cart",
      description: `${product.name} · by ${artisan?.name}`,
      action: { label: "View cart", href: "/cart" },
    });
  };

  return (
    <article className={cn("group relative flex flex-col", className)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-surface-muted">
        <Link href={href} tabIndex={-1} aria-hidden="true" className="absolute inset-0">
          <SmartImage
            src={product.images[0].src}
            alt={product.images[0].alt}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            fallbackLabel={product.name}
          />
          {product.images[1] && (
            <SmartImage
              src={product.images[1].src}
              alt=""
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
        </Link>

        <div className="pointer-events-none absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {soldOut ? (
            <Badge tone="dark">Sold out</Badge>
          ) : lowStock ? (
            <Badge tone="dark">Only {product.stock} left</Badge>
          ) : isNew ? (
            <Badge tone="dark">New</Badge>
          ) : null}
        </div>

        <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
          <WishlistButton productId={product.id} productName={product.name} />
          <QuickViewButton
            product={product}
            className="hidden size-10 translate-x-2 items-center justify-center rounded-full bg-surface/90 text-text opacity-0 shadow-soft backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-surface group-hover:translate-x-0 group-hover:opacity-100 md:inline-flex"
          />
        </div>

        {/* Desktop quick-add, revealed on hover/focus */}
        <div className="absolute inset-x-3 bottom-3 hidden translate-y-2 gap-2 opacity-0 transition-all duration-300 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 md:flex">
          <button
            type="button"
            onClick={onAdd}
            disabled={soldOut}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-md bg-surface/95 text-sm font-semibold text-text shadow-soft backdrop-blur-sm transition-colors hover:bg-ink hover:text-background disabled:opacity-60"
          >
            <ShoppingBag className="size-4" aria-hidden />
            {soldOut ? "Sold out" : "Add to Cart"}
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        <p className="flex items-center gap-1 text-[0.7rem] font-bold tracking-[0.14em] text-accent uppercase">
          <MapPin className="size-3" aria-hidden />
          {region?.name}
        </p>
        <h3 className="mt-1.5 font-serif text-[1.35rem] leading-tight font-semibold text-text">
          <Link href={href}>
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">
              {product.name}
            </span>
          </Link>
        </h3>
        {artisan && (
          <p className="mt-1 text-sm text-muted">
            by{" "}
            <Link href={`/artisans/${artisan.slug}`} className="font-semibold text-text hover:text-primary">
              {artisan.name}
            </Link>
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <Price amount={product.price} compareAt={product.compareAtPrice} />
          <Rating value={product.rating} count={product.reviewCount} />
        </div>

        {/* Mobile actions — always visible, clearly labelled */}
        <div className="mt-3 md:hidden">
          <button
            type="button"
            onClick={onAdd}
            disabled={soldOut}
            className="flex h-10 w-full items-center justify-center gap-1.5 rounded-md border border-border-strong text-sm font-semibold transition-colors active:bg-ink active:text-background disabled:opacity-50"
          >
            <ShoppingBag className="size-4" aria-hidden />
            {soldOut ? "Sold out" : "Add to Cart"}
          </button>
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({
  products,
  className,
  columns = 3,
}: {
  products: Product[];
  className?: string;
  columns?: 3 | 4;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12",
        columns === 4 ? "lg:grid-cols-3 xl:grid-cols-4" : "lg:grid-cols-3",
        className,
      )}
    >
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < 3} />
      ))}
    </div>
  );
}
