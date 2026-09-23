import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Rating({
  value,
  count,
  size = "sm",
  showValue = true,
  className,
}: {
  value: number;
  count?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}) {
  const px = size === "lg" ? "size-5" : size === "md" ? "size-4" : "size-3.5";
  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="flex items-center gap-0.5" role="img" aria-label={`Rated ${value.toFixed(1)} out of 5`}>
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.max(0, Math.min(1, value - i));
          return (
            <span key={i} className={cn("relative inline-block", px)}>
              <Star className={cn("absolute inset-0 text-border-strong", px)} strokeWidth={1.5} aria-hidden />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className={cn("fill-secondary text-secondary", px)} strokeWidth={1.5} aria-hidden />
              </span>
            </span>
          );
        })}
      </span>
      {showValue && (
        <span className={cn("font-semibold text-text", size === "sm" ? "text-xs" : "text-sm")}>{value.toFixed(1)}</span>
      )}
      {count != null && (
        <span className={cn("text-muted", size === "sm" ? "text-xs" : "text-sm")}>({count})</span>
      )}
    </div>
  );
}

/** Interactive star input for writing reviews. */
export function RatingInput({
  value,
  onChange,
  label = "Your rating",
}: {
  value: number;
  onChange: (v: number) => void;
  label?: string;
}) {
  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-semibold">{label}</legend>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            aria-pressed={value === n}
            className="rounded p-0.5 transition-transform hover:scale-110"
          >
            <Star
              className={cn("size-7", n <= value ? "fill-secondary text-secondary" : "text-border-strong")}
              strokeWidth={1.5}
            />
          </button>
        ))}
      </div>
    </fieldset>
  );
}
