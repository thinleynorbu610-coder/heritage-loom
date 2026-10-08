"use client";

import { CheckCircle2, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { FormInput, Select, Textarea } from "@/components/ui/FormInput";
import { useAuth } from "@/context/AuthContext";
import { useProductSubmissions } from "@/context/ProductSubmissionsContext";
import { useToast } from "@/context/ToastContext";
import { getCategories, getRegions, PRODUCT_TYPES } from "@/services/catalog";
import type { CategorySlug, Product, ProductType, RegionSlug } from "@/types";

type Errors = Partial<
  Record<"name" | "description" | "price" | "stock" | "category" | "type" | "region" | "materials" | "technique" | "significance" | "images", string>
>;

type ImageItem = { src: string; alt: string };

function initialFormFrom(product?: Product) {
  return {
    name: product?.name ?? "",
    description: product?.summary ?? "",
    price: product ? String(product.price) : "",
    stock: product ? String(product.stock) : "",
    category: product?.category ?? "",
    type: product?.type ?? "",
    region: product?.region ?? "",
    materials: product?.materials.join(", ") ?? "",
    technique: product?.technique.name ?? "",
    significance: product?.culturalSignificance ?? "",
  };
}

const MAX_IMAGES = 4;

/**
 * Add / Edit Product. New listings are submitted into the shared
 * product-submissions store (localStorage-backed, same pattern as orders)
 * with status "pending", so they appear immediately in Admin → Products for
 * review. Approving there makes the listing live in the seller's inventory.
 * Edits are demo-only for now; nothing in the live catalogue is patched.
 */
export function ProductForm({ mode, initial }: { mode: "create" | "edit"; initial?: Product }) {
  const { toast } = useToast();
  const { user } = useAuth();
  const { submitProduct } = useProductSubmissions();
  const router = useRouter();
  const categories = getCategories();
  const regions = getRegions();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState(initialFormFrom(initial));
  const [images, setImages] = useState<ImageItem[]>(initial?.images ?? []);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const slots = MAX_IMAGES - images.length;
    Array.from(files)
      .slice(0, slots)
      .forEach((file) => {
        if (!file.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.onload = () => {
          setImages((prev) => (prev.length >= MAX_IMAGES ? prev : [...prev, { src: String(reader.result), alt: form.name || "Product photo" }]));
        };
        reader.readAsDataURL(file);
      });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (i: number) => setImages((prev) => prev.filter((_, idx) => idx !== i));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Errors = {};
    if (form.name.trim().length < 3) errs.name = "Please enter a product name.";
    if (form.description.trim().length < 20) errs.description = "Please describe the product (20+ characters).";
    if (!form.price || Number(form.price) <= 0) errs.price = "Please enter a valid price.";
    if (form.stock === "" || Number(form.stock) < 0) errs.stock = "Please enter a stock quantity (0 or more).";
    if (!form.category) errs.category = "Please choose a category.";
    if (!form.type) errs.type = "Please choose a product type.";
    if (!form.region) errs.region = "Please choose a region.";
    if (form.materials.trim().length < 2) errs.materials = "Please list at least one material.";
    if (form.technique.trim().length < 5) errs.technique = "Please describe the technique used.";
    if (form.significance.trim().length < 10) errs.significance = "Please share the cultural significance.";
    if (images.length === 0) errs.images = "Please add at least one product photo.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setDone(true);
      if (mode === "create" && user?.artisanId) {
        submitProduct({
          name: form.name,
          summary: form.description,
          price: Number(form.price),
          stock: Number(form.stock),
          category: form.category as CategorySlug,
          type: form.type as ProductType,
          region: form.region as RegionSlug,
          artisanId: user.artisanId,
          materials: form.materials.split(",").map((m) => m.trim()).filter(Boolean),
          techniqueName: form.technique,
          culturalSignificance: form.significance,
          images,
        });
      }
      toast(
        mode === "edit"
          ? { title: "Changes saved", description: form.name }
          : { title: "Product submitted for review", description: form.name },
      );
    }, 700);
  };

  if (done) {
    return (
      <div className="max-w-xl rounded-2xl border border-border bg-surface p-8 text-center">
        <CheckCircle2 className="mx-auto size-12 text-success" />
        <h2 className="mt-4 font-serif text-2xl font-semibold">{mode === "edit" ? "Changes saved" : "Submitted for review"}</h2>
        <p className="mt-2 text-muted">
          {mode === "edit" ? (
            <>
              <strong>{form.name}</strong> has been updated.
            </>
          ) : (
            <>
              <strong>{form.name}</strong> has been sent to the admin team for review. It will appear in your
              inventory as soon as it&apos;s approved.
            </>
          )}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={() => router.push("/seller/products")}>View my products</Button>
          {mode === "create" && (
            <Button
              variant="outline"
              onClick={() => {
                setDone(false);
                setForm(initialFormFrom());
                setImages([]);
              }}
            >
              Add another
            </Button>
          )}
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
          <FormInput label="Stock quantity" type="number" inputMode="numeric" min={0} value={form.stock} onChange={set("stock")} error={errors.stock} required />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Select label="Category" placeholder="Choose category" options={categories.map((c) => ({ value: c.slug, label: c.name }))} value={form.category} onChange={set("category")} error={errors.category} required />
          <Select label="Product type" placeholder="Choose type" options={PRODUCT_TYPES.map((t) => ({ value: t, label: t }))} value={form.type} onChange={set("type")} error={errors.type} required />
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
          {mode === "edit" ? "Save changes" : "Submit for review"}
        </Button>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold">Product images</p>
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
        {images.length < MAX_IMAGES && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border-strong text-muted transition-colors hover:border-primary hover:text-primary"
          >
            <Upload className="size-7" />
            <span className="text-sm font-semibold">Click to upload photos</span>
            <span className="text-xs">JPG or PNG, up to {MAX_IMAGES} images</span>
          </button>
        )}
        {errors.images && (
          <p className="mt-2 text-sm font-medium text-danger" role="alert">
            {errors.images}
          </p>
        )}
        {images.length > 0 && (
          <div className="mt-3 grid grid-cols-4 gap-2">
            {images.map((img, i) => (
              // eslint-disable-next-line @next/next/no-img-element -- transient data: URLs / demo asset URLs, not worth Next/Image optimization here
              <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-surface-muted">
                <img src={img.src} alt={img.alt} className="size-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-ink/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Remove photo"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  );
}
