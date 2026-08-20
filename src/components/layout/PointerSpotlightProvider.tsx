"use client";

import { useEffect } from "react";

/** Publishes the pointer position on :root as `--gx` / `--gy`, in viewport pixels, for the `.ndi-spot` cards. */
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
