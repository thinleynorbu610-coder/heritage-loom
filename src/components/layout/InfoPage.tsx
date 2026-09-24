import { Breadcrumbs } from "@/components/ui/Misc";

/** Shared shell for simple content pages (FAQ, terms, privacy, contact). */
export function InfoPage({
  title,
  intro,
  eyebrow,
  children,
}: {
  title: string;
  intro?: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <section className="border-b border-border bg-surface bg-weave">
        <div className="container-page py-14 sm:py-20">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: title }]} />
          {eyebrow && <p className="eyebrow mt-8">{eyebrow}</p>}
          <h1 className="mt-4 font-display text-5xl sm:text-6xl">{title}</h1>
          {intro && <p className="mt-4 max-w-2xl text-lg text-muted">{intro}</p>}
        </div>
      </section>
      <div className="container-page py-14 sm:py-20">{children}</div>
    </>
  );
}

export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-3xl text-[1.05rem] leading-relaxed text-muted [&_h2]:mt-12 [&_h2]:mb-3 [&_h2]:font-serif [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:text-text [&_li]:mt-2 [&_p]:mt-4 [&_strong]:text-text [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6">
      {children}
    </div>
  );
}
