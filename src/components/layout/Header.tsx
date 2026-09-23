"use client";

import { ChevronDown, Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { SmartImage } from "@/components/ui/SmartImage";
import { dashboardPathFor, useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useIsClient } from "@/lib/persistent-store";
import { cn } from "@/lib/utils";
import { getCategories } from "@/services/catalog";
import { CartDrawer } from "./CartDrawer";
import { MobileNavigation } from "./MobileNavigation";
import { mainNav } from "./navigation";
import { SearchOverlay } from "./SearchOverlay";

function HeaderAction({
  label,
  icon,
  count,
  onClick,
  href,
  className,
}: {
  label: string;
  icon: React.ReactNode;
  count?: number;
  onClick?: () => void;
  href?: string;
  className?: string;
}) {
  const inner = (
    <>
      <span className="relative">
        {icon}
        {!!count && (
          <span className="absolute -top-2 -right-2.5 flex h-[1.15rem] min-w-[1.15rem] animate-scale-in items-center justify-center rounded-full bg-secondary px-1 text-[0.65rem] font-bold text-white tabular-nums">
            {count}
          </span>
        )}
      </span>
      <span className="text-[0.68rem] font-semibold tracking-wide">{label}</span>
    </>
  );
  const cls = cn(
    "flex h-14 min-w-14 flex-col items-center justify-center gap-1 rounded-md px-2 text-white transition-colors hover:bg-white/15",
    className,
  );
  const aria = count ? `${label}, ${count} item${count === 1 ? "" : "s"}` : label;
  return href ? (
    <Link href={href} className={cls} aria-label={aria}>
      {inner}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={cls} aria-label={aria}>
      {inner}
    </button>
  );
}

export function Header() {
  const pathname = usePathname();
  const { count, open: openCart } = useCart();
  const { ids } = useWishlist();
  const { user } = useAuth();
  const isClient = useIsClient();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const cartCount = isClient ? count : 0;
  const wishCount = isClient ? ids.length : 0;
  const accountHref = user ? dashboardPathFor(user.role) : "/login";
  const accountLabel = isClient && user ? user.name.split(" ")[0] : "Login";

  return (
    <>
      <div className="bg-ink text-background">
        <div className="container-page flex h-9 items-center justify-center text-center text-xs tracking-wide sm:justify-between">
          <p>
            <span className="text-secondary">Free delivery</span> across Bhutan on orders over Nu. 5,000
          </p>
          <p className="hidden text-background/70 sm:block">Every piece made by a verified Bhutanese artisan</p>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 border-b bg-primary transition-[box-shadow,border-color] duration-300",
          scrolled
            ? "border-primary-hover shadow-[0_6px_24px_-18px_rgb(10_30_45/0.5)]"
            : "border-primary/70",
        )}
      >
        <div className="container-page flex h-[var(--header-h)] items-center gap-4">
          {/* Mobile: menu */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="-ml-2 flex flex-col items-center gap-0.5 rounded-md p-2 text-white lg:hidden"
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <Menu className="size-5" aria-hidden />
            <span className="text-[0.62rem] font-semibold">Menu</span>
          </button>

          <Logo tone="light" className="mx-auto lg:mx-0" />

          <nav aria-label="Main" className="ml-8 hidden flex-1 items-center gap-1 lg:flex">
            {mainNav.map((item) =>
              item.label === "Categories" ? (
                <div key={item.href} className="group/cat relative">
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1 rounded-md px-3.5 py-2 text-[0.94rem] font-semibold text-white transition-colors hover:text-white/75",
                      isActive(item.href) && "underline decoration-2 underline-offset-4",
                    )}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <ChevronDown className="size-3.5 transition-transform group-hover/cat:rotate-180" aria-hidden />
                  </Link>
                  <div className="invisible absolute top-full left-1/2 w-[640px] -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-focus-within/cat:visible group-focus-within/cat:opacity-100 group-hover/cat:visible group-hover/cat:opacity-100">
                    <div className="grid grid-cols-3 gap-2 rounded-xl border border-border bg-surface p-3 shadow-lift">
                      {getCategories().map((c) => (
                        <Link
                          key={c.slug}
                          href={`/shop?category=${c.slug}`}
                          className="group/item flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-surface-muted"
                        >
                          <span className="relative size-12 shrink-0 overflow-hidden rounded-md bg-surface-muted">
                            <SmartImage src={c.image} alt="" fill sizes="48px" className="object-cover" />
                          </span>
                          <span className="text-sm leading-tight font-semibold group-hover/item:text-primary">
                            {c.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "relative rounded-md px-3.5 py-2 text-[0.94rem] font-semibold text-white transition-colors hover:text-white/75",
                  )}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <span className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-white" aria-hidden />
                  )}
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-0.5 lg:ml-auto">
            <HeaderAction
              label="Search"
              icon={<Search className="size-5" aria-hidden />}
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex"
            />
            <HeaderAction
              label="Wishlist"
              icon={<Heart className="size-5" aria-hidden />}
              count={wishCount}
              href="/wishlist"
              className="hidden sm:flex"
            />
            <HeaderAction
              label={accountLabel}
              icon={<User className="size-5" aria-hidden />}
              href={accountHref}
              className="hidden lg:flex"
            />
            <HeaderAction
              label="Cart"
              icon={<ShoppingBag className="size-5" aria-hidden />}
              count={cartCount}
              onClick={openCart}
              className="-mr-2 lg:mr-0"
            />
          </div>
        </div>
      </header>

      <MobileNavigation
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onSearch={() => {
          setMenuOpen(false);
          setSearchOpen(true);
        }}
      />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer />
    </>
  );
}
