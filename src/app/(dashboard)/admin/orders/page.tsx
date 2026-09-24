"use client";

import Link from "next/link";
import { RequireRole } from "@/components/account/RequireRole";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { type Column, DataTable } from "@/components/dashboard/DataTable";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { useOrders } from "@/context/OrdersContext";
import { formatDate, formatNu } from "@/lib/utils";
import type { Order } from "@/types";

function AdminOrders() {
  const { orders } = useOrders();

  const columns: Column<Order>[] = [
    {
      key: "number",
      header: "Order",
      render: (o) => (
        <Link href={`/admin/orders/${o.id}`} className="font-mono font-semibold text-primary hover:underline">
          #{o.number}
        </Link>
      ),
    },
    { key: "customer", header: "Customer", render: (o) => o.customerName },
    { key: "items", header: "Items", hideOnMobile: true, render: (o) => o.lines.reduce((n, l) => n + l.quantity, 0) },
    { key: "total", header: "Total", render: (o) => formatNu(o.total) },
    { key: "date", header: "Date", hideOnMobile: true, render: (o) => formatDate(o.placedAt) },
    { key: "status", header: "Status", render: (o) => <StatusBadge status={o.status} /> },
    {
      key: "payment",
      header: "Payment",
      render: (o) =>
        o.paymentVerification === "awaiting-verification" ? (
          <Badge tone="warning">Needs verification</Badge>
        ) : (
          <span className="text-muted capitalize">{o.paymentMethod.replace("-", " ")}</span>
        ),
    },
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
