"use client";

import { useEffect } from "react";

import { useReducedMotion } from "./useReducedMotion";

/** Where the window's fade ends at the top, as a fraction of its height. */
const BAND = 0.22;

/** Fades the partner tiles at the ends of their window, per tile. */
export function useOrgTileFade() {
  const reduced = useReducedMotion();

  useEffect(() => {
    const win = document.querySelector<HTMLElement>("[data-org-cols]");
    if (!win) return;
    const tiles = Array.from(win.querySelectorAll<HTMLElement>("[data-org-tile]"));
    if (tiles.length === 0) return;

    let frame = 0;
    let running = false;

    const paint = () => {
      frame = 0;
      const w = win.getBoundingClientRect();
      const height = Math.max(1, w.height);
      // Read every rect before writing a single style, so the loop never interleaves layout reads with style writes.
      const rects = tiles.map((tile) => tile.getBoundingClientRect());
      rects.forEach((rect, index) => {
        const top = rect.top - w.top;
        const own = Math.max(1, rect.height);
        const at = (y: number) => (((y - top) / own) * 100).toFixed(1);
        const gradient =
          `linear-gradient(to bottom, transparent ${at(0)}%, #000 ${at(BAND * height)}%, ` +
          `#000 ${at((1 - BAND) * height)}%, transparent ${at(height)}%)`;
        const style = tiles[index].style;
        style.maskImage = gradient;
        style.webkitMaskImage = gradient;
      });
      if (running) frame = requestAnimationFrame(paint);
    };

    // The tiles only move while the window is on screen, and a rewrite per frame is only worth paying for then.
    const observer = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting && !reduced;
        if (running && !frame) frame = requestAnimationFrame(paint);
        else paint();
      },
      { rootMargin: "120px" },
    );
    observer.observe(win);

    const onResize = () => {
      if (!running && !frame) frame = requestAnimationFrame(paint);
    };
    window.addEventListener("resize", onResize);
    paint();

    return () => {
      running = false;
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);
}
