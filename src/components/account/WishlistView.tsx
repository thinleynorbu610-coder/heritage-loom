"use client";

import { Heart } from "lucide-react";
import { ProductGrid } from "@/components/product/ProductCard";
import { LinkButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProductGridSkeleton } from "@/components/ui/LoadingSkeleton";
import { useWishlist } from "@/context/WishlistContext";
import { useIsClient } from "@/lib/persistent-store";
import { getProductById } from "@/services/catalog";

export function WishlistView({ columns = 4 }: { columns?: 3 | 4 }) {
  const { ids } = useWishlist();
  const isClient = useIsClient();
  if (!isClient) return <ProductGridSkeleton count={4} />;
  const products = ids.map(getProductById).filter((p) => p != null);

  if (!products.length) {
    return (
      <EmptyState
        icon={<Heart className="size-6" aria-hidden />}
        title="Nothing saved yet"
        description="Tap the heart on any piece to save it here. It's a good way to keep track of handmade pieces you love."
        action={<LinkButton href="/shop">Explore the Collection</LinkButton>}
      />
    );
  }
  return <ProductGrid products={products} columns={columns} />;
}
