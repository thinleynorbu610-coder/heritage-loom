import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
  className,
  tone = "dark",
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  action?: React.ReactNode;
  className?: string;
  tone?: "dark" | "light";
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && <p className={cn("eyebrow mb-4", tone === "light" && "text-secondary")}>{eyebrow}</p>}
        <Tag
          className={cn(
            "font-display text-4xl text-balance sm:text-5xl",
            tone === "light" ? "text-background" : "text-text",
          )}
        >
          {title}
        </Tag>
        {description && (
          <p className={cn("mt-4 text-lg leading-relaxed", tone === "light" ? "text-background/70" : "text-muted")}>
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
