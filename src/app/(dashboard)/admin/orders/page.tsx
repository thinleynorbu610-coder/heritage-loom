"use client";

import { RequireRole } from "@/components/account/RequireRole";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { type Column, DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/ui/Badge";
import { useOrders } from "@/context/OrdersContext";
import { formatDate, formatNu } from "@/lib/utils";
import type { Order } from "@/types";

function AdminOrders() {
  const { orders } = useOrders();

  const columns: Column<Order>[] = [
    { key: "number", header: "Order", render: (o) => <span className="font-mono font-semibold">#{o.number}</span> },
    { key: "customer", header: "Customer", render: (o) => o.customerName },
    { key: "items", header: "Items", hideOnMobile: true, render: (o) => o.lines.reduce((n, l) => n + l.quantity, 0) },
    { key: "total", header: "Total", render: (o) => formatNu(o.total) },
    { key: "date", header: "Date", hideOnMobile: true, render: (o) => formatDate(o.placedAt) },
    { key: "status", header: "Status", render: (o) => <StatusBadge status={o.status} /> },
  ];

  return <DataTable columns={columns} rows={orders} emptyMessage="No orders placed yet." />;
}

export default function AdminOrdersPage() {
  return (
    <RequireRole role="admin">
      <DashboardHeader title="Orders" description="Platform-wide order overview." />
      <AdminOrders />
    </RequireRole>
  );
}
