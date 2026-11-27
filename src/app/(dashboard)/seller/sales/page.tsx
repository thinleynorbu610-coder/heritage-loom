"use client";

import { AlertTriangle, ArrowRight, Download, Receipt, ShoppingBag, TrendingUp, Users } from "lucide-react";
import { RequireRole } from "@/components/account/RequireRole";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { DonutChart, GeoBar, LineAreaChart } from "@/components/dashboard/Charts";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/ui/Badge";
import { Button, LinkButton } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { sellerMonthlySales, sellerOrders } from "@/data/orders";
import { formatNu } from "@/lib/utils";
import { getArtisanById, getProductsByArtisan } from "@/services/catalog";

const DONUT_COLORS = ["var(--primary)", "var(--secondary)", "var(--accent)", "var(--info)"];

function Analytics() {
  const { user } = useAuth();
  const { toast } = useToast();
  const artisan = user?.artisanId ? getArtisanById(user.artisanId) : undefined;
  const products = artisan ? getProductsByArtisan(artisan.id) : [];

  const grossRevenue = sellerMonthlySales.reduce((n, m) => n + m.value, 0);
  const avgOrder = sellerOrders.length ? grossRevenue / sellerOrders.length : 0;
  const fulfilled = sellerOrders.filter((o) => o.status === "shipped" || o.status === "delivered").length;
  const uniqueCustomers = new Set(sellerOrders.map((o) => o.customer)).size;

  const unitsByProduct = new Map<string, number>();
  const revenueByProduct = new Map<string, number>();
  for (const o of sellerOrders) {
    unitsByProduct.set(o.productId, (unitsByProduct.get(o.productId) ?? 0) + o.quantity);
    revenueByProduct.set(o.productId, (revenueByProduct.get(o.productId) ?? 0) + o.total);
  }
  const ranked = [...products]
    .map((p) => ({ product: p, units: unitsByProduct.get(p.id) ?? 0, revenue: revenueByProduct.get(p.id) ?? 0 }))
    .sort((a, b) => b.revenue - a.revenue);

  const donutSegments = ranked
    .filter((r) => r.revenue > 0)
    .map((r, i) => ({ label: r.product.name, value: r.revenue, colorVar: DONUT_COLORS[i % DONUT_COLORS.length] }));

  const byRegion = new Map<string, number>();
  for (const o of sellerOrders) byRegion.set(o.dzongkhag, (byRegion.get(o.dzongkhag) ?? 0) + 1);
  const regions = [...byRegion.entries()].sort((a, b) => b[1] - a[1]);

  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 3);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <p className="eyebrow">Artisan intelligence · Updated with every order</p>
        <Button
          variant="outline"
          onClick={() => toast({ title: "Demo only", description: "CSV / PDF export connects once the API is live." })}
        >
          <Download className="size-4" /> Export CSV / PDF
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Gross Revenue (6 mo)" value={formatNu(grossRevenue)} icon={<Receipt className="size-4" />} tone="primary" trend="+23% vs. prior period" />
        <StatCard label="Fulfilled Orders" value={String(fulfilled)} icon={<ShoppingBag className="size-4" />} trend={`of ${sellerOrders.length} total orders`} />
        <StatCard label="Avg. Order Value" value={formatNu(Math.round(avgOrder))} icon={<TrendingUp className="size-4" />} />
        <StatCard label="Customers Reached" value={String(uniqueCustomers)} icon={<Users className="size-4" />} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-xl border border-border bg-surface p-6 sm:p-8">
          <h2 className="font-serif text-2xl font-semibold">Revenue over time</h2>
          <p className="text-sm text-muted">Monthly revenue for the last 6 months.</p>
          <div className="mt-6">
            <LineAreaChart data={sellerMonthlySales} valueLabel={formatNu} />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 sm:p-8">
          <h2 className="font-serif text-2xl font-semibold">Revenue by product</h2>
          <p className="text-sm text-muted">Share of revenue across your current listings.</p>
          <div className="mt-6">
            {donutSegments.length > 0 ? (
              <DonutChart segments={donutSegments} centerLabel="Revenue" centerValue={formatNu(grossRevenue)} />
            ) : (
              <p className="text-sm text-muted">No sales yet to break down.</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-border bg-surface p-6 sm:p-8">
        <h2 className="font-serif text-2xl font-semibold">Top performing products</h2>
        <div className="mt-5 overflow-hidden rounded-lg border border-border">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-muted text-xs font-semibold tracking-wide text-muted uppercase">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Units sold</th>
                <th className="px-4 py-3">Total revenue</th>
                <th className="px-4 py-3">Stock status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ranked.map(({ product, units, revenue }) => (
                <tr key={product.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="relative size-10 shrink-0 overflow-hidden rounded-md bg-surface-muted">
                        <SmartImage src={product.images[0].src} alt="" fill sizes="40px" className="object-cover" />
                      </span>
                      <span className="max-w-48 truncate font-semibold">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 tabular-nums">{units}</td>
                  <td className="px-4 py-3 font-semibold tabular-nums">{formatNu(revenue)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={product.stock === 0 ? "out-of-stock" : product.stock <= 3 ? "low-stock" : "active"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-border bg-surface p-6 sm:p-8">
        <h2 className="font-serif text-2xl font-semibold">Where your customers are</h2>
        <p className="text-sm text-muted">Orders by dzongkhag, this season.</p>
        <div className="mt-6 flex flex-col gap-5">
          {regions.map(([region, count]) => (
            <GeoBar key={region} label={region} sublabel={`${count} order${count > 1 ? "s" : ""}`} percent={Math.round((count / sellerOrders.length) * 100)} />
          ))}
        </div>
      </div>

      {lowStock.length > 0 && (
        <div className="mt-8 flex flex-col items-start gap-4 rounded-xl bg-ink p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center text-secondary">
              <AlertTriangle className="size-5" />
            </span>
            <div>
              <p className="eyebrow text-secondary">Curator recommendation</p>
              <h3 className="mt-1 font-serif text-xl font-semibold">Restock before demand picks up</h3>
              <p className="mt-1 max-w-md text-sm text-white/70">
                {lowStock.length} of your best-selling piece{lowStock.length > 1 ? "s" : ""} — {lowStock.map((p) => p.name).join(", ")} — {lowStock.length > 1 ? "are" : "is"} running
                low. Restock soon to avoid missing orders.
              </p>
            </div>
          </div>
          <LinkButton href="/seller/products" variant="light" className="shrink-0">
            Restock Inventory <ArrowRight className="size-4" />
          </LinkButton>
        </div>
      )}
    </>
  );
}

export default function SellerSalesPage() {
  return (
    <RequireRole role="artisan">
      <DashboardHeader title="Analytics & Insights" description="Track revenue, your best-selling pieces and where your customers are ordering from." />
      <Analytics />
    </RequireRole>
  );
}
