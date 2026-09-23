import { cn } from "@/lib/utils";

/**
 * Restrained geometric motifs inspired by the diamond and stepped patterns of
 * Bhutanese supplementary-weft textiles. Purely geometric — no religious symbols.
 */

/** Horizontal band of small diamonds, used as a section separator. */
export function MotifDivider({ className, tone = "brand" }: { className?: string; tone?: "brand" | "light" }) {
  const stroke = tone === "light" ? "rgba(247,237,214,0.45)" : "var(--border-strong)";
  const fill = tone === "light" ? "var(--secondary)" : "var(--primary)";
  return (
    <div className={cn("flex items-center gap-4", className)} aria-hidden="true">
      <span className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${stroke})` }} />
      <svg width="88" height="14" viewBox="0 0 88 14">
        <path d="M7 1 L13 7 L7 13 L1 7Z" fill="none" stroke={stroke} />
        <path d="M25 3 L29 7 L25 11 L21 7Z" fill="none" stroke={stroke} />
        <path d="M44 0 L51 7 L44 14 L37 7Z" fill={fill} opacity="0.9" />
        <path d="M44 4 L47 7 L44 10 L41 7Z" fill="var(--background)" opacity="0.9" />
        <path d="M63 3 L67 7 L63 11 L59 7Z" fill="none" stroke={stroke} />
        <path d="M81 1 L87 7 L81 13 L75 7Z" fill="none" stroke={stroke} />
      </svg>
      <span className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${stroke})` }} />
    </div>
  );
}

/** Thin woven border strip — alternating warp/weft blocks. */
export function WovenStrip({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("h-1.5 w-full", className)}
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, var(--primary) 0 14px, var(--secondary) 14px 18px, var(--primary) 18px 32px, var(--ink) 32px 34px)",
      }}
    />
  );
}

/** Small diamond used as bullet / accent. */
export function Diamond({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 10 10" className={cn("size-2.5", className)} aria-hidden="true">
      <path d="M5 0 L10 5 L5 10 L0 5Z" fill="currentColor" />
    </svg>
  );
}

/** Stepped-diamond corner ornament for cards and panels. */
export function CornerMotif({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={cn("size-12", className)} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M0 24 L24 0" />
        <path d="M0 36 L36 0" />
        <path d="M8 8 h8 v8 h-8z" />
        <path d="M0 12 L12 0" />
      </g>
    </svg>
  );
}
