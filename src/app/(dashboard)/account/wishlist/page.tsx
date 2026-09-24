"use client";

import { RequireRole } from "@/components/account/RequireRole";
import { WishlistView } from "@/components/account/WishlistView";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";

export default function AccountWishlistPage() {
  return (
    <RequireRole role="customer">
      <DashboardHeader title="Wishlist" description="Pieces you've saved for later." />
      <WishlistView columns={3} />
    </RequireRole>
  );
}
