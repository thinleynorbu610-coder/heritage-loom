"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { Children, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * 3D cover-flow carousel.
 *
 * The active item sits centred, flat and lifted; neighbours fan out to each side,
 * angled away in perspective, pushed back in depth and softly veiled. Supports
 * mouse/touch drag (with momentum), horizontal trackpad scrolling, keyboard arrows,
 * prev/next buttons and dot pagination. Off-centre items are inert — clicking one
 * brings it to the centre instead of following its link.
 */
export function CoverFlow({
  label,
  header,
  children,
  initialIndex,
  slideClassName = "w-[78%] sm:w-[52%] lg:w-[34%]",
  veilClassName = "bg-ink",
  veilStrength = 0.38,
  className,
}: {
  /** Accessible name for the carousel region. */
  label: string;
  /** Optional heading block rendered above the stage. */
  header?: React.ReactNode;
  children: React.ReactNode;
  /** Item centred on first render. Defaults to the middle item. */
  initialIndex?: number;
  /** Responsive width of each slide (relative to the stage). */
  slideClassName?: string;
  /** Colour of the veil laid over off-centre slides. */
  veilClassName?: string;
  /** Veil opacity for the nearest neighbours (doubles off further out, capped). */
  veilStrength?: number;
  className?: string;
}) {
  const items = Children.toArray(children);
  const count = items.length;
  const clamp = useCallback((i: number) => Math.max(0, Math.min(count - 1, i)), [count]);

  const [active, setActive] = useState(() => clamp(initialIndex ?? Math.floor((count - 1) / 2)));
  const [drag, setDrag] = useState(0); // fractional slide offset while dragging
  const [dragging, setDragging] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  const gesture = useRef<{
    id: number;
    startX: number;
    startY: number;
    lastX: number;
    lastT: number;
    velocity: number; // px per ms
    engaged: boolean;
    width: number;
  } | null>(null);
  const suppressClick = useRef(false);
  const wheel = useRef({ acc: 0, lockedUntil: 0 });

  const go = useCallback((i: number) => setActive(clamp(i)), [clamp]);

  // Keep the index valid if the number of items changes.
  useEffect(() => {
    setActive((a) => clamp(a));
  }, [clamp]);

  /* ----------------------------------------------------------- drag / swipe */

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    gesture.current = {
      id: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastT: performance.now(),
      velocity: 0,
      engaged: false,
      width: slideRef.current?.offsetWidth || 320,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const g = gesture.current;
    if (!g || g.id !== e.pointerId) return;
    const dx = e.clientX - g.startX;
    const dy = e.clientY - g.startY;

    if (!g.engaged) {
      if (Math.abs(dx) < 6) return;
      // Mostly-vertical movement belongs to page scrolling.
      if (Math.abs(dy) > Math.abs(dx)) {
        gesture.current = null;
        return;
      }
      g.engaged = true;
      setDragging(true);
      stageRef.current?.setPointerCapture(e.pointerId);
    }

    const now = performance.now();
    const dt = Math.max(1, now - g.lastT);
    g.velocity = g.velocity * 0.6 + ((e.clientX - g.lastX) / dt) * 0.4;
    g.lastX = e.clientX;
    g.lastT = now;

    let offset = -dx / (g.width * 0.62);
    // Rubber-band past the ends.
    const target = active + offset;
    if (target < 0) offset = -active + target * 0.3;
    if (target > count - 1) offset = count - 1 - active + (target - (count - 1)) * 0.3;
    setDrag(offset);
  };

  const endGesture = (e: React.PointerEvent) => {
    const g = gesture.current;
    gesture.current = null;
    if (!g || g.id !== e.pointerId || !g.engaged) return;

    suppressClick.current = true;
    window.setTimeout(() => (suppressClick.current = false), 0);

    // Fling: project momentum forward, then snap to the nearest slide.
    const fling = (-g.velocity * 180) / (g.width * 0.62);
    let next = Math.round(active + drag + fling);
    if (next === active && Math.abs(drag) > 0.15) next = active + Math.sign(drag);
    setDragging(false);
    setDrag(0);
    go(next);
  };

  /* ------------------------------------------------------ wheel / keyboard */

  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    const w = wheel.current;
    const now = performance.now();
    if (now < w.lockedUntil) return;
    w.acc += e.deltaX;
    if (Math.abs(w.acc) > 40) {
      go(active + Math.sign(w.acc));
      w.acc = 0;
      w.lockedUntil = now + 420;
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const map: Record<string, number> = {
      ArrowLeft: active - 1,
      ArrowRight: active + 1,
      Home: 0,
      End: count - 1,
    };
    if (e.key in map) {
      e.preventDefault();
      go(map[e.key]);
    }
  };

  /* ---------------------------------------------------------------- render */

  const position = active + drag;

  return (
    <div className={className}>
      {header}

      <div
        ref={stageRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endGesture}
        onPointerCancel={endGesture}
        onWheel={onWheel}
        onKeyDown={onKeyDown}
        onClickCapture={(e) => {
          if (suppressClick.current) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        onDragStart={(e) => e.preventDefault()}
        className={cn(
          "coverflow-stage relative mt-12 grid touch-pan-y justify-items-center rounded-xl py-6 select-none [perspective:1600px] focus-visible:outline-offset-8",
          dragging ? "cursor-grabbing" : "cursor-grab",
        )}
      >
        {/* Soft floor shadow anchoring the centre slide */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-[20%] -bottom-2 h-10 rounded-[50%] bg-ink/20 blur-2xl"
        />

        {items.map((child, i) => {
          const o = i - position;
          const a = Math.abs(o);
          const s = Math.sign(o);
          const near = Math.min(a, 1);
          const isActive = i === active;

          // Distance from centre, as a percentage of the slide's own width.
          const x = s * (near * 74 + Math.max(a - 1, 0) * 40);
          const z = -Math.min(a, 3.5) * 170;
          const rotate = -s * near * 38;
          const scale = 1 - Math.min(a, 3) * 0.05;
          const opacity = a <= 2.4 ? 1 : Math.max(0, 1 - (a - 2.4) / 0.6);
          const veil = Math.min(near * veilStrength + Math.max(a - 1, 0) * veilStrength * 0.5, 0.75);

          return (
            <div
              key={i}
              ref={i === 0 ? slideRef : undefined}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={!isActive || undefined}
              onClick={isActive ? undefined : () => go(i)}
              className={cn(
                "coverflow-slide relative col-start-1 row-start-1 [transform-style:preserve-3d] [backface-visibility:hidden]",
                !dragging &&
                  "transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                slideClassName,
              )}
              style={{
                transform: `translateX(${x}%) translateZ(${z}px) rotateY(${rotate}deg) scale(${scale})`,
                opacity,
                zIndex: 100 - Math.round(a * 10),
                pointerEvents: opacity < 0.05 ? "none" : undefined,
                willChange: "transform",
              }}
            >
              <div
                className={cn(
                  "h-full rounded-xl transition-shadow duration-700 [&>*]:h-full",
                  isActive && !dragging ? "shadow-lift" : "shadow-soft",
                )}
                inert={!isActive}
              >
                {child}
              </div>
              {/* Depth veil on off-centre slides */}
              <div
                aria-hidden
                className={cn(
                  "pointer-events-none absolute inset-0 rounded-xl",
                  !dragging && "transition-opacity duration-700",
                  veilClassName,
                )}
                style={{ opacity: veil }}
              />
            </div>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {label}: item {active + 1} of {count}
      </p>

      {/* Controls */}
      <div className="mt-10 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() => go(active - 1)}
          disabled={active === 0}
          className="flex size-11 items-center justify-center rounded-full border border-border-strong bg-surface transition-colors hover:border-text hover:bg-text hover:text-background disabled:pointer-events-none disabled:opacity-35"
          aria-label={`Previous — ${label.toLowerCase()}`}
        >
          <ArrowLeft className="size-5" aria-hidden />
        </button>
        <div className="flex items-center gap-1">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show item ${i + 1} of ${count}`}
              aria-current={i === active || undefined}
              className="group flex h-8 items-center px-1"
            >
              <span
                className={cn(
                  "block h-1.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  i === active ? "w-7 bg-primary" : "w-1.5 bg-border-strong group-hover:bg-muted",
                )}
              />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(active + 1)}
          disabled={active === count - 1}
          className="flex size-11 items-center justify-center rounded-full border border-border-strong bg-surface transition-colors hover:border-text hover:bg-text hover:text-background disabled:pointer-events-none disabled:opacity-35"
          aria-label={`Next — ${label.toLowerCase()}`}
        >
          <ArrowRight className="size-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}
