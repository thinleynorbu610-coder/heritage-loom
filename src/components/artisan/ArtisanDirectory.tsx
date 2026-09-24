"use client";

import { UsersRound } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Select } from "@/components/ui/FormInput";
import { cn } from "@/lib/utils";
import { getAllArtisans, getCategories, getRegions } from "@/services/catalog";
import { ArtisanCard } from "./ArtisanCard";

export function ArtisanDirectory() {
  const artisans = getAllArtisans();
  const regions = getRegions();
  const crafts = getCategories();
  const [region, setRegion] = useState("all");
  const [craft, setCraft] = useState("all");

  const results = useMemo(
    () =>
      artisans.filter(
        (a) =>
          (region === "all" || a.region === region) &&
          (craft === "all" || a.craftTypes.includes(craft as (typeof a.craftTypes)[number])),
      ),
    [artisans, region, craft],
  );

  const reset = () => {
    setRegion("all");
    setCraft("all");
  };

  return (
    <div>
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 sm:p-5 lg:flex-row lg:items-end">
        <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:max-w-xl">
          <Select
            label="Region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            options={[{ value: "all", label: "All regions" }, ...regions.map((r) => ({ value: r.slug, label: r.name }))]}
          />
          <Select
            label="Craft type"
            value={craft}
            onChange={(e) => setCraft(e.target.value)}
            options={[{ value: "all", label: "All crafts" }, ...crafts.map((c) => ({ value: c.slug, label: c.name }))]}
          />
        </div>
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-none lg:ml-auto lg:pb-0">
          {crafts.slice(0, 4).map((c) => (
            <button
              key={c.slug}
              type="button"
              aria-pressed={craft === c.slug}
              onClick={() => setCraft(craft === c.slug ? "all" : c.slug)}
              className={cn(
                "h-10 shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors",
                craft === c.slug ? "border-ink bg-ink text-background" : "border-border hover:border-text",
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-muted" aria-live="polite">
        Showing <span className="font-semibold text-text">{results.length}</span> of {artisans.length} artisans
      </p>

      {results.length ? (
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((a) => (
            <li key={a.id} className="animate-fade-in">
              <ArtisanCard artisan={a} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          className="mt-6"
          icon={<UsersRound className="size-6" aria-hidden />}
          title="No artisans match these filters"
          description="Try another region or craft — new makers are joining Heritage Loom every month."
          action={<Button onClick={reset}>Show all artisans</Button>}
        />
      )}
    </div>
  );
}
