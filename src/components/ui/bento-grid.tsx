"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { Icon } from "@/components/ui/icons";
import type { IconName } from "@/components/ui/icons";
import { GlowLayers, glowVars, useGlowCard } from "@/components/ui/spotlight-card";

/** The card's bottom padding, in px — `p-7` on the face and the value block. */
const PAD = 28;
/** Clearance left between the face's last line and the Value label. */
const GAP = 20;

/**
 * Bento grid — cards of unequal span, each revealing a second layer on hover.
 *
 * Adapted from the Magic UI bento grid, with the site's cursor-tracked rim
 * around each card. Four changes, all forced by this project rather than
 * preference:
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
 * - The rim is this site's own port of the effect (`spotlight-card.tsx`), not
 *   a second copy of it. The upstream component positions its gradient with
 *   `background-attachment: fixed`, and these cards carry a `backdrop-filter`,
 *   which makes each card the containing block for a fixed background — so the
 *   viewport coordinates would resolve against the card and land outside it,
 *   drawing nothing at all. The port uses element-local coordinates, shares one
 *   pointer listener across every glow card on the page instead of registering
 *   one per card, and is already in the site's mint.
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
      className={`grid w-full grid-cols-1 gap-4 min-[901px]:grid-cols-[1.16fr_0.85fr_1.16fr] ${className}`.trim()}
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
  /**
   * One element serves both purposes: it subscribes to the shared pointer
   * listener that drives the rim, and it is where `--bento-lift` is written for
   * the face and value to read.
   */
  const cardRef = useGlowCard<HTMLDivElement>();
  const valueRef = useRef<HTMLDivElement>(null);

  /**
   * The face lifts by however tall the value block actually is.
   *
   * The source hardcodes `-translate-y-10`. A constant only works while every
   * value wraps to the same number of lines — this grid has a narrow middle
   * column where they wrap to three, and any fixed number either collides with
   * the label or leaves a gap. Measuring costs one ResizeObserver and is right
   * at every width.
   */
  useEffect(() => {
    const card = cardRef.current;
    const block = valueRef.current;
    if (!card || !block) return;

    const apply = () => {
      card.style.setProperty("--bento-lift", `${Math.round(block.offsetHeight - PAD + GAP)}px`);
    };
    apply();

    const observer = new ResizeObserver(apply);
    observer.observe(block);
    return () => observer.disconnect();
    // cardRef comes from a hook rather than a bare useRef, so the linter cannot
    // see that it is stable and asks for it here. Listing it changes nothing.
  }, [cardRef]);

  return (
    /* The rim lives on a wrapper rather than on the card itself. The card has
       to keep `overflow: hidden` — that clip is the only thing holding the
       value block out of sight below the card at rest — and the rim and its
       bloom are drawn outside the card box, so on the clipping element they
       would be erased. `proud` matches `border` so the whole 2px ring sits
       outside the card face instead of half under it. */
    <div
      ref={cardRef}
      className={`ndi-bento ndi-glow-card group relative flex flex-col rounded-2xl min-[901px]:min-h-[19.5rem] ${className}`.trim()}
      style={glowVars("mint", { spotlight: 260, border: 2, proud: 2 })}
    >
      <GlowLayers />
      <div
        className="ndi-bento-inner relative flex flex-1 flex-col justify-end overflow-hidden rounded-2xl border border-grid"
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
          <div
            ref={valueRef}
            className="ndi-bento-value absolute inset-x-0 bottom-0 flex flex-col gap-1.5 px-7 pb-7"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
              Value
            </span>
            <p className="max-w-[42ch] text-[14.5px] leading-[1.6] text-muted">{value}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
