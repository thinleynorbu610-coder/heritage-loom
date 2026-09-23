"use client";

import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { LinkButton } from "@/components/ui/Button";
import { Price } from "@/components/ui/Misc";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";
import { cn, pluralize } from "@/lib/utils";
import { getAllProducts, getRegionStats, getRegions } from "@/services/catalog";
import type { RegionSlug } from "@/types";

/**
 * Interactive region explorer. The ridge-line graphic places regions on an
 * illustrative west→east axis only — it is deliberately not a map.
 */
export function RegionExplorer() {
  const regions = getRegions();
  const [active, setActive] = useState<RegionSlug>("bumthang");
  const region = regions.find((r) => r.slug === active)!;
  const stats = getRegionStats(active);
  const products = getAllProducts()
    .filter((p) => p.region === active)
    .slice(0, 3);

  return (
    <section className="container-page py-20 sm:py-28" aria-labelledby="regions-title">
      <SectionHeading
        eyebrow="Explore Bhutan by region"
        title={<span id="regions-title">From the valleys of the west to the hills of the east.</span>}
        description="Choose a region to discover the artisans and pieces that come from there."
      />

      {/* Ridge-line selector (tablet & desktop) */}
      <div className="relative mt-12 hidden rounded-2xl border border-border bg-surface bg-weave px-6 pt-8 pb-4 md:block">
        <svg viewBox="0 0 1000 150" className="h-40 w-full" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="ridge" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.16" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 120 L60 95 L110 105 L170 60 L230 85 L290 40 L350 70 L420 30 L480 65 L540 25 L600 55 L660 35 L720 75 L790 45 L850 80 L920 60 L1000 90 L1000 150 L0 150Z"
            fill="url(#ridge)"
          />
          <path
            d="M0 120 L60 95 L110 105 L170 60 L230 85 L290 40 L350 70 L420 30 L480 65 L540 25 L600 55 L660 35 L720 75 L790 45 L850 80 L920 60 L1000 90"
            fill="none"
            stroke="var(--border-strong)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className="absolute inset-x-6 top-8 h-40">
          {regions.map((r) => {
            const on = r.slug === active;
            return (
              <button
                key={r.slug}
                type="button"
                onClick={() => setActive(r.slug)}
                aria-pressed={on}
                className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
                style={{ left: `${r.position.x}%`, top: `${r.position.y}%` }}
              >
                <span
                  className={cn(
                    "relative flex size-4 items-center justify-center rounded-full border-2 transition-all duration-300",
                    on ? "scale-125 border-primary bg-primary" : "border-accent bg-surface group-hover:border-primary",
                  )}
                >
                  {on && <span className="absolute inset-0 animate-ping rounded-full bg-primary/40" />}
                </span>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-sm font-semibold whitespace-nowrap transition-colors",
                    on ? "bg-ink text-background" : "bg-surface/90 text-text group-hover:text-primary",
                  )}
                >
                  {r.name}
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex justify-between text-xs font-semibold tracking-[0.2em] text-subtle uppercase">
          <span>← West</span>
          <span className="tracking-normal normal-case">Illustrative placement, not to scale</span>
          <span>East →</span>
        </div>
      </div>

      {/* Mobile selector */}
      <div className="-mx-4 mt-10 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none md:hidden" role="group" aria-label="Choose a region">
        {regions.map((r) => (
          <button
            key={r.slug}
            type="button"
            onClick={() => setActive(r.slug)}
            aria-pressed={r.slug === active}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors",
              r.slug === active ? "border-ink bg-ink text-background" : "border-border bg-surface",
            )}
          >
            {r.name}
          </button>
        ))}
      </div>

      {/* Region detail */}
      <div key={active} className="mt-6 grid animate-fade-in gap-6 lg:mt-8 lg:grid-cols-[1.1fr_1.4fr]">
        <div className="relative min-h-72 overflow-hidden rounded-2xl bg-ink text-white">
          <SmartImage src={region.image} alt={`Landscape in ${region.name}`} fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
          <div className="relative flex h-full flex-col justify-end p-6 sm:p-8">
            <p className="flex items-center gap-1.5 text-xs font-bold tracking-[0.2em] text-secondary uppercase">
              <MapPin className="size-3.5" aria-hidden /> Dzongkhag
            </p>
            <h3 className="mt-2 font-serif text-5xl font-semibold">{region.name}</h3>
            <p className="mt-2 max-w-sm text-white/80">{region.summary}</p>
            <p className="mt-4 text-sm text-white/70">
              {pluralize(stats.artisans, "artisan")} · {pluralize(stats.products, "piece")} on Heritage Loom
            </p>
          </div>
        </div>

        <div className="flex flex-col rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <p className="text-sm font-semibold text-muted">Made in {region.name}</p>
          {products.length ? (
            <ul className="mt-4 grid flex-1 grid-cols-1 gap-4 sm:grid-cols-3">
              {products.map((p) => (
                <li key={p.id}>
                  <Link href={`/products/${p.slug}`} className="group block">
                    <span className="relative block aspect-square overflow-hidden rounded-lg bg-surface-muted">
                      <SmartImage src={p.images[0].src} alt={p.images[0].alt} fill sizes="(min-width:640px) 18vw, 90vw" className="object-cover transition-transform duration-500 group-hover:scale-105" fallbackLabel={p.name} />
                    </span>
                    <span className="mt-3 block font-serif text-lg leading-tight font-semibold group-hover:text-primary">{p.name}</span>
                    <Price amount={p.price} size="sm" className="mt-1" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 flex-1 text-muted">New artisans from {region.name} are joining soon.</p>
          )}
          <LinkButton href={`/shop?region=${region.slug}`} variant="outline" className="mt-6 self-start">
            Shop all from {region.name} <ArrowRight className="size-4" aria-hidden />
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
