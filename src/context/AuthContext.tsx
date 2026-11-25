"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { createPersistentStore, useIsClient, useStore } from "@/lib/persistent-store";
import { apiRequest, authHeaders } from "@/lib/api";
import type { SessionUser, UserRole } from "@/types";

export const DEMO_ACCOUNTS: Record<UserRole, SessionUser> = {
  customer: { id: "usr-1", name: "Tenzin Norbu", email: "tenzin@example.bt", phone: "17 12 34 56", role: "customer" },
  artisan: { id: "usr-3", name: "Pema Choden", email: "pema@example.bt", phone: "17 55 66 77", role: "artisan", artisanId: "art-001" },
  admin: { id: "usr-7", name: "Admin Team", email: "admin@heritageloom.bt", role: "admin" },
};

const sessionStore = createPersistentStore<SessionUser | null>("hl.session", null);
interface AuthContextValue {
  user: SessionUser | null; ready: boolean;
  loginAs: (role: UserRole) => SessionUser;
  loginWithEmail: (email: string, password: string) => Promise<SessionUser>;
  register: (input: { name: string; email: string; phone?: string; role?: UserRole; password?: string }) => Promise<SessionUser>;
  updateProfile: (patch: Partial<Pick<SessionUser, "name" | "email" | "phone">>) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextValue | null>(null);

function apiUser(user: { id: string; name: string; email: string; role: "user" | "seller" | "admin" }): SessionUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role === "user" ? "customer" : user.role === "seller" ? "artisan" : "admin",
  };
}
function saveSession(user: SessionUser, token: string) { sessionStore.set(user); window.localStorage.setItem("hl.auth.token", token); }

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useStore(sessionStore); const ready = useIsClient();
  const loginAs = useCallback((role: UserRole) => { const u = DEMO_ACCOUNTS[role]; sessionStore.set(u); return u; }, []);
  const loginWithEmail = useCallback(async (email: string, password: string) => {
    const result = await apiRequest<{ user: { id: string; name: string; email: string; role: "user" | "seller" | "admin" }; token: string }>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    const u = apiUser(result.user); saveSession(u, result.token); return u;
  }, []);
  const register = useCallback(async ({ name, email, phone, password = "temporary-demo-password" }: { name: string; email: string; phone?: string; role?: UserRole; password?: string }) => {
    const result = await apiRequest<{ user: { id: string; name: string; email: string; role: "user" | "seller" | "admin" }; token: string }>("/api/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) });
    const u = { ...apiUser(result.user), phone }; saveSession(u, result.token); return u;
  }, []);
  const updateProfile = useCallback((patch: Partial<Pick<SessionUser, "name" | "email" | "phone">>) => sessionStore.set((prev) => prev ? { ...prev, ...patch } : prev), []);
  const logout = useCallback(() => { sessionStore.set(null); window.localStorage.removeItem("hl.auth.token"); }, []);
  const value = useMemo(() => ({ user, ready, loginAs, loginWithEmail, register, updateProfile, logout }), [user, ready, loginAs, loginWithEmail, register, updateProfile, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const ctx = useContext(AuthContext); if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>"); return ctx; }
export function dashboardPathFor(role: UserRole) { return role === "admin" ? "/admin" : role === "artisan" ? "/seller" : "/account"; }
