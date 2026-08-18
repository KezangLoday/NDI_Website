"use client";

import { useGlowCards } from "@/hooks/useGlowCards";
import type { UserUseCase } from "@/content/types";
import { Icon } from "@/components/ui/icons";

/** The glass fill behind each bento card, straight from the design. */
const GLASS =
  "linear-gradient(150deg, rgba(255,255,255,0.10), rgba(18,65,67,0.34) 46%, rgba(20,27,41,0.28))";

const GLASS_SHADOW =
  "inset 0 1px 0 rgba(255,255,255,0.14), inset 0 0 0 1px rgba(255,255,255,0.03), " +
  "0 22px 52px rgba(0,0,0,0.38)";

/**
 * "What you can do today" — the bento of frosted-glass cards, each a link, each
 * carrying the proximity-tracked border glow.
 *
 * The cards that lead somewhere also open on hover: the heading and its text
 * rise, and "Watch tutorial" comes up into the space they leave. The two cards
 * with no tutorial behind them stay still, because a card that lifts to show a
 * way in and then has none is a lie about itself.
 *
 * The 12-column grid and its 232px minimum row are the design's; below 1000px
 * the design collapses each card to a half-width span, and below 700px to a
 * plain stack.
 */
export function UseCaseCards({ useCases }: { useCases: UserUseCase[] }) {
  useGlowCards();

  return (
    <div data-uc-grid="1" className="mt-10 grid gap-4">
      {useCases.map((useCase) => (
        <a
          key={useCase.id}
          href={useCase.tutorialHref ?? "#"}
          data-tut={useCase.tutorialHref ? "" : undefined}
          className="ndi-uc relative flex min-h-[232px] flex-col justify-between gap-7 rounded-[20px] border p-[26px]"
          style={{
            gridArea: useCase.gridArea,
            borderColor: "rgba(90,201,148,0.20)",
            background: GLASS,
            backdropFilter: "blur(26px) saturate(150%)",
            WebkitBackdropFilter: "blur(26px) saturate(150%)",
            boxShadow: GLASS_SHADOW,
          }}
        >
          <div className="ndi-glow" />
          {/* The icon keeps its place above the heading; only the block below it
              moves. */}
          <span className="ndi-uc-icon relative inline-flex flex-none items-center text-accent">
            <Icon name={useCase.icon} size={24} />
          </span>
          <div className="ndi-uc-face relative">
            <h3 className="font-display text-[21px] font-semibold leading-[1.2] tracking-[-0.03em] text-strong [text-wrap:balance]">
              {useCase.title}
            </h3>
            <p className="mt-2.5 text-[14.5px] leading-[1.55] text-muted [text-wrap:pretty]">
              {useCase.description}
            </p>
          </div>
          {/* Out of flow, so the face can rise into the space it leaves. Only
              the cards that have a tutorial get one, so only those move. */}
          {useCase.tutorialHref ? (
            <span className="ndi-uc-cta ndi-tut inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-accent">
              Watch tutorial
              <Icon name="arrowRight" size={14} strokeWidth={2} />
            </span>
          ) : null}
        </a>
      ))}
    </div>
  );
}
