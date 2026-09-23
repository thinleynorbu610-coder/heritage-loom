import type { Metadata } from "next";
import { Suspense } from "react";
import { TrackOrderView } from "@/components/order/TrackOrderView";
import { Skeleton } from "@/components/ui/LoadingSkeleton";
import { Breadcrumbs } from "@/components/ui/Misc";

export const metadata: Metadata = { title: "Track an Order" };

export default function TrackOrderPage() {
  return (
    <div className="container-page py-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Track an Order" }]} />
        <h1 className="mt-6 font-display text-5xl sm:text-6xl">Track your order</h1>
        <p className="mt-3 text-lg text-muted">Follow your piece from the artisan&apos;s workshop to your door.</p>
        <div className="mt-10">
          <Suspense fallback={<Skeleton className="h-40 w-full" />}>
            <TrackOrderView />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
