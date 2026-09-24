"use client";

import { Package, PackagePlus, PlusCircle, Receipt, ShoppingBag, TrendingUp } from "lucide-react";
import { RequireRole } from "@/components/account/RequireRole";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { MiniBarChart, StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { Price } from "@/components/ui/Misc";
import { SmartImage } from "@/components/ui/SmartImage";
import { useAuth } from "@/context/AuthContext";
import { sellerMonthlySales, sellerOrders } from "@/data/orders";
import { formatDate, formatNu } from "@/lib/utils";
import { getArtisanById, getProductById, getProductsByArtisan } from "@/services/catalog";

function SellerDashboard() {
  const { user } = useAuth();
  const artisan = user?.artisanId ? getArtisanById(user.artisanId) : undefined;
  const products = artisan ? getProductsByArtisan(artisan.id) : [];
  const pending = sellerOrders.filter((o) => o.status === "pending").length;
  const totalSales = sellerMonthlySales.reduce((n, m) => n + m.value, 0);

  return (
    <>
      <DashboardHeader
        title={`Namtsho, ${artisan?.name.split(" ")[0] ?? "Artisan"}`}
        description="Here's how your storefront is doing."
        action={
          <LinkButton href="/seller/products/new">
            <PlusCircle className="size-4" /> Add Product
          </LinkButton>
        }
      />

      {artisan && !artisan.verified && (
        <div className="mb-6 rounded-xl border border-warning/30 bg-warning-soft px-5 py-4 text-sm text-warning">
          Your account is awaiting verification. You can prepare listings now — they&apos;ll go live once approved.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Products" value={String(products.length)} icon={<Package className="size-4" />} />
        <StatCard label="Orders (30d)" value={String(sellerOrders.length)} icon={<ShoppingBag className="size-4" />} />
        <StatCard label="Pending Orders" value={String(pending)} icon={<PackagePlus className="size-4" />} />
        <StatCard label="Sales (6 mo)" value={formatNu(totalSales)} icon={<Receipt className="size-4" />} tone="primary" />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-xl border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-semibold">Sales, last 6 months</h2>
            <span className="flex items-center gap-1 text-sm font-semibold text-success">
              <TrendingUp className="size-4" /> +23% vs. prior period
            </span>
          </div>
          <div className="mt-8">
            <MiniBarChart data={sellerMonthlySales} valueLabel={formatNu} />
          </div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-6">
          <h2 className="font-serif text-2xl font-semibold">Recent orders</h2>
          <ul className="mt-4 flex flex-col divide-y divide-border">
            {sellerOrders.slice(0, 4).map((o) => {
              const p = getProductById(o.productId);
              return (
                <li key={o.id} className="flex items-center gap-3 py-3">
                  <span className="relative size-11 shrink-0 overflow-hidden rounded-md bg-surface-muted">
                    {p && <SmartImage src={p.images[0].src} alt="" fill sizes="44px" className="object-cover" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{p?.name}</p>
                    <p className="text-xs text-muted">{formatDate(o.date)}</p>
                  </div>
                  <StatusBadge status={o.status} />
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-serif text-2xl font-semibold">Your products</h2>
        <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.slice(0, 4).map((p) => (
            <li key={p.id} className="overflow-hidden rounded-xl border border-border bg-surface">
              <span className="relative block aspect-square bg-surface-muted">
                <SmartImage src={p.images[0].src} alt={p.images[0].alt} fill sizes="200px" className="object-cover" />
              </span>
              <div className="p-3">
                <p className="truncate text-sm font-semibold">{p.name}</p>
                <Price amount={p.price} size="sm" className="mt-1" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default function SellerDashboardPage() {
  return (
    <RequireRole role="artisan">
      <SellerDashboard />
    </RequireRole>
  );
}
