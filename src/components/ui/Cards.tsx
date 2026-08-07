"use client";

import type { ReactNode } from "react";

/** Shared card fill from the design — the glass pass in ndi-effects.css sits on top. */
const CARD_BACKGROUND =
  "radial-gradient(120% 80% at 24% -10%, rgba(111,224,169,0.24) 0%, rgba(90,201,148,0.07) 40%, rgba(90,201,148,0) 66%), " +
  "radial-gradient(90% 60% at 50% 118%, rgba(18,65,67,0.55) 0%, rgba(18,65,67,0) 70%), " +
  "linear-gradient(164deg, #0f3340 0%, #0d1420 68%)";

/**
 * "What you can do" card.
 *
 * The design gave this an evervault-style cursor reveal; that has been removed
 * by request, so the card is static and purely presentational. The `.ndi-usecase`
 * class still carries the glass fill and lens rim from ndi-effects.css.
 */
export function FeatureCard({ children }: { children: ReactNode }) {
  return (
    <div
      className="ndi-usecase h-full rounded-2xl p-[26px]"
      style={{
        background: CARD_BACKGROUND,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), 0 18px 40px -26px rgba(0,0,0,0.9)",
      }}
    >
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
}

export function SpotlightCard({
  children,
  as = "div",
  href,
  className = "",
  hoverLift = false,
}: SpotlightCardProps) {
  const Tag = as;
  return (
    <Tag
      href={href}
      className={`ndi-spot flex flex-col items-start gap-[14px] rounded-2xl p-[26px] ${
        hoverLift ? "ndi-lift" : ""
      } ${className}`.trim()}
      style={{
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
