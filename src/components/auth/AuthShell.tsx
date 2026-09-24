import { Logo } from "@/components/brand/Logo";
import { MotifDivider } from "@/components/ui/Motif";
import { SmartImage } from "@/components/ui/SmartImage";
import { media } from "@/data/media";

export function AuthShell({
  title,
  subtitle,
  children,
  panel,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  panel?: { quote: string; attribution: string };
}) {
  return (
    <div className="grid min-h-[calc(100vh-var(--header-h))] lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-14 sm:px-10">
        <div className="w-full max-w-md">
          <Logo compact className="lg:hidden" />
          <h1 className="mt-8 font-display text-4xl sm:text-5xl lg:mt-0">{title}</h1>
          <p className="mt-2 text-lg text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
      <div className="relative isolate hidden overflow-hidden bg-ink text-white lg:block">
        <SmartImage src={media.weaverFloor} alt="An artisan weaving traditional cloth" fill sizes="50vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/10" />
        <div className="absolute inset-0 bg-motif-light" />
        <div className="relative flex h-full flex-col justify-end p-12">
          <Logo />
          {panel && (
            <>
              <MotifDivider tone="light" className="my-8" />
              <blockquote className="font-serif text-3xl leading-snug">“{panel.quote}”</blockquote>
              <p className="mt-4 text-sm text-white/70">{panel.attribution}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
