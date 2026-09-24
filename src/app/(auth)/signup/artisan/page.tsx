"use client";

import { CheckCircle2, Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { FormInput, Select, Textarea } from "@/components/ui/FormInput";
import { dashboardPathFor, useAuth } from "@/context/AuthContext";
import { getCategories, getRegions } from "@/services/catalog";

type Errors = Partial<Record<"name" | "email" | "phone" | "region" | "craft" | "about", string>>;

export default function ArtisanSignupPage() {
  const { register } = useAuth();
  const router = useRouter();
  const categories = getCategories();
  const regions = getRegions();

  const [form, setForm] = useState({ name: "", email: "", phone: "", region: "", craft: "", about: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Errors = {};
    if (form.name.trim().length < 2) errs.name = "Please enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Please enter a valid email address.";
    if (!/^\d{8}$/.test(form.phone.replace(/\D/g, ""))) errs.phone = "Enter an 8-digit phone number.";
    if (!form.region) errs.region = "Please select your region.";
    if (!form.craft) errs.craft = "Please select your main craft.";
    if (form.about.trim().length < 20) errs.about = "Please tell us a little more (20+ characters).";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    window.setTimeout(() => {
      register({ name: form.name, email: form.email, phone: form.phone, role: "artisan" });
      setLoading(false);
      setSubmitted(true);
    }, 700);
  };

  if (submitted) {
    return (
      <AuthShell title="Application received" subtitle="Thank you for applying to sell on Heritage Loom.">
        <div className="rounded-2xl border border-border bg-surface p-8 text-center">
          <CheckCircle2 className="mx-auto size-12 text-success" aria-hidden />
          <h2 className="mt-4 font-serif text-2xl font-semibold">We&apos;ll be in touch soon</h2>
          <p className="mt-2 text-muted">
            Our team reviews new artisan applications within a few working days. You can explore your seller dashboard
            now — your account will show as pending review.
          </p>
          <Button size="lg" className="mt-6" onClick={() => router.push(dashboardPathFor("artisan"))}>
            Go to seller dashboard
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Continue as Artisan"
      subtitle="Share your craft with customers across Bhutan."
      panel={{ quote: "Simple tools, clear guidance — no technical skills needed.", attribution: "For artisans & cooperatives" }}
    >
      <form onSubmit={submit} noValidate className="flex flex-col gap-5">
        <FormInput label="Full name" icon={<User className="size-4" aria-hidden />} value={form.name} onChange={set("name")} error={errors.name} required />
        <div className="grid gap-5 sm:grid-cols-2">
          <FormInput label="Email" type="email" icon={<Mail className="size-4" aria-hidden />} value={form.email} onChange={set("email")} error={errors.email} required />
          <FormInput label="Phone" type="tel" placeholder="17 12 34 56" icon={<Phone className="size-4" aria-hidden />} value={form.phone} onChange={set("phone")} error={errors.phone} required />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Select label="Region" placeholder="Choose your region" options={regions.map((r) => ({ value: r.slug, label: r.name }))} value={form.region} onChange={set("region")} error={errors.region} required />
          <Select label="Main craft" placeholder="Choose your craft" options={categories.map((c) => ({ value: c.slug, label: c.name }))} value={form.craft} onChange={set("craft")} error={errors.craft} required />
        </div>
        <Textarea
          label="Tell us about your craft"
          placeholder="What do you make, and how long have you been making it?"
          value={form.about}
          onChange={set("about")}
          error={errors.about}
          required
        />
        <Button type="submit" size="lg" loading={loading}>
          Submit application
        </Button>
      </form>
      <p className="mt-8 text-muted">
        Not an artisan?{" "}
        <Link href="/signup" className="font-semibold text-primary hover:underline">
          Create a customer account
        </Link>
      </p>
    </AuthShell>
  );
}
