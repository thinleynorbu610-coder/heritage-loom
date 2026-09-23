"use client";

import { useState } from "react";
import { RequireRole } from "@/components/account/RequireRole";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/Button";
import { Checkbox, FormInput } from "@/components/ui/FormInput";
import { useToast } from "@/context/ToastContext";

function PlatformSettings() {
  const { toast } = useToast();
  const [deliveryFee, setDeliveryFee] = useState("150");
  const [freeThreshold, setFreeThreshold] = useState("5000");
  const [autoApprove, setAutoApprove] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Settings saved" });
  };

  return (
    <form onSubmit={submit} className="flex max-w-xl flex-col gap-8">
      <section>
        <h2 className="font-serif text-2xl font-semibold">Delivery</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <FormInput label="Standard delivery fee (Nu.)" type="number" value={deliveryFee} onChange={(e) => setDeliveryFee(e.target.value)} />
          <FormInput label="Free delivery threshold (Nu.)" type="number" value={freeThreshold} onChange={(e) => setFreeThreshold(e.target.value)} />
        </div>
      </section>
      <section className="border-t border-border pt-8">
        <h2 className="font-serif text-2xl font-semibold">Moderation</h2>
        <div className="mt-4">
          <Checkbox
            label="Auto-approve listings from verified artisans"
            description="New products from already-verified artisans skip manual review."
            checked={autoApprove}
            onChange={(e) => setAutoApprove(e.target.checked)}
          />
        </div>
      </section>
      <Button type="submit" className="self-start">
        Save settings
      </Button>
    </form>
  );
}

export default function AdminSettingsPage() {
  return (
    <RequireRole role="admin">
      <DashboardHeader title="Settings" description="Platform-wide configuration." />
      <PlatformSettings />
    </RequireRole>
  );
}
