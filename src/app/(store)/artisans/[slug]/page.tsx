import { BadgeCheck, CalendarDays, Hammer, MapPin, MessageCircle, PackageOpen, Star } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product/ProductCard";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Breadcrumbs } from "@/components/ui/Misc";
import { Diamond, MotifDivider } from "@/components/ui/Motif";
import { Reveal } from "@/components/ui/Reveal";
import { SmartImage } from "@/components/ui/SmartImage";
import { formatDate } from "@/lib/utils";
import { getAllArtisans, getArtisanBySlug, getProductsByArtisan, getRegion } from "@/services/catalog";

export function generateStaticParams() {
  return getAllArtisans().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/artisans/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const a = getArtisanBySlug(slug);
  return a ? { title: `${a.name} — ${a.specialty}`, description: a.shortIntro } : { title: "Artisan not found" };
}

export default async function ArtisanProfilePage({ params }: PageProps<"/artisans/[slug]">) {
  const { slug } = await params;
  const artisan = getArtisanBySlug(slug);
  if (!artisan) notFound();
  const region = getRegion(artisan.region)!;
  const products = getProductsByArtisan(artisan.id);
  const first = artisan.name.split(" ")[0];

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <SmartImage src={artisan.cover} alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/95 via-ink/70 to-ink/30" />
        <div className="absolute inset-0 -z-10 bg-motif-light" />
        <div className="container-page py-10 sm:py-14">
          <Breadcrumbs
            className="[&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-white"
            items={[{ label: "Home", href: "/" }, { label: "Artisans", href: "/artisans" }, { label: artisan.name }]}
          />
          <div className="mt-10 grid items-end gap-10 pb-6 md:grid-cols-[minmax(0,320px)_1fr] lg:gap-16">
            <div className="relative aspect-[4/5] w-full max-w-xs overflow-hidden rounded-2xl border-4 border-white/10 bg-white/5 shadow-2xl">
              <SmartImage src={artisan.portrait} alt={`Portrait representing ${artisan.name}`} fill sizes="320px" className="object-cover" fallbackLabel={artisan.name} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {artisan.verified ? (
                  <Badge tone="success" icon={<BadgeCheck className="size-3.5" aria-hidden />}>
                    Verified artisan
                  </Badge>
                ) : (
                  <Badge tone="warning">Verification in progress</Badge>
                )}
                <Badge tone="dark">Since {formatDate(artisan.joined)}</Badge>
              </div>
              <h1 className="mt-5 font-display text-5xl sm:text-7xl">{artisan.name}</h1>
              <p className="mt-3 font-serif text-2xl text-secondary">{artisan.specialty}</p>
              <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-white/85">
                <li className="flex items-center gap-2">
                  <MapPin className="size-4 text-secondary" aria-hidden />
                  {artisan.village ? `${artisan.village}, ` : ""}
                  {region.name}
                </li>
                <li className="flex items-center gap-2">
                  <CalendarDays className="size-4 text-secondary" aria-hidden />
                  {artisan.yearsOfExperience} years of practice
                </li>
                <li className="flex items-center gap-2">
                  <Star className="size-4 text-secondary" aria-hidden />
                  {artisan.rating.toFixed(1)} average rating
                </li>
                <li className="flex items-center gap-2">
                  <PackageOpen className="size-4 text-secondary" aria-hidden />
                  {products.length} {products.length === 1 ? "piece" : "pieces"} available
                </li>
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <LinkButton href="#collection" variant="secondary">
                  Shop {first}&apos;s collection
                </LinkButton>
                <LinkButton href="/contact" variant="light">
                  <MessageCircle className="size-4" aria-hidden /> Ask about a commission
                </LinkButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story & background */}
      <section className="container-page grid gap-12 py-20 sm:py-28 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
        <Reveal>
          <p className="eyebrow">Their story</p>
          <p className="mt-6 font-serif text-3xl leading-snug text-balance sm:text-4xl">{artisan.story}</p>
          <h2 className="mt-12 text-sm font-bold tracking-[0.18em] text-muted uppercase">Background</h2>
          <p className="mt-3 text-lg leading-relaxed text-muted">{artisan.background}</p>
        </Reveal>
        <Reveal delay={100} className="flex flex-col gap-6">
          <div className="rounded-2xl border border-border bg-surface p-7">
            <h2 className="flex items-center gap-2 font-serif text-2xl font-semibold">
              <Hammer className="size-5 text-primary" aria-hidden /> Techniques
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              {artisan.techniques.map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <Diamond className="size-2 shrink-0 text-secondary" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-7">
            <h2 className="font-serif text-2xl font-semibold">Materials</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {artisan.materials.map((m) => (
                <li key={m} className="rounded-full bg-secondary-soft px-3.5 py-1.5 text-sm font-semibold text-accent">
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* Journey timeline */}
      <section className="border-y border-border bg-surface-muted py-20 sm:py-28" aria-labelledby="journey-title">
        <div className="container-page">
          <p className="eyebrow">The craft journey</p>
          <h2 id="journey-title" className="mt-3 font-display text-4xl sm:text-5xl">
            How {first}&apos;s craft grew.
          </h2>
          <ol className="relative mt-14 grid gap-10 md:grid-cols-[repeat(auto-fit,minmax(0,1fr))] md:gap-6">
            <span className="absolute top-3 right-0 left-0 hidden h-px bg-border-strong md:block" aria-hidden />
            <span className="absolute top-0 bottom-0 left-3 w-px bg-border-strong md:hidden" aria-hidden />
            {artisan.journey.map((m, i) => (
              <li key={m.year} className="relative pl-12 md:pl-0">
                <Reveal delay={i * 90}>
                  <span
                    className="absolute top-0 left-0 flex size-6 rotate-45 items-center justify-center border-2 border-primary bg-background md:relative md:mb-6"
                    aria-hidden
                  >
                    <span className="size-2 bg-primary" />
                  </span>
                  <p className="font-display text-4xl text-primary">{m.year}</p>
                  <p className="mt-2 font-semibold">{m.title}</p>
                  <p className="mt-1 text-[0.95rem] leading-relaxed text-muted">{m.description}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Collection */}
      <section id="collection" className="container-page scroll-mt-24 py-20 sm:py-28" aria-labelledby="collection-title">
        <div className="mb-12">
          <p className="eyebrow">Their collection</p>
          <h2 id="collection-title" className="mt-3 font-display text-4xl sm:text-5xl">
            Made by {first}
          </h2>
        </div>
        {products.length ? (
          <ProductGrid products={products} columns={4} />
        ) : (
          <EmptyState
            icon={<PackageOpen className="size-6" aria-hidden />}
            title={`${first} is preparing new pieces`}
            description="Their first listings are being reviewed. Save this page and check back soon."
            action={<LinkButton href="/artisans" variant="outline">Meet other artisans</LinkButton>}
          />
        )}
        <MotifDivider className="mt-20" />
      </section>
    </>
  );
}
