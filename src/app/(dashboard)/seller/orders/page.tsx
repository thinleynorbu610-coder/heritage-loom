"use client";

import { useState } from "react";
import { RequireRole } from "@/components/account/RequireRole";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { type Column, DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/ui/Badge";
import { useToast } from "@/context/ToastContext";
import { type SellerOrderStatus, sellerOrders as initialOrders } from "@/data/orders";
import { formatDate, formatNu } from "@/lib/utils";
import { getProductById } from "@/services/catalog";

type SellerOrder = (typeof initialOrders)[number];

const STATUS_FLOW: SellerOrderStatus[] = ["pending", "paid", "shipped", "delivered"];
const TABS = ["all", ...STATUS_FLOW] as const;

function OrdersManager() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<SellerOrder[]>(initialOrders);
  const [tab, setTab] = useState<(typeof TABS)[number]>("all");

  const advance = (order: SellerOrder) => {
    const idx = STATUS_FLOW.indexOf(order.status);
    if (idx === STATUS_FLOW.length - 1) return;
    const next = STATUS_FLOW[idx + 1];
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: next } : o)));
    toast({ title: `Order #${order.number} marked as ${next}`, description: order.customer });
  };

  const filtered = orders.filter((o) => tab === "all" || o.status === tab);

  const columns: Column<SellerOrder>[] = [
    { key: "number", header: "Order", render: (o) => <span className="font-mono font-semibold">#{o.number}</span> },
    { key: "customer", header: "Customer", render: (o) => o.customer },
    { key: "product", header: "Product", hideOnMobile: true, render: (o) => getProductById(o.productId)?.name ?? "—" },
    { key: "total", header: "Total", render: (o) => formatNu(o.total) },
    { key: "date", header: "Date", hideOnMobile: true, render: (o) => formatDate(o.date) },
    { key: "status", header: "Status", render: (o) => <StatusBadge status={o.status} /> },
    {
      key: "action",
      header: "Action",
      className: "text-right",
      render: (o) =>
        o.status === "delivered" ? (
          <span className="text-sm text-muted">Complete</span>
        ) : (
          <button
            type="button"
            onClick={() => advance(o)}
            className="rounded-md border border-border-strong px-3 py-1.5 text-sm font-semibold hover:border-primary hover:text-primary"
          >
            Mark as {STATUS_FLOW[STATUS_FLOW.indexOf(o.status) + 1]}
          </button>
        ),
    },
  ];

  return (
    <>
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            aria-pressed={tab === t}
            className={`h-10 shrink-0 rounded-full border px-4 text-sm font-semibold capitalize transition-colors ${
              tab === t ? "border-ink bg-ink text-background" : "border-border hover:border-text"
            }`}
          >
            {t} {t !== "all" && `(${orders.filter((o) => o.status === t).length})`}
          </button>
        ))}
      </div>
      <DataTable columns={columns} rows={filtered} emptyMessage="No orders in this status." />
    </>
  );
}

export default function SellerOrdersPage() {
  return (
    <RequireRole role="artisan">
      <DashboardHeader title="Orders" description="Update order status as you prepare and ship each piece." />
      <OrdersManager />
    </RequireRole>
  );
}
