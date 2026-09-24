"use client";

import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { useRef, useState } from "react";
import { Modal } from "@/components/ui/Overlay";
import { SmartImage } from "@/components/ui/SmartImage";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types";

export function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [index, setIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const [zooming, setZooming] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const go = (i: number) => {
    const next = (i + images.length) % images.length;
    setIndex(next);
    const track = trackRef.current;
    if (track) track.scrollTo({ left: track.clientWidth * next, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col-reverse gap-4 lg:flex-row">
      {/* Thumbnails */}
      <div className="hidden gap-3 lg:flex lg:w-20 lg:flex-col" role="tablist" aria-label="Product images">
        {images.map((img, i) => (
          <button
            key={img.src + i}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Show image ${i + 1}: ${img.alt}`}
            onClick={() => go(i)}
            className={cn(
              "relative aspect-[4/5] w-full overflow-hidden rounded-md border-2 bg-surface-muted transition-all",
              i === index ? "border-primary" : "border-transparent opacity-70 hover:opacity-100",
            )}
          >
            <SmartImage src={img.src} alt="" fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>

      {/* Main image — desktop: hover zoom; mobile: swipe */}
      <div className="relative flex-1">
        <div
          className="group relative hidden aspect-[4/5] cursor-zoom-in overflow-hidden rounded-xl bg-surface-muted lg:block"
          onMouseEnter={() => setZooming(true)}
          onMouseLeave={() => setZooming(false)}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
          }}
          onClick={() => setZoomOpen(true)}
        >
          <SmartImage
            key={images[index].src}
            src={images[index].src}
            alt={images[index].alt}
            fill
            priority
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="animate-fade-in object-cover transition-transform duration-300 ease-out"
            style={{ transformOrigin: origin, transform: zooming ? "scale(1.6)" : "scale(1)" }}
            fallbackLabel={name}
          />
          <span className="pointer-events-none absolute right-4 bottom-4 flex items-center gap-1.5 rounded-full bg-surface/90 px-3 py-1.5 text-xs font-semibold opacity-0 shadow-soft transition-opacity group-hover:opacity-100">
            <Expand className="size-3.5" aria-hidden /> Click to enlarge
          </span>
        </div>

        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory overflow-x-auto scrollbar-none lg:hidden"
          onScroll={(e) => {
            const el = e.currentTarget;
            const i = Math.round(el.scrollLeft / el.clientWidth);
            if (i !== index) setIndex(i);
          }}
          aria-label="Product images, swipe to see more"
          role="region"
        >
          {images.map((img, i) => (
            <div key={img.src + i} className="relative aspect-[4/5] w-full shrink-0 snap-center overflow-hidden rounded-xl bg-surface-muted">
              <SmartImage src={img.src} alt={img.alt} fill priority={i === 0} sizes="100vw" className="object-cover" fallbackLabel={name} />
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              className="absolute top-1/2 left-3 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 shadow-soft transition-colors hover:bg-surface sm:flex"
              aria-label="Previous image"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              className="absolute top-1/2 right-3 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 shadow-soft transition-colors hover:bg-surface sm:flex"
              aria-label="Next image"
            >
              <ChevronRight className="size-5" />
            </button>
            <div className="mt-3 flex justify-center gap-1.5 lg:hidden" aria-hidden="true">
              {images.map((_, i) => (
                <span key={i} className={cn("h-1.5 rounded-full transition-all", i === index ? "w-6 bg-primary" : "w-1.5 bg-border-strong")} />
              ))}
            </div>
          </>
        )}
      </div>

      <Modal open={zoomOpen} onClose={() => setZoomOpen(false)} title={name} description={images[index].alt} size="lg">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-surface-muted sm:aspect-[4/3]">
          <SmartImage src={images[index].src} alt={images[index].alt} fill sizes="90vw" className="object-contain" fallbackLabel={name} />
        </div>
        <div className="mt-4 flex justify-center gap-2">
          {images.map((img, i) => (
            <button
              key={img.src + i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1}`}
              className={cn("relative size-14 overflow-hidden rounded-md border-2", i === index ? "border-primary" : "border-transparent")}
            >
              <SmartImage src={img.src} alt="" fill sizes="56px" className="object-cover" />
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}
