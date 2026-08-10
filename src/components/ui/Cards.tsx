"use client";

import type { ReactNode } from "react";

import { EvervaultPattern, useEvervaultPointer } from "./evervault-card";

/** Shared card fill from the design — the glass pass in ndi-effects.css sits on top. */
const CARD_BACKGROUND =
  "radial-gradient(120% 80% at 24% -10%, rgba(111,224,169,0.24) 0%, rgba(90,201,148,0.07) 40%, rgba(90,201,148,0) 66%), " +
  "radial-gradient(90% 60% at 50% 118%, rgba(18,65,67,0.55) 0%, rgba(18,65,67,0) 70%), " +
  "linear-gradient(164deg, #0f3340 0%, #0d1420 68%)";

/**
 * "What you can do" card, with the evervault cursor reveal.
 *
 * `.ndi-usecase` carries the glass fill and lens rim; the pattern sits between
 * that and the content, which `.ndi-usecase > *` already lifts to z-index 1.
 */
export function FeatureCard({ children }: { children: ReactNode }) {
  const { ref, onPointerMove } = useEvervaultPointer<HTMLDivElement>();

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      className="ndi-usecase ndi-ev-card h-full rounded-2xl p-[26px]"
      style={{
        background: CARD_BACKGROUND,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), 0 18px 40px -26px rgba(0,0,0,0.9)",
      }}
    >
      <EvervaultPattern />
      {children}
    </div>
  );
}

interface SpotlightCardProps {
  children: ReactNode;
  /** Render as a link when the whole card is clickable. */
  as?: "div" | "a";
  href?: string;
  className?: string;
  /** Cards that are links lift slightly on hover. */
  hoverLift?: boolean;
  /** Row gap between the card's children, in px. Some cards set their own margins. */
  gap?: number;
}

export function SpotlightCard({
  children,
  as = "div",
  href,
  className = "",
  hoverLift = false,
  gap = 14,
}: SpotlightCardProps) {
  const Tag = as;
  return (
    <Tag
      href={href}
      className={`ndi-spot flex flex-col items-start rounded-2xl p-[26px] ${
        hoverLift ? "ndi-lift" : ""
      } ${className}`.trim()}
      style={{
        gap,
        background: CARD_BACKGROUND,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), 0 18px 40px -26px rgba(0,0,0,0.9)",
      }}
    >
      <div className="ndi-spot-halo" />
      <div className="ndi-spot-fill" />
      {children}
    </Tag>
  );
}
