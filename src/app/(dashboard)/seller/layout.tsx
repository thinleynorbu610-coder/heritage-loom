"use client";

import { HelpCircle, LayoutGrid, Package, Settings, ShieldCheck, ShoppingBag, TrendingUp, User } from "lucide-react";
import { DashboardShell, type DashboardNavItem } from "@/components/dashboard/DashboardShell";
import { useAuth } from "@/context/AuthContext";
import { sellerOrders } from "@/data/orders";
import { getArtisanById, getProductsByArtisan } from "@/services/catalog";

const secondaryNavItems: DashboardNavItem[] = [
  { label: "Settings", href: "/seller/settings", icon: Settings },
  { label: "Help & Support", href: "/seller/help", icon: HelpCircle },
];

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const artisan = user?.artisanId ? getArtisanById(user.artisanId) : undefined;
  const productCount = artisan ? getProductsByArtisan(artisan.id).length : 0;
  const pendingCount = sellerOrders.filter((o) => o.status === "pending").length;

  const navItems: DashboardNavItem[] = [
    { label: "Dashboard", href: "/seller", icon: LayoutGrid },
    { label: "Inventory", href: "/seller/products", icon: Package, badge: productCount > 0 ? { text: `${productCount} items` } : undefined },
    { label: "Orders", href: "/seller/orders", icon: ShoppingBag, badge: pendingCount > 0 ? { text: String(pendingCount), tone: "danger" } : undefined },
    { label: "Moderation", href: "/seller/moderation", icon: ShieldCheck },
    { label: "Analytics", href: "/seller/sales", icon: TrendingUp },
    { label: "Profile", href: "/seller/profile", icon: User },
  ];

  return (
    <DashboardShell navItems={navItems} secondaryNavItems={secondaryNavItems} roleLabel="artisan" hubLabel="Artisan Hub" offsetTop={false}>
      {children}
    </DashboardShell>
  );
}
