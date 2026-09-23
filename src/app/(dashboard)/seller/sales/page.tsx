"use client";

import { CircleDollarSign, Package, ShoppingBag, TrendingUp } from "lucide-react";
import { RequireRole } from "@/components/account/RequireRole";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { MiniBarChart, StatCard } from "@/components/dashboard/StatCard";
import { sellerMonthlySales, sellerOrders } from "@/data/orders";
import { formatNu } from "@/lib/utils";

function Sales() {
  const total = sellerMonthlySales.reduce((n, m) => n + m.value, 0);
  const avgOrder = total / sellerOrders.length;
  const bestMonth = [...sellerMonthlySales].sort((a, b) => b.value - a.value)[0];

  return (
    <>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total sales (6 mo)" value={formatNu(total)} icon={<CircleDollarSign className="size-4" />} tone="primary" />
        <StatCard label="Orders (30d)" value={String(sellerOrders.length)} icon={<ShoppingBag className="size-4" />} />
        <StatCard label="Avg. order value" value={formatNu(Math.round(avgOrder))} icon={<Package className="size-4" />} />
        <StatCard label="Best month" value={bestMonth.month} icon={<TrendingUp className="size-4" />} trend={formatNu(bestMonth.value)} />
      </div>

      <div className="mt-8 rounded-xl border border-border bg-surface p-6 sm:p-8">
        <h2 className="font-serif text-2xl font-semibold">Monthly sales</h2>
        <div className="mt-8">
          <MiniBarChart data={sellerMonthlySales} valueLabel={formatNu} />
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-4 border-t border-border pt-6 sm:grid-cols-3 lg:grid-cols-6">
          {sellerMonthlySales.map((m) => (
            <li key={m.month}>
              <p className="text-sm text-muted">{m.month}</p>
              <p className="font-semibold tabular-nums">{formatNu(m.value)}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default function SellerSalesPage() {
  return (
    <RequireRole role="artisan">
      <DashboardHeader title="Sales" description="Track how your storefront is performing." />
      <Sales />
    </RequireRole>
  );
}
