"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const publicPaths = ["/", "/our-story", "/login", "/signup", "/forgot-password"];

export function GuestAccessGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user } = useAuth();

  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    if (user) return;
    const target = (event.target as HTMLElement).closest("a") as HTMLAnchorElement | null;
    if (!target) return;
    const href = target.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
    const path = href.split("?")[0];
    if (publicPaths.includes(path)) return;
    event.preventDefault();
    router.push(`/login?redirect=${encodeURIComponent(href)}`);
  }

  return <div onClick={handleClick}>{children}</div>;
}
