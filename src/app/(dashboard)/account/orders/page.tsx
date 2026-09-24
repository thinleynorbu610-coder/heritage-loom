"use client";

import { Package } from "lucide-react";
import Link from "next/link";
import { RequireRole } from "@/components/account/RequireRole";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { StatusBadge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Price } from "@/components/ui/Misc";
import { SmartImage } from "@/components/ui/SmartImage";
import { useOrders } from "@/context/OrdersContext";
import { formatDate, pluralize } from "@/lib/utils";
import { getProductById } from "@/services/catalog";

function Orders() {
  const { orders } = useOrders();

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={<Package className="size-6" />}
        title="No orders yet"
        description="When you place an order, it will show up here with live tracking."
        action={<LinkButton href="/shop">Start shopping</LinkButton>}
      />
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {orders.map((o) => (
        <li key={o.id} className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface-muted px-5 py-3.5">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <span className="font-mono font-bold">#{o.number}</span>
              <span className="text-muted">Placed {formatDate(o.placedAt)}</span>
            </div>
            <StatusBadge status={o.status} />
          </div>
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex -space-x-3">
              {o.lines.slice(0, 4).map((l) => {
                const p = getProductById(l.productId);
                return p ? (
                  <span key={l.productId} className="relative size-14 shrink-0 overflow-hidden rounded-lg border-2 border-surface bg-surface-muted">
                    <SmartImage src={p.images[0].src} alt="" fill sizes="56px" className="object-cover" />
                  </span>
                ) : null;
              })}
            </div>
            <div className="flex flex-1 items-center justify-between gap-4 sm:justify-end sm:gap-8">
              <div className="text-sm text-muted">{pluralize(o.lines.length, "item")}</div>
              <Price amount={o.total} />
              <div className="flex gap-2">
                <Link href={`/track-order?order=${o.number}`} className="rounded-md border border-border-strong px-3.5 py-2 text-sm font-semibold hover:border-text">
                  Track
                </Link>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function OrdersPage() {
  return (
    <RequireRole role="customer">
      <DashboardHeader title="My Orders" description="Every order you've placed on Heritage Loom." />
      <Orders />
    </RequireRole>
  );
}
