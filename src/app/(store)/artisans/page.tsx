import type { Metadata } from "next";
import { ArtisanDirectory } from "@/components/artisan/ArtisanDirectory";
import { Breadcrumbs } from "@/components/ui/Misc";

export const metadata: Metadata = {
  title: "Artisans",
  description: "Meet the weavers, painters, carvers and silversmiths selling on Heritage Loom.",
};

export default function ArtisansPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-surface bg-weave">
        <div className="container-page py-14 sm:py-20">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Artisans" }]} />
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <h1 className="font-display text-5xl text-balance sm:text-7xl">
              Meet the Hands <br className="hidden sm:block" />
              <em className="text-primary">Behind the Craft.</em>
            </h1>
            <p className="text-lg leading-relaxed text-muted">
              Every artisan on Heritage Loom is reviewed before they sell. Explore their stories, their workshops and
              the traditions they carry forward.
            </p>
          </div>
        </div>
      </section>
      <section className="container-page py-10 sm:py-14">
        <ArtisanDirectory />
      </section>
    </>
  );
}
