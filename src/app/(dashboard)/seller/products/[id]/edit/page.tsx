"use client";

import { useParams } from "next/navigation";
import { RequireRole } from "@/components/account/RequireRole";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { ProductForm } from "@/components/seller/ProductForm";
import { LinkButton } from "@/components/ui/Button";
import { getProductById } from "@/services/catalog";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id);

  return (
    <RequireRole role="artisan">
      {product ? (
        <>
          <DashboardHeader title="Edit Product" description={product.name} />
          <ProductForm mode="edit" initial={product} />
        </>
      ) : (
        <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-2xl border border-dashed border-border-strong bg-surface p-10 text-center">
          <h1 className="font-serif text-2xl font-semibold">Product not found</h1>
          <p className="mt-2 max-w-sm text-muted">This listing may have been removed. Head back to your inventory to pick another one.</p>
          <LinkButton href="/seller/products" className="mt-6">
            Back to products
          </LinkButton>
        </div>
      )}
    </RequireRole>
  );
}
