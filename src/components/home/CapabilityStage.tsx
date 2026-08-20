"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";

/** The capabilities stage, with its progress scrubbed to the scroll position. */
export function CapabilityStage({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduced) {
      el.style.setProperty("--p", "1");
      return;
    }

    let frame = 0;
    const scrub = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      /* Finished when the stage sits centred in the viewport, over the 0.62vh of travel before that. */
      const to = Math.max(0, (vh - rect.height) / 2);
      const from = to + vh * 0.62;
      const p = Math.min(1, Math.max(0, (from - rect.top) / Math.max(1, from - to)));
      el.style.setProperty("--p", p.toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(scrub);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    scrub();
    // Fonts and images settle after first paint and move the stage with them.
    const settle = setTimeout(scrub, 400);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      clearTimeout(settle);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
