"use client";

import { MoreVertical, PackagePlus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { RequireRole } from "@/components/account/RequireRole";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { type Column, DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { formatNu } from "@/lib/utils";
import { getArtisanById, getProductsByArtisan } from "@/services/catalog";
import type { Product } from "@/types";

function ProductsTable() {
  const { user } = useAuth();
  const { toast } = useToast();
  const artisan = user?.artisanId ? getArtisanById(user.artisanId) : undefined;
  const [products, setProducts] = useState<Product[]>(artisan ? getProductsByArtisan(artisan.id) : []);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const remove = (p: Product) => {
    setProducts((prev) => prev.filter((x) => x.id !== p.id));
    setMenuOpen(null);
    toast({ title: "Product removed", description: p.name, variant: "info" });
  };

  const columns: Column<Product>[] = [
    {
      key: "product",
      header: "Product",
      render: (p) => (
        <div className="flex items-center gap-3">
          <span className="relative size-12 shrink-0 overflow-hidden rounded-md bg-surface-muted">
            <SmartImage src={p.images[0].src} alt="" fill sizes="48px" className="object-cover" />
          </span>
          <div className="min-w-0">
            <p className="max-w-48 truncate font-semibold">{p.name}</p>
            <p className="text-xs text-muted">{p.category.replace("-", " ")}</p>
          </div>
        </div>
      ),
    },
    { key: "price", header: "Price", render: (p) => formatNu(p.price) },
    {
      key: "stock",
      header: "Stock",
      render: (p) => <span className={p.stock === 0 ? "font-semibold text-danger" : p.stock <= 3 ? "font-semibold text-warning" : ""}>{p.stock}</span>,
    },
    { key: "status", header: "Status", render: (p) => <StatusBadge status={p.stock === 0 ? "out-of-stock" : p.status} /> },
    {
      key: "actions",
      header: "Actions",
      hideOnMobile: true,
      className: "text-right",
      render: (p) => (
        <div className="relative inline-block text-left">
          <button
            type="button"
            onClick={() => setMenuOpen(menuOpen === p.id ? null : p.id)}
            className="rounded-md p-1.5 hover:bg-surface-muted"
            aria-label={`Actions for ${p.name}`}
            aria-expanded={menuOpen === p.id}
          >
            <MoreVertical className="size-4" />
          </button>
          {menuOpen === p.id && (
            <div className="absolute top-full right-0 z-10 mt-1 w-40 rounded-lg border border-border bg-surface py-1 shadow-lift">
              <Link href={`/products/${p.slug}`} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-surface-muted" onClick={() => setMenuOpen(null)}>
                <Pencil className="size-3.5" /> Edit listing
              </Link>
              <button type="button" onClick={() => remove(p)} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-danger hover:bg-danger-soft">
                <Trash2 className="size-3.5" /> Remove
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable columns={columns} rows={products} emptyMessage="You haven't listed any products yet." />
      {menuOpen && <button type="button" className="fixed inset-0 z-0 cursor-default" onClick={() => setMenuOpen(null)} aria-label="Close menu" tabIndex={-1} />}
    </>
  );
}

export default function SellerProductsPage() {
  return (
    <RequireRole role="artisan">
      <DashboardHeader
        title="Products"
        description="Manage your listings."
        action={
          <LinkButton href="/seller/products/new">
            <PackagePlus className="size-4" /> Add Product
          </LinkButton>
        }
      />
      <ProductsTable />
    </RequireRole>
  );
}
