"use client";

import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  CheckCircle2,
  Download,
  Package,
  PackagePlus,
  PlusCircle,
  Receipt,
  ShoppingBag,
  TrendingUp,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { RequireRole } from "@/components/account/RequireRole";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { MiniBarChart, StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Price } from "@/components/ui/Misc";
import { SmartImage } from "@/components/ui/SmartImage";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { sellerMonthlySales, sellerOrders } from "@/data/orders";
import { downloadCsv, formatDate, formatNu, todayISO } from "@/lib/utils";
import { getArtisanById, getProductById, getProductsByArtisan } from "@/services/catalog";
import type { Product } from "@/types";

function SellerDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const artisan = user?.artisanId ? getArtisanById(user.artisanId) : undefined;
  const products = artisan ? getProductsByArtisan(artisan.id) : [];
  const pending = sellerOrders.filter((o) => o.status === "pending").length;
  const completed = sellerOrders.filter((o) => o.status === "delivered").length;
  const totalSales = sellerMonthlySales.reduce((n, m) => n + m.value, 0);
  const avgOrderValue = sellerOrders.length ? Math.round(sellerOrders.reduce((n, o) => n + o.total, 0) / sellerOrders.length) : 0;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 3);
  const outOfStock = products.filter((p) => p.stock === 0);
  const stockAlerts = lowStock.length + outOfStock.length;

  const soldByProduct = new Map<string, number>();
  for (const o of sellerOrders) soldByProduct.set(o.productId, (soldByProduct.get(o.productId) ?? 0) + o.quantity);
  const topProducts = [...products]
    .sort((a, b) => (soldByProduct.get(b.id) ?? 0) - (soldByProduct.get(a.id) ?? 0))
    .slice(0, 4);

  const exportReport = () => {
    downloadCsv(`heritage-loom-sales-report-${todayISO()}.csv`, [
      [
        ["Heritage Loom — Storefront Report"],
        [`Artisan: ${artisan?.name ?? "—"}`],
        [`Generated: ${formatDate(todayISO())}`],
      ],
      [
        ["Metric", "Value"],
        ["Total Products", products.length],
        ["Orders (30d)", sellerOrders.length],
        ["Pending Orders", pending],
        ["Completed Orders", completed],
        ["Sales (6 mo)", totalSales],
        ["Avg. Order Value", avgOrderValue],
        ["Low Stock Alerts", stockAlerts],
      ],
      [
        ["Order", "Customer", "Product", "Date", "Status", "Amount (Nu.)"],
        ...sellerOrders.map((o) => [o.number, o.customer, getProductById(o.productId)?.name ?? "—", o.date, o.status, o.total]),
      ],
    ]);
    toast({ title: "Report downloaded", description: "Check your browser's downloads." });
  };

  return (
    <>
      <DashboardHeader
        title={`Namtsho, ${artisan?.name.split(" ")[0] ?? "Artisan"}`}
        description="Here's how your storefront is doing."
        action={
          <Button variant="outline" onClick={exportReport}>
            <Download className="size-4" /> Export Report
          </Button>
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
      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Completed Orders" value={String(completed)} icon={<CheckCircle2 className="size-4" />} />
        <StatCard label="Avg. Order Value" value={formatNu(avgOrderValue)} icon={<Wallet className="size-4" />} />
        <StatCard
          label="Low Stock Alerts"
          value={String(stockAlerts)}
          icon={<AlertTriangle className="size-4" />}
          tone={stockAlerts > 0 ? "danger" : "default"}
          trend={
            stockAlerts > 0 ? (
              <Link href="/seller/products" className="inline-flex items-center gap-1 hover:underline">
                Review inventory <ArrowRight className="size-3" />
              </Link>
            ) : (
              "All products well stocked"
            )
          }
        />
      </div>

      <div className="mt-10">
        <h2 className="font-serif text-xl font-semibold">Quick actions</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { href: "/seller/products/new", label: "Add a product", desc: "List new work in minutes", icon: PlusCircle },
            { href: "/seller/products", label: "Manage inventory", desc: "Update stock & pricing", icon: Boxes },
            { href: "/seller/orders", label: "View orders", desc: `${pending} awaiting action`, icon: ShoppingBag },
            { href: "/seller/sales", label: "View analytics", desc: "Track revenue & trends", icon: TrendingUp },
          ].map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="flex flex-col items-start gap-2 rounded-xl border border-border-strong bg-surface p-4 transition-colors hover:border-text hover:bg-surface-muted"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-secondary-soft text-accent">
                <a.icon className="size-4" />
              </span>
              <span className="block text-sm font-semibold text-text">{a.label}</span>
              <span className="block text-xs text-muted">{a.desc}</span>
            </Link>
          ))}
        </div>
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
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-semibold">Top performing products</h2>
          <Link href="/seller/products" className="text-sm font-semibold text-primary hover:underline">
            View all
          </Link>
        </div>
        <ProductGrid products={topProducts} soldByProduct={soldByProduct} />
      </div>
    </>
  );
}

function ProductGrid({ products, soldByProduct }: { products: Product[]; soldByProduct: Map<string, number> }) {
  return (
    <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => {
        const sold = soldByProduct.get(p.id) ?? 0;
        return (
          <li key={p.id} className="overflow-hidden rounded-xl border border-border bg-surface">
            <span className="relative block aspect-square bg-surface-muted">
              <SmartImage src={p.images[0].src} alt={p.images[0].alt} fill sizes="200px" className="object-cover" />
              {sold > 0 && (
                <span className="absolute top-2 left-2 rounded-full bg-ink/80 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
                  {sold} sold
                </span>
              )}
              {p.stock === 0 ? (
                <span className="absolute top-2 right-2 rounded-full bg-danger px-2 py-0.5 text-xs font-semibold text-white">
                  Out of stock
                </span>
              ) : p.stock <= 3 ? (
                <span className="absolute top-2 right-2 rounded-full bg-warning px-2 py-0.5 text-xs font-semibold text-white">
                  Low stock
                </span>
              ) : null}
            </span>
            <div className="p-3">
              <p className="truncate text-sm font-semibold">{p.name}</p>
              <Price amount={p.price} size="sm" className="mt-1" />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default function SellerDashboardPage() {
  return (
    <RequireRole role="artisan">
      <SellerDashboard />
    </RequireRole>
  );
}
