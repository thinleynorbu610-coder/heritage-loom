"use client";

import { useState } from "react";
import { RequireRole } from "@/components/account/RequireRole";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/ui/FormInput";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { initials } from "@/lib/utils";

function ProfileForm() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
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
    <div className="max-w-xl">
      <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-5">
        <span className="flex size-16 items-center justify-center rounded-full bg-primary-soft text-xl font-semibold text-primary">
          {user ? initials(user.name) : ""}
        </span>
        <div>
          <p className="font-semibold">{user?.name}</p>
          <p className="text-sm text-muted capitalize">{user?.role} account</p>
        </div>
      </div>
      <form onSubmit={submit} className="mt-6 flex flex-col gap-5">
        <FormInput label="Full name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
        <FormInput label="Email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
        <FormInput label="Phone" type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="17 12 34 56" />
        <Button type="submit" loading={saving} className="self-start">
          Save changes
        </Button>
      </form>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <RequireRole role="customer">
      <DashboardHeader title="Profile" description="Manage your personal details." />
      <ProfileForm />
    </RequireRole>
  );
}
