"use client";

import { useState } from "react";
import { RequireRole } from "@/components/account/RequireRole";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/Button";
import { Checkbox, FormInput } from "@/components/ui/FormInput";
import { useToast } from "@/context/ToastContext";

function SettingsForm() {
  const { toast } = useToast();
  const [notify, setNotify] = useState({ orders: true, messages: true, marketing: false });
  const [payout, setPayout] = useState("");

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Settings saved" });
  };

  return (
    <form onSubmit={save} className="flex max-w-xl flex-col gap-8">
      <section>
        <h2 className="font-serif text-2xl font-semibold">Notifications</h2>
        <div className="mt-4 flex flex-col gap-4">
          <Checkbox label="New orders" description="Get notified when a customer places an order." checked={notify.orders} onChange={(e) => setNotify((n) => ({ ...n, orders: e.target.checked }))} />
          <Checkbox label="Customer messages" description="Get notified about questions on your listings." checked={notify.messages} onChange={(e) => setNotify((n) => ({ ...n, messages: e.target.checked }))} />
          <Checkbox label="Marketing tips" description="Occasional tips on selling well." checked={notify.marketing} onChange={(e) => setNotify((n) => ({ ...n, marketing: e.target.checked }))} />
        </div>
      </section>
      <section className="border-t border-border pt-8">
        <h2 className="font-serif text-2xl font-semibold">Payout details</h2>
        <p className="mt-1 text-sm text-muted">Connects to a local payment gateway once available. Not active in this demo.</p>
        <FormInput className="mt-4" label="Mobile banking account" placeholder="e.g. 17XXXXXX" value={payout} onChange={(e) => setPayout(e.target.value)} />
      </section>
      <Button type="submit" className="self-start">
        Save settings
      </Button>
    </form>
  );
}

export default function SellerSettingsPage() {
  return (
    <RequireRole role="artisan">
      <DashboardHeader title="Settings" />
      <SettingsForm />
    </RequireRole>
  );
}
