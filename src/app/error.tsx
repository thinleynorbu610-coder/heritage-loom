"use client";

import { AlertTriangle } from "lucide-react";
import { Button, LinkButton } from "@/components/ui/Button";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main" className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-danger-soft text-danger">
        <AlertTriangle className="size-6" aria-hidden />
      </span>
      <h1 className="mt-6 font-display text-5xl">Something went wrong</h1>
      <p className="mt-3 max-w-md text-muted">
        We couldn&apos;t load this page. Please try again — if the problem continues, return to the home page.
      </p>
      <div className="mt-8 flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <LinkButton href="/" variant="outline">Go home</LinkButton>
      </div>
    </main>
  );
}
