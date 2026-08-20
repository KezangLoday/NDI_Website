"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { Icon } from "@/components/ui/icons";
import type { IconName } from "@/components/ui/icons";
import { useGlowCards } from "@/hooks/useGlowCards";

/** The card's bottom padding, in px — `p-7` on the face and the value block. */
const PAD = 28;
/** Clearance left between the face's last line and the Value label. */
const GAP = 20;

/** Bento grid — cards of unequal span, each revealing a second layer on hover. */
export function BentoGrid({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  /* One subscription for the whole grid. */
  useGlowCards();

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
  const cardRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLDivElement>(null);

  /** The face lifts by however tall the value block actually is. */
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
  }, []);

  return (
    /* The glow lives on a wrapper rather than on the card itself. */
    <div
      ref={cardRef}
      className={`ndi-bento group relative flex flex-col rounded-2xl min-[901px]:min-h-[19.5rem] ${className}`.trim()}
    >
      <div className="ndi-glow" />
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
