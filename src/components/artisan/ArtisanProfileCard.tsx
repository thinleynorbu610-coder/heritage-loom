import { ArrowRight, BadgeCheck, Hammer, MapPin, Timer } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import { pluralize } from "@/lib/utils";
import { getArtisanProductCount, getRegion } from "@/services/catalog";
import type { Artisan } from "@/types";

/** Compact artisan profile used on product pages ("Meet the Artisan"). */
export function ArtisanProfileCard({ artisan }: { artisan: Artisan }) {
  const region = getRegion(artisan.region);
  const count = getArtisanProductCount(artisan.id);
  return (
    <div className="grid overflow-hidden rounded-2xl border border-border bg-surface md:grid-cols-[minmax(0,2fr)_3fr]">
      <div className="relative aspect-[4/3] bg-surface-muted md:aspect-auto md:min-h-80">
        <SmartImage src={artisan.portrait} alt={`Portrait representing ${artisan.name}`} fill sizes="(min-width:768px) 35vw, 100vw" className="object-cover" fallbackLabel={artisan.name} />
      </div>
      <div className="flex flex-col p-6 sm:p-10">
        <p className="eyebrow">Meet the artisan</p>
        <h3 className="mt-3 flex items-center gap-2 font-display text-4xl">
          {artisan.name}
          {artisan.verified && <BadgeCheck className="size-6 text-success" aria-label="Verified artisan" />}
        </h3>
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <li className="flex items-center gap-1.5">
            <Hammer className="size-4 text-accent" aria-hidden /> {artisan.specialty}
          </li>
          <li className="flex items-center gap-1.5">
            <MapPin className="size-4 text-accent" aria-hidden /> {artisan.village ? `${artisan.village}, ` : ""}
            {region?.name}
          </li>
          <li className="flex items-center gap-1.5">
            <Timer className="size-4 text-accent" aria-hidden /> {artisan.yearsOfExperience} years of practice
          </li>
        </ul>
        <p className="mt-5 leading-relaxed text-muted">{artisan.story}</p>
        <div className="mt-auto flex flex-wrap items-center gap-4 pt-7">
          <LinkButton href={`/artisans/${artisan.slug}`} variant="dark">
            View Artisan <ArrowRight className="size-4" aria-hidden />
          </LinkButton>
          <span className="text-sm text-muted">{pluralize(count, "piece")} in their collection</span>
        </div>
      </div>
    </div>
  );
}
