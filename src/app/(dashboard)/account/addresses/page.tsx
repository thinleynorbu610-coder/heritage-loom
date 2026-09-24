"use client";

import { MapPin, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { RequireRole } from "@/components/account/RequireRole";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { FormInput, Select, Textarea } from "@/components/ui/FormInput";
import { Modal } from "@/components/ui/Overlay";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { dzongkhags } from "@/data/regions";
import type { DeliveryAddress } from "@/types";

const emptyAddress: DeliveryAddress = { fullName: "", phone: "", address: "", dzongkhag: "", gewog: "", notes: "" };

function Addresses() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<(DeliveryAddress & { id: string; label: string })[]>([
    { id: "addr-1", label: "Home", fullName: user?.name ?? "Tenzin Norbu", phone: user?.phone ?? "17 12 34 56", address: "House 12, Norzin Lam", dzongkhag: "Thimphu", gewog: "Chang" },
  ]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyAddress);
  const [label, setLabel] = useState("");

  const set = (k: keyof DeliveryAddress) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setAddresses((prev) => [...prev, { ...form, id: `addr-${Date.now()}`, label: label || "Address" }]);
    setOpen(false);
    setForm(emptyAddress);
    setLabel("");
    toast({ title: "Address saved" });
  };

  const remove = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    toast({ title: "Address removed", variant: "info" });
  };

  return (
    <>
      {addresses.length === 0 ? (
        <EmptyState
          icon={<MapPin className="size-6" />}
          title="No saved addresses"
          description="Save an address to speed up checkout next time."
          action={<Button onClick={() => setOpen(true)}>Add address</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((a, i) => (
            <div key={a.id} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{a.label}</span>
                  {i === 0 && <Badge tone="primary">Default</Badge>}
                </div>
                <button type="button" onClick={() => remove(a.id)} className="rounded-md p-1.5 text-subtle hover:bg-danger-soft hover:text-danger" aria-label={`Remove ${a.label} address`}>
                  <Trash2 className="size-4" />
                </button>
              </div>
              <p className="mt-3 text-sm">{a.fullName}</p>
              <p className="text-sm text-muted">
                {a.address}, {a.gewog}, {a.dzongkhag}
              </p>
              <p className="text-sm text-muted">{a.phone}</p>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border-strong p-5 text-muted transition-colors hover:border-primary hover:text-primary"
          >
            <Plus className="size-5" />
            <span className="font-semibold">Add new address</span>
          </button>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Add address" footer={<Button type="submit" form="address-form">Save address</Button>}>
        <form id="address-form" onSubmit={save} className="flex flex-col gap-4">
          <FormInput label="Label" placeholder="e.g. Home, Office" value={label} onChange={(e) => setLabel(e.target.value)} />
          <FormInput label="Full name" value={form.fullName} onChange={set("fullName")} required />
          <FormInput label="Phone number" type="tel" value={form.phone} onChange={set("phone")} required />
          <FormInput label="Address" value={form.address} onChange={set("address")} required />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Dzongkhag" placeholder="Choose" options={dzongkhags} value={form.dzongkhag} onChange={set("dzongkhag")} required />
            <FormInput label="Gewog" value={form.gewog} onChange={set("gewog")} required />
          </div>
          <Textarea label="Notes" optional rows={2} value={form.notes} onChange={set("notes")} />
        </form>
      </Modal>
    </>
  );
}

export default function AddressesPage() {
  return (
    <RequireRole role="customer">
      <DashboardHeader title="Addresses" description="Saved delivery addresses for faster checkout." />
      <Addresses />
    </RequireRole>
  );
}
