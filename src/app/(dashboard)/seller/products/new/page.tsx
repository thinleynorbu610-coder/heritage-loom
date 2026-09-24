"use client";

import { CheckCircle2, ImagePlus, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RequireRole } from "@/components/account/RequireRole";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/Button";
import { FormInput, Select, Textarea } from "@/components/ui/FormInput";
import { useToast } from "@/context/ToastContext";
import { getCategories, getRegions } from "@/services/catalog";

type Errors = Partial<Record<"name" | "description" | "price" | "category" | "region" | "materials" | "technique" | "significance" | "images", string>>;

/**
 * Add Product — DEMO. Submitting only shows a confirmation; nothing is
 * persisted to a catalogue. `POST /api/v1/products` will replace this once
 * the backend exists.
 */
function ProductForm() {
  const { toast } = useToast();
  const router = useRouter();
  const categories = getCategories();
  const regions = getRegions();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    region: "",
    materials: "",
    technique: "",
    significance: "",
  });
  const [imageCount, setImageCount] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Errors = {};
    if (form.name.trim().length < 3) errs.name = "Please enter a product name.";
    if (form.description.trim().length < 20) errs.description = "Please describe the product (20+ characters).";
    if (!form.price || Number(form.price) <= 0) errs.price = "Please enter a valid price.";
    if (!form.category) errs.category = "Please choose a category.";
    if (!form.region) errs.region = "Please choose a region.";
    if (form.materials.trim().length < 2) errs.materials = "Please list at least one material.";
    if (form.technique.trim().length < 5) errs.technique = "Please describe the technique used.";
    if (form.significance.trim().length < 10) errs.significance = "Please share the cultural significance.";
    if (imageCount === 0) errs.images = "Please add at least one product image.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setDone(true);
      toast({ title: "Product submitted for review", description: form.name });
    }, 700);
  };

  if (done) {
    return (
      <div className="max-w-xl rounded-2xl border border-border bg-surface p-8 text-center">
        <CheckCircle2 className="mx-auto size-12 text-success" />
        <h2 className="mt-4 font-serif text-2xl font-semibold">Submitted for review</h2>
        <p className="mt-2 text-muted">
          <strong>{form.name}</strong> has been sent for admin review. Approved listings usually go live within one
          working day.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={() => router.push("/seller/products")}>View my products</Button>
          <Button variant="outline" onClick={() => { setDone(false); setForm({ name: "", description: "", price: "", category: "", region: "", materials: "", technique: "", significance: "" }); setImageCount(0); }}>
            Add another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="grid max-w-4xl gap-10 lg:grid-cols-[1.3fr_1fr]">
      <div className="flex flex-col gap-5">
        <FormInput label="Product name" value={form.name} onChange={set("name")} error={errors.name} placeholder="e.g. Handwoven Yathra Scarf" required />
        <Textarea label="Description" rows={4} value={form.description} onChange={set("description")} error={errors.description} placeholder="Describe the piece for customers browsing the shop." required />
        <div className="grid gap-5 sm:grid-cols-2">
          <FormInput label="Price (Nu.)" type="number" inputMode="numeric" min={1} value={form.price} onChange={set("price")} error={errors.price} required />
          <Select label="Category" placeholder="Choose category" options={categories.map((c) => ({ value: c.slug, label: c.name }))} value={form.category} onChange={set("category")} error={errors.category} required />
        </div>
        <Select label="Region" placeholder="Where is it made?" options={regions.map((r) => ({ value: r.slug, label: r.name }))} value={form.region} onChange={set("region")} error={errors.region} required />

        <div className="mt-2 border-t border-border pt-6">
          <p className="eyebrow">Cultural storytelling</p>
          <p className="mt-1 text-sm text-muted">These details appear prominently on the product page — they&apos;re what makes Heritage Loom different.</p>
          <div className="mt-5 flex flex-col gap-5">
            <FormInput label="Materials" placeholder="e.g. Cotton, Silk, Natural dyes" value={form.materials} onChange={set("materials")} error={errors.materials} required />
            <FormInput label="Traditional technique" placeholder="e.g. Backstrap loom weaving" value={form.technique} onChange={set("technique")} error={errors.technique} required />
            <Textarea label="Cultural significance" rows={3} value={form.significance} onChange={set("significance")} error={errors.significance} placeholder="Why does this piece matter culturally?" required />
          </div>
        </div>

        <Button type="submit" size="lg" loading={submitting} className="mt-2 self-start">
          Submit for review
        </Button>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold">Product images</p>
        <button
          type="button"
          onClick={() => setImageCount((n) => Math.min(4, n + 1))}
          className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border-strong text-muted transition-colors hover:border-primary hover:text-primary"
        >
          <Upload className="size-7" />
          <span className="text-sm font-semibold">Click to add a demo image</span>
          <span className="text-xs">Real uploads connect once storage is live</span>
        </button>
        {errors.images && (
          <p className="mt-2 text-sm font-medium text-danger" role="alert">
            {errors.images}
          </p>
        )}
        {imageCount > 0 && (
          <div className="mt-3 grid grid-cols-4 gap-2">
            {Array.from({ length: imageCount }).map((_, i) => (
              <div key={i} className="flex aspect-square items-center justify-center rounded-lg border border-border bg-surface-muted text-subtle">
                <ImagePlus className="size-5" />
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  );
}

export default function NewProductPage() {
  return (
    <RequireRole role="artisan">
      <DashboardHeader title="Add Product" description="List a new piece — every field here appears on the product page." />
      <ProductForm />
    </RequireRole>
  );
}
