import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
  hideOnMobile?: boolean;
}

/**
 * Responsive data table: a real <table> on larger screens, and a stacked
 * card list on mobile so nothing requires horizontal scrolling to read.
 */
export function DataTable<T extends { id: string }>({
  columns,
  rows,
  caption,
  emptyMessage = "Nothing to show yet.",
}: {
  columns: Column<T>[];
  rows: T[];
  caption?: string;
  emptyMessage?: string;
}) {
  if (rows.length === 0) {
    return <p className="rounded-lg border border-dashed border-border-strong bg-surface-muted p-8 text-center text-muted">{emptyMessage}</p>;
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl border border-border md:block">
        <table className="w-full border-collapse text-left text-sm">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead>
            <tr className="border-b border-border bg-surface-muted">
              {columns.map((c) => (
                <th key={c.key} scope="col" className={cn("px-5 py-3.5 font-semibold text-muted", c.className)}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {rows.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-surface-muted/60">
                {columns.map((c) => (
                  <td key={c.key} className={cn("px-5 py-4 align-middle", c.className)}>
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="flex flex-col gap-3 md:hidden">
        {rows.map((row) => (
          <li key={row.id} className="rounded-xl border border-border bg-surface p-4">
            <dl className="flex flex-col gap-2.5">
              {columns
                .filter((c) => !c.hideOnMobile)
                .map((c) => (
                  <div key={c.key} className="flex items-center justify-between gap-3 text-sm">
                    <dt className="shrink-0 text-muted">{c.header}</dt>
                    <dd className="min-w-0 text-right font-medium">{c.render(row)}</dd>
                  </div>
                ))}
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}
