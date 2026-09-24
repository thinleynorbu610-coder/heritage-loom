import type { OrderStatus } from "@/types";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "primary" | "gold" | "success" | "warning" | "danger" | "info" | "dark";

const tones: Record<Tone, string> = {
  neutral: "bg-surface-muted text-muted border-border",
  primary: "bg-primary-soft text-primary border-primary/15",
  gold: "bg-secondary-soft text-accent border-secondary/25",
  success: "bg-success-soft text-success border-success/15",
  warning: "bg-warning-soft text-warning border-warning/20",
  danger: "bg-danger-soft text-danger border-danger/15",
  info: "bg-info-soft text-info border-info/15",
  dark: "bg-ink/80 text-white border-transparent backdrop-blur-sm",
};

export function Badge({
  tone = "neutral",
  className,
  children,
  icon,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}


const statusMap: Record<string, { label: string; tone: Tone }> = {
  placed: { label: "Order placed", tone: "neutral" },
  pending: { label: "Pending", tone: "warning" },
  paid: { label: "Paid", tone: "info" },
  preparing: { label: "Preparing", tone: "gold" },
  shipped: { label: "Shipped", tone: "primary" },
  delivered: { label: "Delivered", tone: "success" },
  cancelled: { label: "Cancelled", tone: "danger" },
  active: { label: "Active", tone: "success" },
  draft: { label: "Draft", tone: "neutral" },
  rejected: { label: "Rejected", tone: "danger" },
  approved: { label: "Approved", tone: "success" },
  suspended: { label: "Suspended", tone: "danger" },
  "out-of-stock": { label: "Out of stock", tone: "danger" },
  "low-stock": { label: "Low stock", tone: "warning" },
};

export function StatusBadge({ status }: { status: OrderStatus | string }) {
  const s = statusMap[status] ?? { label: status, tone: "neutral" as Tone };
  return (
    <Badge tone={s.tone}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {s.label}
    </Badge>
  );
}
