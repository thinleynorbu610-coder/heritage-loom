"use client";

import { CheckCircle2, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/ui/FormInput";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSent(true);
  };

  return (
    <AuthShell title="Reset your password" subtitle="We'll send you a link to reset it.">
      {sent ? (
        <div className="rounded-2xl border border-border bg-surface p-8 text-center">
          <CheckCircle2 className="mx-auto size-12 text-success" aria-hidden />
          <h2 className="mt-4 font-serif text-2xl font-semibold">Check your email</h2>
          <p className="mt-2 text-muted">
            Demo mode — no email was sent. In production, a reset link would arrive at <strong>{email}</strong>.
          </p>
          <Link href="/login" className="mt-6 inline-block font-semibold text-primary hover:underline">
            Back to login
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="flex flex-col gap-5">
          <FormInput
            label="Email"
            type="email"
            icon={<Mail className="size-4" aria-hidden />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            required
          />
          <Button type="submit" size="lg">
            Send reset link
          </Button>
          <Link href="/login" className="text-center font-semibold text-primary hover:underline">
            Back to login
          </Link>
        </form>
      )}
    </AuthShell>
  );
}
