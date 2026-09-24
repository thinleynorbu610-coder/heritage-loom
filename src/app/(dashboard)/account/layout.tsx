"use client";

import { Heart, LayoutGrid, MapPin, Package, Star, User } from "lucide-react";
import { DashboardShell, type DashboardNavItem } from "@/components/dashboard/DashboardShell";

const navItems: DashboardNavItem[] = [
  { label: "Overview", href: "/account", icon: LayoutGrid },
  { label: "My Orders", href: "/account/orders", icon: Package },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Reviews", href: "/account/reviews", icon: Star },
  { label: "Profile", href: "/account/profile", icon: User },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell navItems={navItems} roleLabel="customer">
      {children}
    </DashboardShell>
  );
}
