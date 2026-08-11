"use client";

import type { ReactNode, Ref } from "react";

import { GlowCard, GlowLayers, glowVars, useGlowCard, type GlowColor } from "./spotlight-card";

/** Shared card fill from the design — the glass pass in ndi-effects.css sits on top. */
const CARD_BACKGROUND =
  "radial-gradient(120% 80% at 24% -10%, rgba(111,224,169,0.24) 0%, rgba(90,201,148,0.07) 40%, rgba(90,201,148,0) 66%), " +
  "radial-gradient(90% 60% at 50% 118%, rgba(18,65,67,0.55) 0%, rgba(18,65,67,0) 70%), " +
  "linear-gradient(164deg, #0f3340 0%, #0d1420 68%)";

/**
 * "What you can do" card, wearing the spotlight glow.
 *
 * `customSize` keeps GlowCard's preset dimensions out of the way — the card's
 * own fill, radius and padding stay exactly as `.ndi-usecase` has them, and the
 * glow is added on top.
 */
export function FeatureCard({
  children,
  glowColor = "mint",
}: {
  children: ReactNode;
  glowColor?: GlowColor;
}) {
  return (
    <GlowCard
      customSize
      glowColor={glowColor}
      className="ndi-usecase h-full rounded-2xl p-[26px]"
      style={{
        background: CARD_BACKGROUND,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), 0 18px 40px -26px rgba(0,0,0,0.9)",
      }}
    >
      {children}
    </GlowCard>
  );
}

/**
 * The shared card fill wearing the glow rim, with nothing else assumed.
 *
 * FeatureCard is the Home-specific version — it adds `.ndi-usecase`, which the
 * glass pass keys off inside `#how-it-works`. This one is for the same
 * treatment anywhere else.
 */
export function GlowPanel({
  children,
  className = "",
  glowColor = "mint",
}: {
  children: ReactNode;
  className?: string;
  glowColor?: GlowColor;
}) {
  return (
    <GlowCard
      customSize
      glowColor={glowColor}
      className={`h-full rounded-2xl ${className}`.trim()}
      style={{
        background: CARD_BACKGROUND,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), 0 18px 40px -26px rgba(0,0,0,0.9)",
      }}
    >
      {children}
    </GlowCard>
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
  /**
   * Wear the glow rim instead of the design's own cursor-tracked ring.
   *
   * The two cannot coexist: the rim's z-index rules would drag `.ndi-spot`'s
   * halo and fill above it. Nothing is lost by the swap — the ring never drew,
   * because its mask intersects a transparent padding-box layer with a white
   * border-box one, which is empty by definition.
   */
  glowColor?: GlowColor;
}

export function SpotlightCard({
  children,
  as = "div",
  href,
  className = "",
  hoverLift = false,
  gap = 14,
  glowColor,
}: SpotlightCardProps) {
  const Tag = as;
  const ref = useGlowCard<HTMLElement>();
  const glowing = glowColor !== undefined;

  return (
    <Tag
      // `Tag` is a union, so React types its ref as an intersection of both
      // element refs. Only one of them is ever rendered — one cast at the seam.
      ref={glowing ? (ref as Ref<HTMLDivElement & HTMLAnchorElement>) : undefined}
      href={href}
      data-glow={glowing ? "" : undefined}
      className={`ndi-spot flex flex-col items-start rounded-2xl p-[26px] ${
        glowing ? "ndi-glow-card" : ""
      } ${hoverLift ? "ndi-lift" : ""} ${className}`.trim()}
      style={{
        gap,
        background: CARD_BACKGROUND,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), 0 18px 40px -26px rgba(0,0,0,0.9)",
        ...(glowColor && glowVars(glowColor)),
      }}
    >
      {glowing ? (
        <GlowLayers />
      ) : (
        <>
          <div className="ndi-spot-halo" />
          <div className="ndi-spot-fill" />
        </>
      )}
      {children}
    </Tag>
  );
}
