import type { ReactNode } from "react";

import { externalLinkProps } from "@/lib/links";

/** The design's primary CTA gradient. */
const GRADIENT =
  "linear-gradient(115deg, #8CF0C0 0%, #6FE0A9 24%, #4FC091 56%, #2FA189 80%, #1E8189 100%)";

/**
 * Filled mint CTA.
 *
 * Wears the store buttons' hover — lift, a light sweeping across, and a soft
 * brightening — rather than the design's cursor-tracked glow and click ripple.
 * `.ndi-sweepbtn` drives the same sweep and glow spans the store buttons use.
 */
export function GradientButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      // Opens in a new tab when the href leaves the site — a no-op otherwise,
      // so in-page anchors like #inquiry are unaffected.
      {...externalLinkProps(href)}
      className={`ndi-sweepbtn relative inline-flex h-12 items-center gap-2.5 overflow-hidden rounded-xl border border-transparent px-6 font-display text-[14.5px] font-semibold ${className}`.trim()}
      style={{ background: GRADIENT, color: "#08130f", boxShadow: "var(--glow-sm)" }}
    >
      <span className="ndi-store-sweep" />
      <span className="ndi-store-glow" />
      <span className="relative z-[1] inline-flex items-center gap-2.5">{children}</span>
    </a>
  );
}
