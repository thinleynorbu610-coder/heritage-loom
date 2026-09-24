"use client";

import { SlidersHorizontal, SearchX, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Select } from "@/components/ui/FormInput";
import { Breadcrumbs } from "@/components/ui/Misc";
import { Drawer } from "@/components/ui/Overlay";
import { LoadMore } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { formatNu } from "@/lib/utils";
import {
  PRODUCT_TYPES,
  SORT_OPTIONS,
  type SortOption,
  getAllArtisans,
  getAllProducts,
  getCategories,
  getRegions,
  searchProducts,
} from "@/services/catalog";
import type { CategorySlug, ProductType, RegionSlug } from "@/types";
import { FilterPanel, type FilterState } from "./FilterPanel";
import { ProductGrid } from "./ProductCard";

const PAGE_SIZE = 9;

const list = (v: string | null) => (v ? v.split(",").filter(Boolean) : []);
const num = (v: string | null) => (v != null && v !== "" && !Number.isNaN(Number(v)) ? Number(v) : undefined);

export function ShopView() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const q = params.get("q") ?? "";
  const sort = (params.get("sort") as SortOption) || "featured";
  const state: FilterState = {
    categories: list(params.get("category")),
    regions: list(params.get("region")),
    artisans: list(params.get("artisan")),
    types: list(params.get("type")),
    minPrice: num(params.get("min")),
    maxPrice: num(params.get("max")),
  };
  const key = params.toString();

  const results = useMemo(
    () =>
      searchProducts({
        q,
        sort,
        categories: state.categories as CategorySlug[],
        regions: state.regions as RegionSlug[],
        artisans: state.artisans,
        types: state.types as ProductType[],
        minPrice: state.minPrice,
        maxPrice: state.maxPrice,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );

  // Reset "load more" whenever the query changes.
  const [lastKey, setLastKey] = useState(key);
  if (lastKey !== key) {
    setLastKey(key);
    setVisible(PAGE_SIZE);
  }

  const update = (patch: Partial<FilterState> & { q?: string; sort?: string }) => {
    const next = new URLSearchParams(params.toString());
    const set = (k: string, v: string | undefined) => (v ? next.set(k, v) : next.delete(k));
    if ("q" in patch) set("q", patch.q);
    if ("sort" in patch) set("sort", patch.sort === "featured" ? undefined : patch.sort);
    if (patch.categories) set("category", patch.categories.join(","));
    if (patch.regions) set("region", patch.regions.join(","));
    if (patch.artisans) set("artisan", patch.artisans.join(","));
    if (patch.types) set("type", patch.types.join(","));
    if ("minPrice" in patch) set("min", patch.minPrice?.toString());
    if ("maxPrice" in patch) set("max", patch.maxPrice?.toString());
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const all = getAllProducts();
  const count = <T extends string>(field: "category" | "region" | "artisanId" | "type", value: T) =>
    all.filter((p) => p[field] === value).length;

  const options = {
    categories: getCategories().map((c) => ({ value: c.slug, label: c.name, count: count("category", c.slug) })),
    regions: getRegions().map((r) => ({ value: r.slug, label: r.name, count: count("region", r.slug) })),
    artisans: getAllArtisans().map((a) => ({ value: a.id, label: a.name, count: count("artisanId", a.id) })),
    types: PRODUCT_TYPES.map((t) => ({ value: t, label: t, count: count("type", t) })),
  };

  const chips: { label: string; remove: () => void }[] = [
    ...state.categories.map((v) => ({
      label: options.categories.find((o) => o.value === v)?.label ?? v,
      remove: () => update({ categories: state.categories.filter((x) => x !== v) }),
    })),
    ...state.regions.map((v) => ({
      label: options.regions.find((o) => o.value === v)?.label ?? v,
      remove: () => update({ regions: state.regions.filter((x) => x !== v) }),
    })),
    ...state.artisans.map((v) => ({
      label: options.artisans.find((o) => o.value === v)?.label ?? v,
      remove: () => update({ artisans: state.artisans.filter((x) => x !== v) }),
    })),
    ...state.types.map((v) => ({ label: v, remove: () => update({ types: state.types.filter((x) => x !== v) }) })),
    ...(state.minPrice != null || state.maxPrice != null
      ? [
          {
            label: `${state.minPrice != null ? formatNu(state.minPrice) : "Nu. 0"} – ${state.maxPrice != null ? formatNu(state.maxPrice) : "Any"}`,
            remove: () => update({ minPrice: undefined, maxPrice: undefined }),
          },
        ]
      : []),
    ...(q ? [{ label: `“${q}”`, remove: () => update({ q: "" }) }] : []),
  ];

  const clearAll = () => router.replace(sort !== "featured" ? `${pathname}?sort=${sort}` : pathname, { scroll: false });
  const activeFilterCount = chips.length - (q ? 1 : 0);

  const singleCategory = state.categories.length === 1 ? getCategories().find((c) => c.slug === state.categories[0]) : undefined;
  const heading = singleCategory?.name ?? (q ? `Results for “${q}”` : "The Collection");
  const shown = results.slice(0, visible);

  return (
    <>
      <div className="border-b border-border bg-surface bg-weave">
        <div className="container-page py-10 sm:py-14">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Shop", href: singleCategory ? "/shop" : undefined },
              ...(singleCategory ? [{ label: singleCategory.name, href: undefined as string | undefined }] : []),
            ]}
          />
          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h1 className="font-display text-5xl sm:text-6xl">{heading}</h1>
              <p className="mt-3 text-lg text-muted">
                {singleCategory?.description ??
                  "Every piece is handmade in Bhutan and listed by the artisan who made it."}
              </p>
            </div>
            <SearchBar key={q} defaultValue={q} onSearch={(value) => update({ q: value })} className="lg:max-w-md" />
          </div>
        </div>
      </div>

      <div className="container-page py-8 sm:py-12">
        <div className="grid gap-10 lg:grid-cols-[260px_1fr] xl:gap-14">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block" aria-label="Filters">
            <div className="sticky top-[calc(var(--header-h)+1.5rem)]">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h2 className="font-serif text-2xl font-semibold">Filters</h2>
                {activeFilterCount > 0 && (
                  <button type="button" onClick={clearAll} className="text-sm font-semibold text-primary hover:underline">
                    Clear all
                  </button>
                )}
              </div>
              <FilterPanel key={key} state={state} onChange={update} options={options} />
            </div>
          </aside>

          <div>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted" aria-live="polite">
                <span className="font-semibold text-text">{results.length}</span> {results.length === 1 ? "piece" : "pieces"}
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setFiltersOpen(true)} className="h-10 lg:hidden">
                  <SlidersHorizontal className="size-4" aria-hidden />
                  Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
                </Button>
                <Select
                  aria-label="Sort products"
                  fieldSize="sm"
                  value={sort}
                  onChange={(e) => update({ sort: e.target.value })}
                  options={SORT_OPTIONS}
                  className="w-auto min-w-44 font-semibold"
                />
              </div>
            </div>

            {chips.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {chips.map((c) => (
                  <button
                    key={c.label}
                    type="button"
                    onClick={c.remove}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border-strong bg-surface py-1.5 pr-2.5 pl-3.5 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
                    aria-label={`Remove filter ${c.label}`}
                  >
                    {c.label}
                    <X className="size-3.5" aria-hidden />
                  </button>
                ))}
                <button type="button" onClick={() => router.replace(pathname, { scroll: false })} className="ml-1 text-sm font-semibold text-muted underline-offset-4 hover:text-text hover:underline">
                  Reset
                </button>
              </div>
            )}

            <div className="mt-8">
              {results.length === 0 ? (
                <EmptyState
                  icon={<SearchX className="size-6" aria-hidden />}
                  title="No pieces match your search"
                  description="Try removing a filter, widening the price range, or searching for a material like “wool” or a region like “Paro”."
                  action={
                    <>
                      <Button onClick={() => router.replace(pathname, { scroll: false })}>Clear all filters</Button>
                    </>
                  }
                />
              ) : (
                <>
                  <ProductGrid products={shown} />
                  <div className="mt-16">
                    <LoadMore shown={shown.length} total={results.length} onLoadMore={() => setVisible((v) => v + PAGE_SIZE)} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile filters */}
      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filters"
        side="right"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" onClick={clearAll} className="flex-1" disabled={activeFilterCount === 0}>
              Clear all
            </Button>
            <Button onClick={() => setFiltersOpen(false)} className="flex-[2]">
              Show {results.length} {results.length === 1 ? "piece" : "pieces"}
            </Button>
          </div>
        }
      >
        <div className="px-5">
          <FilterPanel key={key} state={state} onChange={update} options={options} />
        </div>
      </Drawer>
    </>
  );
}
