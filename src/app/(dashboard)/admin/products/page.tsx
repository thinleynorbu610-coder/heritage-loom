"use client";

import { Eye } from "lucide-react";
import { useState } from "react";
import { RequireRole } from "@/components/account/RequireRole";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { type Column, DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/ui/Badge";
import { useToast } from "@/context/ToastContext";
import { pendingProducts as initialPending, products as activeProducts } from "@/data/products";
import { formatDate } from "@/lib/utils";
import { getArtisanById } from "@/services/catalog";
import type { Product } from "@/types";

const TABS = ["pending", "active"] as const;

function ProductModeration() {
  const { toast } = useToast();
  const [pending, setPending] = useState<Product[]>(initialPending);
  const [tab, setTab] = useState<(typeof TABS)[number]>("pending");

  const decide = (p: Product, status: "active" | "rejected") => {
    setPending((prev) => prev.filter((x) => x.id !== p.id));
    toast({ title: status === "active" ? "Product approved" : "Product rejected", description: p.name });
  };

  const columns: Column<Product>[] = [
    { key: "product", header: "Product", render: (p) => <span className="font-semibold">{p.name}</span> },
    { key: "artisan", header: "Artisan", render: (p) => getArtisanById(p.artisanId)?.name ?? "—" },
    { key: "category", header: "Category", hideOnMobile: true, render: (p) => p.category.replace("-", " ") },
    { key: "status", header: "Status", render: (p) => <StatusBadge status={p.status} /> },
    {
      key: "actions",
      header: "Review",
      className: "text-right",
      render: (p) =>
        p.status === "pending" ? (
          <div className="flex justify-end gap-2">
            <button type="button" className="rounded-md p-1.5 hover:bg-surface-muted" aria-label={`Review ${p.name}`}>
              <Eye className="size-4" />
            </button>
            <button type="button" onClick={() => decide(p, "active")} className="rounded-md bg-success-soft px-2.5 py-1 text-xs font-semibold text-success hover:brightness-95">
              Approve
            </button>
            <button type="button" onClick={() => decide(p, "rejected")} className="rounded-md bg-danger-soft px-2.5 py-1 text-xs font-semibold text-danger hover:brightness-95">
              Reject
            </button>
          </div>
        ) : (
          <span className="text-sm text-muted">{formatDate(p.createdAt)}</span>
        ),
    },
  ];

  const rows = tab === "pending" ? pending : activeProducts;

  return (
    <>
      <div className="mb-6 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            aria-pressed={tab === t}
            className={`h-10 rounded-full border px-4 text-sm font-semibold capitalize transition-colors ${
              tab === t ? "border-ink bg-ink text-background" : "border-border hover:border-text"
            }`}
          >
            {t} {t === "pending" ? `(${pending.length})` : `(${activeProducts.length})`}
          </button>
        ))}
      </div>
      <DataTable columns={columns} rows={rows} emptyMessage="Nothing here." />
    </>
  );
}

export default function AdminProductsPage() {
  return (
    <RequireRole role="admin">
      <DashboardHeader title="Products" description="Moderate new listings before they go live." />
      <ProductModeration />
    </RequireRole>
  );
}
