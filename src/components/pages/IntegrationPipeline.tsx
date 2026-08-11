"use client";

import { Fragment, useEffect, useRef, useState } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Icon } from "@/components/ui/icons";
import type { PipelineStep } from "@/content/types";

const STEP_MS = 5200;

/**
 * The four-step integration path, as a flow of medallions joined by arrows.
 *
 * Boxing each step made a timeline read as four tiles. A medallion carrying the
 * step number, an arrow into the next one, and the label beneath says "this
 * happens, then this" without any container at all — and the arrows light up
 * behind the pointer, so the run already travelled reads differently from the
 * run still ahead. The pulse rides the segment currently being crossed.
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
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div
        ref={railRef}
        data-pipe-rail="1"
        className="flex flex-col items-stretch gap-6 min-[761px]:flex-row min-[761px]:items-start min-[761px]:gap-0"
      >
        {steps.map((entry, index) => {
          const isActive = index === step;
          const isDone = index < step;
          return (
            <Fragment key={entry.code}>
              {index > 0 ? (
                <span
                  aria-hidden="true"
                  className="ndi-flow-link"
                  data-on={index <= step ? "1" : "0"}
                  data-crossing={index === step ? "1" : "0"}
                >
                  <span className="ndi-flow-line">
                    {index === step ? <span className="ndi-pipe-pulse" /> : null}
                  </span>
                  <Icon name="arrowRight" size={15} strokeWidth={2} />
                  <span className="ndi-flow-line" />
                </span>
              ) : null}

              <button
                type="button"
                onClick={() => select(index)}
                onFocus={() => select(index)}
                onMouseEnter={() => select(index)}
                aria-current={isActive ? "step" : undefined}
                className="ndi-flow-step flex flex-1 cursor-pointer flex-col items-center px-2 text-center"
              >
                <span
                  className="ndi-flow-badge"
                  data-state={isActive ? "1" : isDone ? "2" : "0"}
                >
                  <span className="font-mono text-[13px] tracking-[0.1em]">{entry.code}</span>
                </span>
                <span
                  className="mt-4 font-display text-[17px] font-semibold tracking-[-0.02em] transition-colors duration-300 ease-ndi"
                  style={{ color: isActive ? "var(--text-strong)" : "var(--text-muted)" }}
                >
                  {entry.title}
                </span>
                <span
                  className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors duration-300 ease-ndi"
                  style={{ color: isActive ? "var(--text-accent)" : "var(--text-faint)" }}
                >
                  {entry.tag}
                </span>
              </button>
            </Fragment>
          );
        })}
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
