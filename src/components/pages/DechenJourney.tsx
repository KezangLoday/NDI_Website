"use client";

import { useEffect, useRef, useState } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { JourneyChapter, Media } from "@/content/types";
import { mediaUrl } from "@/lib/media";

/** How fast the strip catches up to the scroll position each frame. */
const EASE = 0.14;
/** Below this delta the strip is treated as settled and the loop idles. */
const SETTLE = 0.0004;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/** Smooth interpolation between two anchors, so chapters glide rather than snap. */
function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

/**
 * Maps overall progress (0-1) to a position along the strip by interpolating
 * between the per-chapter anchors, rather than moving linearly. That is what
 * makes the strip linger on each scene and travel quickly between them.
 */
function anchorPosition(progress: number, anchors: number[]) {
  const n = anchors.length;
  const scaled = clamp01(progress) * (n - 1);
  const index = Math.min(n - 2, Math.floor(scaled));
  const t = smoothstep(clamp01(scaled - index));
  return anchors[index] + (anchors[index + 1] - anchors[index]) * t;
}

interface DechenJourneyProps {
  chapters: JourneyChapter[];
  strip: Media;
}

/**
 * The pinned horizontal scrollytelling section.
 *
 * A tall outer section provides the scroll distance; an inner sticky pane holds
 * the viewport. Vertical scroll through the outer section drives the strip
 * horizontally, easing toward the target each frame so the motion feels
 * weighted instead of locked to the scrollbar.
 */
export function DechenJourney({ chapters, strip }: DechenJourneyProps) {
  const outerRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [chapter, setChapter] = useState(0);
  const [progress, setProgress] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const outer = outerRef.current;
    const stripEl = stripRef.current;
    if (!outer || !stripEl) return;

    const anchors = chapters.map((c) => c.anchor);
    let current = anchors[0];
    let frame = 0;
    let running = true;

    const render = () => {
      const rect = outer.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const target = span > 0 ? clamp01(-rect.top / span) : 0;

      // Ease toward the target; idle once the difference stops mattering.
      const eased = reduced ? target : current + (target - current) * EASE;
      const settled = Math.abs(target - current) < SETTLE;
      current = reduced || settled ? target : eased;

      const stripWidth = stripEl.offsetWidth;
      const travel = Math.max(0, stripWidth - window.innerWidth);
      const position = anchorPosition(current, anchors);
      const x = Math.min(travel, Math.max(0, position * stripWidth - window.innerWidth / 2));
      stripEl.style.transform = `translate3d(${-x}px, 0, 0)`;

      const index = Math.min(chapters.length - 1, Math.floor(current * chapters.length));
      setChapter(index);
      setProgress(current);

      if (running) frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);
    return () => {
      running = false;
      cancelAnimationFrame(frame);
    };
  }, [chapters, reduced]);

  /** Jump to the middle of a chapter's scroll band. */
  const goToChapter = (index: number) => {
    const outer = outerRef.current;
    if (!outer) return;
    const span = outer.offsetHeight - window.innerHeight;
    const top = outer.offsetTop + span * ((index + 0.5) / chapters.length);
    window.scrollTo({ top, behavior: "smooth" });
  };

  const active = chapters[chapter];

  return (
    <section
      ref={outerRef}
      id="in-action"
      className="relative"
      style={{ height: "560vh" }}
      aria-label="Bhutan NDI in action — Dechen's journey"
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        {/* Heading */}
        <div className="mx-auto w-full max-w-[1200px] flex-none px-5 pt-28 min-[641px]:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
              — Dechen&apos;s journey
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-grid bg-white/[0.02] px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent"
                style={{ boxShadow: "var(--glow-sm)" }}
              />
              Live
            </span>
          </div>
          <h2 className="mt-3 font-display text-[clamp(28px,3.4vw,40px)] font-semibold leading-[1.1] tracking-[-0.03em] text-strong">
            Bhutan NDI in action
          </h2>
        </div>

        {/* The strip */}
        <div className="relative min-h-0 flex-1 overflow-hidden">
          <div
            ref={stripRef}
            className="absolute left-0 top-1/2 h-[min(56vh,460px)] -translate-y-1/2 will-change-transform"
            style={{ width: `calc(min(56vh, 460px) * ${strip.width} / ${strip.height})` }}
          >
            {/* Served directly, not through next/image: at 14020px wide the
                optimiser would try to generate enormous variants for an asset
                that is already a 76KB webp. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mediaUrl(strip)}
              alt={strip.alt}
              className="block h-full w-full object-cover"
              draggable={false}
            />
          </div>
        </div>

        {/* Caption + progress + chapter dots */}
        <div className="mx-auto w-full max-w-[1200px] flex-none px-5 pb-12 min-[641px]:px-8">
          <div className="min-h-[76px]">
            {chapters.map((entry, index) => (
              <div
                key={entry.id}
                aria-hidden={index !== chapter}
                className="transition-[opacity,transform] duration-[420ms] ease-ndi"
                style={{
                  display: index === chapter ? "block" : "none",
                  opacity: index === chapter ? 1 : 0,
                  transform: index === chapter ? "translateY(0)" : "translateY(14px)",
                }}
              >
                <div className="font-display text-[19px] font-semibold text-strong">
                  {entry.title}
                </div>
                <p className="mt-1.5 max-w-[720px] text-[15px] leading-[1.6] text-muted [text-wrap:pretty]">
                  {entry.caption}
                </p>
              </div>
            ))}
          </div>

          <div
            className="mt-5 h-px w-full overflow-hidden"
            style={{ background: "var(--border-grid)" }}
          >
            <div
              className="h-full"
              style={{ width: `${progress * 100}%`, background: "var(--accent)" }}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {chapters.map((entry, index) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => goToChapter(index)}
                aria-current={index === chapter ? "step" : undefined}
                aria-label={`${entry.step} — ${entry.title}`}
                className="cursor-pointer rounded-lg border px-2.5 py-1.5 font-mono text-[10px] tracking-[0.14em] transition-colors duration-[220ms]"
                style={{
                  borderColor:
                    index === chapter ? "rgba(90,201,148,0.45)" : "var(--border-subtle)",
                  background: index === chapter ? "rgba(90,201,148,0.10)" : "transparent",
                  color: index === chapter ? "var(--accent)" : "var(--text-faint)",
                }}
              >
                {entry.step}
              </button>
            ))}
          </div>
        </div>
      </div>

      <span className="sr-only">{active.caption}</span>
    </section>
  );
}
