/** Join class names, skipping falsy values. */
type ClassValue = string | number | bigint | boolean | null | undefined;

export function cn(...classes: ClassValue[]) {
  return classes.filter((c): c is string => typeof c === "string" && c.length > 0).join(" ");
}

const nuFormatter = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/** Format an amount in Bhutanese Ngultrum, e.g. "Nu. 3,800". */
export function formatNu(amount: number) {
  return `Nu. ${nuFormatter.format(amount)}`;
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function formatDate(iso: string) {
  return dateFormatter.format(new Date(iso + (iso.length === 10 ? "T00:00:00" : "")));
}

export function addDays(iso: string, days: number) {
  const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
