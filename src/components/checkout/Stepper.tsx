import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex items-center gap-2 sm:gap-3" aria-label="Checkout progress">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className={cn("flex items-center gap-2 sm:gap-3", i < steps.length - 1 && "flex-1")}>
            <span className="flex items-center gap-2.5" aria-current={active ? "step" : undefined}>
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors",
                  done && "border-success bg-success text-white",
                  active && "border-primary bg-primary text-white",
                  !done && !active && "border-border-strong text-muted",
                )}
              >
                {done ? <Check className="size-4" aria-hidden /> : i + 1}
              </span>
              <span className={cn("text-sm font-semibold", active ? "text-text" : "text-muted", !active && "hidden md:inline")}>
                {label}
                {done && <span className="sr-only"> (completed)</span>}
              </span>
            </span>
            {i < steps.length - 1 && (
              <span className={cn("h-0.5 flex-1 rounded-full", done ? "bg-success" : "bg-border")} aria-hidden />
            )}
          </li>
        );
      })}
    </ol>
  );
}
