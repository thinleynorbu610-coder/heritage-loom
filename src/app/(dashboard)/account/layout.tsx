"use client";

import { LayoutGrid } from "lucide-react";
import { DashboardShell, type DashboardNavItem } from "@/components/dashboard/DashboardShell";
import { Header } from "@/components/layout/Header";

const navItems: DashboardNavItem[] = [
  { label: "Overview", href: "/account", icon: LayoutGrid },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <DashboardShell navItems={navItems} roleLabel="customer" hubLabel="" hideSidebar>
        {children}
      </DashboardShell>
    </>
  );
}
