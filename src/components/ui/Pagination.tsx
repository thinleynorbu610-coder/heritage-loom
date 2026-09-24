"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

export function Pagination({
  page,
  pageCount,
  onChange,
  className,
}: {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  className?: string;
}) {
  if (pageCount <= 1) return null;
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  return (
    <nav aria-label="Pagination" className={cn("flex items-center justify-center gap-1", className)}>
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="inline-flex h-10 items-center gap-1 rounded-md px-3 text-sm font-semibold text-muted hover:bg-surface-muted hover:text-text disabled:opacity-40"
      >
        <ChevronLeft className="size-4" aria-hidden /> Previous
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          aria-current={p === page ? "page" : undefined}
          className={cn(
            "size-10 rounded-md text-sm font-semibold transition-colors",
            p === page ? "bg-ink text-background" : "text-muted hover:bg-surface-muted hover:text-text",
          )}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === pageCount}
        className="inline-flex h-10 items-center gap-1 rounded-md px-3 text-sm font-semibold text-muted hover:bg-surface-muted hover:text-text disabled:opacity-40"
      >
        Next <ChevronRight className="size-4" aria-hidden />
      </button>
    </nav>
  );
}

/** "Load more" pattern with progress indicator — used on the shop page. */
export function LoadMore({
  shown,
  total,
  onLoadMore,
  loading,
  noun = "products",
}: {
  shown: number;
  total: number;
  onLoadMore: () => void;
  loading?: boolean;
  noun?: string;
}) {
  const pct = total ? Math.round((shown / total) * 100) : 100;
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-muted">
        Showing <span className="font-semibold text-text">{shown}</span> of{" "}
        <span className="font-semibold text-text">{total}</span> {noun}
      </p>
      <div className="h-0.5 w-48 overflow-hidden rounded-full bg-border" aria-hidden="true">
        <div className="h-full bg-primary transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
      {shown < total && (
        <Button variant="outline" onClick={onLoadMore} loading={loading} className="min-w-44">
          Load more {noun}
        </Button>
      )}
    </div>
  );
}
