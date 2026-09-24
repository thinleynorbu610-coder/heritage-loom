import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Misc";
import { Reveal } from "@/components/ui/Reveal";
import { SmartImage } from "@/components/ui/SmartImage";
import { cn } from "@/lib/utils";
import { getAllArtisans, getAllProducts, getCategories } from "@/services/catalog";

export const metadata: Metadata = {
  title: "Categories",
  description: "Explore Bhutanese crafts by tradition: textiles, gho & kira, jewellery, paintings, woodwork and handicrafts.",
};

export default function CategoriesPage() {
  const categories = getCategories();
  const products = getAllProducts();
  const artisans = getAllArtisans();

  return (
    <>
      <section className="border-b border-border bg-surface bg-weave">
        <div className="container-page py-14 sm:py-20">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Categories" }]} />
          <h1 className="mt-8 max-w-3xl font-display text-5xl text-balance sm:text-7xl">
            Six traditions, <em className="text-primary">one marketplace.</em>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted">
            Many Bhutanese crafts belong to Zorig Chusum — the thirteen traditional arts. Choose a tradition to meet its
            makers and explore their work.
          </p>
        </div>
      </section>

      <section className="container-page flex flex-col gap-6 py-14 sm:gap-10 sm:py-20">
        {categories.map((c, i) => {
          const items = products.filter((p) => p.category === c.slug);
          const makers = artisans.filter((a) => a.craftTypes.includes(c.slug)).length;
          return (
            <Reveal key={c.slug}>
              <Link
                href={`/shop?category=${c.slug}`}
                className="group grid overflow-hidden rounded-2xl border border-border bg-surface transition-shadow hover:shadow-lift md:grid-cols-2"
              >
                <div className={cn("relative aspect-[16/10] overflow-hidden bg-accent-soft md:aspect-auto md:min-h-[380px]", i % 2 === 1 && "md:order-2")}>
                  <SmartImage src={c.image} alt="" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover transition-transform duration-[1200ms] group-hover:scale-105" fallbackLabel={c.name} />
                </div>
                <div className="flex flex-col justify-center p-7 sm:p-12">
                  <p className="font-display text-6xl text-border-strong">{String(i + 1).padStart(2, "0")}</p>
                  <h2 className="mt-2 font-display text-4xl sm:text-5xl">{c.name}</h2>
                  <p className="mt-4 text-lg leading-relaxed text-muted">{c.description}</p>
                  <p className="mt-6 text-sm text-muted">
                    <span className="font-semibold text-text">{items.length}</span> pieces ·{" "}
                    <span className="font-semibold text-text">{makers}</span> artisans
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 font-bold text-primary">
                    Explore {c.name}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </section>
    </>
  );
}
