"use client";

import { ArrowRight, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Price } from "@/components/ui/Misc";
import { SmartImage } from "@/components/ui/SmartImage";
import { cn } from "@/lib/utils";
import { getAllArtisans, getArtisanById, getCategories, searchProducts } from "@/services/catalog";

const SUGGESTIONS = ["Kira", "Yathra", "Wooden bowl", "Silver", "Raw silk", "Bumthang"];

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, onClose]);

  const term = q.trim().toLowerCase();
  const productResults = useMemo(() => (term ? searchProducts({ q: term }).slice(0, 5) : []), [term]);
  const artisanResults = useMemo(
    () =>
      term
        ? getAllArtisans()
            .filter((a) => `${a.name} ${a.specialty} ${a.region}`.toLowerCase().includes(term))
            .slice(0, 3)
        : [],
    [term],
  );
  const categoryResults = useMemo(
    () => (term ? getCategories().filter((c) => c.name.toLowerCase().includes(term)) : []),
    [term],
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(term ? `/shop?q=${encodeURIComponent(q.trim())}` : "/shop");
    onClose();
  };

  const nothing = term && !productResults.length && !artisanResults.length && !categoryResults.length;

  return (
    <div className={cn("fixed inset-0 z-[85]", !open && "pointer-events-none")} inert={!open} aria-hidden={!open}>
      <div
        className={cn("absolute inset-0 bg-ink/45 backdrop-blur-[2px] transition-opacity duration-300", open ? "opacity-100" : "opacity-0")}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className={cn(
          "relative max-h-[85vh] overflow-y-auto border-b border-border bg-background shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0",
        )}
      >
        <div className="container-page py-6 sm:py-10">
          <form onSubmit={submit} role="search" className="flex items-center gap-3 border-b-2 border-text pb-3">
            <Search className="size-6 shrink-0 text-muted" aria-hidden />
            <label htmlFor="global-search" className="sr-only">
              Search Heritage Loom
            </label>
            <input
              ref={inputRef}
              id="global-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search crafts, textiles, artisans..."
              className="min-w-0 flex-1 bg-transparent font-serif text-2xl outline-none placeholder:text-subtle sm:text-4xl [&::-webkit-search-cancel-button]:hidden"
            />
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-2 text-muted hover:bg-surface-muted hover:text-text"
              aria-label="Close search"
            >
              <X className="size-6" />
            </button>
          </form>

          {!term && (
            <div className="mt-6">
              <p className="text-sm font-semibold text-muted">Popular searches</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQ(s)}
                    className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {nothing && (
            <p className="mt-8 text-muted">
              No results for <span className="font-semibold text-text">“{q}”</span>. Try a craft, material or region —
              for example “wool” or “Paro”.
            </p>
          )}

          {term && !nothing && (
            <div className="mt-8 grid gap-10 md:grid-cols-[2fr_1fr]">
              <div>
                <p className="eyebrow mb-4">Products</p>
                <ul className="flex flex-col divide-y divide-border">
                  {productResults.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/products/${p.slug}`}
                        onClick={onClose}
                        className="group flex items-center gap-4 py-3"
                      >
                        <span className="relative size-16 shrink-0 overflow-hidden rounded-md bg-surface-muted">
                          <SmartImage src={p.images[0].src} alt="" fill sizes="64px" className="object-cover" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-semibold group-hover:text-primary">{p.name}</span>
                          <span className="block text-sm text-muted">by {getArtisanById(p.artisanId)?.name}</span>
                        </span>
                        <Price amount={p.price} size="sm" />
                      </Link>
                    </li>
                  ))}
                </ul>
                {productResults.length > 0 && (
                  <button
                    type="button"
                    onClick={submit}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary"
                  >
                    See all results for “{q}” <ArrowRight className="size-4" aria-hidden />
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-8">
                {artisanResults.length > 0 && (
                  <div>
                    <p className="eyebrow mb-4">Artisans</p>
                    <ul className="flex flex-col gap-2">
                      {artisanResults.map((a) => (
                        <li key={a.id}>
                          <Link href={`/artisans/${a.slug}`} onClick={onClose} className="font-semibold hover:text-primary">
                            {a.name} <span className="font-normal text-muted">· {a.specialty}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {categoryResults.length > 0 && (
                  <div>
                    <p className="eyebrow mb-4">Categories</p>
                    <ul className="flex flex-col gap-2">
                      {categoryResults.map((c) => (
                        <li key={c.slug}>
                          <Link href={`/shop?category=${c.slug}`} onClick={onClose} className="font-semibold hover:text-primary">
                            {c.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
