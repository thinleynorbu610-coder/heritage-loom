"use client";

import { Flag, LayoutGrid, Package, Settings, ShoppingBag, Star, UserCog, Users } from "lucide-react";
import { DashboardShell, type DashboardNavItem } from "@/components/dashboard/DashboardShell";

const navItems: DashboardNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutGrid },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Artisans", href: "/admin/artisans", icon: UserCog },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Reports", href: "/admin/reports", icon: Flag },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell navItems={navItems} roleLabel="admin">
      {children}
    </DashboardShell>
  );
}
