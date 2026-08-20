"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { JourneyChapter, Media } from "@/content/types";
import { mediaUrl } from "@/lib/media";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

interface DechenJourneyProps {
  chapters: JourneyChapter[];
  strip: Media;
}

/**
 * The pinned "Dechen's journey" section.
 *
 * A tall outer section supplies the scroll distance; an inner sticky pane
 * holds a two-column layout — the illustrated strip playing inside a laptop
 * screen on the left, and a stepper with the chapter captions on the right.
 *
 * Scroll drives the strip horizontally *within the screen*, so the travel is
 * measured against the screen's width rather than the viewport's. Position
 * interpolates between the eight per-chapter anchors, which is what makes it
 * hold on a scene and then glide to the next one.
 *
 * The strip offset and the rail fill change every frame, so they are written
 * straight to the DOM; only the active chapter goes through state, and that
 * changes at most eight times.
 */
export function DechenJourney({ chapters, strip }: DechenJourneyProps) {
  const outerRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLImageElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  const total = chapters.length;

  const scrollToChapter = useCallback(
    (index: number) => {
      const outer = outerRef.current;
      if (!outer) return;
      const span = outer.offsetHeight - window.innerHeight;
      window.scrollTo({
        top: outer.offsetTop + span * ((index + 0.5) / total),
        behavior: "smooth",
      });
    },
    [total],
  );

  useEffect(() => {
    /* The pinned version only exists above 900px. Below that the section is a
       swipeable strip with the chapters listed under it, so none of the
       measuring or the scroll listener below has anything to drive. */
    if (!window.matchMedia("(min-width: 901px)").matches) return;

    const outer = outerRef.current;
    const stripEl = stripRef.current;
    if (!outer || !stripEl) return;

    const anchors = chapters.map((chapter) => chapter.anchor);
    let screenWidth = 0;
    let stripWidth = 0;
    let travel = 0;
    let target = 0;
    let current = 0;
    let frame = 0;
    let currentIndex = -1;

    const measure = () => {
      screenWidth = stripEl.parentElement?.clientWidth ?? 0;
      stripWidth = stripEl.offsetWidth;
      travel = Math.max(0, stripWidth - screenWidth);
    };

    // Hold on a chapter's scene, then glide to the next.
    const offsetAt = (progress: number) => {
      const shifted = progress * total - 0.5;
      let anchor: number;
      if (shifted <= 0) {
        anchor = anchors[0];
      } else if (shifted >= total - 1) {
        anchor = anchors[total - 1];
      } else {
        const index = Math.floor(shifted);
        const fraction = shifted - index;
        const smooth = fraction * fraction * (3 - 2 * fraction);
        anchor = anchors[index] + (anchors[index + 1] - anchors[index]) * smooth;
      }
      return Math.min(travel, Math.max(0, anchor * stripWidth - screenWidth / 2));
    };

    const paint = () => {
      stripEl.style.transform = `translate3d(${(-offsetAt(current)).toFixed(2)}px,0,0)`;
      if (fillRef.current) fillRef.current.style.height = `${(current * 100).toFixed(2)}%`;

      const index = Math.min(total - 1, Math.max(0, Math.floor(current * total)));
      if (index !== currentIndex) {
        currentIndex = index;
        setActive(index);
      }
    };

    const tick = () => {
      frame = 0;
      const next = reduced ? target : current + (target - current) * 0.14;
      const settled = Math.abs(next - current) < 0.0004;
      current = settled ? target : next;
      paint();
      // Idle once settled rather than holding a permanent rAF loop.
      if (!settled) frame = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      const rect = outer.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      target = span > 0 ? clamp01(-rect.top / span) : 0;
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onResize = () => {
      measure();
      onScroll();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    if (stripEl.complete) measure();
    else stripEl.addEventListener("load", onResize);

    onScroll();
    current = target;
    measure();
    paint();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      stripEl.removeEventListener("load", onResize);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [chapters, reduced, total]);

  return (
    <section
      ref={outerRef}
      id="in-action"
      /* The 560vh of scroll distance is what drives the pinned strip, and it
         only applies where the strip is pinned. On a phone the section is its
         own height and the picture is swiped by hand. */
      className="relative h-auto scroll-mt-[110px] min-[901px]:h-[560vh]"
      aria-label="Bhutan NDI in action — Dechen's journey"
    >
      {/* ---- Phones and small tablets: swipe the strip ---- */}
      <div className="px-5 py-16 min-[641px]:px-8 min-[901px]:hidden">
        <div className="flex items-center gap-[9px] font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
          <span aria-hidden="true" className="block h-px w-4 bg-current" />
          Dechen&apos;s journey
        </div>
        <h2 className="mt-3 font-display text-[clamp(26px,7vw,34px)] font-bold leading-[1.06] tracking-[-0.03em] text-strong">
          Bhutan NDI in action
        </h2>
        <p className="mt-3.5 max-w-[46ch] text-[15px] leading-[1.62] text-muted [text-wrap:pretty]">
          Swipe the strip to follow Dechen from paperwork to a wallet, or read the stages below.
        </p>

        {/* A real scroll container: the picture is 17:1, so it is panned by
            hand rather than by hijacking the page's own scroll. */}
        <div
          className="ndi-journey-swipe mt-6 overflow-x-auto rounded-[14px] border p-2"
          style={{
            borderColor: "rgba(90,201,148,0.22)",
            background: "linear-gradient(168deg, #1a2333 0%, #0d1320 60%, #0a0f1a 100%)",
          }}
        >
          {/* `w-max`, and no clipping here: the strip is 17:1, so the element has
              to be as wide as the picture for the scroll container above to have
              anything to scroll. */}
          <div className="w-max rounded-lg" style={{ background: "#f4f8f6" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mediaUrl(strip)}
              alt={strip.alt}
              className="block h-[168px] w-auto max-w-none"
              draggable={false}
            />
          </div>
        </div>

        <ol className="mt-7 flex flex-col">
          {chapters.map((chapter) => (
            <li
              key={chapter.id}
              className="grid grid-cols-[30px_1fr] items-start gap-3 border-t border-subtle py-4"
            >
              <span className="mt-0.5 font-mono text-[10.5px] tracking-[0.14em] text-accent">
                {chapter.step}
              </span>
              <span>
                <span className="block font-display text-[16px] font-semibold tracking-[-0.01em] text-strong">
                  {chapter.title}
                </span>
                <span className="mt-1 block text-[14px] leading-[1.6] text-muted [text-wrap:pretty]">
                  {chapter.caption}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* ---- Pinned scrollytelling, 901px and up ---- */}
      <div className="sticky top-0 hidden h-screen items-center overflow-hidden min-[901px]:flex">
        <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 items-center gap-[clamp(28px,3.2vw,48px)] px-5 min-[641px]:px-8 min-[901px]:grid-cols-[minmax(0,1.24fr)_minmax(0,0.76fr)]">
          {/* The journey plays inside a screen; scroll drives the picture. */}
          <div className="relative flex flex-col items-center">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-[6%] h-[84%] w-[88%] -translate-x-1/2"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(90,201,148,0.20) 0%, rgba(90,201,148,0.05) 45%, transparent 72%)",
                filter: "blur(26px)",
              }}
            />

            <div
              className="relative box-border w-full rounded-[18px] border p-[13px] pb-[30px]"
              style={{
                borderColor: "rgba(90,201,148,0.22)",
                background: "linear-gradient(168deg, #1a2333 0%, #0d1320 60%, #0a0f1a 100%)",
                boxShadow:
                  "var(--inset-top), 0 34px 70px -30px rgba(0,0,0,0.85), 0 0 0 1px rgba(0,0,0,0.4)",
              }}
            >
              <div
                className="relative aspect-video w-full overflow-hidden rounded-lg"
                style={{
                  background: "#f4f8f6",
                  boxShadow:
                    "inset 0 0 0 1px rgba(0,0,0,0.5), inset 0 2px 22px rgba(0,0,0,0.35)",
                }}
              >
                {/* Served directly, not through next/image: the optimiser caps
                    at 3840px, which is half the width this renders at, and the
                    asset is already a 75KB webp. The element is hand-positioned
                    besides. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={stripRef}
                  src={mediaUrl(strip)}
                  alt={strip.alt}
                  className="absolute left-0 block h-[114%] w-auto max-w-none will-change-transform"
                  style={{ top: "-7%", transform: "translate3d(0,0,0)" }}
                  draggable={false}
                />
                {/* Scanlines, vignette and a glass sheen sell the screen. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(180deg, rgba(12,17,27,0.055) 0px, rgba(12,17,27,0.055) 1px, transparent 1px, transparent 3px)",
                  }}
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse 78% 70% at 50% 45%, transparent 40%, rgba(12,17,27,0.30) 100%)",
                  }}
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(122deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.06) 22%, transparent 46%)",
                  }}
                />
              </div>

              <div className="absolute bottom-2.5 left-5 right-5 flex items-center justify-between font-mono text-[9.5px] uppercase tracking-[0.18em] text-faint">
                <span>Dechen&apos;s journey</span>
                <span className="flex items-center gap-[7px] text-accent">
                  <span
                    aria-hidden="true"
                    className="h-[5px] w-[5px] rounded-full bg-accent"
                    style={{ boxShadow: "0 0 8px rgba(90,201,148,0.9)" }}
                  />
                  Live
                </span>
              </div>
            </div>

            {/* Laptop neck and base */}
            <div
              aria-hidden="true"
              className="h-[11px] w-[110px] rounded-b"
              style={{
                background: "linear-gradient(180deg, #16202f, #0b1119)",
                border: "1px solid rgba(90,201,148,0.14)",
                borderTop: "none",
              }}
            />
            <div
              aria-hidden="true"
              className="h-[6px] w-[200px] rounded-[3px]"
              style={{
                background: "linear-gradient(180deg, #16202f, #0a0f1a)",
                border: "1px solid rgba(90,201,148,0.12)",
                boxShadow: "0 14px 30px -18px rgba(0,0,0,0.9)",
              }}
            />
          </div>

          {/* Step by step */}
          <div>
            <div className="flex items-center gap-[9px] font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
              <span aria-hidden="true" className="block h-px w-4 bg-current" />
              Dechen&apos;s journey
            </div>
            <h2 className="mt-3 font-display text-[clamp(26px,2.8vw,38px)] font-bold leading-[1.06] tracking-[-0.03em] text-strong">
              Bhutan NDI in action
            </h2>

            <div className="relative mt-[22px] pl-[22px]">
              <div
                aria-hidden="true"
                className="absolute bottom-1.5 left-0 top-1.5 w-px"
                style={{ background: "var(--border-grid)" }}
              />
              <div
                ref={fillRef}
                aria-hidden="true"
                className="absolute left-0 top-1.5 w-px"
                style={{
                  height: "0%",
                  background: "var(--accent)",
                  boxShadow: "0 0 10px rgba(90,201,148,0.55)",
                }}
              />
              {chapters.map((chapter, index) => {
                const isActive = index === active;
                return (
                  <button
                    key={chapter.id}
                    type="button"
                    onClick={() => scrollToChapter(index)}
                    aria-current={isActive ? "step" : undefined}
                    className="grid w-full cursor-pointer grid-cols-[34px_1fr] items-center gap-2.5 border-none bg-transparent py-[7px] text-left transition-opacity duration-[400ms] ease-ndi"
                    style={{ opacity: isActive ? 1 : index < active ? 0.6 : 0.4 }}
                  >
                    <span
                      className="font-mono text-[10.5px] tracking-[0.14em] transition-colors duration-[400ms] ease-ndi"
                      style={{ color: isActive ? "var(--accent)" : "var(--text-faint)" }}
                    >
                      {chapter.step}
                    </span>
                    <span
                      className="font-display text-[15.5px] font-medium tracking-[-0.01em] transition-colors duration-[400ms] ease-ndi"
                      style={{ color: isActive ? "var(--text-strong)" : "var(--text-muted)" }}
                    >
                      {chapter.title}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="relative mt-[18px] h-[78px] max-w-[420px]">
              {chapters.map((chapter, index) => (
                <div
                  key={chapter.id}
                  aria-hidden={index !== active}
                  className="absolute left-0 right-0 top-0 transition-[opacity,transform] duration-[420ms] ease-ndi"
                  style={{
                    opacity: index === active ? 1 : 0,
                    transform: index === active ? "translateY(0)" : "translateY(14px)",
                  }}
                >
                  <p className="text-[15px] leading-[1.62] text-muted [text-wrap:pretty]">
                    {chapter.caption}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
