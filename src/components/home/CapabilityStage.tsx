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
      /* Finished when the stage sits centred in the viewport, over the 0.62vh
         of travel before that.

         Both endpoints have to come from the stage's own height, not from a
         fraction of the viewport. The first attempt at this ran the window
         against the stage's top, which crosses the viewport long before the
         composition is worth looking at: measured at 1440x950, the entries were
         89% through their travel by the time the whole stage was on screen. The
         second measured the stage's centre against a fixed 0.42vh, which mixes
         the two and breaks as the window shortens — the target resolves to
         `0.42vh - height/2`, so at 1434x832 it landed at rect.top 38 and at
         1280x720 at -9, demanding the section be scrolled off the top before it
         would finish.

         Centring is the same idea with the height on both sides, so it holds at
         any window: 164, 105 and 49 at those three sizes, always with the whole
         section still framed and clear of the point where it starts to leave.
         Clamped at 0 for a stage taller than the viewport, which can never be
         centred and finishes as its top reaches the top instead. */
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
