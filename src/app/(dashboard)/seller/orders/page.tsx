"use client";

import { Banknote, Check, CheckCircle2, Eye, Maximize2, Search, ShieldCheck, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { RequireRole } from "@/components/account/RequireRole";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { type Column, DataTable } from "@/components/dashboard/DataTable";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Checkbox, FormInput } from "@/components/ui/FormInput";
import { Drawer, Modal } from "@/components/ui/Overlay";
import { SmartImage } from "@/components/ui/SmartImage";
import { useToast } from "@/context/ToastContext";
import { type SellerOrder, type SellerOrderStatus, sellerOrders as initialOrders } from "@/data/orders";
import { cn, formatDate, formatNu } from "@/lib/utils";
import { getProductById } from "@/services/catalog";

const STATUS_FLOW: SellerOrderStatus[] = ["pending", "paid", "shipped", "delivered"];
const TABS = ["all", ...STATUS_FLOW, "cancelled"] as const;
/** The artisan's own receiving account — shown as the verification destination. */
const SELLER_ACCOUNT = "mBoB ****4821";

function OrdersManager() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<SellerOrder[]>(initialOrders);
  const [tab, setTab] = useState<(typeof TABS)[number]>("all");
  const [query, setQuery] = useState("");
  const [viewing, setViewing] = useState<SellerOrder | null>(null);
  const [verifying, setVerifying] = useState<SellerOrder | null>(null);
  const [cancelling, setCancelling] = useState<SellerOrder | null>(null);

  const advance = (order: SellerOrder) => {
    const idx = STATUS_FLOW.indexOf(order.status);
    if (idx === -1 || idx === STATUS_FLOW.length - 1) return;
    const next = STATUS_FLOW[idx + 1];
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: next } : o)));
    setViewing((v) => (v?.id === order.id ? { ...v, status: next } : v));
    toast({ title: `Order #${order.number} marked as ${next}`, description: order.customer });
  };

  const confirmPayment = (order: SellerOrder) => {
    advance(order);
    setVerifying(null);
  };

  const rejectPayment = (order: SellerOrder) => {
    setVerifying(null);
    toast({ title: "Payment proof rejected", description: `${order.customer} has been notified to resubmit.`, variant: "info" });
  };

  const cancel = (order: SellerOrder) => {
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: "cancelled" } : o)));
    setViewing((v) => (v?.id === order.id ? { ...v, status: "cancelled" } : v));
    setCancelling(null);
    toast({ title: `Order #${order.number} cancelled`, description: order.customer, variant: "info" });
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (tab !== "all" && o.status !== tab) return false;
      if (!q) return true;
      return o.number.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q);
    });
  }, [orders, tab, query]);

  const canCancel = (o: SellerOrder) => o.status === "pending" || o.status === "paid";

  const columns: Column<SellerOrder>[] = [
    { key: "number", header: "Order", render: (o) => <span className="font-mono font-semibold">#{o.number}</span> },
    { key: "customer", header: "Customer", render: (o) => o.customer },
    { key: "product", header: "Product", hideOnMobile: true, render: (o) => getProductById(o.productId)?.name ?? "—" },
    { key: "total", header: "Total", render: (o) => formatNu(o.total) },
    { key: "date", header: "Date", hideOnMobile: true, render: (o) => formatDate(o.date) },
    { key: "status", header: "Status", render: (o) => <StatusBadge status={o.status} /> },
    {
      key: "action",
      header: "Action",
      className: "text-right",
      render: (o) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => setViewing(o)}
            className="rounded-md p-1.5 text-muted hover:bg-surface-muted hover:text-text"
            aria-label={`View order #${o.number}`}
          >
            <Eye className="size-4" />
          </button>
          {o.status === "delivered" || o.status === "cancelled" ? (
            <span className="px-1.5 text-sm text-muted">{o.status === "delivered" ? "Complete" : "—"}</span>
          ) : o.status === "pending" ? (
            <button
              type="button"
              onClick={() => setVerifying(o)}
              className="flex items-center gap-1.5 rounded-md border border-warning/30 bg-warning-soft px-3 py-1.5 text-sm font-semibold text-warning hover:border-warning/50"
            >
              <ShieldCheck className="size-3.5" /> Verify Payment
            </button>
          ) : (
            <button
              type="button"
              onClick={() => advance(o)}
              className="rounded-md border border-border-strong px-3 py-1.5 text-sm font-semibold hover:border-primary hover:text-primary"
            >
              Mark as {STATUS_FLOW[STATUS_FLOW.indexOf(o.status) + 1]}
            </button>
          )}
          {canCancel(o) && (
            <button
              type="button"
              onClick={() => setCancelling(o)}
              className="rounded-md p-1.5 text-muted hover:bg-danger-soft hover:text-danger"
              aria-label={`Cancel order #${o.number}`}
            >
              <XCircle className="size-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="mb-5 max-w-sm">
        <FormInput
          placeholder="Search order number or customer…"
          icon={<Search className="size-4" aria-hidden />}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search orders"
        />
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            aria-pressed={tab === t}
            className={`h-10 shrink-0 rounded-full border px-4 text-sm font-semibold capitalize transition-colors ${
              tab === t ? "border-ink bg-ink text-background" : "border-border hover:border-text"
            }`}
          >
            {t} {t !== "all" && `(${orders.filter((o) => o.status === t).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 && orders.length > 0 ? (
        <div className="rounded-lg border border-dashed border-border-strong bg-surface-muted p-8 text-center text-muted">
          No orders match &ldquo;{query}&rdquo;{tab !== "all" ? ` in ${tab}` : ""}.
        </div>
      ) : (
        <DataTable columns={columns} rows={filtered} emptyMessage="No orders in this status." />
      )}

      <OrderDetailDrawer
        order={viewing}
        onClose={() => setViewing(null)}
        onAdvance={advance}
        onVerify={(o) => setVerifying(o)}
        onRequestCancel={(o) => setCancelling(o)}
      />

      <VerifyPaymentDrawer order={verifying} onClose={() => setVerifying(null)} onConfirm={confirmPayment} onReject={rejectPayment} />

      <Modal
        open={!!cancelling}
        onClose={() => setCancelling(null)}
        title="Cancel this order?"
        description={cancelling ? `Order #${cancelling.number} for ${cancelling.customer} will be marked cancelled. This can't be undone.` : undefined}
        footer={
          <>
            <Button variant="outline" onClick={() => setCancelling(null)}>
              Keep order
            </Button>
            <Button variant="danger" onClick={() => cancelling && cancel(cancelling)}>
              Cancel order
            </Button>
          </>
        }
      />
    </>
  );
}

function OrderDetailDrawer({
  order,
  onClose,
  onAdvance,
  onVerify,
  onRequestCancel,
}: {
  order: SellerOrder | null;
  onClose: () => void;
  onAdvance: (o: SellerOrder) => void;
  onVerify: (o: SellerOrder) => void;
  onRequestCancel: (o: SellerOrder) => void;
}) {
  const product = order ? getProductById(order.productId) : undefined;
  const canAdvance = order ? order.status !== "pending" && order.status !== "delivered" && order.status !== "cancelled" : false;
  const canCancel = order ? order.status === "pending" || order.status === "paid" : false;

  return (
    <Drawer
      open={!!order}
      onClose={onClose}
      title={order ? `Order #${order.number}` : "Order"}
      footer={
        order && (
          <div className="flex flex-wrap items-center gap-2">
            {order.status === "delivered" && <span className="text-sm text-muted">This order is complete.</span>}
            {order.status === "cancelled" && <span className="text-sm text-muted">This order was cancelled.</span>}
            {order.status === "pending" && (
              <Button onClick={() => onVerify(order)}>
                <ShieldCheck className="size-4" /> Verify Payment
              </Button>
            )}
            {canAdvance && (
              <Button onClick={() => onAdvance(order)}>Mark as {STATUS_FLOW[STATUS_FLOW.indexOf(order.status) + 1]}</Button>
            )}
            {canCancel && (
              <Button variant="outline" onClick={() => onRequestCancel(order)}>
                Cancel order
              </Button>
            )}
          </div>
        )
      }
    >
      {order && (
        <div className="flex flex-col gap-6 p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">{formatDate(order.date)}</span>
            <StatusBadge status={order.status} />
          </div>

          <div>
            <p className="eyebrow">Customer</p>
            <p className="mt-1 font-semibold">{order.customer}</p>
            <p className="text-sm text-muted">{order.dzongkhag}</p>
          </div>

          <div>
            <p className="eyebrow">Item{order.quantity > 1 ? "s" : ""}</p>
            <div className="mt-2 flex items-center gap-3 rounded-lg border border-border bg-surface p-3">
              <span className="relative size-14 shrink-0 overflow-hidden rounded-md bg-surface-muted">
                {product && <SmartImage src={product.images[0].src} alt="" fill sizes="56px" className="object-cover" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{product?.name ?? "—"}</p>
                <p className="text-xs text-muted">
                  Qty {order.quantity} · {formatNu(order.total / order.quantity)} each
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-4">
            <span className="font-semibold">Total</span>
            <span className="font-serif text-xl font-semibold">{formatNu(order.total)}</span>
          </div>
        </div>
      )}
    </Drawer>
  );
}

/** Stylised stand-in for the buyer's uploaded mobile-banking screenshot. */
function ReceiptMock({ order, large }: { order: SellerOrder; large?: boolean }) {
  return (
    <div
      className={cn(
        "mx-auto flex flex-col items-center gap-3 rounded-2xl bg-gradient-to-b from-info to-ink p-6 text-center text-white shadow-lift",
        large ? "w-full max-w-sm" : "w-56",
      )}
    >
      <p className="text-sm font-bold tracking-wide">{order.paymentMethod}</p>
      <span className="flex size-10 items-center justify-center rounded-full bg-white/15">
        <Check className="size-5" />
      </span>
      <p className="text-xs text-white/80">Fund Transfer Successful</p>
      <div className="w-full rounded-xl bg-white/10 p-3 text-left text-xs">
        <dl className="flex flex-col gap-1.5">
          <div className="flex justify-between gap-3">
            <dt className="text-white/70">Amount</dt>
            <dd className="font-semibold">{formatNu(order.total)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-white/70">Jrnl No.</dt>
            <dd className="font-semibold">{order.paymentRef}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-white/70">To Acc</dt>
            <dd className="truncate font-semibold">{SELLER_ACCOUNT}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

function VerifyPaymentDrawer({
  order,
  onClose,
  onConfirm,
  onReject,
}: {
  order: SellerOrder | null;
  onClose: () => void;
  onConfirm: (o: SellerOrder) => void;
  onReject: (o: SellerOrder) => void;
}) {
  const [confirmed, setConfirmed] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  const close = () => {
    setConfirmed(false);
    onClose();
  };

  return (
    <>
      <Drawer
        open={!!order}
        onClose={close}
        title="Verify Payment Receipt"
        headerExtra={<Badge tone="warning">Pending seller action</Badge>}
        footer={
          order && (
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button variant="outline" onClick={close}>
                Close / Review Later
              </Button>
              <Button variant="outline" className="border-danger/40 text-danger hover:bg-danger-soft" onClick={() => onReject(order)}>
                Reject Proof
              </Button>
              <Button disabled={!confirmed} onClick={() => onConfirm(order)}>
                <CheckCircle2 className="size-4" /> Confirm &amp; Mark Paid
              </Button>
            </div>
          )
        }
      >
        {order && (
          <div className="flex flex-col gap-6 p-5">
            <p className="text-xs text-muted">
              Order #{order.number} · Submitted {formatDate(order.date)}
            </p>

            <div>
              <p className="eyebrow">Buyer &amp; transfer claim details</p>
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-4 rounded-lg border border-border bg-surface p-4 text-sm">
                <div>
                  <dt className="text-xs text-muted">Customer</dt>
                  <dd className="mt-0.5 font-semibold">{order.customer}</dd>
                  <dd className="text-xs text-muted">{order.customerEmail}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Claimed amount</dt>
                  <dd className="mt-0.5 font-semibold text-success">{formatNu(order.total)}</dd>
                  <dd className="text-xs text-success">Invoice exact match</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Payment method</dt>
                  <dd className="mt-0.5 flex items-center gap-1.5 font-semibold">
                    <Banknote className="size-3.5" /> {order.paymentMethod}
                  </dd>
                  <dd className="text-xs text-muted">{SELLER_ACCOUNT}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Transaction ref</dt>
                  <dd className="mt-0.5 font-semibold">Jrnl No. {order.paymentRef}</dd>
                  <dd className="text-xs text-success">Formatted valid</dd>
                </div>
              </dl>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <p className="eyebrow">Buyer uploaded receipt</p>
                <button type="button" onClick={() => setZoomed(true)} className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                  <Maximize2 className="size-3.5" /> Zoom
                </button>
              </div>
              <div className="mt-3 rounded-xl border border-border bg-surface-muted p-5">
                <ReceiptMock order={order} />
              </div>
            </div>

            <div>
              <p className="eyebrow">Extracted receipt details</p>
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-xs text-muted">Extracted total</dt>
                  <dd className="font-semibold tabular-nums">{formatNu(order.total)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Sender account</dt>
                  <dd className="font-semibold">{order.customer}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Destination acc</dt>
                  <dd className="font-semibold">{SELLER_ACCOUNT}</dd>
                </div>
              </dl>
            </div>

            <Checkbox
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              label={
                <>
                  I confirm receipt in my bank account: I have checked my merchant portal / bank balance and verify
                  that the payment of {formatNu(order.total)} was received from {order.customer} to account{" "}
                  {SELLER_ACCOUNT}.
                </>
              }
              className="rounded-lg border border-success/25 bg-success-soft p-3"
            />
          </div>
        )}
      </Drawer>

      {order && (
        <Modal open={zoomed} onClose={() => setZoomed(false)} title="Uploaded receipt" size="sm">
          <ReceiptMock order={order} large />
        </Modal>
      )}
    </>
  );
}

export default function SellerOrdersPage() {
  return (
    <RequireRole role="artisan">
      <DashboardHeader title="Orders" description="Update order status as you prepare and ship each piece." />
      <OrdersManager />
    </RequireRole>
  );
}
