"use client";

import { CheckCircle2, Package, ShoppingBag, UserCog, Users, XCircle } from "lucide-react";
import Link from "next/link";
import { RequireRole } from "@/components/account/RequireRole";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { MiniBarChart, StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/ui/Badge";
import { artisanApplications, platformMonthlyOrders, platformStats } from "@/data/orders";
import { pendingProducts } from "@/data/products";
import { formatDate } from "@/lib/utils";

function AdminDashboard() {
  const pendingApps = artisanApplications.filter((a) => a.status === "pending");

  return (
    <>
      <DashboardHeader title="Admin dashboard" description="Platform-wide overview." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Users" value={platformStats.users.toLocaleString()} icon={<Users className="size-4" />} />
        <StatCard label="Total Artisans" value={String(platformStats.artisans)} icon={<UserCog className="size-4" />} />
        <StatCard label="Total Products" value={String(platformStats.products)} icon={<Package className="size-4" />} />
        <StatCard label="Total Orders" value={platformStats.orders.toLocaleString()} icon={<ShoppingBag className="size-4" />} tone="primary" />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-xl border border-border bg-surface p-6">
          <h2 className="font-serif text-2xl font-semibold">Orders, last 6 months</h2>
          <div className="mt-8">
            <MiniBarChart data={platformMonthlyOrders} valueLabel={(v) => `${v} orders`} />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-semibold">Pending approvals</h2>
            <Link href="/admin/artisans" className="text-sm font-semibold text-primary hover:underline">
              View all
            </Link>
          </div>
          <ul className="mt-4 flex flex-col divide-y divide-border">
            {pendingApps.slice(0, 4).map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{a.name}</p>
                  <p className="text-xs text-muted">{a.location} · {a.craft}</p>
                </div>
                <StatusBadge status={a.status} />
              </li>
            ))}
            {pendingApps.length === 0 && <p className="py-3 text-sm text-muted">No pending applications.</p>}
          </ul>
          <div className="mt-4 flex items-center gap-2 border-t border-border pt-4 text-xs text-muted">
            <CheckCircle2 className="size-3.5 text-success" /> {artisanApplications.filter((a) => a.status === "approved").length} approved
            <XCircle className="ml-3 size-3.5 text-danger" /> {artisanApplications.filter((a) => a.status === "rejected").length} rejected
          </div>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-semibold">Products awaiting moderation</h2>
          <Link href="/admin/products" className="text-sm font-semibold text-primary hover:underline">
            View all
          </Link>
        </div>
        <ul className="mt-4 flex flex-col gap-2">
          {pendingProducts.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-surface px-4 py-3">
              <span className="font-medium">{p.name}</span>
              <span className="text-sm text-muted">Submitted {formatDate(p.createdAt)}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default function AdminDashboardPage() {
  return (
    <RequireRole role="admin">
      <AdminDashboard />
    </RequireRole>
  );
}
