import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Heritage Loom mark: a square of interlaced warp and weft threads, set on
 * its point to echo the diamond motifs found in Bhutanese textiles.
 */
export function LogoMark({ className, tone = "brand" }: { className?: string; tone?: "brand" | "light" }) {
  const main = tone === "light" ? "#faf6ef" : "var(--primary)";
  const gold = "var(--secondary)";
  return (
    <svg viewBox="0 0 40 40" className={cn("shrink-0", className)} aria-hidden="true">
      <g transform="rotate(45 20 20)">
        <rect x="7" y="7" width="26" height="26" rx="2" fill="none" stroke={main} strokeWidth="2" />
        {/* warp */}
        <path d="M15 7v26M20 7v26M25 7v26" stroke={main} strokeWidth="1.6" />
        {/* weft, woven over/under */}
        <path d="M7 15h5.5m5 0h5m5 0h5.5M7 25h5.5m5 0h5m5 0h5.5" stroke={gold} strokeWidth="2.2" strokeLinecap="round" />
        <path d="M7 20h10.5m5 0h10.5" stroke={gold} strokeWidth="2.2" strokeLinecap="round" />
        <rect x="18" y="18" width="4" height="4" fill={gold} />
      </g>
    </svg>
  );
}

export function Logo({
  className,
  tone = "brand",
  compact = false,
}: {
  className?: string;
  tone?: "brand" | "light";
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label="Heritage Loom — home"
    >
      <LogoMark className="size-9 transition-transform duration-500 group-hover:rotate-90" tone={tone} />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-serif text-[1.35rem] font-semibold tracking-[0.14em]",
              tone === "light" ? "text-background" : "text-text",
            )}
          >
            HERITAGE LOOM
          </span>
          <span
            className={cn(
              "mt-1 hidden text-[0.58rem] font-semibold tracking-[0.3em] uppercase sm:block",
              tone === "light" ? "text-secondary" : "text-muted",
            )}
          >
            Crafted in Bhutan
          </span>
        </span>
      )}
    </Link>
  );
}
