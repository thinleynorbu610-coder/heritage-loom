"use client";

import { Eye, MapPin, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Modal } from "@/components/ui/Overlay";
import { Price } from "@/components/ui/Misc";
import { Rating } from "@/components/ui/Rating";
import { SmartImage } from "@/components/ui/SmartImage";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { getArtisanById, getRegion } from "@/services/catalog";
import type { Product } from "@/types";
import { WishlistButton } from "./WishlistButton";

/**
 * Quick View — a fast look at a product without leaving the grid.
 * Mirrors the full product page's key facts (maker, origin, story) but stays
 * short; "See full story & details" sends shoppers to the real page.
 */
export function QuickViewButton({ product, className }: { product: Product; className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        className={className}
        aria-label={`Quick view: ${product.name}`}
        title="Quick View"
      >
        <Eye className="size-[1.05rem]" aria-hidden strokeWidth={1.8} />
      </button>
      <QuickViewModal product={product} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function QuickViewModal({ product, open, onClose }: { product: Product; open: boolean; onClose: () => void }) {
  const { add } = useCart();
  const { toast } = useToast();
  const artisan = getArtisanById(product.artisanId);
  const region = getRegion(product.region);
  const soldOut = product.stock === 0;

  const onAdd = () => {
    add(product.id);
    toast({
      title: "Added to your cart",
      description: `${product.name} · by ${artisan?.name}`,
      action: { label: "View cart", href: "/cart" },
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={product.name} size="lg">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-surface-muted">
          <SmartImage
            src={product.images[0].src}
            alt={product.images[0].alt}
            fill
            sizes="(min-width: 640px) 40vw, 90vw"
            className="object-cover"
            fallbackLabel={product.name}
          />
        </div>
        <div className="flex flex-col">
          <p className="flex items-center gap-1 text-[0.7rem] font-bold tracking-[0.14em] text-accent uppercase">
            <MapPin className="size-3" aria-hidden />
            {region?.name}
          </p>
          {artisan && (
            <p className="mt-2 text-sm text-muted">
              by{" "}
              <Link href={`/artisans/${artisan.slug}`} className="font-semibold text-text hover:text-primary" onClick={onClose}>
                {artisan.name}
              </Link>
            </p>
          )}
          <div className="mt-3 flex items-center gap-3">
            <Price amount={product.price} compareAt={product.compareAtPrice} />
            <Rating value={product.rating} count={product.reviewCount} />
          </div>

          <p className="mt-4 line-clamp-4 text-[0.95rem] leading-relaxed text-muted">{product.story}</p>

          <dl className="mt-4 grid grid-cols-2 gap-3 border-y border-border py-4 text-sm">
            <div>
              <dt className="text-xs text-muted">Technique</dt>
              <dd className="font-semibold">{product.technique.name}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Materials</dt>
              <dd className="font-semibold">{product.materials.join(", ")}</dd>
            </div>
          </dl>

          <div className="mt-auto flex flex-col gap-2.5 pt-5 sm:flex-row">
            <button
              type="button"
              onClick={onAdd}
              disabled={soldOut}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-md bg-primary px-5 font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
            >
              <ShoppingBag className="size-4" aria-hidden />
              {soldOut ? "Sold out" : "Add to Cart"}
            </button>
            <WishlistButton productId={product.id} productName={product.name} variant="inline" />
          </div>
          <Link
            href={`/products/${product.slug}`}
            onClick={onClose}
            className="mt-4 text-center text-sm font-semibold text-primary hover:underline sm:text-left"
          >
            See full story &amp; details →
          </Link>
        </div>
      </div>
    </Modal>
  );
}
