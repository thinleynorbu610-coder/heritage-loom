import {
  ArrowRight,
  BadgeCheck,
  Gem,
  Hammer,
  HeartHandshake,
  Landmark,
  Lock,
  MapPin,
  ScrollText,
  Sparkles,
  Store,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { ArtisanCard } from "@/components/artisan/ArtisanCard";
import { CategoryCard } from "@/components/product/CategoryCard";
import { ProductGrid } from "@/components/product/ProductCard";
import { LinkButton } from "@/components/ui/Button";
import { Diamond, MotifDivider } from "@/components/ui/Motif";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";
import { media } from "@/data/media";
import {
  getAllArtisans,
  getAllProducts,
  getCategories,
  getFeaturedProducts,
} from "@/services/catalog";
import { Carousel } from "./Carousel";

export function FeaturedCategories() {
  const categories = getCategories();
  const all = getAllProducts();
  return (
    <section className="container-page py-20 sm:py-28" aria-labelledby="categories-title">
      <Reveal>
        <SectionHeading
          eyebrow="Featured categories"
          title={<span id="categories-title">Crafted in Bhutan.</span>}
          description="Six living traditions, each shaped by generations of makers. Choose a craft to begin exploring."
          action={
            <LinkButton href="/categories" variant="outline">
              All categories <ArrowRight className="size-4" aria-hidden />
            </LinkButton>
          }
        />
      </Reveal>
      {/* Mobile: swipeable row. Tablet/Desktop: editorial grid. */}
      <div className="-mx-4 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 scrollbar-none sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-3">
        {categories.map((c, i) => (
          <Reveal key={c.slug} delay={(i % 3) * 80} className="w-[78%] shrink-0 snap-start sm:w-auto">
            <CategoryCard category={c} count={all.filter((p) => p.category === c.slug).length} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function FeaturedProducts() {
  const products = getFeaturedProducts(6);
  return (
    <section className="border-y border-border bg-surface py-20 sm:py-28" aria-labelledby="featured-title">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Featured pieces"
            title={<span id="featured-title">Stories woven into every piece.</span>}
            description="Each piece is listed with its maker, its origin and the tradition behind it."
            action={
              <LinkButton href="/shop" variant="outline">
                Shop all products <ArrowRight className="size-4" aria-hidden />
              </LinkButton>
            }
          />
        </Reveal>
        <Reveal className="mt-12">
          <ProductGrid products={products} />
        </Reveal>
      </div>
    </section>
  );
}

const storyPoints = [
  { icon: Gem, title: "Materials", text: "Sheep wool, hand-spun and coloured with natural dyes." },
  { icon: Hammer, title: "Crafting technique", text: "Yathra weaving — narrow strips on a floor loom, band by band." },
  { icon: MapPin, title: "Place of origin", text: "Chumey, in the highland valleys of Bumthang." },
  { icon: UserRound, title: "Artisan story", text: "Dechen Lhamo, from a family that has woven yathra for generations." },
  { icon: Landmark, title: "Cultural meaning", text: "A cloth that has warmed highland families for generations." },
];

export function StoryBehindCraft() {
  return (
    <section className="container-page py-20 sm:py-28" aria-labelledby="story-title">
      <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-accent-soft sm:w-[82%]">
            <SmartImage
              src={media.loomWoman}
              alt="A weaver working at a traditional loom"
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
          <div className="absolute right-0 -bottom-8 hidden aspect-square w-[46%] overflow-hidden rounded-xl border-8 border-background bg-surface-muted shadow-lift sm:block">
            <SmartImage src={media.yarnDetail} alt="Close-up of hand-spun yarn" fill sizes="25vw" className="object-cover" />
          </div>
          <div className="absolute top-6 -left-3 rounded-lg bg-surface px-4 py-3 shadow-lift sm:-left-6">
            <p className="text-xs text-muted">Time on the loom</p>
            <p className="font-serif text-2xl font-semibold">≈ 4 days</p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <p className="eyebrow">The story behind the craft</p>
          <h2 id="story-title" className="mt-4 font-display text-4xl text-balance sm:text-5xl lg:text-6xl">
            More Than a Product. <span className="text-primary">A Piece of Bhutan.</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Heritage Loom connects commerce with cultural storytelling. Before you see a price, you meet the person who
            made the piece, the valley it comes from and the tradition that shaped it.
          </p>

          <ol className="mt-10 flex flex-col divide-y divide-border border-y border-border">
            {storyPoints.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-start gap-4 py-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                  <Icon className="size-[1.1rem]" aria-hidden />
                </span>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="text-[0.95rem] text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ol>
          <LinkButton href="/products/handwoven-yathra-scarf" variant="dark" className="mt-8">
            See this story in full <ArrowRight className="size-4" aria-hidden />
          </LinkButton>
        </Reveal>
      </div>
    </section>
  );
}

export function ArtisanSpotlight() {
  const artisans = getAllArtisans().filter((a) => a.verified);
  return (
    <section className="overflow-hidden bg-surface-muted py-20 sm:py-28" aria-labelledby="makers-title">
      <div className="container-page">
        <Carousel
          label="Featured artisans"
          header={
            <SectionHeading
              eyebrow="Artisan spotlight"
              title={<span id="makers-title">Meet the Maker.</span>}
              description="The hands behind every piece — weavers, painters, carvers and smiths from across the country."
            />
          }
        >
          {artisans.map((a) => (
            <div key={a.id} className="w-[80%] shrink-0 snap-start sm:w-[46%] lg:w-[31%] xl:w-[23.5%]">
              <ArtisanCard artisan={a} variant="spotlight" />
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
}

export function TraditionMeetsTomorrow() {
  const pillars = [
    {
      icon: Store,
      title: "Reach",
      text: "A rural weaver in Trashigang can offer her work to a customer in Thimphu or Phuentsholing without leaving her loom.",
    },
    {
      icon: ScrollText,
      title: "Record",
      text: "Every listing captures techniques, materials and meanings — a living record of craft that grows with each piece.",
    },
    {
      icon: HeartHandshake,
      title: "Return",
      text: "Artisans set their own prices and are named on every product, so recognition and income flow back to the maker.",
    },
  ];
  return (
    <section className="relative overflow-hidden bg-ink py-20 text-background sm:py-28" aria-labelledby="tomorrow-title">
      <div className="absolute inset-0 bg-motif-light" aria-hidden />
      <div className="container-page relative grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-20">
        <Reveal>
          <p className="eyebrow text-secondary">Our purpose</p>
          <h2 id="tomorrow-title" className="mt-4 font-display text-5xl text-balance sm:text-6xl lg:text-7xl">
            Where Tradition <br className="hidden sm:block" />
            Meets <em className="text-secondary">Tomorrow.</em>
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-background/75">
            Digital commerce can make Bhutanese craftsmanship accessible to more people — without flattening it into
            just another listing. We design every page so the story travels with the object.
          </p>
          <ul className="mt-10 grid gap-8 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {pillars.map(({ icon: Icon, title, text }) => (
              <li key={title}>
                <Icon className="size-6 text-secondary" aria-hidden />
                <p className="mt-3 font-serif text-2xl font-semibold">{title}</p>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-background/70">{text}</p>
              </li>
            ))}
          </ul>
          <LinkButton href="/our-story" variant="secondary" className="mt-10">
            Read our story <ArrowRight className="size-4" aria-hidden />
          </LinkButton>
        </Reveal>

        <Reveal delay={120} className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-white/5">
            <SmartImage
              src={media.punakhaDzong}
              alt="A dzong with mountains in the background"
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-x-5 bottom-5 rounded-lg border border-white/15 bg-ink/70 p-5 backdrop-blur-md">
            <p className="flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-secondary uppercase">
              <Sparkles className="size-3.5" aria-hidden /> Coming in a future phase
            </p>
            <p className="mt-2 text-[0.95rem] text-background/85">
              Short craft films from artisans&apos; workshops, provenance badges and made-to-order commissions.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const trust = [
  { icon: BadgeCheck, title: "Verified Artisans", text: "Every maker is reviewed before selling." },
  { icon: Landmark, title: "Authentic Bhutanese Products", text: "Made in Bhutan, by hand." },
  { icon: Lock, title: "Secure Checkout", text: "Payments via trusted gateways." },
  { icon: Store, title: "Local Marketplace", text: "Built for Bhutanese customers." },
  { icon: ScrollText, title: "Artisan Stories", text: "Know who made what you buy." },
];

export function TrustSection() {
  return (
    <section className="container-page py-16 sm:py-20" aria-label="Why shop with Heritage Loom">
      <MotifDivider className="mb-14" />
      <ul className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
        {trust.map(({ icon: Icon, title, text }, i) => (
          <li key={title} className={i === 4 ? "col-span-2 sm:col-span-1" : undefined}>
            <Reveal delay={i * 60} className="flex flex-col items-center text-center">
              <span className="flex size-12 items-center justify-center rounded-full border border-border bg-surface text-primary">
                <Icon className="size-5" aria-hidden />
              </span>
              <p className="mt-4 font-semibold">{title}</p>
              <p className="mt-1 text-sm text-muted">{text}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SellerCallout() {
  return (
    <section className="container-page pb-20 sm:pb-28">
      <Reveal className="relative overflow-hidden rounded-2xl border border-border bg-secondary-soft/70 bg-motif px-6 py-12 sm:px-12 sm:py-14">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <p className="flex items-center gap-2 eyebrow">
              <Diamond className="text-secondary" /> For artisans &amp; cooperatives
            </p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl">Share your craft with all of Bhutan.</h2>
            <p className="mt-4 text-lg text-muted">
              Open a storefront, tell your story and receive orders directly. Simple tools, clear guidance, no technical
              skills needed.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <LinkButton href="/signup/artisan" size="lg">
              Become a Seller
            </LinkButton>
            <Link href="/faq" className="inline-flex h-13 items-center justify-center px-4 font-semibold text-text hover:text-primary">
              How selling works
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
