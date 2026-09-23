"use client";

import { LogIn } from "lucide-react";
import { usePathname } from "next/navigation";
import { LinkButton } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/LoadingSkeleton";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/types";

/**
 * Client-side guard for demo auth. Since there's no real backend/session,
 * this renders a friendly prompt rather than redirecting, so the flow stays
 * demonstrable without a hard bounce.
 */
export function RequireRole({ role, children }: { role: UserRole; children: React.ReactNode }) {
  const { user, ready } = useAuth();
  const pathname = usePathname();

  if (!ready) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!user || user.role !== role) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-dashed border-border-strong bg-surface p-10 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-primary-soft text-primary">
          <LogIn className="size-6" aria-hidden />
        </span>
        <h1 className="mt-5 font-serif text-3xl font-semibold">
          {user ? "This dashboard isn't available for your account" : "Please log in to continue"}
        </h1>
        <p className="mt-2 max-w-md text-muted">
          {user
            ? `You're logged in as a ${user.role}. Switch accounts from the login page to view this dashboard.`
            : "Log in to view this page. In this demo, you can try any of the three account roles."}
        </p>
        <LinkButton href={`/login?next=${encodeURIComponent(pathname)}`} className="mt-6">
          Go to login
        </LinkButton>
      </div>
    );
  }

  return <>{children}</>;
}
