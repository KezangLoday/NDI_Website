"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * The capabilities stage, with its progress scrubbed to the scroll position.
 *
 * The entries come out of the phone as the section rises through the viewport
 * and go back into it on the way up, so this cannot be the one-shot
 * `Reveal` — that fires once and never returns. It publishes a single number,
 * `--p`, and every piece of the choreography is a function of it in CSS: each
 * row takes its own slice of the range, so they leave the device one after
 * another rather than together.
 *
 * `--p` defaults to 1 in the stylesheet, so with no JavaScript the section is
 * simply finished and in place rather than stacked invisibly on the phone.
 */
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
      /* 0 while the stage's top is still at the foot of the viewport, 1 once it
         has risen to a fifth of the way up — by which point the whole stage is
         in view on any viewport tall enough to hold it. */
      const from = vh;
      const to = vh * 0.2;
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
