"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * next/image wrapper with a graceful, on-brand fallback.
 * If a (demo) image fails to load, a woven-pattern panel is shown instead of
 * a broken image icon, so layouts stay intact.
 */
type SmartImageProps = Omit<ImageProps, "src" | "alt"> & {
  src: string;
  alt: string;
  fallbackLabel?: string;
};

export function SmartImage({ src, alt, className, fallbackLabel, fill, ...rest }: SmartImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const failed = failedSrc === src;

  if (failed || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "flex items-center justify-center overflow-hidden bg-accent-soft bg-motif",
          fill ? "absolute inset-0 size-full" : "size-full",
          className,
        )}
      >
        <div className="flex flex-col items-center gap-2 px-4 text-center">
          <svg viewBox="0 0 40 40" className="size-10 text-accent/40" aria-hidden="true">
            <g transform="rotate(45 20 20)" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="8" y="8" width="24" height="24" rx="2" />
              <path d="M16 8v24M24 8v24M8 16h24M8 24h24" />
            </g>
          </svg>
          {fallbackLabel && (
            <span className="max-w-[16ch] font-serif text-lg leading-tight text-accent/70">{fallbackLabel}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      onError={() => setFailedSrc(src)}
      {...rest}
    />
  );
}
