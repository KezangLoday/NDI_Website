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
 * are one circuit instead of a widget sitting above a card — which is what the
 * old "STEP 03 —— BUILD" line was there to paper over, and why it is gone.
 * The branch is placed by translating a step-width element by whole multiples
 * of its own width, so nothing has to be measured for it to track the step.
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

      {/* The step's name is already on the live pad a few pixels above, so the
          panel does not repeat it — the branch says which step this is. The
          heading stays for structure, and for anyone who cannot see the wire. */}
      <div
        className="ndi-board-panel rounded-2xl border border-grid px-8 py-[30px]"
        id="ndi-pipeline-detail"
      >
        <h3 className="sr-only">{active.title}</h3>
        <p className="max-w-[64ch] text-[17px] leading-[1.6] text-body [text-wrap:pretty]">
          {active.body}
        </p>

        <dl className="mt-7 grid gap-x-10 gap-y-6 border-t border-subtle pt-6 min-[761px]:grid-cols-3">
          {[
            ["You bring", active.input],
            ["Output", active.output],
            ["Owners", active.owners],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                {label}
              </dt>
              <dd className="mt-2.5 text-[14.5px] leading-[1.55] text-body">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
