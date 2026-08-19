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
      /* Progress tracks the stage's centre, not its top: the top crosses the
         viewport long before the composition is worth looking at, and how far
         ahead depends on how tall the stage is.

         The window it replaced ran from the top entering the foot of the
         viewport to it reaching a fifth of the way up. Measured at 1440x950,
         where the stage is 623px tall, that put the entries at 89% of their
         travel by the time the whole stage was on screen — so the gesture was
         all but over before there was anything to watch, and the last row had
         31px left to move. Anchored on the centre it is at 68% there, with
         120px still to go, over a window half again as long. */
      const centre = rect.top + rect.height / 2;
      const to = vh * 0.42;
      const from = to + vh * 0.8;
      const p = Math.min(1, Math.max(0, (from - centre) / Math.max(1, from - to)));
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
