"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { PipelineStep } from "@/content/types";

const STEP_MS = 5200;

/** Column gap on the rail, in px. The connector geometry is derived from it. */
const GUTTER = 16;

/** Width of one card, as a calc term: the row minus its three gutters, quartered. */
const CARD = `((100% - ${GUTTER * 3}px) / 4)`;

/**
 * Where the trace sits, measured from the top of the rail.
 *
 * Inside a card the trace is flex-centred against the 14px dot, which lands it
 * on a half pixel: 16px of padding + (14 - 1) / 2. The connectors are
 * absolutely positioned and have to match that exactly — a whole 24px looks
 * level in isolation but steps by a pixel at every card edge.
 */
const TRACE_TOP = 16 + (14 - 1) / 2;

/**
 * The four-step integration path.
 *
 * Auto-advances every 5.2s, and pauses on hover, while the tab is hidden, and
 * whenever the rail is scrolled out of view — there is no point animating a
 * component nobody is looking at, and it keeps the timer honest when the user
 * returns.
 */
export function IntegrationPipeline({ steps }: { steps: PipelineStep[] }) {
  const [step, setStep] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const element = railRef.current;
    if (!element || !("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => setInView(entry.isIntersecting)),
      { threshold: 0.25 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || hovered || !inView) return;

    const timer = setInterval(() => {
      if (document.hidden) return;
      setStep((current) => (current + 1) % steps.length);
    }, STEP_MS);

    return () => clearInterval(timer);
  }, [reduced, hovered, inView, steps.length]);

  const select = (index: number) => setStep(index);

  const active = steps[step];

  /** Left edge to the right edge of the active card: the run already lit. */
  const TRACK = `calc(${CARD} * ${step + 1} + ${GUTTER * step}px)`;

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {/* Rail — a dot per step on a trace that lights up as far as you have got. */}
      <div ref={railRef} data-pipe-rail="1" className="relative">
        {/*
          The completed run, as one clipping window laid over the cards and the
          gutters between them. The pulse travels inside it, so the light crosses
          card boundaries unbroken instead of restarting in each card — that
          continuity is what reads as one process rather than four tiles. The
          window grows to the right edge of the active card: (step + 1) cards
          plus the `step` gutters already crossed.

          Geometry is inline rather than utilities throughout this block because
          `.ndi-pipe-trace` is unlayered and would outrank a Tailwind `absolute`.
        */}
        <span
          aria-hidden="true"
          data-pipe-line="1"
          style={{
            position: "absolute",
            top: TRACE_TOP,
            left: 0,
            height: 1,
            overflow: "hidden",
            zIndex: 2,
            pointerEvents: "none",
            width: TRACK,
            // The pulse translates rather than animating `left`, so it needs
            // the track's width as a length — see ndiTraceFlow.
            "--pulse-end": TRACK,
            transition: "width 0.45s var(--ease-out)",
          } as CSSProperties}
        >
          <span className="ndi-pipe-pulse" />
        </span>

        {/* The gutters between columns — each step's own trace stops at its
            column edge, so without these the line breaks three times. */}
        {[1, 2, 3].map((index) => (
          <span
            key={index}
            aria-hidden="true"
            data-pipe-line="1"
            className="ndi-pipe-trace"
            data-on={index <= step ? "2" : "0"}
            style={{
              position: "absolute",
              top: TRACE_TOP,
              height: 1,
              width: GUTTER,
              flex: "none",
              left: `calc(${CARD} * ${index} + ${GUTTER * (index - 1)}px)`,
            }}
          />
        ))}

        <div className="relative grid grid-cols-1 gap-4 min-[641px]:grid-cols-2 min-[1001px]:grid-cols-4">
          {steps.map((entry, index) => {
            const isActive = index === step;
            const isDone = index < step;
            const state = isActive ? "1" : isDone ? "2" : "0";
            return (
              <button
                key={entry.code}
                type="button"
                onClick={() => select(index)}
                onFocus={() => select(index)}
                onMouseEnter={() => select(index)}
                aria-current={isActive ? "step" : undefined}
                // No box: the dot on the trace already marks the step, and a
                // border around each one turned a timeline into four tiles.
                className="flex cursor-pointer flex-col gap-2.5 pb-5 pt-4 text-left"
              >
                {/* The trace runs the full column width. */}
                <span aria-hidden="true" className="flex items-center self-stretch">
                  <span
                    data-pipe-dot="1"
                    className="h-[14px] w-[14px] flex-none rounded-full border transition-[background,border-color] duration-300 ease-ndi"
                    style={{
                      borderColor: isActive || isDone ? "var(--accent)" : "var(--border-grid)",
                      background: isActive
                        ? "var(--accent)"
                        : isDone
                          ? "rgba(90,201,148,0.45)"
                          : "#0d1420",
                      boxShadow: isActive ? "var(--glow-sm)" : "none",
                    }}
                  />
                  <span className="ndi-pipe-trace" data-on={state} />
                </span>

                <span
                  className="font-mono text-[10.5px] uppercase tracking-[0.16em]"
                  style={{ color: isActive ? "var(--text-accent)" : "var(--text-faint)" }}
                >
                  {entry.code}
                </span>
                <span
                  className="font-display text-[17px] font-semibold tracking-[-0.02em]"
                  style={{ color: isActive ? "var(--text-strong)" : "var(--text-muted)" }}
                >
                  {entry.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail panel — copy on the left, the three facts as rows on the right. */}
      <div
        data-ndi-2col="1"
        className="mt-[22px] grid grid-cols-1 items-start gap-10 overflow-hidden rounded-2xl border border-grid px-8 py-[30px] min-[901px]:grid-cols-[1.1fr_1fr]"
        style={{
          background: "var(--grad-card)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          boxShadow: "var(--inset-top), 0 18px 44px rgba(0,0,0,0.28)",
        }}
      >
        <div>
          <div className="flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.16em] text-accent">
            Step {active.code}
            <span
              aria-hidden="true"
              className="h-px w-10"
              style={{
                background: "linear-gradient(90deg, var(--border-strong), transparent)",
              }}
            />
            {active.tag}
          </div>
          <div className="mt-3.5 font-display text-[24px] font-semibold tracking-[-0.02em] text-strong">
            {active.title}
          </div>
          <p className="mt-2.5 text-[15px] leading-[1.62] text-muted [text-wrap:pretty]">
            {active.body}
          </p>
        </div>

        <div className="flex flex-col border-t border-subtle">
          {[
            ["You bring", active.input, "text-body"],
            ["Output", active.output, "text-body"],
            ["Owners", active.owners, "text-muted"],
          ].map(([label, value, tone], index) => (
            <div
              key={label}
              className={`grid grid-cols-[96px_minmax(0,1fr)] gap-4 py-4 ${
                index < 2 ? "border-b border-subtle" : ""
              }`}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                {label}
              </span>
              <span className={`text-[14px] leading-[1.6] ${tone}`}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
