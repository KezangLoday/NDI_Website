"use client";

import { useEffect } from "react";

/**
 * Publishes the pointer position as `--gx` / `--gy` on :root, in viewport
 * coordinates, for the `.ndi-spot` capability cards to read.
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
