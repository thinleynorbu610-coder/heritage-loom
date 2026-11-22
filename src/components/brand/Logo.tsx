import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link href="/" className={cn("group inline-flex items-center", className)} aria-label="Heritage Loom — home">
      <Image
        src="/assets/heritagelogo.png"
        alt="Heritage Loom"
        width={2065}
        height={761}
        priority
        loading="eager"
        className={cn("w-auto transition-transform duration-500 group-hover:scale-105", compact ? "h-8" : "h-10 sm:h-11")}
      />
    </Link>
  );
}
