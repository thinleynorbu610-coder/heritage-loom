import { ArrowRight, BadgeCheck, MapPin } from "lucide-react";
import Link from "next/link";
import { SmartImage } from "@/components/ui/SmartImage";
import { cn, pluralize } from "@/lib/utils";
import { getArtisanProductCount, getRegion } from "@/services/catalog";
import type { Artisan } from "@/types";

export function ArtisanCard({
  artisan,
  variant = "grid",
  className,
}: {
  artisan: Artisan;
  variant?: "grid" | "spotlight";
  className?: string;
}) {
  const region = getRegion(artisan.region);
  const count = getArtisanProductCount(artisan.id);
  const href = `/artisans/${artisan.slug}`;

  if (variant === "spotlight") {
    return (
      <article
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface transition-shadow duration-300 hover:shadow-lift",
          className,
        )}
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          <SmartImage
            src={artisan.portrait}
            alt={`Portrait representing ${artisan.name}`}
            fill
            sizes="(min-width: 1024px) 30vw, 80vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            fallbackLabel={artisan.name}
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-5 pt-16 text-white">
            <p className="text-xs font-semibold tracking-[0.18em] text-secondary uppercase">{artisan.specialty}</p>
            <h3 className="mt-1 font-serif text-3xl leading-none font-semibold">{artisan.name}</h3>
          </div>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <dl className="grid grid-cols-2 gap-3 border-b border-border pb-4 text-sm">
            <div>
              <dt className="text-xs text-muted">Region</dt>
              <dd className="font-semibold">{region?.name}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Experience</dt>
              <dd className="font-semibold">{artisan.yearsOfExperience} years</dd>
            </div>
          </dl>
          <p className="mt-4 line-clamp-3 flex-1 text-[0.95rem] leading-relaxed text-muted">{artisan.story}</p>
          <Link
            href={href}
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary after:absolute after:inset-0"
          >
            View Artisan
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-lift",
        className,
      )}
    >
      <div className="relative aspect-[5/4] overflow-hidden bg-surface-muted">
        <SmartImage
          src={artisan.portrait}
          alt={`Portrait representing ${artisan.name}`}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          fallbackLabel={artisan.name}
        />
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-1.5 font-serif text-2xl leading-tight font-semibold">
              {artisan.name}
              {artisan.verified && <BadgeCheck className="size-5 text-success" aria-label="Verified artisan" />}
            </h3>
            <p className="mt-0.5 text-sm font-semibold text-primary">{artisan.specialty}</p>
          </div>
        </div>
        <p className="mt-2 flex items-center gap-1 text-sm text-muted">
          <MapPin className="size-3.5" aria-hidden />
          {artisan.village ? `${artisan.village}, ` : ""}
          {region?.name}
        </p>
        <p className="mt-3 line-clamp-2 flex-1 text-[0.95rem] leading-relaxed text-muted">{artisan.shortIntro}</p>
        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <span className="text-sm text-muted">{pluralize(count, "product")}</span>
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-text transition-colors after:absolute after:inset-0 group-hover:text-primary"
          >
            View Profile
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}
