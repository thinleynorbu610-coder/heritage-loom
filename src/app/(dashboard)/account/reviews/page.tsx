"use client";

import { Star } from "lucide-react";
import Link from "next/link";
import { RequireRole } from "@/components/account/RequireRole";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { LinkButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Rating } from "@/components/ui/Rating";
import { SmartImage } from "@/components/ui/SmartImage";
import { useOrders } from "@/context/OrdersContext";
import { formatDate } from "@/lib/utils";
import { getProductById } from "@/services/catalog";

/** Phase 2: purchased, un-reviewed items are surfaced so customers can review them. */
function ReviewPrompts() {
  const { orders } = useOrders();
  const delivered = orders.filter((o) => o.status === "delivered");
  const products = Array.from(new Set(delivered.flatMap((o) => o.lines.map((l) => l.productId))))
    .map(getProductById)
    .filter((p) => p != null);

  if (products.length === 0) {
    return (
      <EmptyState
        icon={<Star className="size-6" />}
        title="No reviews yet"
        description="Once an order is delivered, you can leave a review from here."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-muted">You have {products.length} delivered item(s) awaiting your review.</p>
      <ul className="flex flex-col gap-3">
        {products.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-surface p-4">
            <span className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
              <SmartImage src={p.images[0].src} alt="" fill sizes="64px" className="object-cover" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{p.name}</p>
              <p className="text-sm text-muted">Delivered {formatDate(delivered.find((o) => o.lines.some((l) => l.productId === p.id))!.estimatedDelivery)}</p>
              <Rating value={p.rating} showValue={false} className="mt-1" />
            </div>
            <LinkButton href={`/products/${p.slug}#reviews`} variant="outline" size="sm">
              Write a review
            </LinkButton>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AccountReviewsPage() {
  return (
    <RequireRole role="customer">
      <DashboardHeader title="Reviews" description="Share your thoughts on pieces you've purchased." />
      <ReviewPrompts />
      <p className="mt-8 text-sm text-muted">
        Looking for a specific product?{" "}
        <Link href="/account/orders" className="font-semibold text-primary hover:underline">
          View your orders
        </Link>
        .
      </p>
    </RequireRole>
  );
}
