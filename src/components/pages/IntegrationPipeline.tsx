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
            {active.code}
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
