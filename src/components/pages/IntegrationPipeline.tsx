"use client";

import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { PipelineStep } from "@/content/types";

const STEP_MS = 5200;

/**
 * The four-step integration path, drawn as a conductor on a board.
 *
 * The site's whole visual world is circuit trace — orthogonal runs with 45°
 * chamfers, ground-filled junction pads, solid vias, everything at 1.6px (see
 * CircuitDefs). This section used to opt out of it and draw a row of numbered
 * medallions joined by arrow glyphs, which is the shape every stepper takes and
 * says nothing about this product. An integration path already is a trace, so
 * it is drawn as one: the run behind the current step is energised, the run
 * ahead is dark, and the segment being crossed carries a pulse travelling the
 * chamfers rather than a gradient sliding along a straight line.
 *
 * The one structural move is the branch. The live pad drops a conductor into
 * the detail panel and lands on a via at its edge, so the rail and the panel
 * are one circuit instead of a widget sitting above a card. It is placed by
 * translating a step-width element by whole multiples of its own width, so
 * nothing has to be measured for it to track the step.
 *
 * The panel's own layout is the one it has always had, kept on request.
 *
 * Auto-advances every 5.2s, and pauses on hover, while the tab is hidden, and
 * whenever the rail is scrolled out of view.
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

  return (
    <div
      className="ndi-board"
      style={{ "--n": steps.length, "--i": step } as CSSProperties}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div ref={railRef} data-pipe-rail="1" className="ndi-board-rail">
        {/* The trace runs off both edges: this is a detail of a larger board,
            not a diagram that begins and ends with the first and last step. */}
        <span aria-hidden="true" className="ndi-board-lead" data-side="in" />
        <span aria-hidden="true" className="ndi-board-lead" data-side="out" />

        {steps.map((entry, index) => {
          const isActive = index === step;
          const isDone = index < step;
          return (
            <Fragment key={entry.code}>
              {index > 0 ? (
                <span
                  aria-hidden="true"
                  className="ndi-trace"
                  data-on={index <= step ? "1" : "0"}
                >
                  <svg viewBox="0 0 74 24" fill="none" aria-hidden="true">
                    <path d="M0 12 H24 L32 4 H42 L50 12 H74" />
                    <circle className="ndi-trace-via" cx="37" cy="4" r="2.4" />
                    {index === step ? (
                      <path className="ndi-trace-pulse" d="M0 12 H24 L32 4 H42 L50 12 H74" />
                    ) : null}
                  </svg>
                </span>
              ) : null}

              <button
                type="button"
                onClick={() => select(index)}
                onFocus={() => select(index)}
                onMouseEnter={() => select(index)}
                aria-current={isActive ? "step" : undefined}
                aria-controls="ndi-pipeline-detail"
                className="ndi-board-step"
              >
                <span className="ndi-node" data-state={isActive ? "1" : isDone ? "2" : "0"}>
                  <span className="font-mono text-[13px] tracking-[0.1em]">{entry.code}</span>
                </span>
                <span className="ndi-node-title font-display text-[17px] font-semibold tracking-[-0.02em]">
                  {entry.title}
                </span>
                <span className="ndi-node-tag font-mono text-[10px] uppercase tracking-[0.16em]">
                  {entry.tag}
                </span>
              </button>
            </Fragment>
          );
        })}
      </div>

      {/* The conductor from the live pad down into the panel. */}
      <div aria-hidden="true" className="ndi-board-gap">
        <span className="ndi-board-branch" />
      </div>

      <div
        data-ndi-2col="1"
        id="ndi-pipeline-detail"
        className="ndi-board-panel grid grid-cols-1 items-start gap-10 overflow-hidden rounded-2xl border border-grid px-8 py-[30px] min-[901px]:grid-cols-[1.1fr_1fr]"
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
          <h3 className="mt-3.5 font-display text-[24px] font-semibold tracking-[-0.02em] text-strong">
            {active.title}
          </h3>
          <p className="mt-2.5 text-[15px] leading-[1.62] text-muted [text-wrap:pretty]">
            {active.body}
          </p>
        </div>

        <div className="flex flex-col">
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
