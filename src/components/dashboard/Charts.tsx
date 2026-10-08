"use client";

import { cn } from "@/lib/utils";

/** Area/line chart for a short time series — e.g. 6 months of revenue. */
export function LineAreaChart({
  data,
  valueLabel,
}: {
  data: { month: string; value: number }[];
  valueLabel: (v: number) => string;
}) {
  const width = 600;
  const height = 200;
  const padX = 24;
  const padTop = 36;
  const padBottom = 28;
  const max = Math.max(...data.map((d) => d.value), 1);
  const min = Math.min(...data.map((d) => d.value), 0);
  const range = max - min || 1;
  const step = (width - padX * 2) / (data.length - 1 || 1);

  const points = data.map((d, i) => {
    const x = padX + i * step;
    const y = padTop + (height - padTop - padBottom) * (1 - (d.value - min) / range);
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1].x.toFixed(1)},${height - padBottom} L${points[0].x.toFixed(1)},${height - padBottom} Z`;
  const last = points[points.length - 1];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full overflow-visible" role="img" aria-label={`Chart showing ${data.map((d) => `${d.month}: ${valueLabel(d.value)}`).join(", ")}`}>
      <defs>
        <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Faint horizontal grid */}
      {[0, 0.5, 1].map((t) => (
        <line key={t} x1={padX} x2={width - padX} y1={padTop + (height - padTop - padBottom) * t} y2={padTop + (height - padTop - padBottom) * t} stroke="var(--border)" strokeWidth="1" />
      ))}

      <path d={areaPath} fill="url(#revenueFill)" />
      <path d={linePath} fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {points.map((p, i) => (
        <circle key={p.month} cx={p.x} cy={p.y} r={i === points.length - 1 ? 4.5 : 3} fill={i === points.length - 1 ? "var(--primary)" : "var(--surface)"} stroke="var(--primary)" strokeWidth="2" />
      ))}

      {/* Callout on the latest point */}
      <g transform={`translate(${Math.min(last.x, width - 150)}, ${Math.max(last.y - 44, 4)})`}>
        <rect width="150" height="34" rx="8" fill="var(--ink)" />
        <text x="10" y="14" fontSize="9" fontWeight="700" fill="var(--secondary)" className="uppercase">
          {last.month} · latest
        </text>
        <text x="10" y="27" fontSize="12" fontWeight="700" fill="white">
          {valueLabel(last.value)}
        </text>
      </g>

      {points.map((p) => (
        <text key={p.month} x={p.x} y={height - 8} fontSize="11" fontWeight="600" fill="var(--muted)" textAnchor="middle">
          {p.month}
        </text>
      ))}
    </svg>
  );
}

export interface DonutSegment {
  label: string;
  value: number;
  colorVar: string;
}

/** Donut chart with a legend — share-of-total breakdowns (e.g. revenue by product). */
export function DonutChart({ segments, centerLabel, centerValue }: { segments: DonutSegment[]; centerLabel: string; centerValue: string }) {
  const total = segments.reduce((n, s) => n + s.value, 0) || 1;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
      <svg viewBox="0 0 100 100" className="size-40 shrink-0 -rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--surface-muted)" strokeWidth="14" />
        {segments.map((s) => {
          const fraction = s.value / total;
          const dash = fraction * circumference;
          const circle = (
            <circle
              key={s.label}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={s.colorVar}
              strokeWidth="14"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += dash;
          return circle;
        })}
      </svg>
      <div className="flex w-full flex-col gap-2.5">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2.5 text-sm">
            <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: s.colorVar }} />
            <span className="min-w-0 flex-1 truncate">{s.label}</span>
            <span className="shrink-0 font-semibold tabular-nums">{Math.round((s.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
      <div className="sr-only">
        {centerLabel}: {centerValue}
      </div>
    </div>
  );
}

export function GeoBar({ label, sublabel, percent }: { label: string; sublabel: string; percent: number }) {
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-semibold">{label}</span>
        <span className="font-semibold tabular-nums">{percent}%</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
        <div className={cn("h-full rounded-full bg-primary")} style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-1 text-xs text-muted">{sublabel}</p>
    </div>
  );
}
