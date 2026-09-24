import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon,
  trend,
  tone = "default",
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  tone?: "default" | "primary";
}) {
  return (
    <div className={cn("rounded-xl border border-border p-5", tone === "primary" ? "bg-ink text-white" : "bg-surface")}>
      <div className="flex items-start justify-between">
        <p className={cn("text-sm font-semibold", tone === "primary" ? "text-white/70" : "text-muted")}>{label}</p>
        <span className={cn("flex size-9 items-center justify-center rounded-full", tone === "primary" ? "bg-white/10 text-secondary" : "bg-primary-soft text-primary")}>
          {icon}
        </span>
      </div>
      <p className="mt-3 font-serif text-3xl font-semibold tabular-nums">{value}</p>
      {trend && <p className={cn("mt-1 text-xs", tone === "primary" ? "text-white/60" : "text-muted")}>{trend}</p>}
    </div>
  );
}

/** Small inline bar chart for monthly figures — no external chart library needed. */
export function MiniBarChart({ data, valueLabel }: { data: { month: string; value: number }[]; valueLabel: (v: number) => string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex h-40 items-end gap-3 sm:gap-4" role="img" aria-label={`Chart showing ${data.map((d) => `${d.month}: ${valueLabel(d.value)}`).join(", ")}`}>
      {data.map((d) => (
        <div key={d.month} className="flex flex-1 flex-col items-center gap-2">
          <div className="relative flex h-32 w-full items-end justify-center">
            <div
              className="w-full max-w-10 rounded-t-md bg-primary/85 transition-all duration-700 ease-out"
              style={{ height: `${(d.value / max) * 100}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-muted">{d.month}</span>
        </div>
      ))}
    </div>
  );
}
