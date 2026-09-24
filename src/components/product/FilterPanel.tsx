"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn, formatNu } from "@/lib/utils";

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterState {
  categories: string[];
  regions: string[];
  artisans: string[];
  types: string[];
  minPrice?: number;
  maxPrice?: number;
}

export const PRICE_PRESETS = [
  { label: "Under Nu. 3,000", min: undefined, max: 3000 },
  { label: "Nu. 3,000 – 10,000", min: 3000, max: 10000 },
  { label: "Nu. 10,000 – 20,000", min: 10000, max: 20000 },
  { label: "Over Nu. 20,000", min: 20000, max: undefined },
];

function FilterGroup({
  title,
  children,
  defaultOpen = true,
  activeCount = 0,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  activeCount?: number;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border py-5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between text-left font-semibold"
      >
        <span>
          {title}
          {activeCount > 0 && (
            <span className="ml-2 rounded-full bg-primary px-1.5 py-0.5 text-[0.65rem] text-white">{activeCount}</span>
          )}
        </span>
        <ChevronDown className={cn("size-4 text-muted transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      <div className={cn("grid transition-[grid-template-rows] duration-300", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div className="overflow-hidden">
          <div className="pt-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

function CheckList({
  name,
  options,
  selected,
  onToggle,
}: {
  name: string;
  options: FilterOption[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <ul className="flex flex-col gap-1">
      {options.map((o) => {
        const id = `${name}-${o.value}`;
        const checked = selected.includes(o.value);
        return (
          <li key={o.value}>
            <label
              htmlFor={id}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 text-[0.94rem] transition-colors hover:bg-surface-muted",
                o.count === 0 && !checked && "opacity-50",
              )}
            >
              <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(o.value)}
                className="size-4 shrink-0 accent-[var(--primary)]"
              />
              <span className={cn("flex-1", checked && "font-semibold")}>{o.label}</span>
              {o.count != null && <span className="text-xs text-subtle tabular-nums">{o.count}</span>}
            </label>
          </li>
        );
      })}
    </ul>
  );
}

export function FilterPanel({
  state,
  onChange,
  options,
}: {
  state: FilterState;
  onChange: (next: Partial<FilterState>) => void;
  options: {
    categories: FilterOption[];
    regions: FilterOption[];
    artisans: FilterOption[];
    types: FilterOption[];
  };
}) {
  const toggle = (key: "categories" | "regions" | "artisans" | "types", value: string) => {
    const list = state[key];
    onChange({ [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value] });
  };

  const [min, setMin] = useState(state.minPrice?.toString() ?? "");
  const [max, setMax] = useState(state.maxPrice?.toString() ?? "");
  const [syncedFrom, setSyncedFrom] = useState({ minPrice: state.minPrice, maxPrice: state.maxPrice });
  // Keep inputs in sync when price changes from outside (preset chips, "clear all").
  if (syncedFrom.minPrice !== state.minPrice || syncedFrom.maxPrice !== state.maxPrice) {
    setSyncedFrom({ minPrice: state.minPrice, maxPrice: state.maxPrice });
    setMin(state.minPrice?.toString() ?? "");
    setMax(state.maxPrice?.toString() ?? "");
  }

  const applyPrice = (e?: React.FormEvent) => {
    e?.preventDefault();
    const lo = min ? Number(min) : undefined;
    const hi = max ? Number(max) : undefined;
    if (lo != null && hi != null && lo > hi) onChange({ minPrice: hi, maxPrice: lo });
    else onChange({ minPrice: lo, maxPrice: hi });
  };

  const priceActive = state.minPrice != null || state.maxPrice != null;

  return (
    <div className="flex flex-col">
      <FilterGroup title="Category" activeCount={state.categories.length}>
        <CheckList name="category" options={options.categories} selected={state.categories} onToggle={(v) => toggle("categories", v)} />
      </FilterGroup>

      <FilterGroup title="Price range" activeCount={priceActive ? 1 : 0}>
        <div className="flex flex-wrap gap-2">
          {PRICE_PRESETS.map((p) => {
            const on = state.minPrice === p.min && state.maxPrice === p.max;
            return (
              <button
                key={p.label}
                type="button"
                aria-pressed={on}
                onClick={() => onChange(on ? { minPrice: undefined, maxPrice: undefined } : { minPrice: p.min, maxPrice: p.max })}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                  on ? "border-ink bg-ink text-background" : "border-border bg-surface hover:border-text",
                )}
              >
                {p.label}
              </button>
            );
          })}
        </div>
        <form onSubmit={applyPrice} className="mt-4 flex items-end gap-2">
          <label className="flex-1 text-xs font-semibold text-muted">
            Min (Nu.)
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={min}
              onChange={(e) => setMin(e.target.value)}
              placeholder="0"
              className="mt-1 h-10 w-full rounded-md border border-border bg-surface px-3 text-sm text-text outline-none focus:border-primary"
            />
          </label>
          <span className="pb-2.5 text-muted">–</span>
          <label className="flex-1 text-xs font-semibold text-muted">
            Max (Nu.)
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={max}
              onChange={(e) => setMax(e.target.value)}
              placeholder="Any"
              className="mt-1 h-10 w-full rounded-md border border-border bg-surface px-3 text-sm text-text outline-none focus:border-primary"
            />
          </label>
          <button type="submit" className="h-10 rounded-md bg-ink px-3 text-sm font-semibold text-background hover:bg-primary">
            Apply
          </button>
        </form>
        {priceActive && (
          <p className="mt-2 text-xs text-muted">
            Showing {state.minPrice != null ? formatNu(state.minPrice) : "Nu. 0"} –{" "}
            {state.maxPrice != null ? formatNu(state.maxPrice) : "any price"}
          </p>
        )}
      </FilterGroup>

      <FilterGroup title="Region" activeCount={state.regions.length}>
        <CheckList name="region" options={options.regions} selected={state.regions} onToggle={(v) => toggle("regions", v)} />
      </FilterGroup>

      <FilterGroup title="Artisan" activeCount={state.artisans.length} defaultOpen={false}>
        <CheckList name="artisan" options={options.artisans} selected={state.artisans} onToggle={(v) => toggle("artisans", v)} />
      </FilterGroup>

      <FilterGroup title="Product type" activeCount={state.types.length} defaultOpen={false}>
        <CheckList name="type" options={options.types} selected={state.types} onToggle={(v) => toggle("types", v)} />
      </FilterGroup>
    </div>
  );
}
