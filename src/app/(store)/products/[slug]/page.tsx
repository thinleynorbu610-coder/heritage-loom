import {
  ArrowRight,
  BadgeCheck,
  Gem,
  Hammer,
  Landmark,
  MapPin,
  PlayCircle,
  ScrollText,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArtisanProfileCard } from "@/components/artisan/ArtisanProfileCard";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductGrid } from "@/components/product/ProductCard";
import { PurchasePanel } from "@/components/product/PurchasePanel";
import { Reviews } from "@/components/product/Reviews";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/ui/Misc";
import { Diamond, MotifDivider } from "@/components/ui/Motif";
import { Reveal } from "@/components/ui/Reveal";
import { SmartImage } from "@/components/ui/SmartImage";
import {
  getAllProducts,
  getArtisanById,
  getCategory,
  getProductBySlug,
  getRegion,
  getRelatedProducts,
  getReviews,
} from "@/services/catalog";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  const artisan = getArtisanById(product.artisanId);
  return { title: product.name, description: `${product.summary} Handmade by ${artisan?.name}.` };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product || product.status !== "active") notFound();
  const artisan = getArtisanById(product.artisanId)!;
  const region = getRegion(product.region)!;
  const category = getCategory(product.category)!;
  const related = getRelatedProducts(product, 4);
  const reviews = getReviews(product.id);

  // The six questions every listing answers — surfaced up front, not hidden in tabs.
  const passport = [
    { icon: UserRound, q: "Who made it?", a: artisan.name, detail: artisan.specialty, href: "#artisan" },
    { icon: MapPin, q: "Where was it made?", a: `${artisan.village ? artisan.village + ", " : ""}${region.name}`, detail: "Bhutan", href: "#origin" },
    { icon: Gem, q: "What is it made of?", a: product.materials.slice(0, 2).join(", "), detail: product.materials.length > 2 ? `+ ${product.materials.slice(2).join(", ")}` : "Natural materials", href: "#materials" },
    { icon: Hammer, q: "How was it made?", a: product.technique.name, detail: product.productionTime ?? "", href: "#technique" },
    { icon: Landmark, q: "Why does it matter?", a: category.name, detail: "Cultural significance", href: "#significance" },
    { icon: ScrollText, q: "What is its story?", a: "Read the story", detail: "From the maker", href: "#story" },
  ];

  return (
    <div className="pb-24 lg:pb-0">
      <div className="container-page pt-6 sm:pt-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
            { label: category.name, href: `/shop?category=${category.slug}` },
            { label: product.name },
          ]}
        />
      </div>

      <section className="container-page grid gap-10 pt-6 pb-16 lg:grid-cols-[1.15fr_1fr] lg:gap-16 xl:gap-20">
        <ProductGallery images={product.images} name={product.name} />
        <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
          <PurchasePanel product={product} artisan={artisan} region={region} category={category} />
        </div>
      </section>

      {/* Cultural passport */}
      <section aria-labelledby="passport-title" className="border-y border-border bg-surface bg-weave">
        <div className="container-page py-14 sm:py-16">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Cultural passport</p>
              <h2 id="passport-title" className="mt-3 font-display text-4xl sm:text-5xl">
                Know your piece.
              </h2>
            </div>
            <p className="max-w-md text-muted">Six things every Heritage Loom listing tells you — tap any to read more.</p>
          </div>
          <ul className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {passport.map(({ icon: Icon, q, a, detail, href }) => (
              <li key={q} className="bg-background">
                <a href={href} className="group flex h-full items-start gap-4 p-6 transition-colors hover:bg-surface">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-muted">{q}</span>
                    <span className="mt-1 block font-serif text-2xl leading-tight font-semibold group-hover:text-primary">{a}</span>
                    {detail && <span className="mt-0.5 block text-sm text-muted">{detail}</span>}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Story */}
      <section id="story" className="container-page scroll-mt-28 py-20 sm:py-28" aria-labelledby="story-title">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="eyebrow">Product story</p>
            <h2 id="story-title" className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl">
              The Story Behind the Craft
            </h2>
            <p className="mt-8 font-serif text-2xl leading-snug text-text first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-7xl first-letter:leading-[0.8] first-letter:text-primary">
              {product.story}
            </p>
            <p className="mt-6 flex items-center gap-2 text-sm text-muted">
              <Diamond className="text-secondary" /> As told by {artisan.name}, {region.name}
            </p>
          </Reveal>
          <Reveal delay={120} className="relative aspect-[4/5] overflow-hidden rounded-xl bg-accent-soft lg:aspect-[5/6]">
            <SmartImage src={product.images[2]?.src ?? product.images[0].src} alt={product.images[2]?.alt ?? product.images[0].alt} fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" fallbackLabel={product.name} />
          </Reveal>
        </div>
      </section>

      {/* Materials + technique */}
      <section className="container-page pb-20 sm:pb-28">
        <MotifDivider className="mb-16" />
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div id="materials" className="scroll-mt-28">
              <p className="eyebrow">Materials</p>
              <h2 className="mt-3 font-display text-4xl">What it&apos;s made of</h2>
              <ul className="mt-8 flex flex-wrap gap-3">
                {product.materials.map((m) => (
                  <li key={m} className="flex items-center gap-2 rounded-full border border-border-strong bg-surface px-5 py-2.5 font-semibold">
                    <Diamond className="size-2 text-secondary" /> {m}
                  </li>
                ))}
              </ul>
              <dl className="mt-10 grid grid-cols-1 gap-6 border-t border-border pt-8 sm:grid-cols-3">
                {product.dimensions && (
                  <div>
                    <dt className="text-sm text-muted">Dimensions</dt>
                    <dd className="mt-1 font-semibold">{product.dimensions}</dd>
                  </div>
                )}
                {product.productionTime && (
                  <div>
                    <dt className="text-sm text-muted">Time to make</dt>
                    <dd className="mt-1 font-semibold">{product.productionTime}</dd>
                  </div>
                )}
                {product.care && (
                  <div>
                    <dt className="text-sm text-muted">Care</dt>
                    <dd className="mt-1 font-semibold">{product.care}</dd>
                  </div>
                )}
              </dl>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div id="technique" className="scroll-mt-28 rounded-2xl border border-border bg-surface p-7 sm:p-10">
              <p className="eyebrow">Traditional technique</p>
              <h2 className="mt-3 font-display text-4xl">{product.technique.name}</h2>
              <p className="mt-5 text-lg leading-relaxed text-muted">{product.technique.description}</p>
              <p className="mt-6 text-sm text-muted">
                Learn more about {artisan.name.split(" ")[0]}&apos;s techniques on{" "}
                <Link href={`/artisans/${artisan.slug}`} className="font-semibold text-primary hover:underline">
                  their profile
                </Link>
                .
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Significance */}
      <section id="significance" className="relative scroll-mt-20 overflow-hidden bg-ink py-20 text-background sm:py-28">
        <div className="absolute inset-0 bg-motif-light" aria-hidden />
        <Reveal className="container-page relative max-w-4xl text-center">
          <p className="eyebrow text-secondary">Cultural significance</p>
          <blockquote className="mt-6 font-display text-3xl leading-tight text-balance sm:text-5xl">
            “{product.culturalSignificance}”
          </blockquote>
          <MotifDivider tone="light" className="mx-auto mt-10 max-w-sm" />
        </Reveal>
      </section>

      {/* Origin + Artisan */}
      <section className="container-page grid gap-6 py-20 sm:py-28 lg:grid-cols-[1fr_2fr]">
        <Reveal className="h-full">
          <div id="origin" className="relative flex h-full min-h-96 scroll-mt-28 flex-col overflow-hidden rounded-2xl bg-ink text-white">
            <SmartImage src={region.image} alt={`Landscape in ${region.name}`} fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-ink/10" />
            <div className="relative mt-auto p-7">
              <p className="flex items-center gap-1.5 eyebrow text-secondary">
                <MapPin className="size-3.5" aria-hidden /> Origin
              </p>
              <h2 className="mt-2 font-display text-5xl">{region.name}</h2>
              {artisan.village && <p className="mt-1 text-white/70">{artisan.village} village</p>}
              <p className="mt-3 text-white/80">{region.summary}</p>
              <Link href={`/shop?region=${region.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-secondary hover:underline">
                More from {region.name} <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </Reveal>
        <Reveal delay={100} className="h-full">
          <div id="artisan" className="h-full scroll-mt-28">
            <ArtisanProfileCard artisan={artisan} />
          </div>
        </Reveal>
      </section>

      {/* Future-ready (Phase 3) */}
      <section className="container-page pb-20" aria-label="Coming soon">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-start gap-4 rounded-xl border border-dashed border-border-strong p-6">
            <PlayCircle className="size-8 shrink-0 text-accent" aria-hidden />
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">Craft film</p>
                <Badge tone="gold">Coming soon</Badge>
              </div>
              <p className="mt-1 text-sm text-muted">A short film from {artisan.name.split(" ")[0]}&apos;s workshop, showing this piece being made.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-xl border border-dashed border-border-strong p-6">
            <ShieldCheck className="size-8 shrink-0 text-accent" aria-hidden />
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">Provenance badge</p>
                <Badge tone="gold">Coming soon</Badge>
              </div>
              <p className="mt-1 text-sm text-muted">
                A verifiable record of origin and maker. Today, all artisans are{" "}
                <span className="inline-flex items-center gap-1 font-semibold text-success">
                  <BadgeCheck className="size-3.5" aria-hidden />
                  reviewed
                </span>{" "}
                before selling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="scroll-mt-24 border-t border-border bg-surface py-20 sm:py-24" aria-labelledby="reviews-title">
        <div className="container-page">
          <p className="eyebrow">Reviews</p>
          <h2 id="reviews-title" className="mt-3 mb-12 font-display text-4xl sm:text-5xl">
            What customers say
          </h2>
          <Reviews productId={product.id} productName={product.name} initial={reviews} rating={product.rating} reviewCount={product.reviewCount} />
        </div>
      </section>

      {/* Related */}
      <section className="container-page py-20 sm:py-28" aria-labelledby="related-title">
        <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">You may also like</p>
            <h2 id="related-title" className="mt-3 font-display text-4xl sm:text-5xl">
              Related pieces
            </h2>
          </div>
          <LinkButton href={`/shop?category=${category.slug}`} variant="outline">
            More {category.name} <ArrowRight className="size-4" aria-hidden />
          </LinkButton>
        </div>
        <ProductGrid products={related} columns={4} />
      </section>
    </div>
  );
}
