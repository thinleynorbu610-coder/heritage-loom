"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { FormInput, Select, Textarea } from "@/components/ui/FormInput";
import { useToast } from "@/context/ToastContext";

export function ContactForm() {
  const { toast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const errs: Record<string, string> = {};
    if (!String(data.get("name")).trim()) errs.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(String(data.get("email")))) errs.email = "Please enter a valid email address.";
    if (String(data.get("message")).trim().length < 10) errs.message = "Please write a short message (10+ characters).";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    e.currentTarget.reset();
    toast({ title: "Message ready to send", description: "Demo mode — messages will be delivered once the backend is connected." });
  };

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormInput name="name" label="Full name" required error={errors.name} autoComplete="name" />
        <FormInput name="email" type="email" label="Email" required error={errors.email} autoComplete="email" />
      </div>
      <Select
        name="topic"
        label="Topic"
        defaultValue="order"
        options={[
          { value: "order", label: "An existing order" },
          { value: "commission", label: "A commission request" },
          { value: "selling", label: "Selling on Heritage Loom" },
          { value: "other", label: "Something else" },
        ]}
      />
      <Textarea name="message" label="Message" rows={6} required error={errors.message} />
      <Button type="submit" size="lg" className="self-start">
        Send message
      </Button>
    </form>
  );
}
