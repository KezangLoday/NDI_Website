"use client";

import { useCallback, type PointerEvent, type ReactNode } from "react";

/** The design's primary CTA gradient. */
const GRADIENT =
  "linear-gradient(115deg, #8CF0C0 0%, #6FE0A9 24%, #4FC091 56%, #2FA189 80%, #1E8189 100%)";

/**
 * Filled mint CTA with a cursor-tracked hover glow and a click ripple.
 *
 * `--bx`/`--by` are element-local pointer coordinates that `.ndi-hglow` reads;
 * the ripple is a transient span, so both are DOM writes rather than state.
 */
export function GradientButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const onMove = useCallback((event: PointerEvent<HTMLAnchorElement>) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    element.style.setProperty("--bx", `${event.clientX - rect.left}px`);
    element.style.setProperty("--by", `${event.clientY - rect.top}px`);
  }, []);

  const onDown = useCallback((event: PointerEvent<HTMLAnchorElement>) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const ink = document.createElement("span");
    ink.className = "ndi-ripple";
    ink.style.width = `${size}px`;
    ink.style.height = `${size}px`;
    ink.style.left = `${event.clientX - rect.left}px`;
    ink.style.top = `${event.clientY - rect.top}px`;
    element.appendChild(ink);
    setTimeout(() => ink.remove(), 650);
  }, []);

  return (
    <a
      href={href}
      onPointerMove={onMove}
      onPointerDown={onDown}
      className={`ndi-hglow ndi-sweepbtn inline-flex h-12 items-center gap-2.5 rounded-xl border border-transparent px-6 font-display text-[14.5px] font-semibold ${className}`.trim()}
      style={{ background: GRADIENT, color: "#08130f", boxShadow: "var(--glow-sm)" }}
    >
      {children}
    </a>
  );
}
