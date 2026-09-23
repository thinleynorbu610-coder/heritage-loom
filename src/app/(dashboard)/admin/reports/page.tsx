"use client";

import { RequireRole } from "@/components/account/RequireRole";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { MiniBarChart } from "@/components/dashboard/StatCard";
import { categories } from "@/data/categories";
import { platformMonthlyOrders } from "@/data/orders";
import { products } from "@/data/products";

function Reports() {
  const byCategory = categories.map((c) => ({ name: c.name, count: products.filter((p) => p.category === c.slug).length }));
  const maxCount = Math.max(...byCategory.map((c) => c.count), 1);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="font-serif text-2xl font-semibold">Orders over time</h2>
        <div className="mt-8">
          <MiniBarChart data={platformMonthlyOrders} valueLabel={(v) => `${v} orders`} />
        </div>
      </div>
      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="font-serif text-2xl font-semibold">Listings by category</h2>
        <ul className="mt-6 flex flex-col gap-3">
          {byCategory.map((c) => (
            <li key={c.name} className="flex items-center gap-3 text-sm">
              <span className="w-36 shrink-0 font-medium">{c.name}</span>
              <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-border">
                <span className="block h-full rounded-full bg-primary" style={{ width: `${(c.count / maxCount) * 100}%` }} />
              </span>
              <span className="w-6 text-right tabular-nums text-muted">{c.count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function AdminReportsPage() {
  return (
    <RequireRole role="admin">
      <DashboardHeader title="Reports" description="Platform trends at a glance." />
      <Reports />
    </RequireRole>
  );
}
