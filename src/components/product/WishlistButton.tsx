"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/context/ToastContext";
import { useWishlist } from "@/context/WishlistContext";
import { useIsClient } from "@/lib/persistent-store";
import { cn } from "@/lib/utils";

export function WishlistButton({
  productId,
  productName,
  variant = "floating",
  className,
}: {
  productId: string;
  productName: string;
  variant?: "floating" | "inline" | "text";
  className?: string;
}) {
  const { has, toggle } = useWishlist();
  const { toast } = useToast();
  const isClient = useIsClient();
  const [pop, setPop] = useState(0);
  const active = isClient && has(productId);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggle(productId);
    setPop((n) => n + 1);
    toast({
      title: added ? "Saved to your wishlist" : "Removed from wishlist",
      description: productName,
      variant: added ? "success" : "info",
      action: added ? { label: "View wishlist", href: "/wishlist" } : undefined,
    });
  };

  const label = active ? `Remove ${productName} from wishlist` : `Save ${productName} to wishlist`;

  if (variant === "text") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={cn(
          "inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-primary",
          className,
        )}
      >
        <Heart key={pop} className={cn("size-4", active && "animate-heart-pop fill-primary text-primary")} aria-hidden />
        {active ? "Saved" : "Save for later"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      title={active ? "Saved to wishlist" : "Save to wishlist"}
      className={cn(
        "flex items-center justify-center transition-all duration-200",
        variant === "floating"
          ? "size-10 rounded-full bg-surface/90 shadow-soft backdrop-blur-sm hover:scale-105 hover:bg-surface"
          : "h-12 w-12 rounded-md border border-border-strong bg-surface hover:border-primary",
        className,
      )}
    >
      <Heart
        key={pop}
        className={cn(
          "size-[1.15rem] transition-colors",
          active ? "animate-heart-pop fill-primary text-primary" : "text-text",
        )}
        strokeWidth={1.8}
        aria-hidden
      />
    </button>
  );
}
