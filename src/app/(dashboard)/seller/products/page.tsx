"use client";

import { Pencil, PlusCircle, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { RequireRole } from "@/components/account/RequireRole";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { StatusBadge } from "@/components/ui/Badge";
import { Button, LinkButton } from "@/components/ui/Button";
import { FormInput, Select } from "@/components/ui/FormInput";
import { Modal } from "@/components/ui/Overlay";
import { SmartImage } from "@/components/ui/SmartImage";
import { useAuth } from "@/context/AuthContext";
import { useProductSubmissions } from "@/context/ProductSubmissionsContext";
import { useToast } from "@/context/ToastContext";
import { cn, formatNu } from "@/lib/utils";
import { getArtisanById, getProductsByArtisan } from "@/services/catalog";
import type { Product } from "@/types";

type SortOption = "name" | "price-asc" | "price-desc" | "stock-asc";

const SORT_LABELS: Record<SortOption, string> = {
  name: "Name: A to Z",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  "stock-asc": "Stock: Low to High",
};

function sku(p: Product) {
  const prefix = p.category.split("-")[0].slice(0, 2).toUpperCase();
  return `${prefix}-${p.id.replace(/\D/g, "").padStart(3, "0")}`;
}

function StockCell({ product }: { product: Product }) {
  if (product.stock === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-subtle">
        <span className="size-2 rounded-full bg-subtle" /> Out of stock
      </span>
    );
  }
  if (product.stock <= 3) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-danger">
        <span className="size-2 rounded-full bg-danger" /> {product.stock} units left
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-success">
      <span className="size-2 rounded-full bg-success" /> {product.stock} units
    </span>
  );
}

function ProductsTable() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { submissionsByArtisan } = useProductSubmissions();
  const artisan = user?.artisanId ? getArtisanById(user.artisanId) : undefined;

  const allProducts = useMemo(() => {
    if (!artisan) return [];
    const base = getProductsByArtisan(artisan.id);
    const baseIds = new Set(base.map((p) => p.id));
    return [...submissionsByArtisan(artisan.id).filter((p) => !baseIds.has(p.id)), ...base];
  }, [artisan, submissionsByArtisan]);

  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const products = useMemo(() => allProducts.filter((p) => !hiddenIds.has(p.id)), [allProducts, hiddenIds]);
  const [removing, setRemoving] = useState<Product | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<SortOption>("name");

  const categories = useMemo(() => Array.from(new Set(products.map((p) => p.category))).sort(), [products]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = products.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (q && !p.name.toLowerCase().includes(q)) return false;
      return true;
    });
    return [...rows].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return a.stock - b.stock;
    });
  }, [products, query, category, sort]);

  const confirmRemove = () => {
    if (!removing) return;
    setHiddenIds((prev) => new Set(prev).add(removing.id));
    toast({ title: "Product removed", description: removing.name, variant: "info" });
    setRemoving(null);
  };

  return (
    <>
      <div className="mb-5">
        <FormInput
          placeholder="Search inventory, SKUs, or crafts…"
          icon={<Search className="size-4" aria-hidden />}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search inventory"
          className="max-w-md"
        />
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[{ value: "all", label: "All items" }, ...categories.map((c) => ({ value: c, label: c.replace("-", " ") }))].map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setCategory(t.value)}
              aria-pressed={category === t.value}
              className={cn(
                "h-9 shrink-0 rounded-full border px-4 text-sm font-semibold capitalize transition-colors",
                category === t.value ? "border-ink bg-ink text-background" : "border-border hover:border-text",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <Select
          fieldSize="sm"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          options={Object.entries(SORT_LABELS).map(([value, label]) => ({ value, label: `Sort by: ${label}` }))}
          aria-label="Sort products"
          className="ml-auto w-auto"
        />
      </div>

      {visible.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border-strong bg-surface-muted p-8 text-center text-muted">
          <p>{products.length === 0 ? "You haven't listed any products yet." : "No products match your filters."}</p>
          {products.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("all");
              }}
              className="mt-3 text-sm font-semibold text-primary hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-muted text-xs font-semibold tracking-wide text-muted uppercase">
                <th className="px-5 py-3.5">Product details</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Price</th>
                <th className="px-5 py-3.5">Stock level</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {visible.map((p) => (
                <tr key={p.id} className={cn("transition-colors hover:bg-surface-muted/60", p.stock > 0 && p.stock <= 3 && "border-l-2 border-l-danger")}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="relative size-12 shrink-0 overflow-hidden rounded-md bg-surface-muted">
                        <SmartImage src={p.images[0].src} alt="" fill sizes="48px" className="object-cover" />
                      </span>
                      <div className="min-w-0">
                        <p className="max-w-56 truncate font-semibold">{p.name}</p>
                        <p className="text-xs text-muted">SKU: {sku(p)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-block rounded-full bg-surface-muted px-2.5 py-0.5 text-xs font-semibold capitalize">{p.category.replace("-", " ")}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-5 py-3.5 font-semibold tabular-nums">{formatNu(p.price)}</td>
                  <td className="px-5 py-3.5">
                    <StockCell product={p} />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <LinkButton href={`/seller/products/${p.id}/edit`} variant="ghost" size="icon" aria-label={`Edit ${p.name}`}>
                        <Pencil className="size-4" />
                      </LinkButton>
                      <button
                        type="button"
                        onClick={() => setRemoving(p)}
                        className="flex size-10 items-center justify-center rounded-full text-danger transition-colors hover:bg-danger-soft"
                        aria-label={`Remove ${p.name}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {visible.length > 0 && (
        <p className="mt-4 text-sm text-muted">
          Showing {visible.length} of {products.length} items
        </p>
      )}

      <Modal
        open={!!removing}
        onClose={() => setRemoving(null)}
        title="Remove this product?"
        description={removing ? `"${removing.name}" will be removed from your storefront. This can't be undone.` : undefined}
        footer={
          <>
            <Button variant="outline" onClick={() => setRemoving(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmRemove}>
              Remove
            </Button>
          </>
        }
      />
    </>
  );
}

export default function SellerProductsPage() {
  return (
    <RequireRole role="artisan">
      <DashboardHeader
        title="Inventory Management"
        description="Manage your premium Gho, Kira and craft listings — monitor stock levels and keep your storefront curated."
        action={
          <LinkButton href="/seller/products/new">
            <PlusCircle className="size-4" /> Add New Product
          </LinkButton>
        }
      />
      <ProductsTable />
    </RequireRole>
  );
}
