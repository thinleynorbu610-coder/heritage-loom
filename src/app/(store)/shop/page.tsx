import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopView } from "@/components/product/ShopView";
import { ShopSkeleton } from "@/components/ui/LoadingSkeleton";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse handmade Bhutanese textiles, gho & kira, jewellery, paintings, woodwork and handicrafts.",
};

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <ShopView />
    </Suspense>
  );
}
