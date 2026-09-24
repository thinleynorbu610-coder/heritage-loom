import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border-strong bg-surface/60 bg-motif px-6 py-16 text-center",
        className,
      )}
    >
      {icon && (
        <div className="mb-5 flex size-14 items-center justify-center rounded-full border border-border bg-background text-primary">
          {icon}
        </div>
      )}
      <h3 className="font-serif text-2xl font-semibold">{title}</h3>
      {description && <p className="mt-2 max-w-md text-muted">{description}</p>}
      {action && <div className="mt-6 flex flex-wrap justify-center gap-3">{action}</div>}
    </div>
  );
}
