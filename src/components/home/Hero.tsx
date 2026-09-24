"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { LinkButton } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import { media } from "@/data/media";
import { cn } from "@/lib/utils";

interface Slide {
  eyebrow: string;
  title: React.ReactNode;
  copy: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
}

const slides: Slide[] = [
  {
    eyebrow: "Handmade in Bhutan · Sold by its makers",
    title: (
      <>
        Discover the Craft.
        <br />
        <em className="font-medium text-secondary not-italic sm:italic">Carry the Story.</em>
      </>
    ),
    copy: "Explore authentic Bhutanese craftsmanship, made by local artisans and brought closer to you.",
    primaryHref: "/shop",
    primaryLabel: "Explore Collection",
    secondaryHref: "/artisans",
    secondaryLabel: "Meet the Artisans",
  },
  {
    eyebrow: "New this season · Bumthang highlands",
    title: (
      <>
        Threads Spun by Hand.
        <br />
        <em className="font-medium text-secondary not-italic sm:italic">Woven with Patience.</em>
      </>
    ),
    copy: "Every yathra scarf takes days on the loom — narrow strips of hand-spun wool, banded together the traditional way.",
    primaryHref: "/shop?category=handwoven-textiles",
    primaryLabel: "Shop Textiles",
    secondaryHref: "/products/handwoven-yathra-scarf",
    secondaryLabel: "See This Story",
  },
  {
    eyebrow: "Where every piece begins",
    title: (
      <>
        Carved, Painted, Cast —
        <br />
        <em className="font-medium text-secondary not-italic sm:italic">Made to Last.</em>
      </>
    ),
    copy: "From Punakha's dzongs to Thimphu's workshops, thirteen traditional arts live on in the hands that still practise them.",
    primaryHref: "/categories",
    primaryLabel: "Browse Categories",
    secondaryHref: "/our-story",
    secondaryLabel: "Our Story",
  },
];

const AUTOPLAY_MS = 6500;

export function Hero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((i: number) => setActive(((i % slides.length) + slides.length) % slides.length), []);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => setActive((a) => (a + 1) % slides.length), AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused]);

  const slide = slides[active];

  return (
    <section
      className="relative isolate overflow-hidden bg-ink text-white"
      aria-roledescription="carousel"
      aria-label="Featured stories"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Studio backdrop photo, with texture + gradient for text contrast */}
      <SmartImage src={media.heroBackdrop} alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/50 to-ink/20" />
      <div className="absolute inset-0 -z-10 bg-motif-light opacity-70" />

      {/* Foreground cutout — real customers in handwoven gho */}
      <div
        className={cn(
          "pointer-events-none absolute left-1/2 top-0 z-0 aspect-[3/4] w-[42%] max-w-[190px] -translate-x-1/2",
          "sm:left-3 sm:top-2 sm:max-w-[230px] sm:translate-x-0",
          "md:left-4 md:top-3 md:max-w-[300px]",
          "lg:top-4 lg:max-w-[370px]",
          "xl:left-6 xl:max-w-[460px]",
          "2xl:left-12 2xl:max-w-[500px]",
        )}
      >
        <SmartImage
          src={media.ghoTwins}
          alt="Two friends standing back to back, wearing patterned handwoven gho robes"
          fill
          sizes="(min-width: 1536px) 500px, (min-width: 1280px) 460px, (min-width: 1024px) 370px, (min-width: 768px) 300px, (min-width: 640px) 230px, 130px"
          className="object-contain object-bottom drop-shadow-[0_25px_35px_rgba(0,0,0,0.45)]"
        />
      </div>

      <div className="container-page flex min-h-[calc(100svh-var(--header-h)-2.25rem)] flex-col justify-end pt-24 pb-10 sm:min-h-[640px] lg:min-h-[min(820px,calc(100svh-var(--header-h)-2.25rem))] lg:pb-14">
        <div key={active} className="max-w-2xl pt-44 sm:ml-[270px] sm:pt-0 md:ml-[340px] lg:ml-[410px] xl:ml-[510px] 2xl:ml-[580px]">
          <p className="eyebrow animate-fade-up text-secondary">{slide.eyebrow}</p>
          <h1 className="mt-6 animate-fade-up font-display text-[3.2rem] text-balance [animation-delay:80ms] sm:text-7xl lg:text-[5.5rem]">
            {slide.title}
          </h1>
          <p className="mt-6 max-w-lg animate-fade-up text-lg leading-relaxed text-white/80 [animation-delay:160ms] sm:text-xl">
            {slide.copy}
          </p>
          <div className="mt-9 flex animate-fade-up flex-col gap-3 [animation-delay:240ms] sm:flex-row">
            <LinkButton href={slide.primaryHref} size="lg" className="sm:min-w-52">
              {slide.primaryLabel}
              <ArrowRight className="size-4" aria-hidden />
            </LinkButton>
            <LinkButton href={slide.secondaryHref} size="lg" variant="light" className="sm:min-w-52">
              {slide.secondaryLabel}
            </LinkButton>
          </div>

          <div className="mt-8 flex animate-fade-up items-center gap-2 [animation-delay:280ms]">
            {slides.map((s, i) => (
              <button
                key={s.eyebrow}
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === active}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === active ? "w-7 bg-secondary" : "w-1.5 bg-white/35 hover:bg-white/60",
                )}
              />
            ))}
          </div>
        </div>

        <div className="mt-16 flex animate-fade-up flex-col gap-6 border-t border-white/15 pt-6 [animation-delay:320ms] sm:flex-row sm:items-end sm:justify-between">
          <dl className="grid grid-cols-3 gap-6 sm:flex sm:gap-12">
            {[
              ["8", "Verified artisans"],
              ["7", "Regions represented"],
              ["13", "Traditional arts"],
            ].map(([n, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd>
                  <span className="block font-serif text-4xl leading-none text-white">{n}</span>
                  <span className="mt-1 block text-xs tracking-wide text-white/65">{label}</span>
                </dd>
              </div>
            ))}
          </dl>
          <Link
            href="/products/handwoven-yathra-scarf"
            className="group hidden items-center gap-3 rounded-lg border border-white/15 bg-white/5 p-2 pr-5 backdrop-blur-md transition-colors hover:bg-white/10 md:flex"
          >
            <span className="relative size-14 overflow-hidden rounded-md bg-white/10">
              <SmartImage src={media.loomColour} alt="" fill sizes="56px" className="object-cover" />
            </span>
            <span className="text-sm">
              <span className="block text-xs text-secondary">Now on the loom</span>
              <span className="block font-semibold">Yathra Scarf · Dechen Lhamo, Bumthang</span>
            </span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </div>
      </div>

      {/* Carousel controls */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 hidden -translate-y-1/2 justify-between px-3 sm:flex lg:px-6">
        <button
          type="button"
          onClick={() => go(active - 1)}
          className="pointer-events-auto flex size-11 items-center justify-center rounded-full border border-white/20 bg-ink/30 text-white backdrop-blur-md transition-colors hover:bg-ink/60"
          aria-label="Previous slide"
        >
          <ChevronLeft className="size-5" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => go(active + 1)}
          className="pointer-events-auto flex size-11 items-center justify-center rounded-full border border-white/20 bg-ink/30 text-white backdrop-blur-md transition-colors hover:bg-ink/60"
          aria-label="Next slide"
        >
          <ChevronRight className="size-5" aria-hidden />
        </button>
      </div>
    </section>
  );
}
