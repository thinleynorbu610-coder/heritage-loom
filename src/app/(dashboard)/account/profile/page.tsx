"use client";

import { MapPin, ShieldCheck, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Addresses } from "@/app/(dashboard)/account/addresses/page";
import { RequireRole } from "@/components/account/RequireRole";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/ui/FormInput";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { initials } from "@/lib/utils";

function ProfileForm() {
  const { user, updateProfile, logout } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [form, setForm] = useState({ name: user?.name ?? "", email: user?.email ?? "", phone: user?.phone ?? "" });
  const [saving, setSaving] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    window.setTimeout(() => {
      updateProfile(form);
      setSaving(false);
      toast({ title: "Profile updated" });
    }, 400);
  };

  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <div className="flex items-center gap-4 border-b border-border pb-6">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary-soft font-serif text-2xl font-semibold text-primary">
            {user ? initials(user.name) : ""}
          </span>
          <div className="min-w-0">
            <p className="truncate font-serif text-2xl font-semibold">{user?.name}</p>
            <p className="mt-1 text-sm text-muted">Customer account</p>
          </div>
        </div>

        <form onSubmit={submit} className="mt-7 flex flex-col gap-5">
          <div>
            <h2 className="font-serif text-2xl font-semibold">Personal details</h2>
            <p className="mt-1 text-sm text-muted">Keep your contact information up to date.</p>
          </div>
          <FormInput label="Full name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          <FormInput label="Email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
          <FormInput label="Phone" type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="17 12 34 56" />
          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" loading={saving}>Save changes</Button>
            <Button type="button" variant="outline" onClick={() => { logout(); router.push("/"); }}>Logout</Button>
          </div>
        </form>
      </div>

      <aside className="flex flex-col gap-3">
        <div className="rounded-2xl bg-ink p-6 text-background">
          <ShieldCheck className="size-6 text-secondary" aria-hidden />
          <h2 className="mt-5 font-serif text-2xl font-semibold">Your account</h2>
          <p className="mt-2 text-sm leading-relaxed text-background/70">Your details are used to make checkout and delivery easier.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-xl border border-border bg-background p-4">
            <UserRound className="size-5 text-primary" aria-hidden />
            <p className="mt-3 text-sm font-semibold">Personal details</p>
            <p className="mt-1 text-xs text-muted">Name, email and phone</p>
          </div>
          <div className="rounded-xl border border-border bg-background p-4">
            <MapPin className="size-5 text-primary" aria-hidden />
            <p className="mt-3 text-sm font-semibold">Saved addresses</p>
            <p className="mt-1 text-xs text-muted">Manage delivery destinations below</p>
          </div>
        </div>
      </aside>
    </section>
  );
}

export default function ProfilePage() {
  return (
    <RequireRole role="customer">
      <DashboardHeader title="Profile" description="Manage your personal details and saved delivery addresses." />
      <ProfileForm />
      <section className="mt-12 border-t border-border pt-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Delivery</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold">Saved addresses</h2>
            <p className="mt-1 text-muted">Save an address to speed up checkout next time.</p>
          </div>
          <MapPin className="hidden size-7 text-primary sm:block" aria-hidden />
        </div>
        <Addresses />
      </section>
    </RequireRole>
  );
}
