"use client";

import { RequireRole } from "@/components/account/RequireRole";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { ProductForm } from "@/components/seller/ProductForm";

export default function NewProductPage() {
  return (
    <RequireRole role="artisan">
      <DashboardHeader title="Add Product" description="List a new piece — every field here appears on the product page." />
      <ProductForm mode="create" />
    </RequireRole>
  );
}
