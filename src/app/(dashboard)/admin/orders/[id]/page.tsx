"use client";

import { AlertTriangle, BadgeCheck, Banknote, ShieldCheck, Smartphone } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { RequireRole } from "@/components/account/RequireRole";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { OrderDetails } from "@/components/order/OrderStatus";
import { Badge } from "@/components/ui/Badge";
import { Button, LinkButton } from "@/components/ui/Button";
import { useOrders } from "@/context/OrdersContext";
import { useToast } from "@/context/ToastContext";
import { formatDate } from "@/lib/utils";

function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { orders, confirmOrder } = useOrders();
  const { toast } = useToast();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="rounded-2xl border border-dashed border-border-strong bg-surface p-10 text-center">
        <h2 className="font-serif text-2xl font-semibold">Order not found</h2>
        <p className="mt-2 text-muted">It may have been placed in a different browser session.</p>
        <LinkButton href="/admin/orders" variant="outline" className="mt-5">
          Back to orders
        </LinkButton>
      </div>
    );
  }

  const onConfirm = () => {
    confirmOrder(order.id);
    toast({
      title: "Order confirmed",
      description:
        order.paymentMethod === "mobile-banking"
          ? `Payment for #${order.number} marked as verified.`
          : `#${order.number} confirmed for cash on delivery.`,
      variant: "success",
    });
  };

  return (
    <>
      <DashboardHeader title={`Order #${order.number}`} description="Verify payment and confirm this order before it moves to preparation." />

      {order.status === "placed" && (
        <div className="mb-8 rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <div className="flex items-center gap-2">
            {order.paymentMethod === "mobile-banking" ? (
              <Smartphone className="size-5 text-accent" aria-hidden />
            ) : (
              <Banknote className="size-5 text-accent" aria-hidden />
            )}
            <h2 className="font-serif text-2xl font-semibold">
              {order.paymentMethod === "mobile-banking" ? "Mobile banking payment" : "Cash on delivery"}
            </h2>
            {order.paymentVerification === "awaiting-verification" && <Badge tone="warning">Needs verification</Badge>}
          </div>

          {order.paymentMethod === "mobile-banking" ? (
            order.paymentProof ? (
              <div className="mt-5 grid gap-6 sm:grid-cols-[200px_1fr]">
                {/* eslint-disable-next-line @next/next/no-img-element -- customer-uploaded data: URL, next/image can't render it */}
                <img
                  src={order.paymentProof.screenshotDataUrl}
                  alt="Customer-submitted payment screenshot"
                  className="w-full rounded-lg border border-border object-cover"
                />
                <dl className="flex flex-col gap-4 text-sm">
                  <div>
                    <dt className="text-muted">Journal / Transaction Number</dt>
                    <dd className="mt-0.5 font-mono text-base font-semibold">{order.paymentProof.transactionNumber}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Amount to verify</dt>
                    <dd className="mt-0.5 font-semibold">Match against your bank statement for this order&apos;s total.</dd>
                  </div>
                  <div className="mt-2 flex items-start gap-2 rounded-md bg-surface-muted p-3 text-muted">
                    <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
                    Check that the screenshot and transaction number match a real, successful payment before confirming.
                  </div>
                  <Button onClick={onConfirm} className="self-start">
                    <ShieldCheck className="size-4" aria-hidden /> Verify &amp; confirm order
                  </Button>
                </dl>
              </div>
            ) : (
              <p className="mt-4 text-muted">No payment evidence was submitted with this order.</p>
            )
          ) : (
            <div className="mt-4">
              <p className="text-muted">
                No online payment evidence is needed for cash on delivery. The courier will collect payment when the
                order is delivered.
              </p>
              <Button onClick={onConfirm} className="mt-4">
                <ShieldCheck className="size-4" aria-hidden /> Confirm order
              </Button>
            </div>
          )}
        </div>
      )}

      {order.status !== "placed" && (
        <div className="mb-8 flex items-center gap-3 rounded-2xl border border-success/20 bg-success-soft p-5 text-success">
          <BadgeCheck className="size-5 shrink-0" aria-hidden />
          <p>
            <strong className="font-semibold">Confirmed.</strong>{" "}
            {order.history.find((h) => h.status === "paid") &&
              `Payment cleared on ${formatDate(order.history.find((h) => h.status === "paid")!.date)}.`}
          </p>
        </div>
      )}

      <OrderDetails order={order} />

      <Link href="/admin/orders" className="mt-6 inline-block text-sm font-semibold text-primary hover:underline">
        Back to all orders
      </Link>
    </>
  );
}

export default function AdminOrderDetailPage() {
  return (
    <RequireRole role="admin">
      <AdminOrderDetail />
    </RequireRole>
  );
}
