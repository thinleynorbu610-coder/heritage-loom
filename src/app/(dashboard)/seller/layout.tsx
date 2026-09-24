"use client";

import { LayoutGrid, Package, PackagePlus, Receipt, Settings, ShoppingBag, User } from "lucide-react";
import { DashboardShell, type DashboardNavItem } from "@/components/dashboard/DashboardShell";

const navItems: DashboardNavItem[] = [
  { label: "Dashboard", href: "/seller", icon: LayoutGrid },
  { label: "Products", href: "/seller/products", icon: Package },
  { label: "Add Product", href: "/seller/products/new", icon: PackagePlus },
  { label: "Orders", href: "/seller/orders", icon: ShoppingBag },
  { label: "Sales", href: "/seller/sales", icon: Receipt },
  { label: "Profile", href: "/seller/profile", icon: User },
  { label: "Settings", href: "/seller/settings", icon: Settings },
];

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell navItems={navItems} roleLabel="artisan">
      {children}
    </DashboardShell>
  );
}
