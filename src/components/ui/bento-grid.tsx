import type { ReactNode } from "react";

import { Icon } from "@/components/ui/icons";
import type { IconName } from "@/components/ui/icons";

/**
 * Bento grid — cards of unequal span, each revealing a second layer on hover.
 *
 * Adapted from the Magic UI bento grid. Three changes, all forced by this
 * project rather than preference:
 *
 * - No `cn`, no shadcn `Button`, no Radix icons. This codebase has none of
 *   them, and the one thing the button was for — the "Learn more" CTA — is
 *   replaced here by the card's own Value, so the dependency buys nothing.
 * - The card wears the site's glass fill and mint accent instead of the
 *   source's black-and-white shadcn surface.
 * - The reveal is legible without a pointer. Hover-only content is fine for a
 *   "Learn more" link that repeats a href, but Value is real content, and on
 *   touch there is no hover to give it. Below `(hover: hover)` both layers are
 *   simply shown — see `.ndi-bento` in ndi-effects.css.
 */
export function BentoGrid({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`grid w-full grid-cols-1 gap-4 min-[901px]:auto-rows-[19rem] min-[901px]:grid-cols-3 ${className}`.trim()}
    >
      {children}
    </div>
  );
}

export function BentoCard({
  name,
  description,
  value,
  icon,
  className = "",
}: {
  name: string;
  description: string;
  /** Revealed on hover, in place of the source's CTA. */
  value?: string;
  icon: IconName;
  className?: string;
}) {
  return (
    <div
      className={`ndi-bento group relative flex flex-col justify-end overflow-hidden rounded-2xl border border-grid ${className}`.trim()}
      style={{
        background: "var(--grad-card)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        boxShadow: "var(--inset-top), 0 18px 44px rgba(0,0,0,0.28)",
      }}
    >
      <div className="ndi-bento-face relative z-10 flex flex-col gap-2 p-7">
        <span className="ndi-bento-icon inline-flex h-10 w-10 origin-left items-center text-accent">
          <Icon name={icon} size={34} />
        </span>
        <h3 className="mt-1.5 font-display text-[19px] font-semibold tracking-[-0.02em] text-strong">
          {name}
        </h3>
        <p className="max-w-[42ch] text-[14.5px] leading-[1.6] text-body">{description}</p>
      </div>

      {value ? (
        <div className="ndi-bento-value absolute inset-x-0 bottom-0 flex flex-col gap-1.5 px-7 pb-7">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
            Value
          </span>
          <p className="max-w-[42ch] text-[14.5px] leading-[1.6] text-muted">{value}</p>
        </div>
      ) : null}
    </div>
  );
}
