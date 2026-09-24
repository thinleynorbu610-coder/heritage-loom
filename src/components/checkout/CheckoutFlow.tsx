"use client";

import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  BellRing,
  CheckCircle2,
  CreditCard,
  Info,
  Lock,
  MapPin,
  Pencil,
  ShoppingBag,
  Smartphone,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button, LinkButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { FormInput, Select, Textarea } from "@/components/ui/FormInput";
import { Skeleton } from "@/components/ui/LoadingSkeleton";
import { MotifDivider } from "@/components/ui/Motif";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrdersContext";
import { dzongkhags } from "@/data/regions";
import { useIsClient } from "@/lib/persistent-store";
import { addDays, cn, formatDate, formatNu, todayISO } from "@/lib/utils";
import { getArtisanById, getProductById } from "@/services/catalog";
import { PAYMENT_METHODS } from "@/services/payments";
import type { DeliveryAddress, Order, PaymentMethodId } from "@/types";
import { OrderItems, SummaryRows } from "./OrderSummary";
import { Stepper } from "./Stepper";

const STEPS = ["Delivery", "Review", "Payment", "Confirmation"];
const paymentIcons: Record<PaymentMethodId, typeof Smartphone> = {
  "mobile-banking": Smartphone,
  card: CreditCard,
  "cash-on-delivery": Banknote,
};

type Errors = Partial<Record<keyof DeliveryAddress, string>>;

function validate(a: DeliveryAddress): Errors {
  const e: Errors = {};
  if (a.fullName.trim().length < 2) e.fullName = "Please enter the full name of the person receiving the order.";
  const digits = a.phone.replace(/\D/g, "");
  if (!/^(17|77|16)\d{6}$/.test(digits)) e.phone = "Enter an 8-digit Bhutanese mobile number, e.g. 17 12 34 56.";
  if (a.address.trim().length < 5) e.address = "Please enter a house number, building or nearby landmark.";
  if (!a.dzongkhag) e.dzongkhag = "Please choose your dzongkhag.";
  if (a.gewog.trim().length < 2) e.gewog = "Please enter your gewog or thromde.";
  return e;
}

export function CheckoutFlow() {
  const isClient = useIsClient();
  if (!isClient) {
    return (
      <div className="container-page py-12" role="status" aria-label="Loading checkout">
        <Skeleton className="h-10 w-full max-w-2xl" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px]">
          <Skeleton className="h-[420px] w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
      </div>
    );
  }
  return <CheckoutInner />;
}

function CheckoutInner() {
  const { user } = useAuth();
  const { lines, subtotal, delivery, total, clear } = useCart();
  const { placeOrder } = useOrders();

  const [step, setStep] = useState(0);
  const [address, setAddress] = useState<DeliveryAddress>({
    fullName: user?.name ?? "",
    phone: user?.phone ?? "",
    address: "",
    dzongkhag: "",
    gewog: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [method, setMethod] = useState<PaymentMethodId>("mobile-banking");
  const [agree, setAgree] = useState(false);
  const [agreeError, setAgreeError] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  const set = (k: keyof DeliveryAddress) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setAddress((a) => ({ ...a, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const goTo = (s: number) => {
    setStep(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(address);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      document.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    goTo(1);
  };

  const place = () => {
    if (!agree) {
      setAgreeError(true);
      return;
    }
    setPlacing(true);
    // Brief UI pause for feedback. No network request is made in demo mode.
    window.setTimeout(() => {
      const o = placeOrder({
        customerName: address.fullName,
        lines: lines.map((l) => ({ productId: l.product.id, quantity: l.quantity, unitPrice: l.product.price })),
        subtotal,
        delivery,
        address,
        paymentMethod: method,
      });
      setOrder(o);
      clear();
      setPlacing(false);
      goTo(3);
    }, 900);
  };

  if (!order && lines.length === 0) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={<ShoppingBag className="size-6" aria-hidden />}
          title="Your cart is empty"
          description="Add a piece to your cart to begin checkout."
          action={<LinkButton href="/shop">Explore the Collection</LinkButton>}
        />
      </div>
    );
  }

  const estimated = formatDate(addDays(todayISO(), 6));
  const artisanNames = order
    ? Array.from(
        new Set(
          order.lines
            .map((l) => getArtisanById(getProductById(l.productId)?.artisanId ?? "")?.name)
            .filter((n): n is string => !!n),
        ),
      )
    : [];

  return (
    <div className="container-page py-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-display text-4xl sm:text-5xl">{step === 3 ? "Thank you" : "Checkout"}</h1>
          {step < 3 && (
            <p className="hidden items-center gap-1.5 text-sm text-muted sm:flex">
              <Lock className="size-4" aria-hidden /> Secure checkout
            </p>
          )}
        </div>
        <div className="mt-8">
          <Stepper steps={STEPS} current={step} />
        </div>

        {step === 3 && order ? (
          <Confirmation order={order} artisanNames={artisanNames} />
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px] lg:gap-14">
            <div>
              {/* Step 1 — Delivery */}
              {step === 0 && (
                <form onSubmit={submitDelivery} noValidate className="animate-fade-in">
                  <h2 className="font-serif text-3xl font-semibold">Delivery information</h2>
                  <p className="mt-1 text-muted">Where should the artisan send your order?</p>
                  <div className="mt-8 grid gap-5 sm:grid-cols-2">
                    <FormInput name="fullName" label="Full name" autoComplete="name" value={address.fullName} onChange={set("fullName")} error={errors.fullName} required />
                    <FormInput
                      name="phone"
                      label="Phone number"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="17 12 34 56"
                      value={address.phone}
                      onChange={set("phone")}
                      error={errors.phone}
                      hint="The courier will call this number."
                      required
                    />
                    <FormInput
                      name="address"
                      label="Address"
                      autoComplete="street-address"
                      placeholder="House no., building, street or landmark"
                      value={address.address}
                      onChange={set("address")}
                      error={errors.address}
                      containerClassName="sm:col-span-2"
                      required
                    />
                    <Select name="dzongkhag" label="Dzongkhag" placeholder="Choose dzongkhag" options={dzongkhags} value={address.dzongkhag} onChange={set("dzongkhag")} error={errors.dzongkhag} required />
                    <FormInput name="gewog" label="Gewog / Thromde" placeholder="e.g. Chang Gewog" value={address.gewog} onChange={set("gewog")} error={errors.gewog} required />
                    <Textarea
                      name="notes"
                      label="Delivery notes"
                      optional
                      rows={3}
                      placeholder="e.g. Call when you reach the school gate"
                      value={address.notes}
                      onChange={set("notes")}
                      containerClassName="sm:col-span-2"
                    />
                  </div>
                  <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Link href="/cart" className="inline-flex items-center gap-2 text-sm font-semibold hover:text-primary">
                      <ArrowLeft className="size-4" aria-hidden /> Back to cart
                    </Link>
                    <Button type="submit" size="lg">
                      Continue to review <ArrowRight className="size-4" aria-hidden />
                    </Button>
                  </div>
                </form>
              )}

              {/* Step 2 — Review */}
              {step === 1 && (
                <div className="animate-fade-in">
                  <h2 className="font-serif text-3xl font-semibold">Review your order</h2>
                  <p className="mt-1 text-muted">Please check everything before choosing how to pay.</p>

                  <div className="mt-8 rounded-xl border border-border bg-surface p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="mt-1 size-5 shrink-0 text-accent" aria-hidden />
                        <div>
                          <p className="font-semibold">Delivering to {address.fullName}</p>
                          <p className="mt-1 text-muted">
                            {address.address}, {address.gewog}, {address.dzongkhag}
                          </p>
                          <p className="text-muted">{address.phone}</p>
                          {address.notes && <p className="mt-2 text-sm text-muted italic">“{address.notes}”</p>}
                        </div>
                      </div>
                      <button type="button" onClick={() => goTo(0)} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                        <Pencil className="size-3.5" aria-hidden /> Edit
                      </button>
                    </div>
                    <p className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-sm">
                      <Truck className="size-4 text-accent" aria-hidden />
                      Estimated delivery by <strong>{estimated}</strong>
                    </p>
                  </div>

                  <ul className="mt-6 divide-y divide-border rounded-xl border border-border bg-surface">
                    {lines.map(({ product, quantity, lineTotal }) => (
                      <li key={product.id} className="flex items-center justify-between gap-4 p-5">
                        <div className="min-w-0">
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-sm text-muted">
                            by {getArtisanById(product.artisanId)?.name} · Qty {quantity} × {formatNu(product.price)}
                          </p>
                        </div>
                        <p className="font-semibold tabular-nums">{formatNu(lineTotal)}</p>
                      </li>
                    ))}
                  </ul>
                  <Link href="/cart" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
                    Change items in cart
                  </Link>

                  <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button type="button" onClick={() => goTo(0)} className="inline-flex items-center gap-2 text-sm font-semibold hover:text-primary">
                      <ArrowLeft className="size-4" aria-hidden /> Back to delivery
                    </button>
                    <Button size="lg" onClick={() => goTo(2)}>
                      Continue to payment <ArrowRight className="size-4" aria-hidden />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3 — Payment */}
              {step === 2 && (
                <div className="animate-fade-in">
                  <h2 className="font-serif text-3xl font-semibold">Payment</h2>
                  <p className="mt-1 text-muted">Choose how you would like to pay.</p>

                  <div className="mt-6 flex items-start gap-3 rounded-xl border border-info/20 bg-info-soft p-4 text-sm text-info">
                    <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
                    <p>
                      <strong>Demo mode — no payment will be taken.</strong> A real payment gateway will be connected by the
                      Heritage Loom backend. Placing an order here only records it in your browser.
                    </p>
                  </div>

                  <fieldset className="mt-6">
                    <legend className="sr-only">Payment method</legend>
                    <div className="flex flex-col gap-3">
                      {PAYMENT_METHODS.map((m) => {
                        const Icon = paymentIcons[m.id];
                        const on = method === m.id;
                        return (
                          <label
                            key={m.id}
                            className={cn(
                              "flex cursor-pointer items-start gap-4 rounded-xl border-2 bg-surface p-5 transition-colors",
                              on ? "border-primary" : "border-border hover:border-border-strong",
                            )}
                          >
                            <input
                              type="radio"
                              name="payment"
                              value={m.id}
                              checked={on}
                              onChange={() => setMethod(m.id)}
                              className="mt-1 size-4 accent-[var(--primary)]"
                            />
                            <span className="flex-1">
                              <span className="flex items-center gap-2 font-semibold">
                                <Icon className="size-5 text-accent" aria-hidden /> {m.label}
                              </span>
                              <span className="mt-1 block text-sm text-muted">{m.description}</span>
                              {on && m.id !== "cash-on-delivery" && (
                                <span className="mt-3 flex items-center gap-2 rounded-md bg-surface-muted px-3 py-2 text-xs text-muted">
                                  <Lock className="size-3.5" aria-hidden />
                                  You will be redirected to the provider&apos;s secure page to approve {formatNu(total)}.
                                </span>
                              )}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>

                  <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={agree}
                      onChange={(e) => {
                        setAgree(e.target.checked);
                        setAgreeError(false);
                      }}
                      aria-invalid={agreeError || undefined}
                      className="mt-0.5 size-4 accent-[var(--primary)]"
                    />
                    <span>
                      I understand this is a handmade piece and may vary slightly from photos, and I agree to the{" "}
                      <Link href="/terms" className="font-semibold text-primary hover:underline">
                        terms of use
                      </Link>
                      .
                    </span>
                  </label>
                  {agreeError && (
                    <p className="mt-2 text-sm font-medium text-danger" role="alert">
                      Please confirm to place your order.
                    </p>
                  )}

                  <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button type="button" onClick={() => goTo(1)} className="inline-flex items-center gap-2 text-sm font-semibold hover:text-primary">
                      <ArrowLeft className="size-4" aria-hidden /> Back to review
                    </button>
                    <Button size="lg" onClick={place} loading={placing}>
                      {placing ? "Placing your order…" : `Place order · ${formatNu(total)}`}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <aside aria-label="Order summary" className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
              <div className="rounded-2xl border border-border bg-surface p-6">
                <h2 className="font-serif text-2xl font-semibold">Order summary</h2>
                <div className="mt-5 border-b border-border pb-5">
                  <OrderItems lines={lines} />
                </div>
                <div className="mt-5">
                  <SummaryRows subtotal={subtotal} delivery={delivery} />
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

function Confirmation({ order, artisanNames }: { order: Order; artisanNames: string[] }) {
  return (
    <div className="mx-auto mt-12 max-w-2xl animate-scale-in text-center">
      <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-success-soft text-success">
        <CheckCircle2 className="size-10" aria-hidden />
      </div>
      <h2 className="mt-6 font-display text-5xl">Order confirmed</h2>
      <p className="mt-3 text-lg text-muted">
        Thank you, {order.customerName.split(" ")[0]}. We&apos;ve received your order.
      </p>

      <div className="mt-8 rounded-2xl border border-border bg-surface p-6 text-left sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted">Order number</p>
            <p className="font-mono text-2xl font-bold tracking-wide">#{order.number}</p>
          </div>
          <div className="sm:text-right">
            <p className="text-sm text-muted">Estimated delivery</p>
            <p className="font-semibold">{formatDate(order.estimatedDelivery)}</p>
          </div>
        </div>
        <MotifDivider className="my-6" />
        <p className="flex items-start gap-3">
          <BellRing className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
          <span>
            <strong className="font-semibold">The artisan has been notified.</strong>
            <span className="block text-muted">
              {artisanNames.length ? artisanNames.join(" and ") : "Your artisan"} will begin preparing your order. You&apos;ll
              be able to follow each step in order tracking.
            </span>
          </span>
        </p>
        <dl className="mt-6 grid gap-4 border-t border-border pt-6 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted">Total</dt>
            <dd className="font-semibold">{formatNu(order.total)}</dd>
          </div>
          <div>
            <dt className="text-muted">Payment</dt>
            <dd className="font-semibold">{PAYMENT_METHODS.find((m) => m.id === order.paymentMethod)?.label}</dd>
          </div>
          <div>
            <dt className="text-muted">Delivering to</dt>
            <dd className="font-semibold">
              {order.address.gewog}, {order.address.dzongkhag}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <LinkButton href={`/track-order?order=${order.number}`} size="lg">
          Track your order
        </LinkButton>
        <LinkButton href="/shop" size="lg" variant="outline">
          Continue shopping
        </LinkButton>
      </div>
    </div>
  );
}
