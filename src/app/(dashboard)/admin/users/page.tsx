"use client";

import { useState } from "react";
import { RequireRole } from "@/components/account/RequireRole";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";
import { type Column, DataTable } from "@/components/dashboard/DataTable";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/FormInput";
import { platformUsers } from "@/data/orders";
import { formatDate } from "@/lib/utils";
import type { PlatformUser } from "@/types";

function UsersTable() {
  const [role, setRole] = useState("all");
  const rows = platformUsers.filter((u) => role === "all" || u.role === role);

  const columns: Column<PlatformUser>[] = [
    { key: "name", header: "Name", render: (u) => <span className="font-semibold">{u.name}</span> },
    { key: "email", header: "Email", hideOnMobile: true, render: (u) => u.email },
    { key: "role", header: "Role", render: (u) => <Badge tone={u.role === "admin" ? "dark" : u.role === "artisan" ? "gold" : "neutral"}>{u.role}</Badge> },
    { key: "joined", header: "Joined", hideOnMobile: true, render: (u) => formatDate(u.joined) },
    { key: "orders", header: "Orders", render: (u) => u.orders },
    { key: "status", header: "Status", render: (u) => <StatusBadge status={u.status} /> },
  ];

  return (
    <>
      <div className="mb-6 max-w-xs">
        <Select
          label="Filter by role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          options={[
            { value: "all", label: "All roles" },
            { value: "customer", label: "Customers" },
            { value: "artisan", label: "Artisans" },
            { value: "admin", label: "Admins" },
          ]}
        />
      </div>
      <DataTable columns={columns} rows={rows} emptyMessage="No users found." />
    </>
  );
}

export default function AdminUsersPage() {
  return (
    <RequireRole role="admin">
      <DashboardHeader title="Users" description="All accounts on Heritage Loom." />
      <UsersTable />
    </RequireRole>
  );
}
