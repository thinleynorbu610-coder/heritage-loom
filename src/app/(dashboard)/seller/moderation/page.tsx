"use client";

import { AlertTriangle, BadgeCheck, Download, MessageSquareWarning, ScrollText, ShieldCheck, Star } from "lucide-react";
import { useState } from "react";
import { RequireRole } from "@/components/account/RequireRole";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { StatCard } from "@/components/dashboard/StatCard";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { reviewsForProduct } from "@/data/reviews";
import { formatDate } from "@/lib/utils";
import { getArtisanById, getProductsByArtisan } from "@/services/catalog";

const TABS = ["listings", "feedback", "certifications", "disputes"] as const;
type Tab = (typeof TABS)[number];
const TAB_LABELS: Record<Tab, string> = {
  listings: "Listing Quality & Compliance",
  feedback: "Customer Feedback",
  certifications: "Heritage Certifications",
  disputes: "Dispute Resolution",
};

function Stars({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-0.5 text-secondary">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="size-3.5" fill={i < Math.round(value) ? "currentColor" : "none"} />
      ))}
    </span>
  );
}

function ModerationCenter() {
  const { user } = useAuth();
  const { toast } = useToast();
  const artisan = user?.artisanId ? getArtisanById(user.artisanId) : undefined;
  const products = artisan ? getProductsByArtisan(artisan.id) : [];
  const [tab, setTab] = useState<Tab>("listings");

  const activeListings = products.filter((p) => p.status === "active").length;
  const reviews = products.flatMap((p) => reviewsForProduct(p.id).map((r) => ({ ...r, product: p })));
  const flagged = reviews.filter((r) => r.rating <= 3);
  const avgRating = reviews.length ? reviews.reduce((n, r) => n + r.rating, 0) / reviews.length : 0;
  const healthScore = Math.max(0, Math.min(100, 100 - flagged.length * 6 - (artisan?.verified ? 0 : 15)));

  const demoAction = (title: string, description?: string) => () => toast({ title, description });

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
        <Badge tone="gold">Guild audit</Badge>
        <span className="text-muted">{artisan?.verified ? "Verified artisan vendor" : "Verification in progress"}</span>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Shop Health Score"
          value={`${healthScore}%`}
          icon={<ShieldCheck className="size-4" />}
          tone="primary"
          trend={healthScore >= 90 ? "Excellent standing" : "Review flagged feedback"}
        />
        <StatCard
          label="Catalog Moderation"
          value={`${activeListings}/${products.length}`}
          icon={<ScrollText className="size-4" />}
          trend={products.length - activeListings > 0 ? `${products.length - activeListings} pending review` : "All listings live"}
        />
        <StatCard
          label="Authenticity Rating"
          value={reviews.length ? avgRating.toFixed(1) : "—"}
          icon={<Star className="size-4" />}
          trend={`${reviews.length} craft review${reviews.length === 1 ? "" : "s"}`}
        />
        <StatCard
          label="Dispute Cases"
          value="0"
          icon={<AlertTriangle className="size-4" />}
          trend="No active disputes"
        />
      </div>

      <div className="mt-6 flex flex-col gap-4 rounded-xl border border-secondary/30 bg-secondary-soft p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface text-accent">
            <ScrollText className="size-5" />
          </span>
          <div>
            <p className="flex items-center gap-2 font-semibold">
              Master Artisan Guarantee Policy <Badge tone="dark">Active</Badge>
            </p>
            <p className="mt-1 max-w-xl text-sm text-muted">
              Listings should state natural fibre and dye sourcing where known. Verified artisans carry the Heritage Loom authenticity badge on their public profile.
            </p>
          </div>
        </div>
        <Button variant="outline" className="shrink-0" onClick={demoAction("Policy acknowledged")}>
          Acknowledge
        </Button>
      </div>

      <div className="mt-8 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            aria-pressed={tab === t}
            className={`h-10 shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors ${
              tab === t ? "border-ink bg-ink text-background" : "border-border hover:border-text"
            }`}
          >
            {TAB_LABELS[t]}
            {t === "feedback" && flagged.length > 0 && <span className="ml-1.5 text-danger">({flagged.length})</span>}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "listings" && (
          <div className="rounded-xl border border-border bg-surface">
            {products.length === 0 ? (
              <p className="p-8 text-center text-muted">You haven&apos;t listed any products yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {products.map((p) => (
                  <li key={p.id} className="flex flex-wrap items-center gap-4 p-5">
                    <span className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                      <SmartImage src={p.images[0].src} alt="" fill sizes="56px" className="object-cover" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-xs text-muted capitalize">{p.category.replace("-", " ")}</p>
                    </div>
                    <StatusBadge status={p.status} />
                    {artisan?.verified && (
                      <span className="flex items-center gap-1.5 rounded-full bg-success-soft px-3 py-1 text-xs font-semibold text-success">
                        <BadgeCheck className="size-3.5" /> Certified authentic
                      </span>
                    )}
                    {p.stock <= 3 && (
                      <span className="flex items-center gap-1.5 rounded-full bg-warning-soft px-3 py-1 text-xs font-semibold text-warning">
                        <AlertTriangle className="size-3.5" /> {p.stock === 0 ? "Restock documentation due" : "Low stock"}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {tab === "feedback" && (
          <div className="rounded-xl border border-border bg-surface">
            {reviews.length === 0 ? (
              <p className="p-8 text-center text-muted">No customer reviews yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {reviews.map((r) => (
                  <li key={r.id} className="flex flex-col gap-2 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Stars value={r.rating} />
                        <span className="font-semibold">{r.author}</span>
                        {r.verifiedPurchase && <Badge tone="success">Verified buyer</Badge>}
                        {r.rating <= 3 && (
                          <span className="flex items-center gap-1 text-xs font-semibold text-warning">
                            <MessageSquareWarning className="size-3.5" /> Needs a response
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted">{formatDate(r.date)}</span>
                    </div>
                    <p className="text-sm text-muted">
                      On <span className="font-medium text-text">{r.product.name}</span> — &ldquo;{r.body}&rdquo;
                    </p>
                    <Button variant="outline" size="sm" className="mt-1 self-start" onClick={demoAction("Reply sent", r.author)}>
                      Reply
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {tab === "certifications" && (
          <div className="rounded-xl border border-border bg-surface p-8 text-center">
            {artisan?.verified ? (
              <>
                <BadgeCheck className="mx-auto size-10 text-success" />
                <h3 className="mt-3 font-serif text-xl font-semibold">Certified Authentic — Heritage Loom Guild</h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted">
                  Your identity and craft lineage have been verified. This badge appears on your public artisan profile and every listing.
                </p>
                <Button variant="outline" className="mt-5" onClick={demoAction("Badge download started")}>
                  <Download className="size-4" /> Download Embed Badge
                </Button>
              </>
            ) : (
              <>
                <AlertTriangle className="mx-auto size-10 text-warning" />
                <h3 className="mt-3 font-serif text-xl font-semibold">Verification in progress</h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted">
                  Our guild team is reviewing your submission. Certification usually completes within 3 working days.
                </p>
              </>
            )}
          </div>
        )}

        {tab === "disputes" && (
          <div className="rounded-xl border border-border bg-surface p-8 text-center">
            <ShieldCheck className="mx-auto size-10 text-success" />
            <h3 className="mt-3 font-serif text-xl font-semibold">Clean buyer-protection record</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">No disputes have been raised against your storefront.</p>
          </div>
        )}
      </div>
    </>
  );
}

export default function SellerModerationPage() {
  const { toast } = useToast();
  return (
    <RequireRole role="artisan">
      <DashboardHeader
        title="Shop Moderation & Compliance"
        description="Monitor listing compliance, customer reviews and craft authenticity standards for your storefront."
        action={
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => toast({ title: "Demo only", description: "Report export connects once the API is live." })}>
              <Download className="size-4" /> Download Compliance Report
            </Button>
            <Button onClick={() => toast({ title: "Authenticity badge requested", description: "The guild team will review within 3 working days." })}>
              <BadgeCheck className="size-4" /> Request Authenticity Badge
            </Button>
          </div>
        }
      />
      <ModerationCenter />
    </RequireRole>
  );
}
