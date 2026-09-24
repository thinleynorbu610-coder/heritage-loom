import { Check, Clock, CreditCard, Home, Package, ShoppingBag, Truck } from "lucide-react";
import Link from "next/link";
import { SmartImage } from "@/components/ui/SmartImage";
import { StatusBadge } from "@/components/ui/Badge";
import { cn, formatDate, formatNu } from "@/lib/utils";
import { getArtisanById, getProductById } from "@/services/catalog";
import type { Order, OrderStatus as Status } from "@/types";

const FLOW: { status: Status; label: string; description: string; icon: typeof Check }[] = [
  { status: "placed", label: "Order Placed", description: "We've received your order.", icon: ShoppingBag },
  { status: "paid", label: "Payment Confirmed", description: "Your payment has been confirmed.", icon: CreditCard },
  { status: "preparing", label: "Preparing", description: "The artisan is preparing and packing your piece.", icon: Package },
  { status: "shipped", label: "Shipped", description: "On its way with the courier.", icon: Truck },
  { status: "delivered", label: "Delivered", description: "Delivered to your address.", icon: Home },
];

/** Visual progress tracker — horizontal on desktop, vertical on mobile. */
export function OrderProgress({ order }: { order: Order }) {
  const currentIndex = FLOW.findIndex((f) => f.status === order.status);
  const dateFor = (s: Status) => order.history.find((h) => h.status === s)?.date;
  const pct = (Math.max(0, currentIndex) / (FLOW.length - 1)) * 100;

  return (
    <div>
      {/* Desktop */}
      <ol className="relative hidden grid-cols-5 md:grid" aria-label="Order progress">
        <span className="absolute top-6 right-[10%] left-[10%] h-1 rounded-full bg-border" aria-hidden />
        <span
          className="absolute top-6 left-[10%] h-1 rounded-full bg-success transition-[width] duration-700"
          style={{ width: `${pct * 0.8}%` }}
          aria-hidden
        />
        {FLOW.map((f, i) => {
          const done = i <= currentIndex;
          const current = i === currentIndex;
          const Icon = f.icon;
          return (
            <li key={f.status} className="relative flex flex-col items-center text-center" aria-current={current ? "step" : undefined}>
              <span
                className={cn(
                  "relative flex size-13 items-center justify-center rounded-full border-4 border-background transition-colors",
                  done ? "bg-success text-white" : "bg-surface-muted text-subtle",
                  current && "ring-4 ring-success/20",
                )}
              >
                {done && !current ? <Check className="size-5" aria-hidden /> : <Icon className="size-5" aria-hidden />}
              </span>
              <p className={cn("mt-3 font-semibold", !done && "text-muted")}>{f.label}</p>
              <p className="mt-0.5 text-xs text-muted">{dateFor(f.status) ? formatDate(dateFor(f.status)!) : "Pending"}</p>
              <span className="sr-only">{done ? "Completed" : "Not yet"}</span>
            </li>
          );
        })}
      </ol>

      {/* Mobile */}
      <ol className="relative flex flex-col gap-6 md:hidden" aria-label="Order progress">
        {FLOW.map((f, i) => {
          const done = i <= currentIndex;
          const current = i === currentIndex;
          const Icon = f.icon;
          return (
            <li key={f.status} className="relative flex gap-4" aria-current={current ? "step" : undefined}>
              {i < FLOW.length - 1 && (
                <span className={cn("absolute top-11 bottom-[-1.5rem] left-5 w-0.5 -translate-x-1/2", i < currentIndex ? "bg-success" : "bg-border")} aria-hidden />
              )}
              <span
                className={cn(
                  "relative flex size-10 shrink-0 items-center justify-center rounded-full",
                  done ? "bg-success text-white" : "bg-surface-muted text-subtle",
                  current && "ring-4 ring-success/20",
                )}
              >
                {done && !current ? <Check className="size-4" aria-hidden /> : <Icon className="size-4" aria-hidden />}
              </span>
              <div className="pt-1.5">
                <p className={cn("font-semibold", !done && "text-muted")}>{f.label}</p>
                <p className="text-sm text-muted">
                  {current ? f.description : dateFor(f.status) ? formatDate(dateFor(f.status)!) : "Pending"}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function OrderDetails({ order }: { order: Order }) {
  const current = FLOW.find((f) => f.status === order.status);
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="text-sm text-muted">Order number</p>
          <p className="font-mono text-2xl font-bold">#{order.number}</p>
        </div>
        <div className="flex flex-col gap-1 sm:items-end">
          <StatusBadge status={order.status} />
          <p className="text-sm text-muted">{current?.description}</p>
        </div>
      </div>

      {order.paymentVerification === "awaiting-verification" && (
        <div className="flex items-start gap-3 rounded-2xl border border-warning/20 bg-warning-soft p-5 text-warning">
          <Clock className="mt-0.5 size-5 shrink-0" aria-hidden />
          <p>
            <strong className="font-semibold">Payment is being verified.</strong>
            <span className="block text-warning/90">
              We&apos;re checking your mobile banking payment. This usually takes a few hours, and your order will move
              to &ldquo;Payment Confirmed&rdquo; once it&apos;s cleared.
            </span>
          </p>
        </div>
      )}

      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <OrderProgress order={order} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <h2 className="font-serif text-2xl font-semibold">Items</h2>
          <ul className="mt-5 divide-y divide-border">
            {order.lines.map((l) => {
              const p = getProductById(l.productId);
              const a = p ? getArtisanById(p.artisanId) : undefined;
              if (!p) return null;
              return (
                <li key={l.productId} className="flex items-center gap-4 py-4">
                  <Link href={`/products/${p.slug}`} className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                    <SmartImage src={p.images[0].src} alt={p.images[0].alt} fill sizes="80px" className="object-cover" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link href={`/products/${p.slug}`} className="font-semibold hover:text-primary">
                      {p.name}
                    </Link>
                    <p className="text-sm text-muted">
                      Artisan:{" "}
                      <Link href={`/artisans/${a?.slug}`} className="font-semibold text-text hover:text-primary">
                        {a?.name}
                      </Link>
                    </p>
                    <p className="text-sm text-muted">Qty {l.quantity}</p>
                  </div>
                  <p className="font-semibold tabular-nums">{formatNu(l.unitPrice * l.quantity)}</p>
                </li>
              );
            })}
          </ul>
          <div className="mt-2 flex justify-between border-t border-border pt-4 font-semibold">
            <span>Total paid</span>
            <span className="tabular-nums">{formatNu(order.total)}</span>
          </div>
        </div>
        <dl className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <div>
            <dt className="text-sm text-muted">Delivery address</dt>
            <dd className="mt-1 font-semibold">{order.address.fullName}</dd>
            <dd className="text-muted">
              {order.address.address}, {order.address.gewog}, {order.address.dzongkhag}
            </dd>
            <dd className="text-muted">{order.address.phone}</dd>
          </div>
          <div className="grid grid-cols-2 gap-4 border-t border-border pt-5">
            <div>
              <dt className="text-sm text-muted">Order date</dt>
              <dd className="mt-1 font-semibold">{formatDate(order.placedAt)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">{order.status === "delivered" ? "Delivered" : "Estimated delivery"}</dt>
              <dd className="mt-1 font-semibold">
                {formatDate(order.history.find((h) => h.status === "delivered")?.date ?? order.estimatedDelivery)}
              </dd>
            </div>
          </div>
        </dl>
      </div>
    </div>
  );
}
