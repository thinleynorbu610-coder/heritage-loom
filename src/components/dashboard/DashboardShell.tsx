"use client";

import { LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { useAuth } from "@/context/AuthContext";
import { useIsClient } from "@/lib/persistent-store";
import { cn, initials } from "@/lib/utils";

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function DashboardShell({
  navItems,
  roleLabel,
  children,
}: {
  navItems: DashboardNavItem[];
  roleLabel: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();
  const isClient = useIsClient();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => (href === navItems[0].href ? pathname === href : pathname.startsWith(href));

  const doLogout = () => {
    logout();
    router.push("/");
  };

  const SidebarContent = (
    <>
      <Logo compact className="px-1" />
      <nav aria-label={`${roleLabel} navigation`} className="mt-8 flex-1">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-[0.95rem] font-semibold transition-colors",
                    active ? "bg-primary text-white" : "text-text hover:bg-surface-muted",
                  )}
                >
                  <Icon className="size-[1.1rem] shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {isClient && user && (
        <div className="mt-auto border-t border-border pt-4">
          <div className="flex items-center gap-3 px-1">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-soft font-semibold text-primary">
              {initials(user.name)}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">{user.name}</span>
              <span className="block text-xs text-muted capitalize">{roleLabel}</span>
            </span>
          </div>
          <button
            type="button"
            onClick={doLogout}
            className="mt-3 flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-semibold text-danger hover:bg-danger-soft"
          >
            <LogOut className="size-[1.1rem]" /> Logout
          </button>
        </div>
      )}
    </>
  );

  return (
    <div className="mx-auto flex min-h-[calc(100vh-var(--header-h))] max-w-[1600px]">
      {/* Desktop sidebar */}
      <aside className="sticky top-[var(--header-h)] hidden h-[calc(100vh-var(--header-h))] w-64 shrink-0 flex-col border-r border-border bg-surface p-5 lg:flex">
        {SidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-surface p-5 shadow-2xl">
            <button type="button" onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 rounded-md p-1.5" aria-label="Close menu">
              <X className="size-5" />
            </button>
            {SidebarContent}
          </div>
        </div>
      )}

      <main className="min-w-0 flex-1">
        {/* Mobile top bar — in normal flow so it always sits right under the site header */}
        <div className="sticky top-[var(--header-h)] z-30 flex h-14 items-center justify-between border-b border-border bg-surface px-4 lg:hidden">
          <span className="text-sm font-semibold text-muted capitalize">{roleLabel} dashboard</span>
          <button type="button" onClick={() => setMobileOpen(true)} className="rounded-md p-2" aria-label="Open dashboard menu">
            <Menu className="size-5" />
          </button>
        </div>
        <div className="p-5 sm:p-8 lg:p-10">{children}</div>
      </main>
    </div>
  );
}

export function DashboardHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-serif text-3xl font-semibold sm:text-4xl">{title}</h1>
        {description && <p className="mt-1 text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
