import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { SmartImage } from "@/components/ui/SmartImage";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

export function CategoryCard({
  category,
  count,
  className,
  size = "md",
}: {
  category: Category;
  count?: number;
  className?: string;
  size?: "md" | "lg";
}) {
  return (
    <Link
      href={`/shop?category=${category.slug}`}
      className={cn(
        "group relative flex overflow-hidden rounded-xl bg-ink text-white",
        size === "lg" ? "aspect-[4/5] md:aspect-auto md:min-h-full" : "aspect-[4/5]",
        className,
      )}
    >
      <SmartImage
        src={category.image}
        alt=""
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
        fallbackLabel={category.name}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent transition-colors duration-500 group-hover:bg-ink/25" />
      <div className="relative mt-auto flex w-full items-end justify-between gap-4 p-6 sm:p-7">
        <div>
          {count != null && (
            <p className="mb-2 text-xs font-semibold tracking-[0.18em] text-secondary uppercase">
              {count} {count === 1 ? "piece" : "pieces"}
            </p>
          )}
          <h3 className="font-serif text-3xl leading-none font-semibold">{category.name}</h3>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/80">{category.shortDescription}</p>
        </div>
        <span className="flex size-11 shrink-0 translate-x-1 items-center justify-center rounded-full bg-white text-ink opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100">
          <ArrowUpRight className="size-5" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
