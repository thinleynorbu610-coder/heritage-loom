"use client";

import { BadgeCheck, MessageSquareText } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { FormInput, Textarea } from "@/components/ui/FormInput";
import { Modal } from "@/components/ui/Overlay";
import { Rating, RatingInput } from "@/components/ui/Rating";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { formatDate, todayISO } from "@/lib/utils";
import type { Review } from "@/types";

/**
 * Reviews — Phase 2. New reviews are kept in component state for the demo;
 * they will be submitted to `POST /api/v1/products/{id}/reviews` later.
 */
export function Reviews({
  productId,
  productName,
  initial,
  rating,
  reviewCount,
}: {
  productId: string;
  productName: string;
  initial: Review[];
  rating: number;
  reviewCount: number;
}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState(initial);
  const [open, setOpen] = useState(false);
  const [stars, setStars] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Illustrative distribution derived from the average (until API provides it).
  const dist = [5, 4, 3, 2, 1].map((s) => {
    const fromItems = items.filter((r) => r.rating === s).length;
    return { stars: s, share: items.length ? fromItems / items.length : 0 };
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!stars) errs.stars = "Please choose a star rating.";
    if (title.trim().length < 3) errs.title = "Please add a short title.";
    if (body.trim().length < 10) errs.body = "Please write at least a sentence (10+ characters).";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setItems((prev) => [
      {
        id: `rev-${Date.now()}`,
        productId,
        author: user?.name ?? "Guest",
        location: "Bhutan",
        rating: stars,
        title: title.trim(),
        body: body.trim(),
        date: todayISO(),
        verifiedPurchase: false,
      },
      ...prev,
    ]);
    setOpen(false);
    setStars(0);
    setTitle("");
    setBody("");
    toast({ title: "Thank you for your review", description: "Demo mode — reviews are moderated before publishing." });
  };

  return (
    <div className="grid gap-12 lg:grid-cols-[320px_1fr] lg:gap-16">
      <div>
        <p className="font-display text-7xl">{rating.toFixed(1)}</p>
        <Rating value={rating} size="lg" showValue={false} className="mt-2" />
        <p className="mt-2 text-sm text-muted">Based on {reviewCount} reviews</p>
        <ul className="mt-6 flex flex-col gap-2" aria-label="Rating breakdown of shown reviews">
          {dist.map((d) => (
            <li key={d.stars} className="flex items-center gap-3 text-sm">
              <span className="w-12 text-muted">{d.stars} star</span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                <span className="block h-full rounded-full bg-secondary" style={{ width: `${d.share * 100}%` }} />
              </span>
              <span className="w-9 text-right text-muted tabular-nums">{Math.round(d.share * 100)}%</span>
            </li>
          ))}
        </ul>
        <Button variant="outline" onClick={() => setOpen(true)} className="mt-8" fullWidth>
          Write a review
        </Button>
      </div>

      <div>
        {items.length === 0 ? (
          <EmptyState
            icon={<MessageSquareText className="size-6" aria-hidden />}
            title="No reviews yet"
            description="Be the first to share how this piece feels in your home."
          />
        ) : (
          <ul className="flex flex-col divide-y divide-border border-y border-border">
            {items.map((r) => (
              <li key={r.id} className="py-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Rating value={r.rating} showValue={false} />
                  <time className="text-sm text-muted" dateTime={r.date}>
                    {formatDate(r.date)}
                  </time>
                </div>
                <p className="mt-3 font-semibold">{r.title}</p>
                <p className="mt-1.5 leading-relaxed text-muted">{r.body}</p>
                <p className="mt-3 flex items-center gap-2 text-sm">
                  <span className="font-semibold">{r.author}</span>
                  <span className="text-subtle">· {r.location}</span>
                  {r.verifiedPurchase && (
                    <span className="inline-flex items-center gap-1 text-success">
                      <BadgeCheck className="size-3.5" aria-hidden /> Verified purchase
                    </span>
                  )}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Write a review"
        description={productName}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="review-form">
              Submit review
            </Button>
          </>
        }
      >
        <form id="review-form" onSubmit={submit} noValidate className="flex flex-col gap-5">
          <div>
            <RatingInput value={stars} onChange={setStars} />
            {errors.stars && (
              <p className="mt-1 text-sm font-medium text-danger" role="alert">
                {errors.stars}
              </p>
            )}
          </div>
          <FormInput label="Title" value={title} onChange={(e) => setTitle(e.target.value)} error={errors.title} placeholder="Sum it up in a few words" required />
          <Textarea label="Your review" value={body} onChange={(e) => setBody(e.target.value)} error={errors.body} placeholder="How does it look and feel? How was delivery?" required />
        </form>
      </Modal>
    </div>
  );
}
