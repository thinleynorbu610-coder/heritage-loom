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
import { createPersistentStore, useStore } from "@/lib/persistent-store";
import { getArtisanById, getRegions } from "@/services/catalog";

type ProfileOverride = { name: string; specialty: string; region: string; village: string; story: string };

// Local overrides for the demo — the catalog's seed data stays the source of
// truth elsewhere until the backend owns artisan profiles; this keeps a
// seller's own edits (and this page's preview) consistent across reloads.
const profileOverridesStore = createPersistentStore<Record<string, ProfileOverride>>("hl.sellerProfileOverrides", {});

function SellerProfileForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const artisan = user?.artisanId ? getArtisanById(user.artisanId) : undefined;
  const overrides = useStore(profileOverridesStore);
  const saved = user?.artisanId ? overrides[user.artisanId] : undefined;
  const regions = getRegions();
  const [form, setForm] = useState<ProfileOverride>({
    name: saved?.name ?? artisan?.name ?? "",
    specialty: saved?.specialty ?? artisan?.specialty ?? "",
    region: saved?.region ?? artisan?.region ?? "",
    village: saved?.village ?? artisan?.village ?? "",
    story: saved?.story ?? artisan?.story ?? "",
  });
  const [saving, setSaving] = useState(false);

  if (!artisan) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      profileOverridesStore.set((prev) => ({ ...prev, [user!.artisanId!]: form }));
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
          <p className="font-semibold">{form.name}</p>
          <p className="text-sm text-muted">{form.specialty}</p>
        </div>
        {artisan.verified ? <Badge tone="success">Verified</Badge> : <Badge tone="warning">Pending verification</Badge>}
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast({ title: "Demo only", description: "Photo uploads connect once storage is live." })}
        >
          Change photo
        </Button>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-5">
        <FormInput label="Display name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        <div className="grid gap-5 sm:grid-cols-2">
          <FormInput label="Specialty" value={form.specialty} onChange={(e) => setForm((f) => ({ ...f, specialty: e.target.value }))} />
          <Select label="Region" options={regions.map((r) => ({ value: r.slug, label: r.name }))} value={form.region} onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))} />
        </div>
        <FormInput label="Village" value={form.village} onChange={(e) => setForm((f) => ({ ...f, village: e.target.value }))} />
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
