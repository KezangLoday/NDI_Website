"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Hue range each colour sweeps as the pointer crosses the viewport:
 * `hue = base + xFraction * spread`.
 *
 * `mint` is this site's addition. The upstream palette is kept as-is, but its
 * spreads are 200-300deg wide — `green` alone travels from green to magenta —
 * which no page in a single-accent palette can absorb. Mint starts on the NDI
 * accent (#5ac994, hue 152) and swings 46deg into teal.
 */
const GLOW_COLORS = {
  mint: { base: 138, spread: 46 },
  blue: { base: 220, spread: 200 },
  purple: { base: 280, spread: 300 },
  green: { base: 120, spread: 200 },
  red: { base: 0, spread: 200 },
  orange: { base: 30, spread: 200 },
} as const;

const SIZES = {
  sm: "w-48 h-64",
  md: "w-64 h-80",
  lg: "w-80 h-96",
} as const;

/**
 * Every glow card on the page, sharing one pointer listener.
 *
 * The source component attaches its own `pointermove` to the document per card,
 * which on a four-card row is the same work done four times. Registering here
 * means one listener and one rAF, writing each card's coordinates in the same
 * flush.
 */
const cards = new Set<HTMLElement>();
let listening = false;
let frame = 0;
let pointerX = 0;
let pointerY = 0;

function paint() {
  frame = 0;
  for (const card of cards) {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--glow-x", String(Math.round(pointerX - rect.left)));
    card.style.setProperty("--glow-y", String(Math.round(pointerY - rect.top)));
  }
}

function onPointerMove(event: PointerEvent) {
  pointerX = event.clientX;
  pointerY = event.clientY;
  if (!frame) frame = requestAnimationFrame(paint);
}

function register(card: HTMLElement) {
  cards.add(card);
  if (!listening) {
    listening = true;
    document.addEventListener("pointermove", onPointerMove, { passive: true });
  }
  return () => {
    cards.delete(card);
    if (cards.size === 0) {
      document.removeEventListener("pointermove", onPointerMove);
      listening = false;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    }
  };
}

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  glowColor?: keyof typeof GLOW_COLORS;
  size?: keyof typeof SIZES;
  width?: string | number;
  height?: string | number;
  /** Skip the preset sizing and let `className` / `width` / `height` decide. */
  customSize?: boolean;
  /** Spotlight diameter in px. */
  spotlight?: number;
  /** Border thickness in px. */
  border?: number;
}

/**
 * Card with a spotlight that tracks the cursor across its border and face.
 *
 * Ported from the Aceternity glow card, with three changes:
 *
 * - Coordinates are element-local, not viewport-space with
 *   `background-attachment: fixed`. These cards carry a `backdrop-filter`,
 *   which makes each one the containing block for a fixed background — so the
 *   source's viewport coordinates resolved against the card itself and put the
 *   spotlight far outside it, drawing nothing at all.
 * - One shared pointer listener for all cards rather than one each.
 * - The static rules live in ndi-effects.css instead of a `<style>` tag in the
 *   component, which would otherwise inject the same 40 lines once per card.
 *
 * The card's own fill and radius are left to the caller, so this can wrap an
 * existing card rather than replacing it.
 */
export function GlowCard({
  children,
  className = "",
  style,
  glowColor = "mint",
  size = "md",
  width,
  height,
  customSize = false,
  spotlight = 200,
  border = 3,
}: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { base, spread } = GLOW_COLORS[glowColor];

  useEffect(() => {
    const card = ref.current;
    if (!card) return;
    return register(card);
  }, []);

  return (
    <div
      ref={ref}
      className={`ndi-glow-card relative ${customSize ? "" : `${SIZES[size]} aspect-[3/4]`} ${className}`.trim()}
      style={
        {
          "--glow-base": base,
          "--glow-spread": spread,
          "--glow-size": spotlight,
          "--glow-border": border,
          ...(width !== undefined && { width: typeof width === "number" ? `${width}px` : width }),
          ...(height !== undefined && {
            height: typeof height === "number" ? `${height}px` : height,
          }),
          ...style,
        } as CSSProperties
      }
    >
      <span aria-hidden="true" className="ndi-glow-rim">
        <span className="ndi-glow-bloom" />
      </span>
      {children}
    </div>
  );
}
