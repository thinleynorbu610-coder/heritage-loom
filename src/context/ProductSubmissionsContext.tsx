"use client";

/**
 * Products a seller submits through "Add Product" are stored locally (same
 * pattern as OrdersContext) so the full flow — seller submits, admin
 * reviews in Products moderation, approval makes it live in the seller's
 * own inventory — can be demonstrated with local browser state.
 *
 */
import { createContext, useCallback, useContext, useMemo } from "react";
import { pendingProducts as seedPending } from "@/data/products";
import { createPersistentStore, useStore } from "@/lib/persistent-store";
import { todayISO } from "@/lib/utils";
import type { CategorySlug, Product, ProductType, RegionSlug } from "@/types";

const submissionsStore = createPersistentStore<Product[]>("hl.productSubmissions", []);

interface SubmitProductInput {
  name: string;
  summary: string;
  price: number;
  stock: number;
  category: CategorySlug;
  type: ProductType;
  region: RegionSlug;
  artisanId: string;
  materials: string[];
  techniqueName: string;
  culturalSignificance: string;
  images: { src: string; alt: string }[];
}

interface ProductSubmissionsContextValue {
  /** Every submitted product (pending, approved or rejected), newest first. */
  submissions: Product[];
  submissionsByArtisan: (artisanId: string) => Product[];
  pendingSubmissions: Product[];
  submitProduct: (input: SubmitProductInput) => Product;
  /** Admin action: approve (goes live) or reject a pending submission. */
  decide: (productId: string, status: "active" | "rejected") => void;
}

const ProductSubmissionsContext = createContext<ProductSubmissionsContextValue | null>(null);

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProductSubmissionsProvider({ children }: { children: React.ReactNode }) {
  const submitted = useStore(submissionsStore);

  // Submitted (persisted) entries win over the static seed when an id
  // appears in both — e.g. once an admin has decided on a seeded demo item.
  const submissions = useMemo(() => {
    const overridden = new Set(submitted.map((p) => p.id));
    return [...submitted, ...seedPending.filter((p) => !overridden.has(p.id))];
  }, [submitted]);

  const submissionsByArtisan = useCallback((artisanId: string) => submissions.filter((p) => p.artisanId === artisanId), [submissions]);
  const pendingSubmissions = useMemo(() => submissions.filter((p) => p.status === "pending"), [submissions]);

  const submitProduct = useCallback((input: SubmitProductInput) => {
    const today = todayISO();
    const product: Product = {
      id: `prd-sub-${Date.now()}`,
      slug: `${slugify(input.name)}-${Date.now().toString().slice(-5)}`,
      name: input.name,
      price: input.price,
      category: input.category,
      type: input.type,
      artisanId: input.artisanId,
      region: input.region,
      materials: input.materials,
      technique: { name: input.techniqueName, description: input.techniqueName },
      story: input.summary,
      culturalSignificance: input.culturalSignificance,
      summary: input.summary,
      rating: 0,
      reviewCount: 0,
      images: input.images,
      stock: input.stock,
      createdAt: today,
      status: "pending",
    };
    submissionsStore.set((prev) => [product, ...prev]);
    return product;
  }, []);

  const decide = useCallback((productId: string, status: "active" | "rejected") => {
    submissionsStore.set((prev) => {
      if (prev.some((p) => p.id === productId)) {
        return prev.map((p) => (p.id === productId ? { ...p, status } : p));
      }
      const seed = seedPending.find((p) => p.id === productId);
      return seed ? [{ ...seed, status }, ...prev] : prev;
    });
  }, []);

  const value = useMemo(
    () => ({ submissions, submissionsByArtisan, pendingSubmissions, submitProduct, decide }),
    [submissions, submissionsByArtisan, pendingSubmissions, submitProduct, decide],
  );
  return <ProductSubmissionsContext.Provider value={value}>{children}</ProductSubmissionsContext.Provider>;
}

export function useProductSubmissions() {
  const ctx = useContext(ProductSubmissionsContext);
  if (!ctx) throw new Error("useProductSubmissions must be used inside <ProductSubmissionsProvider>");
  return ctx;
}
