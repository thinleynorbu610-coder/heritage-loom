"use client";

import { ChevronRight, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { cn, formatNu } from "@/lib/utils";

export function Price({
  amount,
  compareAt,
  size = "md",
  className,
}: {
  amount: number;
  compareAt?: number;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const sizes = { sm: "text-sm", md: "text-base", lg: "text-xl", xl: "text-3xl" };
  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span className={cn("font-bold tracking-tight text-text tabular-nums", sizes[size])}>{formatNu(amount)}</span>
      {compareAt && compareAt > amount && (
        <span className="text-sm text-subtle tabular-nums line-through">
          <span className="sr-only">Was </span>
          {formatNu(compareAt)}
        </span>
      )}
    </span>
  );
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  label = "Quantity",
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  label?: string;
}) {
  const h = size === "sm" ? "h-9" : "h-12";
  const w = size === "sm" ? "w-9" : "w-11";
  return (
    <div
      className={cn("inline-flex items-center rounded-md border border-border-strong bg-surface", h)}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={cn("flex h-full items-center justify-center text-text hover:bg-surface-muted disabled:opacity-35", w)}
        aria-label="Decrease quantity"
      >
        <Minus className="size-4" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const n = parseInt(e.target.value, 10);
          if (!Number.isNaN(n)) onChange(Math.min(max, Math.max(min, n)));
        }}
        className={cn(
          "h-full border-x border-border bg-transparent text-center font-semibold tabular-nums outline-none",
          size === "sm" ? "w-10 text-sm" : "w-12",
        )}
        aria-label={label}
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={cn("flex h-full items-center justify-center text-text hover:bg-surface-muted disabled:opacity-35", w)}
        aria-label="Increase quantity"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}

export function Breadcrumbs({ items, className }: { items: { label: string; href?: string }[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm", className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-muted">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="size-3.5 text-subtle" aria-hidden />}
            {item.href ? (
              <Link href={item.href} className="transition-colors hover:text-primary">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-text">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
