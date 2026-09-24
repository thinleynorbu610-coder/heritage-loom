"use client";

import { Heart, Package, PackageCheck, ShoppingBag, Truck } from "lucide-react";
import Link from "next/link";
import { RequireRole } from "@/components/account/RequireRole";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Price } from "@/components/ui/Misc";
import { SmartImage } from "@/components/ui/SmartImage";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrdersContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatDate } from "@/lib/utils";
import { getProductById } from "@/services/catalog";

function Overview() {
  const { user } = useAuth();
  const { orders } = useOrders();
  const { ids } = useWishlist();
  const pending = orders.filter((o) => !["delivered", "cancelled"].includes(o.status)).length;
  const delivered = orders.filter((o) => o.status === "delivered").length;

  return (
    <>
      <DashboardHeader title={`Welcome back, ${user?.name.split(" ")[0]}`} description="Here's what's happening with your account." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Orders" value={String(orders.length)} icon={<ShoppingBag className="size-4" />} />
        <StatCard label="Pending Orders" value={String(pending)} icon={<Truck className="size-4" />} />
        <StatCard label="Delivered Orders" value={String(delivered)} icon={<PackageCheck className="size-4" />} />
        <StatCard label="Wishlist" value={String(ids.length)} icon={<Heart className="size-4" />} />
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-semibold">Recent orders</h2>
          <Link href="/account/orders" className="text-sm font-semibold text-primary hover:underline">
            View all
          </Link>
        </div>
        {orders.length === 0 ? (
          <EmptyState
            className="mt-4"
            icon={<Package className="size-6" />}
            title="No orders yet"
            description="Your future orders will appear here."
            action={<LinkButton href="/shop">Start shopping</LinkButton>}
          />
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {orders.slice(0, 3).map((o) => {
              const firstProduct = getProductById(o.lines[0]?.productId);
              return (
                <li key={o.id}>
                  <Link href={`/track-order?order=${o.number}`} className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary">
                    <span className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                      {firstProduct && <SmartImage src={firstProduct.images[0].src} alt="" fill sizes="56px" className="object-cover" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="font-mono font-semibold">#{o.number}</span>
                        <StatusBadge status={o.status} />
                      </span>
                      <span className="block text-sm text-muted">{formatDate(o.placedAt)} · {o.lines.length} item(s)</span>
                    </span>
                    <Price amount={o.total} size="sm" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}

export default function AccountOverviewPage() {
  return (
    <RequireRole role="customer">
      <Overview />
    </RequireRole>
  );
}
