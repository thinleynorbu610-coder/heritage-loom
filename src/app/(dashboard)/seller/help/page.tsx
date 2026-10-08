"use client";

import { Mail, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import { RequireRole } from "@/components/account/RequireRole";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/FormInput";
import { useToast } from "@/context/ToastContext";

const FAQS = [
  {
    q: "How do I add a new product?",
    a: "Go to Inventory → Add New Product. Fill in the listing details, upload at least one photo, and submit. Your listing goes to the admin team for review and appears in your Inventory with a Pending status until it's approved.",
  },
  {
    q: "How long does product review take?",
    a: "Most listings are reviewed within one working day. You'll see the status change from Pending to Active in your Inventory once approved, or Rejected with a reason if it needs changes.",
  },
  {
    q: "How does payment verification work?",
    a: "When a buyer pays by mobile banking, their order shows a Verify Payment action in Orders. Review the claimed amount and transaction reference against your own bank account, then confirm or reject the proof.",
  },
  {
    q: "What happens when I mark an order as shipped?",
    a: "The buyer is notified and the order moves to Shipped. Mark it Delivered once you've confirmed it reached them, or Cancel it if the order can't be fulfilled.",
  },
  {
    q: "How do I know when stock is running low?",
    a: "Your Dashboard shows a Low Stock Alerts card, and low-stock items are flagged directly in Inventory and Moderation & Compliance, so you can restock before you miss an order.",
  },
  {
    q: "Who sees my authenticity rating and shop health score?",
    a: "These appear on your Moderation & Compliance page and reflect your verification status and customer reviews. They're part of how Heritage Loom signals trust to buyers.",
  },
];

function HelpCenter() {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setSent(true);
      setMessage("");
      toast({ title: "Message sent", description: "Our seller support team will reply within one working day." });
    }, 600);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      <div className="flex flex-col gap-3">
        <h2 className="font-serif text-2xl font-semibold">Frequently asked questions</h2>
        {FAQS.map((item) => (
          <details key={item.q} className="group rounded-xl border border-border bg-surface p-5 open:pb-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold marker:content-none">
              {item.q}
              <span className="text-muted transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm text-muted">{item.a}</p>
          </details>
        ))}
      </div>

      <div className="flex flex-col gap-6">
        <div className="rounded-xl border border-border bg-surface p-6">
          <h2 className="font-serif text-xl font-semibold">Contact seller support</h2>
          <p className="mt-1 text-sm text-muted">We typically reply within one working day.</p>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <a href="mailto:sellers@heritageloom.bt" className="flex items-center gap-2.5 text-text hover:text-primary">
              <Mail className="size-4" /> sellers@heritageloom.bt
            </a>
            <span className="flex items-center gap-2.5 text-text">
              <Phone className="size-4" /> +975 2 333 444 (Mon–Fri, 9am–5pm)
            </span>
          </div>
        </div>

        <form onSubmit={submit} className="rounded-xl border border-border bg-surface p-6">
          <h2 className="flex items-center gap-2 font-serif text-xl font-semibold">
            <MessageCircle className="size-5 text-primary" /> Send a message
          </h2>
          {sent ? (
            <p className="mt-4 text-sm text-success">Thanks — we&apos;ve received your message.</p>
          ) : (
            <>
              <Textarea
                label="How can we help?"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe what you need help with…"
                className="mt-4"
                required
              />
              <Button type="submit" loading={sending} className="mt-3 w-full">
                Send message
              </Button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default function SellerHelpPage() {
  return (
    <RequireRole role="artisan">
      <DashboardHeader title="Help & Support" description="Answers for running your Heritage Loom storefront, and a direct line to seller support." />
      <HelpCenter />
    </RequireRole>
  );
}
