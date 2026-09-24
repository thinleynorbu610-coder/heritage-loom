"use client";

import { useState } from "react";
import { RequireRole } from "@/components/account/RequireRole";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FormInput, Select, Textarea } from "@/components/ui/FormInput";
import { SmartImage } from "@/components/ui/SmartImage";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { getArtisanById, getRegions } from "@/services/catalog";

function SellerProfileForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const artisan = user?.artisanId ? getArtisanById(user.artisanId) : undefined;
  const regions = getRegions();
  const [form, setForm] = useState({
    name: artisan?.name ?? "",
    specialty: artisan?.specialty ?? "",
    region: artisan?.region ?? "",
    story: artisan?.story ?? "",
  });
  const [saving, setSaving] = useState(false);

  if (!artisan) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      toast({ title: "Profile updated", description: "Changes will appear on your public artisan page." });
    }, 500);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-surface p-6 text-center">
        <span className="relative size-32 overflow-hidden rounded-full bg-surface-muted">
          <SmartImage src={artisan.portrait} alt="" fill sizes="128px" className="object-cover" />
        </span>
        <div>
          <p className="font-semibold">{artisan.name}</p>
          <p className="text-sm text-muted">{artisan.specialty}</p>
        </div>
        {artisan.verified ? <Badge tone="success">Verified</Badge> : <Badge tone="warning">Pending verification</Badge>}
        <Button variant="outline" size="sm">
          Change photo
        </Button>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-5">
        <FormInput label="Display name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        <div className="grid gap-5 sm:grid-cols-2">
          <FormInput label="Specialty" value={form.specialty} onChange={(e) => setForm((f) => ({ ...f, specialty: e.target.value }))} />
          <Select label="Region" options={regions.map((r) => ({ value: r.slug, label: r.name }))} value={form.region} onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))} />
        </div>
        <Textarea label="Your story" rows={6} value={form.story} onChange={(e) => setForm((f) => ({ ...f, story: e.target.value }))} hint="This appears on your public artisan page." />
        <Button type="submit" loading={saving} className="self-start">
          Save profile
        </Button>
      </form>
    </div>
  );
}

export default function SellerProfilePage() {
  return (
    <RequireRole role="artisan">
      <DashboardHeader title="Profile" description="This is how customers see you on Heritage Loom." />
      <SellerProfileForm />
    </RequireRole>
  );
}
