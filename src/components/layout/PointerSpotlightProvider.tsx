"use client";

import { useEffect } from "react";

/**
 * Publishes the pointer position on :root in viewport coordinates: `--gx` /
 * `--gy` in pixels for the `.ndi-spot` capability cards, and `--gxp` / `--gyp`
 * as 0–1 fractions of the viewport for the glow cards' hue shift.
 *
 * One shared listener rather than one per card. Every consumer of these values
 * anchors its gradient to the viewport, so the numbers are identical for all of
 * them — publishing once on :root and letting them inherit is both equivalent
 * and far cheaper than each card tracking the pointer itself.
 *
 * One style write per frame. A raw pointermove handler fires far more often
 * than the display refreshes, and every write repaints each spotlight layer —
 * that backlog is what reads as the glow lagging behind the cursor.
 */
export function PointerSpotlightProvider() {
  useEffect(() => {
    let x = 0;
    let y = 0;
    let queued = false;

    const flush = () => {
      queued = false;
      const root = document.documentElement;
      root.style.setProperty("--gx", String(x));
      root.style.setProperty("--gy", String(y));
      root.style.setProperty("--gxp", (x / window.innerWidth).toFixed(3));
      root.style.setProperty("--gyp", (y / window.innerHeight).toFixed(3));
    };

    const onMove = (event: PointerEvent) => {
      x = Math.round(event.clientX);
      y = Math.round(event.clientY);
      if (!queued) {
        queued = true;
        requestAnimationFrame(flush);
      }
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);

  return null;
}
