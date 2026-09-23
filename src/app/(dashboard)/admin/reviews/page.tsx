"use client";

import { Eye, Flag, Trash2 } from "lucide-react";
import { useState } from "react";
import { RequireRole } from "@/components/account/RequireRole";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { type Column, DataTable } from "@/components/dashboard/DataTable";
import { Rating } from "@/components/ui/Rating";
import { useToast } from "@/context/ToastContext";
import { reviews as initial } from "@/data/reviews";
import { formatDate } from "@/lib/utils";
import { getProductById } from "@/services/catalog";
import type { Review } from "@/types";

function ReviewModeration() {
  const { toast } = useToast();
  const [rows, setRows] = useState<Review[]>(initial);

  const remove = (r: Review) => {
    setRows((prev) => prev.filter((x) => x.id !== r.id));
    toast({ title: "Review removed", description: r.title, variant: "info" });
  };

  const columns: Column<Review>[] = [
    { key: "product", header: "Product", render: (r) => getProductById(r.productId)?.name ?? "—" },
    { key: "author", header: "Author", render: (r) => r.author },
    { key: "rating", header: "Rating", render: (r) => <Rating value={r.rating} showValue={false} /> },
    { key: "title", header: "Title", hideOnMobile: true, render: (r) => r.title },
    { key: "date", header: "Date", hideOnMobile: true, render: (r) => formatDate(r.date) },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (r) => (
        <div className="flex justify-end gap-2">
          <button type="button" className="rounded-md p-1.5 hover:bg-surface-muted" aria-label="View review">
            <Eye className="size-4" />
          </button>
          <button type="button" className="rounded-md p-1.5 hover:bg-warning-soft hover:text-warning" aria-label="Flag review">
            <Flag className="size-4" />
          </button>
          <button type="button" onClick={() => remove(r)} className="rounded-md p-1.5 hover:bg-danger-soft hover:text-danger" aria-label="Remove review">
            <Trash2 className="size-4" />
          </button>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} rows={rows} emptyMessage="No reviews submitted yet." />;
}

export default function AdminReviewsPage() {
  return (
    <RequireRole role="admin">
      <DashboardHeader title="Reviews" description="Moderate customer reviews across the platform." />
      <ReviewModeration />
    </RequireRole>
  );
}
