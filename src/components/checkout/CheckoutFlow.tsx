"use client";

import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  BellRing,
  CheckCircle2,
  Clock,
  Info,
  Lock,
  MapPin,
  Pencil,
  ShoppingBag,
  Smartphone,
  Truck,
  Upload,
  X,
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
import {
  MOBILE_BANKING_ACCOUNT_NAME,
  MOBILE_BANKING_ACCOUNT_NUMBER,
  MOBILE_BANKING_QR_URL,
  PAYMENT_METHODS,
} from "@/services/payments";
import type { DeliveryAddress, Order, PaymentMethodId } from "@/types";
import { OrderItems, SummaryRows } from "./OrderSummary";
import { Stepper } from "./Stepper";

const STEPS = ["Delivery", "Payment", "Review", "Confirmation"];
const paymentIcons: Record<PaymentMethodId, typeof Smartphone> = {
  "mobile-banking": Smartphone,
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

/** Reads an image file and downscales it to a compact JPEG data URL, so a phone screenshot doesn't blow the localStorage quota. */
async function fileToCompressedDataUrl(file: File, maxDim = 1000, quality = 0.82): Promise<string> {
  const raw = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new window.Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Could not read image"));
      el.src = raw;
    });
    const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return raw;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", quality);
  } catch {
    return raw;
  }
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
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [screenshotName, setScreenshotName] = useState("");
  const [transactionNumber, setTransactionNumber] = useState("");
  const [screenshotError, setScreenshotError] = useState<string | undefined>();
  const [transactionError, setTransactionError] = useState<string | undefined>();
  const [uploading, setUploading] = useState(false);
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

  const onScreenshotChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setScreenshotError(undefined);
    setUploading(true);
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      setScreenshot(dataUrl);
      setScreenshotName(file.name);
    } catch {
      setScreenshotError("Could not read that image. Please try a different file.");
    } finally {
      setUploading(false);
    }
  };

  const submitPayment = () => {
    if (method === "mobile-banking") {
      const screenshotErr = screenshot ? undefined : "Upload a screenshot of your successful payment.";
      const txErr = transactionNumber.trim() ? undefined : "Enter the Journal/Transaction Number from your bank.";
      setScreenshotError(screenshotErr);
      setTransactionError(txErr);
      if (screenshotErr || txErr) return;
    }
    goTo(2);
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
        paymentProof: method === "mobile-banking" ? { screenshotDataUrl: screenshot!, transactionNumber: transactionNumber.trim() } : undefined,
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
                      Continue to payment <ArrowRight className="size-4" aria-hidden />
                    </Button>
                  </div>
                </form>
              )}

              {/* Step 2 — Payment */}
              {step === 1 && (
                <div className="animate-fade-in">
                  <h2 className="font-serif text-3xl font-semibold">Payment</h2>
                  <p className="mt-1 text-muted">Choose how you would like to pay.</p>

                  <div className="mt-6 flex items-start gap-3 rounded-xl border border-info/20 bg-info-soft p-4 text-sm text-info">
                    <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
                    <p>
                      <strong>Demo mode.</strong> The QR code below is a placeholder — no real payment is taken. A live
                      bank gateway will replace this once the Heritage Loom backend is connected.
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
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>

                  {method === "mobile-banking" && (
                    <div className="mt-6 rounded-xl border border-border bg-surface p-6">
                      <div className="flex flex-col items-center gap-4 border-b border-border pb-6 text-center sm:flex-row sm:text-left">
                        <span className="flex size-40 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-white p-2">
                          {/* eslint-disable-next-line @next/next/no-img-element -- QR host isn't in next.config's image allowlist */}
                          <img src={MOBILE_BANKING_QR_URL} alt="Demo payment QR code" className="size-full object-contain" />
                        </span>
                        <div>
                          <p className="font-semibold">Scan with your mobile banking app</p>
                          <p className="mt-1 text-sm text-muted">
                            Pay <strong className="text-text">{formatNu(total)}</strong> to:
                          </p>
                          <p className="mt-2 text-sm">
                            <span className="block font-semibold">{MOBILE_BANKING_ACCOUNT_NAME}</span>
                            <span className="block text-muted">Acc. {MOBILE_BANKING_ACCOUNT_NUMBER}</span>
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-5 sm:grid-cols-2">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-sm font-semibold text-text">
                            Proof of payment <span className="text-primary" aria-hidden="true">*</span>
                          </span>
                          {screenshot ? (
                            <div className="flex items-center gap-3 rounded-md border border-border bg-surface-muted p-3">
                              <span className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded border border-border bg-white">
                                {/* eslint-disable-next-line @next/next/no-img-element -- next/image doesn't support data: URLs */}
                                <img src={screenshot} alt="Uploaded payment screenshot" className="size-full object-cover" />
                              </span>
                              <span className="min-w-0 flex-1 truncate text-sm text-muted">{screenshotName}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setScreenshot(null);
                                  setScreenshotName("");
                                }}
                                aria-label="Remove screenshot"
                                className="shrink-0 rounded-md p-1.5 text-muted hover:bg-surface hover:text-danger"
                              >
                                <X className="size-4" aria-hidden />
                              </button>
                            </div>
                          ) : (
                            <label
                              className={cn(
                                "flex h-24 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md border-2 border-dashed bg-surface-muted text-sm text-muted transition-colors hover:border-primary hover:text-primary",
                                screenshotError ? "border-danger" : "border-border-strong",
                              )}
                            >
                              <Upload className="size-5" aria-hidden />
                              {uploading ? "Reading image…" : "Upload payment screenshot"}
                              <input type="file" accept="image/*" onChange={onScreenshotChange} disabled={uploading} className="sr-only" />
                            </label>
                          )}
                          {screenshotError && (
                            <p className="text-sm font-medium text-danger" role="alert">
                              {screenshotError}
                            </p>
                          )}
                        </div>
                        <FormInput
                          label="Journal / Transaction Number"
                          placeholder="e.g. FT2609240087"
                          value={transactionNumber}
                          onChange={(e) => {
                            setTransactionNumber(e.target.value);
                            if (transactionError) setTransactionError(undefined);
                          }}
                          error={transactionError}
                          hint="Given by your bank after a successful transfer."
                          required
                        />
                      </div>
                    </div>
                  )}

                  {method === "cash-on-delivery" && (
                    <div className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-surface p-5 text-sm">
                      <Truck className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
                      <p>
                        No online payment needed. Have <strong>{formatNu(total)}</strong> ready in cash for the courier
                        when your order arrives.
                      </p>
                    </div>
                  )}

                  <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button type="button" onClick={() => goTo(0)} className="inline-flex items-center gap-2 text-sm font-semibold hover:text-primary">
                      <ArrowLeft className="size-4" aria-hidden /> Back to delivery
                    </button>
                    <Button size="lg" onClick={submitPayment}>
                      Continue to review <ArrowRight className="size-4" aria-hidden />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3 — Review */}
              {step === 2 && (
                <div className="animate-fade-in">
                  <h2 className="font-serif text-3xl font-semibold">Review your order</h2>
                  <p className="mt-1 text-muted">Please check everything before placing your order.</p>

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

                  <div className="mt-6 rounded-xl border border-border bg-surface p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        {(() => {
                          const Icon = paymentIcons[method];
                          return <Icon className="mt-1 size-5 shrink-0 text-accent" aria-hidden />;
                        })()}
                        <div>
                          <p className="font-semibold">{PAYMENT_METHODS.find((m) => m.id === method)?.label}</p>
                          {method === "cash-on-delivery" ? (
                            <p className="mt-1 text-muted">Pay {formatNu(total)} in cash on delivery.</p>
                          ) : (
                            <p className="mt-1 text-muted">Journal/Transaction No. {transactionNumber}</p>
                          )}
                        </div>
                      </div>
                      <button type="button" onClick={() => goTo(1)} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                        <Pencil className="size-3.5" aria-hidden /> Edit
                      </button>
                    </div>
                    {method === "mobile-banking" && screenshot && (
                      <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                        <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-white">
                          {/* eslint-disable-next-line @next/next/no-img-element -- next/image doesn't support data: URLs */}
                          <img src={screenshot} alt="Uploaded payment screenshot" className="size-full object-cover" />
                        </span>
                        <p className="text-sm text-muted">Payment screenshot submitted for verification.</p>
                      </div>
                    )}
                  </div>

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
                      <ArrowLeft className="size-4" aria-hidden /> Back to payment
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
  const awaitingVerification = order.paymentVerification === "awaiting-verification";
  return (
    <div className="mx-auto mt-12 max-w-2xl animate-scale-in text-center">
      <div
        className={cn(
          "mx-auto flex size-20 items-center justify-center rounded-full",
          awaitingVerification ? "bg-warning-soft text-warning" : "bg-success-soft text-success",
        )}
      >
        {awaitingVerification ? <Clock className="size-10" aria-hidden /> : <CheckCircle2 className="size-10" aria-hidden />}
      </div>
      <h2 className="mt-6 font-display text-5xl">{awaitingVerification ? "Order received" : "Order confirmed"}</h2>
      <p className="mt-3 text-lg text-muted">
        Thank you, {order.customerName.split(" ")[0]}.{" "}
        {awaitingVerification
          ? "We're verifying your payment and will confirm your order shortly."
          : "We've received your order."}
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
        {awaitingVerification ? (
          <p className="flex items-start gap-3">
            <Clock className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden />
            <span>
              <strong className="font-semibold">Awaiting payment verification.</strong>
              <span className="block text-muted">
                Our team checks the payment screenshot and transaction number you submitted, usually within a few
                hours. You&apos;ll see the order move to &ldquo;Payment confirmed&rdquo; once it&apos;s verified.
              </span>
            </span>
          </p>
        ) : (
          <p className="flex items-start gap-3">
            <BellRing className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
            <span>
              <strong className="font-semibold">The artisan has been notified.</strong>
              <span className="block text-muted">
                {artisanNames.length ? artisanNames.join(" and ") : "Your artisan"} will begin preparing your order
                once it&apos;s confirmed. You&apos;ll be able to follow each step in order tracking.
              </span>
            </span>
          </p>
        )}
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
