"use client";

import { BadgeCheck, Clock, MapPin, PackageCheck, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Price, QuantitySelector } from "@/components/ui/Misc";
import { Rating } from "@/components/ui/Rating";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import type { Artisan, Category, Product, Region } from "@/types";
import { WishlistButton } from "./WishlistButton";

export function PurchasePanel({
  product,
  artisan,
  region,
  category,
}: {
  product: Product;
  artisan: Artisan;
  region: Region;
  category: Category;
}) {
  const [qty, setQty] = useState(1);
  const { add, open } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const soldOut = product.stock === 0;

  const addToCart = () => {
    add(product.id, qty);
    open();
  };

  const buyNow = () => {
    add(product.id, qty);
    toast({ title: "Added to your cart", description: "Taking you to checkout…", variant: "info", duration: 2000 });
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col">
      <Link href={`/shop?category=${category.slug}`} className="eyebrow self-start hover:underline">
        {category.name}
      </Link>
      <h1 className="mt-3 font-display text-4xl text-balance sm:text-5xl">{product.name}</h1>

      {/* Seller identity & origin — always obvious */}
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.95rem]">
        <Link href={`/artisans/${artisan.slug}`} className="group inline-flex items-center gap-1.5">
          <span className="text-muted">Made by</span>
          <span className="font-semibold underline-offset-4 group-hover:text-primary group-hover:underline">{artisan.name}</span>
          {artisan.verified && <BadgeCheck className="size-4 text-success" aria-label="Verified artisan" />}
        </Link>
        <Link href={`/shop?region=${region.slug}`} className="inline-flex items-center gap-1.5 hover:text-primary">
          <MapPin className="size-4 text-accent" aria-hidden />
          <span className="font-semibold">{region.name}</span>
          <span className="text-muted">, Bhutan</span>
        </Link>
      </div>

      <a href="#reviews" className="mt-3 self-start">
        <Rating value={product.rating} count={product.reviewCount} size="md" />
        <span className="sr-only">Read reviews</span>
      </a>

      <div className="mt-6 flex items-center gap-4 border-y border-border py-5">
        <Price amount={product.price} compareAt={product.compareAtPrice} size="xl" />
        {soldOut ? (
          <Badge tone="danger">Sold out</Badge>
        ) : product.stock <= 3 ? (
          <Badge tone="warning">Only {product.stock} left</Badge>
        ) : (
          <Badge tone="success">In stock</Badge>
        )}
      </div>

      <p className="mt-5 text-lg leading-relaxed text-muted">{product.summary}</p>

      {!soldOut ? (
        <div className="mt-7 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <QuantitySelector value={qty} onChange={setQty} max={product.stock} />
            <Button size="lg" onClick={addToCart} className="h-12 flex-1">
              <ShoppingBag className="size-5" aria-hidden />
              Add to Cart
            </Button>
            <WishlistButton productId={product.id} productName={product.name} variant="inline" />
          </div>
          <Button size="lg" variant="dark" onClick={buyNow} className="h-12">
            Buy Now
          </Button>
        </div>
      ) : (
        <div className="mt-7 rounded-lg border border-border bg-surface-muted p-5">
          <p className="font-semibold">This piece has found a home.</p>
          <p className="mt-1 text-sm text-muted">
            Handmade pieces are often one of a kind. Save it to your wishlist or explore more from {artisan.name}.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <WishlistButton productId={product.id} productName={product.name} variant="text" />
            <Link href={`/artisans/${artisan.slug}`} className="text-sm font-semibold text-primary hover:underline">
              More from {artisan.name.split(" ")[0]}
            </Link>
          </div>
        </div>
      )}

      <ul className="mt-7 grid gap-3 text-sm sm:grid-cols-2">
        <li className="flex items-start gap-2.5">
          <Truck className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
          <span>
            <strong className="font-semibold">Delivery across Bhutan</strong>
            <span className="block text-muted">Usually 3–7 days. Free over Nu. 5,000.</span>
          </span>
        </li>
        <li className="flex items-start gap-2.5">
          <Clock className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
          <span>
            <strong className="font-semibold">Made by hand</strong>
            <span className="block text-muted">{product.productionTime ?? "Crafted individually"}</span>
          </span>
        </li>
        <li className="flex items-start gap-2.5">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
          <span>
            <strong className="font-semibold">Secure checkout</strong>
            <span className="block text-muted">Pay by mobile banking, card or cash.</span>
          </span>
        </li>
        <li className="flex items-start gap-2.5">
          <PackageCheck className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
          <span>
            <strong className="font-semibold">Packed by the artisan</strong>
            <span className="block text-muted">With a story card for the piece.</span>
          </span>
        </li>
      </ul>

      {/* Mobile sticky purchase bar */}
      {!soldOut && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-md lg:hidden">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{product.name}</p>
            <Price amount={product.price} size="sm" />
          </div>
          <Button onClick={addToCart} className="shrink-0">
            <ShoppingBag className="size-4" aria-hidden /> Add to Cart
          </Button>
        </div>
      )}
    </div>
  );
}
