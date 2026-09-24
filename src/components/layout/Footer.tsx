"use client";

import { ArrowRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { MotifDivider, WovenStrip } from "@/components/ui/Motif";
import { useToast } from "@/context/ToastContext";
import { footerNav } from "./navigation";

const contactDetails = [
  { icon: MapPin, text: "Norzin Lam, Thimphu, Bhutan" },
  { icon: Phone, text: "+975 17 123 456" },
  { icon: Mail, text: "hello@heritageloom.bt" },
  { icon: Clock, text: "Mon – Sat, 9:00 AM – 6:00 PM BTT" },
];

/* Brand icons are drawn inline (lucide no longer ships brand logos). */
const socials = [
  {
    label: "Facebook",
    path: "M14 8h3V4h-3c-2.8 0-4 1.8-4 4.4V11H7v4h3v9h4v-9h3l1-4h-4V8.6c0-.4.3-.6.6-.6Z",
  },
  {
    label: "Instagram",
    path: "M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2Zm0 7.9A3.1 3.1 0 1 1 12 8.9a3.1 3.1 0 0 1 0 6.2ZM17.2 5.6a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2ZM12 3c-2.4 0-2.7 0-3.7.1C5.1 3.2 3.2 5 3.1 8.3 3 9.3 3 9.6 3 12s0 2.7.1 3.7c.1 3.2 2 5.1 5.2 5.2 1 .1 1.3.1 3.7.1s2.7 0 3.7-.1c3.2-.1 5.1-2 5.2-5.2.1-1 .1-1.3.1-3.7s0-2.7-.1-3.7c-.1-3.2-2-5.1-5.2-5.2C14.7 3 14.4 3 12 3Zm0 1.6c2.4 0 2.6 0 3.6.1 2.4.1 3.5 1.2 3.6 3.6.1.9.1 1.2.1 3.6s0 2.7-.1 3.6c-.1 2.4-1.2 3.5-3.6 3.6-.9.1-1.2.1-3.6.1s-2.7 0-3.6-.1c-2.4-.1-3.5-1.2-3.6-3.6-.1-.9-.1-1.2-.1-3.6s0-2.7.1-3.6c.1-2.4 1.2-3.5 3.6-3.6.9-.1 1.2-.1 3.6-.1Z",
  },
  {
    label: "YouTube",
    path: "M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z",
  },
];

export function Footer() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setEmail("");
    toast({
      title: "You're on the list",
      description: "Demo mode — newsletter delivery will be enabled with the backend.",
    });
  };

  return (
    <footer className="relative mt-auto overflow-hidden bg-ink text-background">
      <WovenStrip />
      <div className="bg-motif-light">
        <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.1fr_2.2fr] lg:gap-14 lg:py-20">
          <div className="flex flex-col gap-6">
            <Logo />
            <p className="max-w-sm font-serif text-2xl leading-snug text-background/90">
              Connecting Bhutanese artisans with customers through culture and commerce.
            </p>
            <form onSubmit={subscribe} noValidate className="max-w-md">
              <label htmlFor="newsletter" className="text-sm font-semibold text-background">
                Stories from the loom, once a month
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  id="newsletter"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  aria-invalid={!!error || undefined}
                  aria-describedby={error ? "newsletter-error" : undefined}
                  className="h-12 min-w-0 flex-1 rounded-md border border-white/15 bg-white/5 px-4 text-background placeholder:text-background/40 outline-none focus:border-secondary"
                />
                <button
                  type="submit"
                  className="inline-flex h-12 items-center gap-2 rounded-md bg-secondary px-5 font-semibold text-ink transition-colors hover:bg-background"
                >
                  Subscribe <ArrowRight className="size-4" aria-hidden />
                </button>
              </div>
              {error && (
                <p id="newsletter-error" className="mt-2 text-sm text-secondary" role="alert">
                  {error}
                </p>
              )}
            </form>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {Object.entries(footerNav).map(([heading, links]) => (
              <div key={heading}>
                <h2 className="text-xs font-bold tracking-[0.2em] text-secondary uppercase">{heading}</h2>
                <ul className="mt-5 flex flex-col gap-3">
                  {links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-[0.95rem] text-background/75 transition-colors hover:text-background"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="col-span-2 sm:col-span-1">
              <h2 className="text-xs font-bold tracking-[0.2em] text-secondary uppercase">Visit Us</h2>
              <ul className="mt-5 flex flex-col gap-3">
                {contactDetails.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-2.5 text-[0.95rem] text-background/75">
                    <Icon className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="container-page">
          <MotifDivider tone="light" />
        </div>

        <div className="container-page flex flex-col-reverse items-center justify-between gap-5 py-8 text-sm text-background/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Heritage Loom. A student project celebrating Bhutanese craft.</p>
          <ul className="flex items-center gap-2">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href="#"
                  aria-label={`Heritage Loom on ${s.label} (coming soon)`}
                  className="flex size-10 items-center justify-center rounded-full border border-white/15 text-background/80 transition-colors hover:border-secondary hover:text-secondary"
                >
                  <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
                    <path d={s.path} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
