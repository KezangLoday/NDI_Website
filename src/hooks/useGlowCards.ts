"use client";

import { useEffect } from "react";

/** Proximity-tracked conic border glow on the `.ndi-glow` cards. */
export function useGlowCards() {
  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>(".ndi-glow"));
    if (cards.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const state = cards.map((element) => ({ element, angle: 0, target: 0 }));
    const last = { x: -9999, y: -9999 };
    let frame = 0;

    const tick = () => {
      frame = 0;
      let moving = false;
      state.forEach((card) => {
        const delta = card.target - card.angle;
        if (Math.abs(delta) > 0.4) {
          card.angle += delta * 0.12;
          moving = true;
        } else {
          card.angle = card.target;
        }
        card.element.style.setProperty("--start", card.angle.toFixed(2));
      });
      if (moving) frame = requestAnimationFrame(tick);
    };

    const update = (x: number, y: number) => {
      last.x = x;
      last.y = y;
      const proximity = 64;
      state.forEach((card) => {
        const rect = card.element.getBoundingClientRect();
        const near =
          x > rect.left - proximity &&
          x < rect.right + proximity &&
          y > rect.top - proximity &&
          y < rect.bottom + proximity;
        card.element.style.setProperty("--active", near ? "1" : "0");
        if (!near) return;
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const bearing = (180 * Math.atan2(y - cy, x - cx)) / Math.PI + 90;
        // Take the shorter way round rather than unwinding a full turn.
        card.target = card.angle + ((((bearing - card.angle + 180) % 360) + 360) % 360) - 180;
      });
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => update(event.clientX, event.clientY);
    const onScroll = () => update(last.x, last.y);

    document.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
}
