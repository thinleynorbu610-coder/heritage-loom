"use client";

import { Info, Lock, LogIn, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { Checkbox, FormInput } from "@/components/ui/FormInput";
import { DEMO_ACCOUNTS, dashboardPathFor, useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import type { UserRole } from "@/types";

function LoginForm() {
  const { loginWithEmail } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const redirect = (role: UserRole) => router.push(params.get("next") || dashboardPathFor(role));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = "Please enter a valid email address.";
    if (password.length < 1) errs.password = "Please enter your password.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    window.setTimeout(() => {
      const user = loginWithEmail(email);
      setLoading(false);
      toast({ title: `Welcome back, ${user.name.split(" ")[0]}`, description: "Demo login — no password is verified." });
      redirect(user.role);
    }, 500);
  };

  const quickLogin = (role: UserRole) => {
    const user = DEMO_ACCOUNTS[role];
    setEmail(user.email);
    setPassword("demo");
  };

  return (
    <>
      <form onSubmit={submit} noValidate className="flex flex-col gap-5">
        <FormInput
          label="Email"
          type="email"
          autoComplete="email"
          icon={<Mail className="size-4" aria-hidden />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          required
        />
        <FormInput
          label="Password"
          type="password"
          autoComplete="current-password"
          icon={<Lock className="size-4" aria-hidden />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          required
        />
        <div className="flex items-center justify-between">
          <Checkbox label="Remember me" defaultChecked />
          <Link href="/forgot-password" className="text-sm font-semibold text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" size="lg" loading={loading}>
          <LogIn className="size-4" aria-hidden /> Login
        </Button>
      </form>

      <div className="mt-6 flex items-start gap-2 rounded-lg border border-info/20 bg-info-soft p-4 text-sm text-info">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
        <p>
          This is a demo — any email/password logs you in. Try a role:{" "}
          <button type="button" onClick={() => quickLogin("customer")} className="font-semibold underline underline-offset-2">
            Customer
          </button>
          ,{" "}
          <button type="button" onClick={() => quickLogin("artisan")} className="font-semibold underline underline-offset-2">
            Artisan
          </button>
          , or{" "}
          <button type="button" onClick={() => quickLogin("admin")} className="font-semibold underline underline-offset-2">
            Admin
          </button>
          .
        </p>
      </div>

      <p className="mt-8 text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-primary hover:underline">
          Create one
        </Link>
      </p>
      <p className="mt-2 text-muted">
        Selling your craft?{" "}
        <Link href="/signup/artisan" className="font-semibold text-primary hover:underline">
          Continue as Artisan
        </Link>
      </p>
    </>
  );
}

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to track orders, manage your wishlist and more."
      panel={{ quote: "Every piece tells a story. Every purchase carries it forward.", attribution: "Heritage Loom" }}
    >
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
