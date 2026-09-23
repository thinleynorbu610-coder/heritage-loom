"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef } from "react";

/** Horizontal, scroll-snapping carousel with labelled prev/next controls. */
export function Carousel({
  label,
  header,
  children,
}: {
  label: string;
  header?: React.ReactNode;
  children: React.ReactNode;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div>
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="flex-1">{header}</div>
        <div className="hidden gap-2 md:flex">
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="flex size-12 items-center justify-center rounded-full border border-border-strong bg-surface transition-colors hover:border-text hover:bg-text hover:text-background"
            aria-label={`Previous ${label.toLowerCase()}`}
          >
            <ArrowLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="flex size-12 items-center justify-center rounded-full border border-border-strong bg-surface transition-colors hover:border-text hover:bg-text hover:text-background"
            aria-label={`Next ${label.toLowerCase()}`}
          >
            <ArrowRight className="size-5" />
          </button>
        </div>
      </div>
      <div
        ref={trackRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="-mx-4 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-4 scrollbar-none sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0"
      >
        {children}
      </div>
    </div>
  );
}
