import type { ComponentPropsWithoutRef, ReactNode } from "react";

/**
 * Liquid glass: a blurred backdrop warped by a displacement filter, with a
 * bevelled edge drawn by symmetrical inset highlights.
 *
 * Adapted from the liquid-weather-glass card. Four changes, each forced by
 * where this is used rather than by preference:
 *
 * - No `motion`. The source's only use of it is drag, expand-on-click and a
 *   hover scale. These cards sit in an auto-scrolling marquee and are not
 *   interactive, so all three are meaningless here and the dependency buys
 *   nothing. Nothing was installed.
 * - The SVG filter is rendered once by `LiquidGlassDefs`, not once per card.
 *   The source inlines it in every instance, which on this page would mean
 *   eighteen elements sharing one id.
 * - No fill. The source's demo adds `bg-white/8`; these carry no background at
 *   all, so the only thing between the reader and the page is the blur.
 * - Layers are one element with pseudo-elements rather than three stacked
 *   divs, so a card is one box in the layout instead of four.
 *
 * The bevel is what makes this read on a dark, low-contrast backdrop: the
 * displacement only shows where there is something behind to warp, but the
 * inset highlights draw an edge regardless.
 */
export function LiquidGlassDefs() {
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute h-0 w-0">
      <defs>
        <filter id="ndi-glass-warp" x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.003 0.007"
            numOctaves={1}
            result="turbulence"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="turbulence"
            scale={140}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}

const BEVEL = {
  xs: "inset 1px 1px 1px 0 rgba(255,255,255,0.3), inset -1px -1px 1px 0 rgba(255,255,255,0.3)",
  sm: "inset 2px 2px 2px 0 rgba(255,255,255,0.35), inset -2px -2px 2px 0 rgba(255,255,255,0.35)",
  md: "inset 3px 3px 3px 0 rgba(255,255,255,0.45), inset -3px -3px 3px 0 rgba(255,255,255,0.45)",
  lg: "inset 4px 4px 4px 0 rgba(255,255,255,0.5), inset -4px -4px 4px 0 rgba(255,255,255,0.5)",
} as const;

const GLOW = {
  none: "0 4px 4px rgba(0,0,0,0.05), 0 0 12px rgba(0,0,0,0.05)",
  xs: "0 4px 4px rgba(0,0,0,0.15), 0 0 12px rgba(0,0,0,0.08), 0 0 16px rgba(255,255,255,0.05)",
  sm: "0 4px 4px rgba(0,0,0,0.15), 0 0 12px rgba(0,0,0,0.08), 0 0 24px rgba(255,255,255,0.1)",
  md: "0 4px 4px rgba(0,0,0,0.15), 0 0 12px rgba(0,0,0,0.08), 0 0 32px rgba(255,255,255,0.15)",
} as const;

interface LiquidGlassCardProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  radius?: number;
  bevel?: keyof typeof BEVEL;
  glow?: keyof typeof GLOW;
}

export function LiquidGlassCard({
  children,
  className = "",
  radius = 14,
  bevel = "sm",
  glow = "xs",
  style,
  ...rest
}: LiquidGlassCardProps) {
  return (
    <div
      className={`ndi-lgc relative ${className}`.trim()}
      style={{ borderRadius: radius, boxShadow: `${GLOW[glow]}, ${BEVEL[bevel]}`, ...style }}
      // Callers pass data-* and aria-hidden through — the marquee duplicates
      // every tile and hides the copies from assistive technology.
      {...rest}
    >
      <span aria-hidden="true" className="ndi-lgc-bend" />
      <span className="relative z-10 flex w-full flex-col items-center gap-3">{children}</span>
    </div>
  );
}
