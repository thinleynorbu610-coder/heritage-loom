import { ArrowRight, BadgeCheck, BookOpen, HandCoins, Laptop } from "lucide-react";
import type { Metadata } from "next";
import { LinkButton } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/ui/Misc";
import { MotifDivider } from "@/components/ui/Motif";
import { Reveal } from "@/components/ui/Reveal";
import { SmartImage } from "@/components/ui/SmartImage";
import { media } from "@/data/media";

export const metadata: Metadata = {
  title: "Our Story",
  description: "Why Heritage Loom exists: connecting Bhutanese artisans with customers through culture and commerce.",
};

const principles = [
  { icon: BadgeCheck, title: "Makers first", text: "Artisans are named on every product, set their own prices and tell their own stories." },
  { icon: BookOpen, title: "Stories travel with objects", text: "Materials, technique, origin and meaning are part of every listing — never an afterthought." },
  { icon: Laptop, title: "Simple for everyone", text: "Clear words, large buttons and a short checkout, designed for all levels of digital experience." },
  { icon: HandCoins, title: "Fair and transparent", text: "Customers see exactly who they are buying from and what they are paying for." },
];

const roadmap = [
  { phase: "Phase 1 · MVP", items: ["Product catalogue, search & filters", "Artisan profiles & dashboards", "Cart, checkout & order tracking", "Admin approval of artisans & products"] },
  { phase: "Phase 2", items: ["Reviews & wishlists", "Notifications", "Cooperative storefronts", "Advanced delivery tracking"] },
  { phase: "Phase 3", items: ["Made-to-order commissions", "Craft videos from workshops", "Authenticity & provenance badges"] },
];

export default function OurStoryPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <SmartImage src={media.dzongBalconies} alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/70 to-ink/40" />
        <div className="container-page py-12 sm:py-16">
          <Breadcrumbs className="[&_a]:text-white/70 [&_span]:text-white" items={[{ label: "Home", href: "/" }, { label: "Our Story" }]} />
          <div className="max-w-3xl py-16 sm:py-24">
            <p className="eyebrow text-secondary">About Heritage Loom</p>
            <h1 className="mt-5 font-display text-5xl text-balance sm:text-7xl">
              A marketplace built around people, craftsmanship and culture.
            </h1>
          </div>
        </div>
      </section>

      <section className="container-page grid gap-12 py-20 sm:py-28 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <p className="eyebrow">Why we exist</p>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl">Beautiful work deserves to be found.</h2>
        </Reveal>
        <Reveal delay={100} className="flex flex-col gap-5 text-lg leading-relaxed text-muted">
          <p>
            Across Bhutan, artisans create extraordinary textiles, paintings, woodwork and jewellery. Yet many sell only
            through word of mouth, local shops or occasional fairs — and the stories behind their work are often lost
            along the way.
          </p>
          <p>
            Heritage Loom is a student project that imagines a better path: a modern Bhutanese marketplace where
            customers can discover authentic pieces easily, buy them securely, and understand who made them, where, and
            why they matter.
          </p>
          <p>
            We believe digital commerce and cultural preservation can support each other. Every sale can also be a
            small act of recording and celebrating a tradition.
          </p>
        </Reveal>
      </section>

      <section className="border-y border-border bg-surface py-20 sm:py-28">
        <div className="container-page">
          <p className="eyebrow">Our principles</p>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map(({ icon: Icon, title, text }, i) => (
              <li key={title}>
                <Reveal delay={i * 80} className="h-full rounded-2xl border border-border bg-background p-7">
                  <Icon className="size-7 text-primary" aria-hidden />
                  <h3 className="mt-5 font-serif text-2xl font-semibold">{title}</h3>
                  <p className="mt-2 text-muted">{text}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-page py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow">Roadmap</p>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl">Growing in phases.</h2>
            <p className="mt-4 text-lg text-muted">
              This frontend shows the full experience. Features are delivered in phases as the Go API, PostgreSQL
              database and payment integration come online.
            </p>
          </Reveal>
          <ol className="flex flex-col gap-4">
            {roadmap.map((r, i) => (
              <li key={r.phase}>
                <Reveal delay={i * 80} className="rounded-2xl border border-border bg-surface p-7">
                  <p className="font-serif text-2xl font-semibold">{r.phase}</p>
                  <ul className="mt-4 grid gap-2 text-muted sm:grid-cols-2">
                    {r.items.map((it) => (
                      <li key={it} className="flex items-start gap-2">
                        <span className="mt-2 size-1.5 shrink-0 rotate-45 bg-secondary" aria-hidden />
                        {it}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
        <MotifDivider className="my-20" />
        <div className="flex flex-col items-center text-center">
          <h2 className="max-w-2xl font-display text-4xl text-balance sm:text-5xl">Discover the craft. Carry the story.</h2>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <LinkButton href="/shop" size="lg">
              Explore Collection <ArrowRight className="size-4" aria-hidden />
            </LinkButton>
            <LinkButton href="/artisans" size="lg" variant="outline">
              Meet the Artisans
            </LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
