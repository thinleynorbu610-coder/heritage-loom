/**
 * Catalogue data-access layer.
 *
 * TODAY: synchronous reads from local demo data in `src/data`.
 * LATER: replace each function body with a call to the Go REST API
 * (e.g. `GET /api/v1/products?category=...`) and make them async.
 * Components only depend on these functions, never on the data files
 * directly, so the swap stays contained to this module.
 *
 * No network requests are made here — there is no backend yet.
 */
import { artisans } from "@/data/artisans";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { regions } from "@/data/regions";
import { reviews } from "@/data/reviews";
import type { Artisan, CategorySlug, Product, ProductType, RegionSlug } from "@/types";

export type SortOption = "featured" | "newest" | "price-asc" | "price-desc";

export interface ProductQuery {
  q?: string;
  categories?: CategorySlug[];
  regions?: RegionSlug[];
  artisans?: string[];
  types?: ProductType[];
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
}

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export const PRODUCT_TYPES: ProductType[] = ["Clothing", "Accessories", "Home & Living", "Wall Art", "Jewellery"];

export function getAllProducts() {
  return products.filter((p) => p.status === "active");
}

export function getFeaturedProducts(limit = 6) {
  return getAllProducts().filter((p) => p.featured).slice(0, limit);
}

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string) {
  return products.find((p) => p.id === id);
}

export function getProductsByArtisan(artisanId: string) {
  return getAllProducts().filter((p) => p.artisanId === artisanId);
}

export function getRelatedProducts(product: Product, limit = 4) {
  const pool = getAllProducts().filter((p) => p.id !== product.id);
  const scored = pool
    .map((p) => ({
      p,
      score: (p.category === product.category ? 2 : 0) + (p.region === product.region ? 1 : 0) + (p.artisanId === product.artisanId ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.p);
}

export function searchProducts(query: ProductQuery) {
  const q = query.q?.trim().toLowerCase();
  let list = getAllProducts().filter((p) => {
    if (query.categories?.length && !query.categories.includes(p.category)) return false;
    if (query.regions?.length && !query.regions.includes(p.region)) return false;
    if (query.artisans?.length && !query.artisans.includes(p.artisanId)) return false;
    if (query.types?.length && !query.types.includes(p.type)) return false;
    if (query.minPrice != null && p.price < query.minPrice) return false;
    if (query.maxPrice != null && p.price > query.maxPrice) return false;
    if (q) {
      const artisan = getArtisanById(p.artisanId);
      const haystack = [p.name, p.summary, p.category, p.region, p.technique.name, artisan?.name, ...p.materials]
        .join(" ")
        .toLowerCase();
      if (!q.split(/\s+/).every((term) => haystack.includes(term))) return false;
    }
    return true;
  });

  switch (query.sort) {
    case "newest":
      list = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      break;
    case "price-asc":
      list = [...list].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list = [...list].sort((a, b) => b.price - a.price);
      break;
    default:
      list = [...list].sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || b.rating - a.rating);
  }
  return list;
}

export function getAllArtisans() {
  return artisans;
}

export function getArtisanById(id: string): Artisan | undefined {
  return artisans.find((a) => a.id === id);
}

export function getArtisanBySlug(slug: string) {
  return artisans.find((a) => a.slug === slug);
}

export function getArtisanProductCount(artisanId: string) {
  return getProductsByArtisan(artisanId).length;
}

export function getCategories() {
  return categories;
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getRegions() {
  return regions;
}

export function getRegion(slug: string) {
  return regions.find((r) => r.slug === slug);
}

export function getRegionStats(slug: RegionSlug) {
  return {
    products: getAllProducts().filter((p) => p.region === slug).length,
    artisans: artisans.filter((a) => a.region === slug).length,
  };
}

export function getReviews(productId: string) {
  return reviews.filter((r) => r.productId === productId);
}

export function getPriceBounds() {
  const prices = getAllProducts().map((p) => p.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}
