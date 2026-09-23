"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Search input. When `onSearch` is given it acts as a controlled filter;
 * otherwise submitting navigates to /shop?q=...
 */
export function SearchBar({
  defaultValue = "",
  onSearch,
  placeholder = "Search crafts, textiles, artisans...",
  size = "md",
  className,
  autoFocus,
  onSubmitted,
}: {
  defaultValue?: string;
  onSearch?: (q: string) => void;
  placeholder?: string;
  size?: "md" | "lg";
  className?: string;
  autoFocus?: boolean;
  onSubmitted?: () => void;
}) {
  const router = useRouter();
  const id = useId();
  const [value, setValue] = useState(defaultValue);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (onSearch) onSearch(q);
    else router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
    onSubmitted?.();
  };

  return (
    <form role="search" onSubmit={submit} className={cn("relative w-full", className)}>
      <label htmlFor={id} className="sr-only">
        Search Heritage Loom
      </label>
      <Search
        className={cn(
          "pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted",
          size === "lg" ? "left-5 size-5" : "left-4 size-4",
        )}
        aria-hidden
      />
      <input
        id={id}
        type="search"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => {
          setValue(e.target.value);
          onSearch?.(e.target.value);
        }}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-full border border-border bg-surface text-text placeholder:text-subtle outline-none transition-[border-color,box-shadow] focus:border-primary focus:ring-3 focus:ring-primary/12 [&::-webkit-search-cancel-button]:hidden",
          size === "lg" ? "h-14 pr-28 pl-13 text-lg" : "h-11 pr-20 pl-11 text-[0.95rem]",
        )}
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            setValue("");
            onSearch?.("");
          }}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted hover:bg-surface-muted hover:text-text",
            size === "lg" ? "right-24" : "right-16",
          )}
          aria-label="Clear search"
        >
          <X className="size-4" />
        </button>
      )}
      <button
        type="submit"
        className={cn(
          "absolute top-1/2 right-1.5 -translate-y-1/2 rounded-full bg-ink font-semibold text-background transition-colors hover:bg-primary",
          size === "lg" ? "h-11 px-5 text-sm" : "h-8 px-3.5 text-xs",
        )}
      >
        Search
      </button>
    </form>
  );
}
