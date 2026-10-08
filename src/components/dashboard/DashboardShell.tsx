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
  badge?: { text: string; tone?: "neutral" | "danger" };
}

export function DashboardShell({
  navItems,
  secondaryNavItems,
  roleLabel,
  hubLabel,
  offsetTop = true,
  children,
}: {
  navItems: DashboardNavItem[];
  /** Links shown below a divider, above the profile card (e.g. Settings, Help & Support). */
  secondaryNavItems?: DashboardNavItem[];
  roleLabel: string;
  /** Small eyebrow above the nav, e.g. "Artisan Hub". Defaults from roleLabel. */
  hubLabel?: string;
  /** Set false when this shell isn't rendered below the public site header. */
  offsetTop?: boolean;
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

  const NavLink = ({ item }: { item: DashboardNavItem }) => {
    const Icon = item.icon;
    const active = isActive(item.href);
    return (
      <li>
        <Link
          href={item.href}
          onClick={() => setMobileOpen(false)}
          aria-current={active ? "page" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-[0.92rem] font-semibold transition-colors",
            active ? "bg-primary text-white" : "text-white/75 hover:bg-white/8 hover:text-white",
          )}
        >
          <Icon className="size-[1.1rem] shrink-0" />
          <span className="min-w-0 flex-1 truncate">{item.label}</span>
          {item.badge && (
            <span
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 text-[0.68rem] font-bold",
                item.badge.tone === "danger" ? "bg-danger text-white" : active ? "bg-white/20 text-white" : "bg-white/10 text-white/80",
              )}
            >
              {item.badge.text}
            </span>
          )}
        </Link>
      </li>
    );
  };

  const SidebarContent = (
    <>
      <Logo compact className="mb-5 px-1" />
      <p className="px-3.5 text-[0.68rem] font-bold tracking-[0.12em] text-white/40 uppercase">{hubLabel ?? `${roleLabel} Hub`}</p>
      <nav aria-label={`${roleLabel} navigation`} className="mt-3 flex-1">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </ul>
      </nav>
      {secondaryNavItems && secondaryNavItems.length > 0 && (
        <ul className="flex flex-col gap-1 border-t border-white/10 pt-3">
          {secondaryNavItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </ul>
      )}
      {isClient && user && (
        <div className="mt-4 border-t border-white/10 pt-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-2.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary-soft text-sm font-semibold text-accent">
              {initials(user.name)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-white">{user.name}</span>
              <span className="block truncate text-xs text-white/50 capitalize">{roleLabel}</span>
            </span>
          </div>
          <button
            type="button"
            onClick={doLogout}
            className="mt-2 flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-semibold text-white/60 hover:bg-white/8 hover:text-white"
          >
            <LogOut className="size-[1.1rem]" /> Logout
          </button>
        </div>
      )}
    </>
  );

  return (
    <div className={cn("mx-auto flex max-w-[1600px]", offsetTop ? "min-h-[calc(100vh-var(--header-h))]" : "min-h-screen")}>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "sticky hidden w-64 shrink-0 flex-col bg-ink p-5 lg:flex",
          offsetTop ? "top-[var(--header-h)] h-[calc(100vh-var(--header-h))]" : "top-0 h-screen",
        )}
      >
        {SidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-ink p-5 shadow-2xl">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 rounded-md p-1.5 text-white/70 hover:text-white"
              aria-label="Close menu"
            >
              <X className="size-5" />
            </button>
            {SidebarContent}
          </div>
        </div>
      )}

      <main className="min-w-0 flex-1">
        {/* Mobile top bar — in normal flow so it always sits right under the site header (when present) */}
        <div className={cn("sticky z-30 flex h-14 items-center justify-between border-b border-border bg-surface px-4 lg:hidden", offsetTop ? "top-[var(--header-h)]" : "top-0")}>
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
