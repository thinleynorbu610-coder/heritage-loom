import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import { media } from "@/data/media";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-white" aria-labelledby="hero-title">
      <SmartImage
        src={media.heroValley}
        alt="A traditional dzong beside a river in a green Bhutanese valley"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />
      {/* Readability gradients + subtle woven texture — Elomus-style blue wash */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/92 via-primary/65 to-primary/20" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
      <div className="absolute inset-0 -z-10 bg-motif-light opacity-70" />

      <div className="container-page flex min-h-[calc(100svh-var(--header-h)-2.25rem)] flex-col justify-end pt-24 pb-10 sm:min-h-[640px] lg:min-h-[min(820px,calc(100svh-var(--header-h)-2.25rem))] lg:pb-14">
        <div className="max-w-2xl">
          <p className="eyebrow animate-fade-up text-white/85">Handmade in Bhutan · Sold by its makers</p>
          <h1
            id="hero-title"
            className="mt-6 animate-fade-up font-display text-[3.2rem] text-balance [animation-delay:80ms] sm:text-7xl lg:text-[5.5rem]"
          >
            Discover the Craft.
            <br />
            <em className="font-medium text-[#ffc94d] not-italic sm:italic">Carry the Story.</em>
          </h1>
          <p className="mt-6 max-w-lg animate-fade-up text-lg leading-relaxed text-white/80 [animation-delay:160ms] sm:text-xl">
            Explore authentic Bhutanese craftsmanship, made by local artisans and brought closer to you.
          </p>
          <div className="mt-9 flex animate-fade-up flex-col gap-3 [animation-delay:240ms] sm:flex-row">
            <LinkButton href="/shop" size="lg" variant="light" className="sm:min-w-52">
              Explore Collection
              <ArrowRight className="size-4" aria-hidden />
            </LinkButton>
            <LinkButton
              href="/artisans"
              size="lg"
              variant="ghost"
              className="text-white hover:bg-white/10 sm:min-w-52"
            >
              Meet the Artisans
            </LinkButton>
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
    </section>
  );
}
