"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function generateRandomString(length: number) {
  let result = "";
  for (let i = 0; i < length; i += 1) {
    result += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
  }
  return result;
}

/**
 * Cursor-tracked reveal: a 250px radial window follows the pointer, uncovering a
 * gradient wash and a field of scrambling characters underneath.
 *
 * Ported from the Aceternity "evervault card". Two departures from that source,
 * both deliberate:
 *
 * - The pointer position drives CSS custom properties rather than Framer Motion
 *   values. The library exists to interpolate between states; here the value is
 *   the cursor itself, already continuous, so it would carry a ~50KB dependency
 *   to write two numbers per frame. The mask is identical either way.
 * - The wash is NDI mint rather than the source's green-to-blue, which would be
 *   the only blue on the site.
 *
 * The character field is generated on the client only — it is random, so
 * rendering it on the server would guarantee a hydration mismatch.
 */
export function EvervaultPattern({ length = 1500 }: { length?: number }) {
  const noiseRef = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const element = noiseRef.current;
    if (!element) return;

    element.textContent = generateRandomString(length);
    if (reduced) return;

    // Re-scramble on a slow beat rather than on every pointer event — the source
    // regenerates 1500 characters per mousemove, which is a lot of work for an
    // effect the eye reads as noise either way — and only while the card is
    // actually hovered, since the field is invisible otherwise and four cards
    // churning the DOM on every page view is not free.
    //
    // Written straight to the DOM: it is decoration, and re-rendering the card
    // several times a second to change it would buy nothing.
    const card = element.closest<HTMLElement>(".ndi-ev-card");
    if (!card) return;

    let timer: ReturnType<typeof setInterval> | undefined;
    const start = () => {
      if (timer) return;
      timer = setInterval(() => {
        element.textContent = generateRandomString(length);
      }, 220);
    };
    const stop = () => {
      clearInterval(timer);
      timer = undefined;
    };

    card.addEventListener("pointerenter", start);
    card.addEventListener("pointerleave", stop);
    return () => {
      card.removeEventListener("pointerenter", start);
      card.removeEventListener("pointerleave", stop);
      stop();
    };
  }, [length, reduced]);

  return (
    // .ndi-ev-pattern rather than Tailwind's `absolute`: `.ndi-usecase > *`
    // makes every direct child `position: relative` and outranks a single
    // utility class, which collapses this box to zero height and leaves the
    // inset layers with nothing to size against.
    <div aria-hidden="true" className="ndi-ev-pattern pointer-events-none">
      <div className="ndi-ev-layer ndi-ev-wash" />
      {/* The paragraph is styled in ndi-effects.css alongside the mask, so the
          design's type size and 0.5 alpha stay with the rest of the recipe. */}
      <div className="ndi-ev-layer ndi-ev-noise">
        <p ref={noiseRef} />
      </div>
    </div>
  );
}

/**
 * Tracks the pointer on a card and writes its local coordinates as `--ev-x` and
 * `--ev-y`, which the mask in `.ndi-ev-layer` reads.
 *
 * Writes are batched to one per frame; the properties are set straight on the
 * node because they change continuously and nothing else needs to re-render.
 */
export function useEvervaultPointer<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const frame = useRef(0);
  const next = useRef({ x: 0, y: 0 });

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const onPointerMove = useCallback((event: React.PointerEvent<T>) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    next.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      element.style.setProperty("--ev-x", `${next.current.x}px`);
      element.style.setProperty("--ev-y", `${next.current.y}px`);
    });
  }, []);

  return { ref, onPointerMove };
}

/**
 * The card shell, for standalone use. Matches the source's API — pass `text` for
 * the centred label, or `children` to lay your own content over the effect.
 */
export function EvervaultCard({
  text,
  className = "",
  children,
}: {
  text?: string;
  className?: string;
  children?: ReactNode;
}) {
  const { ref, onPointerMove } = useEvervaultPointer<HTMLDivElement>();

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      className={`ndi-ev-card relative flex h-full w-full items-center justify-center overflow-hidden rounded-3xl ${className}`.trim()}
    >
      <EvervaultPattern />
      {text ? (
        <div className="relative z-10 flex h-44 w-44 items-center justify-center rounded-full">
          <div className="absolute h-full w-full rounded-full bg-black/80 blur-sm" />
          <span className="z-20 font-display text-4xl font-bold text-strong">{text}</span>
        </div>
      ) : null}
      {children}
    </div>
  );
}
