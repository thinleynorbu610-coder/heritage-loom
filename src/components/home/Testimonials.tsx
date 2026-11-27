import { BadgeCheck, Quote } from "lucide-react";
import { Rating } from "@/components/ui/Rating";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { reviews } from "@/data/reviews";
import { getProductById } from "@/services/catalog";
import { CoverFlow } from "@/components/ui/CoverFlow";

/** Homepage testimonials — one review per author, most recent first. */
function pickTestimonials(count: number) {
  const seen = new Set<string>();
  const picked = [];
  for (const r of [...reviews].sort((a, b) => b.date.localeCompare(a.date))) {
    if (seen.has(r.author)) continue;
    seen.add(r.author);
    picked.push(r);
    if (picked.length >= count) break;
  }
  return picked;
}

export function Testimonials() {
  const items = pickTestimonials(8);
  return (
    <section className="overflow-hidden bg-surface-muted py-20 sm:py-28" aria-labelledby="testimonials-title">
      <div className="container-page">
        <CoverFlow
          label="Customer stories"
          slideClassName="w-[84%] sm:w-[56%] lg:w-[36%]"
          veilClassName="bg-surface-muted"
          veilStrength={0.5}
          header={
            <SectionHeading
              eyebrow="Customer stories"
              title={<span id="testimonials-title">Loved Across Bhutan.</span>}
              description="Real words from customers who brought a piece of Heritage Loom home."
            />
          }
        >
          {items.map((r) => {
            const product = getProductById(r.productId);
            return (
              <figure
                key={r.id}
                className="flex flex-col rounded-xl border border-border bg-surface p-6 sm:p-8"
              >
                <Quote className="size-7 text-secondary" aria-hidden />
                <Rating value={r.rating} showValue={false} className="mt-4" />
                <blockquote className="mt-3 flex-1">
                  <p className="font-serif text-xl leading-snug text-text">{r.title}</p>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">&ldquo;{r.body}&rdquo;</p>
                </blockquote>
                <figcaption className="mt-6 flex items-center justify-between gap-2 border-t border-border pt-4">
                  <div>
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-text">
                      {r.author}
                      {r.verifiedPurchase && <BadgeCheck className="size-4 text-success" aria-hidden />}
                    </p>
                    <p className="text-xs text-muted">{r.location}</p>
                  </div>
                  {product && <p className="max-w-[9rem] truncate text-right text-xs text-muted">{product.name}</p>}
                </figcaption>
              </figure>
            );
          })}
        </CoverFlow>
      </div>
    </section>
  );
}
