"use client";

import { ChevronRight, Heart, LogOut, Package, Search, Store, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MotifDivider } from "@/components/ui/Motif";
import { Drawer } from "@/components/ui/Overlay";
import { dashboardPathFor, useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";
import { getCategories } from "@/services/catalog";
import { mainNav } from "./navigation";

export function MobileNavigation({
  open,
  onClose,
  onSearch,
}: {
  open: boolean;
  onClose: () => void;
  onSearch: () => void;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { ids } = useWishlist();

  const linkCls = (href: string) =>
    cn(
      "flex items-center justify-between rounded-lg px-4 py-3.5 font-serif text-2xl font-semibold transition-colors",
      (href === "/" ? pathname === "/" : pathname.startsWith(href)) ? "bg-primary-soft text-primary" : "hover:bg-surface-muted",
    );

  return (
    <Drawer open={open} onClose={onClose} title="Menu" side="left" className="max-w-sm">
      <div className="flex flex-col gap-6 p-4">
        <button
          type="button"
          onClick={onSearch}
          className="flex h-12 items-center gap-3 rounded-full border border-border bg-surface px-4 text-left text-muted"
        >
          <Search className="size-4" aria-hidden />
          Search crafts, textiles, artisans...
        </button>

        <nav aria-label="Mobile">
          <ul className="flex flex-col gap-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={onClose} className={linkCls(item.href)}>
                  {item.label}
                  <ChevronRight className="size-5 text-subtle" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="eyebrow mb-3 px-4">Shop by craft</p>
          <ul className="grid grid-cols-2 gap-2">
            {getCategories().map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/shop?category=${c.slug}`}
                  onClick={onClose}
                  className="block rounded-lg border border-border bg-surface px-3 py-2.5 text-sm font-semibold hover:border-primary hover:text-primary"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <MotifDivider />

        <ul className="flex flex-col gap-1 text-[0.95rem] font-semibold">
          <li>
            <Link
              href={user ? dashboardPathFor(user.role) : "/login"}
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-surface-muted"
            >
              <User className="size-5 text-muted" aria-hidden />
              {user ? `My account (${user.name.split(" ")[0]})` : "Login or create account"}
            </Link>
          </li>
          <li>
            <Link href="/wishlist" onClick={onClose} className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-surface-muted">
              <Heart className="size-5 text-muted" aria-hidden />
              Wishlist {ids.length > 0 && <span className="text-muted">({ids.length})</span>}
            </Link>
          </li>
          <li>
            <Link href="/track-order" onClick={onClose} className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-surface-muted">
              <Package className="size-5 text-muted" aria-hidden />
              Track an order
            </Link>
          </li>
          <li>
            <Link href="/signup/artisan" onClick={onClose} className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-surface-muted">
              <Store className="size-5 text-muted" aria-hidden />
              Sell on Heritage Loom
            </Link>
          </li>
          {user && (
            <li>
              <button
                type="button"
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-danger hover:bg-danger-soft"
              >
                <LogOut className="size-5" aria-hidden />
                Log out
              </button>
            </li>
          )}
        </ul>
      </div>
    </Drawer>
  );
}
