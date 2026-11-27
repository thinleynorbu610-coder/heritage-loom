"use client";

import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { LinkButton } from "@/components/ui/Button";
import { Price } from "@/components/ui/Misc";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";
import { cn, pluralize } from "@/lib/utils";
import { getAllProducts, getRegionStats, getRegions } from "@/services/catalog";
import type { RegionSlug } from "@/types";

/** Keyless Google Maps embed — swap for the Maps Embed API (with a key) if you need quotas/analytics. */
const googleMapSrc = (query: string, zoom: number) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=${zoom}&hl=en&output=embed`;

/** Kira-inspired warp stripe — brand colours only. */
const stripe =
  "repeating-linear-gradient(90deg, var(--primary) 0 14px, var(--secondary) 14px 20px, var(--ink) 20px 24px, var(--accent) 24px 34px, var(--secondary) 34px 38px)";

/**
 * Region explorer as a set of woven panels — one per dzongkhag, ordered west→east
 * along the Lateral Road. The chosen panel opens wide like cloth unrolling from the
 * loom; the others fold into narrow strips. Order is illustrative, not a map.
 */
export function RegionExplorer() {
  const regions = getRegions();
  const [active, setActive] = useState<RegionSlug>("bumthang");
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const [mapView, setMapView] = useState<"region" | "country">("region");
  const selectRegion = (slug: RegionSlug) => {
    setActive(slug);
    setMapView("region");
  };
  const region = regions.find((r) => r.slug === active)!;
  const mapSrc =
    mapView === "region"
      ? googleMapSrc(`${region.landmark}, ${region.name}, Bhutan`, 14)
      : googleMapSrc("Bhutan", 7);
  const stats = getRegionStats(active);
  const products = getAllProducts()
    .filter((p) => p.region === active)
    .slice(0, 3);

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const delta = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!delta) return;
    e.preventDefault();
    const next = (i + delta + regions.length) % regions.length;
    selectRegion(regions[next].slug);
    buttons.current[next]?.focus();
  };

  return (
    <section className="container-page py-20 sm:py-28" aria-labelledby="regions-title">
      <SectionHeading
        eyebrow="Explore Bhutan by region"
        title={<span id="regions-title">From the valleys of the west to the hills of the east.</span>}
        description="Travel from Paro in the west to Trashigang in the east across seven dzongkhags. Choose a region to discover the artisans and pieces that come from there."
      />

      {/* West → East caption */}
      <div className="mt-12 flex items-center gap-4 text-xs font-semibold tracking-[0.2em] text-subtle uppercase">
        <span>West</span>
        <span className="h-px flex-1 bg-gradient-to-r from-border-strong via-secondary/60 to-border-strong" aria-hidden />
        <span className="hidden tracking-normal normal-case sm:inline">Paro to Trashigang</span>
        <span className="hidden h-px flex-1 bg-gradient-to-r from-border-strong via-secondary/60 to-border-strong sm:block" aria-hidden />
        <span>East</span>
      </div>

      {/* Woven panels */}
      <div
        className="mt-5 flex h-[44rem] flex-col gap-2 md:h-[30rem] md:flex-row"
        role="group"
        aria-label="Choose a region"
      >
        {regions.map((r, i) => {
          const on = r.slug === active;
          const rStats = on ? stats : null;
          return (
            <div
              key={r.slug}
              className={cn(
                "group relative min-h-14 min-w-0 overflow-hidden rounded-xl bg-ink text-white transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:min-w-14",
                on ? "flex-[6] md:flex-[5]" : "flex-1",
              )}
            >
              <SmartImage
                src={r.image}
                alt=""
                fill
                sizes="(min-width: 768px) 60vw, 100vw"
                className={cn(
                  "object-cover transition-[transform,filter] duration-[1200ms] ease-out",
                  on ? "scale-100 saturate-100" : "scale-110 saturate-[0.6] group-hover:saturate-100",
                )}
                fallbackLabel={r.name}
              />
              <div
                className={cn(
                  "absolute inset-0 transition-colors duration-700",
                  on ? "bg-gradient-to-t from-ink/90 via-ink/25 to-transparent" : "bg-ink/60 group-hover:bg-ink/45",
                )}
              />

              {/* Warp stripe */}
              <span
                aria-hidden
                className={cn("absolute inset-x-0 top-0 transition-[height] duration-500", on ? "h-2" : "h-1")}
                style={{ backgroundImage: stripe }}
              />

              <button
                ref={(el) => {
                  buttons.current[i] = el;
                }}
                type="button"
                onClick={() => selectRegion(r.slug)}
                onKeyDown={(e) => onKeyDown(e, i)}
                aria-pressed={on}
                aria-label={`${r.name}, stop ${i + 1} of ${regions.length}`}
                tabIndex={on ? 0 : -1}
                className="absolute inset-0 z-10 rounded-xl focus-visible:outline-offset-[-4px] focus-visible:outline-secondary"
              />

              {/* Folded strip label */}
              <div
                aria-hidden
                className={cn(
                  "pointer-events-none absolute inset-0 flex items-center justify-between gap-3 px-5 transition-opacity duration-300 md:flex-col md:justify-between md:px-0 md:py-6",
                  on ? "opacity-0" : "opacity-100 delay-200",
                )}
              >
                <span className="font-serif text-lg text-secondary tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-sm font-semibold tracking-[0.18em] whitespace-nowrap uppercase md:rotate-180 md:[writing-mode:vertical-rl]">
                  {r.name}
                </span>
              </div>

              {/* Open panel content */}
              <div
                className={cn(
                  "pointer-events-none absolute inset-x-0 bottom-0 p-6 transition-all duration-500 sm:p-8",
                  on ? "translate-y-0 opacity-100 delay-300" : "translate-y-4 opacity-0",
                )}
                aria-hidden={!on}
              >
                <p className="flex items-center gap-1.5 text-xs font-bold tracking-[0.2em] text-secondary uppercase">
                  <MapPin className="size-3.5" aria-hidden /> Stop {String(i + 1).padStart(2, "0")} · Dzongkhag
                </p>
                <h3 className="mt-2 font-serif text-4xl font-semibold sm:text-5xl lg:text-6xl">{r.name}</h3>
                <p className="mt-2 max-w-md text-white/80">{r.summary}</p>
                {rStats && (
                  <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-white/75">
                    <span>
                      <strong className="text-lg font-semibold text-white tabular-nums">{rStats.artisans}</strong>{" "}
                      {rStats.artisans === 1 ? "artisan" : "artisans"}
                    </span>
                    <span>
                      <strong className="text-lg font-semibold text-white tabular-nums">{rStats.products}</strong>{" "}
                      {rStats.products === 1 ? "piece" : "pieces"}
                    </span>
                  </p>
                )}
              </div>

              {/* Photo credit (required by CC BY / CC BY-SA licences) */}
              {on && (
                <a
                  href={r.imageCredit.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-4 right-4 z-20 rounded-full bg-ink/45 px-2.5 py-1 text-[0.65rem] text-white/80 backdrop-blur-sm transition-colors hover:bg-ink/70 hover:text-white"
                >
                  Photo: {r.imageCredit.author} · {r.imageCredit.license}
                </a>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.35fr]">
        {/* Accurate map */}
        <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="eyebrow">Where it is</p>
              <p className="mt-2 text-sm text-muted">
                {mapView === "region" ? `${region.landmark}, ${region.name}` : "All of Bhutan"}
              </p>
            </div>
            <div className="flex rounded-full border border-border bg-background p-1 text-xs font-semibold" role="group" aria-label="Map view">
              {(["region", "country"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setMapView(v)}
                  aria-pressed={mapView === v}
                  className={cn(
                    "rounded-full px-3 py-1.5 transition-colors",
                    mapView === v ? "bg-ink text-background" : "text-muted hover:text-text",
                  )}
                >
                  {v === "region" ? region.name : "Bhutan"}
                </button>
              ))}
            </div>
          </div>

          <div className="relative mt-4 h-80 overflow-hidden rounded-xl border border-border bg-surface-muted bg-weave sm:h-96 lg:h-[26rem]">
            <iframe
              key={mapSrc}
              src={mapSrc}
              title={mapView === "region" ? `Google Map of ${region.landmark}, ${region.name}` : "Google Map of Bhutan"}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 size-full animate-fade-in border-0"
            />
          </div>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${region.landmark}, ${region.name}, Bhutan`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover"
          >
            Open {region.landmark} in Google Maps <ArrowUpRight className="size-4" aria-hidden />
          </a>
        </div>

        {/* Made in the selected region */}
        <div key={active} className="flex animate-fade-in flex-col rounded-2xl border border-border bg-surface p-5 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Made in {region.name}</p>
              <p className="mt-3 font-serif text-3xl leading-tight font-semibold">Pieces carried from {region.name}.</p>
              <p className="mt-2 text-muted">
                {pluralize(stats.artisans, "artisan")} · {pluralize(stats.products, "piece")} on Heritage Loom
              </p>
            </div>
            <LinkButton href={`/shop?region=${region.slug}`} variant="outline" className="shrink-0 self-start sm:self-auto">
              Shop all from {region.name} <ArrowRight className="size-4" aria-hidden />
            </LinkButton>
          </div>

          <div className="mt-6 flex-1">
        {products.length ? (
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {products.map((p) => (
              <li key={p.id}>
                <Link href={`/products/${p.slug}`} className="group block">
                  <span className="relative block aspect-square overflow-hidden rounded-lg bg-surface-muted">
                    <SmartImage
                      src={p.images[0].src}
                      alt={p.images[0].alt}
                      fill
                      sizes="(min-width:1024px) 20vw, (min-width:640px) 30vw, 90vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      fallbackLabel={p.name}
                    />
                  </span>
                  <span className="mt-3 block font-serif text-lg leading-tight font-semibold group-hover:text-primary">
                    {p.name}
                  </span>
                  <Price amount={p.price} size="sm" className="mt-1" />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="flex h-full min-h-40 items-center justify-center rounded-lg border border-dashed border-border-strong bg-background bg-weave p-6 text-center text-muted">
            New artisans from {region.name} are joining soon.
          </p>
        )}
          </div>
        </div>
      </div>
    </section>
  );
}
