"use client";

import { Eye } from "lucide-react";
import { useState } from "react";
import { RequireRole } from "@/components/account/RequireRole";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { type Column, DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Overlay";
import { useToast } from "@/context/ToastContext";
import { artisanApplications as initial } from "@/data/orders";
import { formatDate } from "@/lib/utils";
import type { ArtisanApplication } from "@/types";

function ArtisanApprovals() {
  const { toast } = useToast();
  const [apps, setApps] = useState<ArtisanApplication[]>(initial);
  const [viewing, setViewing] = useState<ArtisanApplication | null>(null);

  const decide = (app: ArtisanApplication, status: "approved" | "rejected") => {
    setApps((prev) => prev.map((a) => (a.id === app.id ? { ...a, status } : a)));
    setViewing(null);
    toast({
      title: status === "approved" ? "Artisan approved" : "Application rejected",
      description: app.name,
      variant: status === "approved" ? "success" : "info",
    });
  };

  const columns: Column<ArtisanApplication>[] = [
    { key: "name", header: "Artisan", render: (a) => <span className="font-semibold">{a.name}</span> },
    { key: "location", header: "Location", render: (a) => a.location },
    { key: "craft", header: "Craft", hideOnMobile: true, render: (a) => a.craft },
    { key: "date", header: "Application date", hideOnMobile: true, render: (a) => formatDate(a.appliedOn) },
    { key: "status", header: "Status", render: (a) => <StatusBadge status={a.status} /> },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (a) => (
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => setViewing(a)} className="rounded-md p-1.5 hover:bg-surface-muted" aria-label={`View ${a.name}`}>
            <Eye className="size-4" />
          </button>
          {a.status === "pending" && (
            <>
              <button type="button" onClick={() => decide(a, "approved")} className="rounded-md bg-success-soft px-2.5 py-1 text-xs font-semibold text-success hover:brightness-95">
                Approve
              </button>
              <button type="button" onClick={() => decide(a, "rejected")} className="rounded-md bg-danger-soft px-2.5 py-1 text-xs font-semibold text-danger hover:brightness-95">
                Reject
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable columns={columns} rows={apps} emptyMessage="No artisan applications." />
      <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing?.name ?? ""} description={`${viewing?.craft} · ${viewing?.location}`}>
        {viewing && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted">Applied {formatDate(viewing.appliedOn)}</p>
            <p>{viewing.note}</p>
            {viewing.status === "pending" && (
              <div className="mt-4 flex gap-3">
                <Button onClick={() => decide(viewing, "approved")}>Approve</Button>
                <Button variant="danger" onClick={() => decide(viewing, "rejected")}>
                  Reject
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}

export default function AdminArtisansPage() {
  return (
    <RequireRole role="admin">
      <DashboardHeader title="Artisans" description="Review and approve artisan applications." />
      <ArtisanApprovals />
    </RequireRole>
  );
}
