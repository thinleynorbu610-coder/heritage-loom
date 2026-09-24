"use client";

import { Mail, Phone, Store, User, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { Checkbox, FormInput } from "@/components/ui/FormInput";
import { dashboardPathFor, useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

type Errors = Partial<Record<"name" | "email" | "phone" | "password" | "confirm" | "terms", string>>;

export default function SignupPage() {
  const { register } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Errors = {};
    if (form.name.trim().length < 2) errs.name = "Please enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Please enter a valid email address.";
    if (!/^\d{8}$/.test(form.phone.replace(/\D/g, ""))) errs.phone = "Enter an 8-digit phone number.";
    if (form.password.length < 8) errs.password = "Password must be at least 8 characters.";
    if (form.confirm !== form.password) errs.confirm = "Passwords do not match.";
    if (!terms) errs.terms = "Please agree to the terms to continue.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    window.setTimeout(() => {
      const user = register({ name: form.name, email: form.email, phone: form.phone, role: "customer" });
      setLoading(false);
      toast({ title: `Welcome to Heritage Loom, ${user.name.split(" ")[0]}`, description: "Your account has been created." });
      router.push(dashboardPathFor("customer"));
    }, 500);
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join Heritage Loom to shop, save favourites and track orders."
      panel={{ quote: "Handmade in Bhutan, brought closer to you.", attribution: "Heritage Loom" }}
    >
      <form onSubmit={submit} noValidate className="flex flex-col gap-5">
        <FormInput label="Full name" autoComplete="name" icon={<User className="size-4" aria-hidden />} value={form.name} onChange={set("name")} error={errors.name} required />
        <FormInput label="Email" type="email" autoComplete="email" icon={<Mail className="size-4" aria-hidden />} value={form.email} onChange={set("email")} error={errors.email} required />
        <FormInput label="Phone" type="tel" inputMode="tel" placeholder="17 12 34 56" autoComplete="tel" icon={<Phone className="size-4" aria-hidden />} value={form.phone} onChange={set("phone")} error={errors.phone} required />
        <div className="grid gap-5 sm:grid-cols-2">
          <FormInput label="Password" type="password" autoComplete="new-password" value={form.password} onChange={set("password")} error={errors.password} hint="At least 8 characters." required />
          <FormInput label="Confirm password" type="password" autoComplete="new-password" value={form.confirm} onChange={set("confirm")} error={errors.confirm} required />
        </div>
        <div>
          <Checkbox
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
            label={
              <>
                I agree to the{" "}
                <Link href="/terms" className="font-semibold text-primary hover:underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="font-semibold text-primary hover:underline">
                  Privacy Policy
                </Link>
              </>
            }
          />
          {errors.terms && (
            <p className="mt-2 text-sm font-medium text-danger" role="alert">
              {errors.terms}
            </p>
          )}
        </div>
        <Button type="submit" size="lg" loading={loading}>
          <UserPlus className="size-4" aria-hidden /> Create account
        </Button>
      </form>

      <Link
        href="/signup/artisan"
        className="mt-6 flex items-center gap-3 rounded-xl border border-dashed border-border-strong p-4 transition-colors hover:border-primary hover:bg-primary-soft/40"
      >
        <Store className="size-6 shrink-0 text-primary" aria-hidden />
        <span>
          <span className="block font-semibold">Continue as Artisan</span>
          <span className="block text-sm text-muted">Sell your craft on Heritage Loom instead</span>
        </span>
      </Link>

      <p className="mt-8 text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}
