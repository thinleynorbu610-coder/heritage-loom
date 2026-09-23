import type { Metadata } from "next";
import { WishlistView } from "@/components/account/WishlistView";
import { Breadcrumbs } from "@/components/ui/Misc";

export const metadata: Metadata = { title: "Wishlist" };

export default function WishlistPage() {
  return (
    <div className="container-page py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />
      <h1 className="mt-6 font-display text-5xl sm:text-6xl">Your Wishlist</h1>
      <p className="mt-3 text-lg text-muted">Pieces you&apos;ve saved for later.</p>
      <div className="mt-10">
        <WishlistView />
      </div>
    </div>
  );
}
