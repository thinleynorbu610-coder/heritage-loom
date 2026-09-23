"use client";

/**
 * DEMO AUTHENTICATION — no credentials are checked and nothing leaves the
 * browser. The Go API will issue sessions (e.g. HTTP-only cookies) and this
 * provider will then read the current user from `GET /api/v1/me`.
 */
import { createContext, useCallback, useContext, useMemo } from "react";
import { createPersistentStore, useIsClient, useStore } from "@/lib/persistent-store";
import type { SessionUser, UserRole } from "@/types";

export const DEMO_ACCOUNTS: Record<UserRole, SessionUser> = {
  customer: { id: "usr-1", name: "Tenzin Norbu", email: "tenzin@example.bt", phone: "17 12 34 56", role: "customer" },
  artisan: { id: "usr-3", name: "Pema Choden", email: "pema@example.bt", phone: "17 55 66 77", role: "artisan", artisanId: "art-001" },
  admin: { id: "usr-7", name: "Admin Team", email: "admin@heritageloom.bt", role: "admin" },
};

const sessionStore = createPersistentStore<SessionUser | null>("hl.session", null);

interface AuthContextValue {
  user: SessionUser | null;
  ready: boolean;
  loginAs: (role: UserRole) => SessionUser;
  loginWithEmail: (email: string) => SessionUser;
  register: (input: { name: string; email: string; phone?: string; role?: UserRole }) => SessionUser;
  updateProfile: (patch: Partial<Pick<SessionUser, "name" | "email" | "phone">>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useStore(sessionStore);
  const ready = useIsClient();

  const loginAs = useCallback((role: UserRole) => {
    const u = DEMO_ACCOUNTS[role];
    sessionStore.set(u);
    return u;
  }, []);

  const loginWithEmail = useCallback((email: string) => {
    const match = Object.values(DEMO_ACCOUNTS).find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
    const u: SessionUser = match ?? {
      ...DEMO_ACCOUNTS.customer,
      id: "usr-guest",
      email: email.trim(),
      name: email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    };
    sessionStore.set(u);
    return u;
  }, []);

  const register = useCallback<AuthContextValue["register"]>(({ name, email, phone, role = "customer" }) => {
    const u: SessionUser = {
      id: `usr-${Date.now()}`,
      name,
      email,
      phone,
      role,
      artisanId: role === "artisan" ? "art-001" : undefined,
    };
    sessionStore.set(u);
    return u;
  }, []);

  const updateProfile = useCallback<AuthContextValue["updateProfile"]>((patch) => {
    sessionStore.set((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  const logout = useCallback(() => sessionStore.set(null), []);

  const value = useMemo(
    () => ({ user, ready, loginAs, loginWithEmail, register, updateProfile, logout }),
    [user, ready, loginAs, loginWithEmail, register, updateProfile, logout],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export function dashboardPathFor(role: UserRole) {
  return role === "admin" ? "/admin" : role === "artisan" ? "/seller" : "/account";
}
