"use client";

import { PackageSearch, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { FormInput } from "@/components/ui/FormInput";
import { Skeleton } from "@/components/ui/LoadingSkeleton";
import { useOrders } from "@/context/OrdersContext";
import { useIsClient } from "@/lib/persistent-store";
import { OrderDetails } from "./OrderStatus";

export function TrackOrderView() {
  const params = useSearchParams();
  const router = useRouter();
  const isClient = useIsClient();
  const { getByNumber } = useOrders();
  const query = params.get("order") ?? "";
  const [value, setValue] = useState(query);
  const order = query ? getByNumber(query) : undefined;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = value.trim().replace(/^#/, "").toUpperCase();
    router.replace(v ? `/track-order?order=${encodeURIComponent(v)}` : "/track-order", { scroll: false });
  };

  return (
    <div className="flex flex-col gap-10">
      <form onSubmit={submit} className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 sm:flex-row sm:items-end sm:p-6">
        <FormInput
          label="Order number"
          placeholder="e.g. HL-2026-0001"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          hint="You'll find it in your confirmation and in My Orders."
          containerClassName="flex-1"
          icon={<Search className="size-4" aria-hidden />}
        />
        <Button type="submit" size="lg" className="sm:mb-7">
          Track order
        </Button>
      </form>

      {query && !isClient ? (
        <Skeleton className="h-80 w-full" />
      ) : query && order ? (
        <OrderDetails order={order} />
      ) : query ? (
        <EmptyState
          icon={<PackageSearch className="size-6" aria-hidden />}
          title={`We couldn't find order “${query}”`}
          description="Check the number and try again. Try the demo orders HL-2026-0001, HL-2026-0002 or HL-2026-0003."
        />
      ) : null}
    </div>
  );
}
