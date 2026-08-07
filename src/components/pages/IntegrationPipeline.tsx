"use client";

import { useEffect, useRef, useState } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { PipelineStep } from "@/content/types";

const TICK_MS = 80;
const STEP_MS = 5200;

/**
 * The four-step integration path.
 *
 * Auto-advances roughly every 5.2s, driven by a short tick so the progress bar
 * can fill smoothly. It pauses on hover, while the tab is hidden, and whenever
 * the rail is scrolled out of view — there is no point animating a component
 * nobody is looking at, and it keeps the timer honest when the user returns.
 */
export function IntegrationPipeline({ steps }: { steps: PipelineStep[] }) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
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
      setProgress((current) => {
        const next = current + TICK_MS / STEP_MS;
        if (next >= 1) {
          setStep((s) => (s + 1) % steps.length);
          return 0;
        }
        return next;
      });
    }, TICK_MS);

    return () => clearInterval(timer);
  }, [reduced, hovered, inView, steps.length]);

  const select = (index: number) => {
    setStep(index);
    setProgress(0);
  };

  const active = steps[step];

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {/* Rail */}
      <div ref={railRef} className="grid grid-cols-2 gap-3 min-[901px]:grid-cols-4">
        {steps.map((entry, index) => {
          const isActive = index === step;
          const isDone = index < step;
          return (
            <button
              key={entry.code}
              type="button"
              onClick={() => select(index)}
              onFocus={() => select(index)}
              aria-current={isActive ? "step" : undefined}
              className="group relative flex cursor-pointer flex-col gap-3 rounded-2xl border bg-white/[0.02] p-5 text-left transition-[border-color,background] duration-[220ms]"
              style={{
                borderColor: isActive ? "rgba(90,201,148,0.42)" : "var(--border-grid)",
                background: isActive ? "rgba(90,201,148,0.06)" : "rgba(255,255,255,0.02)",
              }}
            >
              {/* Progress hairline along the top of the active card */}
              <span
                aria-hidden="true"
                className="absolute left-0 right-0 top-0 h-px overflow-hidden rounded-t-2xl"
                style={{ background: "var(--border-grid)" }}
              >
                <span
                  className="block h-full"
                  style={{
                    width: isActive ? `${Math.round(progress * 100)}%` : isDone ? "100%" : "0%",
                    background: "var(--accent)",
                    transition: "width 80ms linear",
                  }}
                />
              </span>
              {isActive ? <span aria-hidden="true" className="ndi-pipe-pulse" /> : null}

              <span
                className="font-mono text-[11px] tracking-[0.14em]"
                style={{ color: isActive || isDone ? "var(--accent)" : "var(--text-faint)" }}
              >
                {entry.code}
              </span>
              <span
                className="font-display text-[16px] font-semibold"
                style={{ color: isActive ? "var(--text-strong)" : "var(--text-muted)" }}
              >
                {entry.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Detail panel */}
      <div className="mt-4 rounded-2xl border border-grid bg-white/[0.02] p-7">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-[11px] tracking-[0.14em] text-accent">
            {active.code}
          </span>
          <span className="rounded-full border border-grid bg-white/[0.02] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            {active.tag}
          </span>
        </div>
        <h3 className="mt-3 font-display text-[21px] font-semibold tracking-[-0.02em] text-strong">
          {active.title}
        </h3>
        <p className="mt-3 max-w-[720px] text-[15px] leading-[1.65] text-muted [text-wrap:pretty]">
          {active.body}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-5 border-t border-subtle pt-5 min-[701px]:grid-cols-3">
          {[
            ["You bring", active.input],
            ["Output", active.output],
            ["Owners", active.owners],
          ].map(([label, value]) => (
            <div key={label}>
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                {label}
              </div>
              <div className="mt-2 text-[14px] leading-[1.55] text-body">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
