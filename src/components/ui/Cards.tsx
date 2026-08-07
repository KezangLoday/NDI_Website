"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Shared card fill from the design — the glass pass in ndi-effects.css sits on top. */
const CARD_BACKGROUND =
  "radial-gradient(120% 80% at 24% -10%, rgba(111,224,169,0.24) 0%, rgba(90,201,148,0.07) 40%, rgba(90,201,148,0) 66%), " +
  "radial-gradient(90% 60% at 50% 118%, rgba(18,65,67,0.55) 0%, rgba(18,65,67,0) 70%), " +
  "linear-gradient(164deg, #0f3340 0%, #0d1420 68%)";

const NOISE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const NOISE_LENGTH = 1400;

function randomString(length: number): string {
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += NOISE_CHARS.charAt(Math.floor(Math.random() * NOISE_CHARS.length));
  }
  return out;
}

/**
 * "What you can do" card — an evervault-style cursor reveal.
 *
 * The noise text is written straight to the DOM rather than held in state:
 * it is regenerated on pointer move, and a 1400-character string through
 * React state every frame would be pure overhead. Generating it in an effect
 * also keeps the server and client markup identical.
 */
export function EvervaultCard({ children }: { children: ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const noiseRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (noiseRef.current) noiseRef.current.textContent = randomString(NOISE_LENGTH);
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    let x = 0;
    let y = 0;
    let queued = false;

    const flush = () => {
      queued = false;
      card.style.setProperty("--mx", `${x}px`);
      card.style.setProperty("--my", `${y}px`);
      if (noiseRef.current) noiseRef.current.textContent = randomString(NOISE_LENGTH);
    };

    const onMove = (event: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
      if (!queued) {
        queued = true;
        requestAnimationFrame(flush);
      }
    };

    card.addEventListener("mousemove", onMove);
    return () => card.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={cardRef}
      className="ndi-ev relative overflow-hidden rounded-2xl p-[26px]"
      style={{
        background: CARD_BACKGROUND,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), 0 18px 40px -26px rgba(0,0,0,0.9)",
      }}
    >
      <div className="ndi-ev-layer ndi-ev-grad" />
      <div className="ndi-ev-layer ndi-ev-noise">
        <p ref={noiseRef} />
      </div>
      {children}
    </div>
  );
}

/**
 * Capability card — a cursor-tracked spotlight ring.
 *
 * The pointer position is a pair of custom properties on :root, written once
 * per frame by PointerSpotlightProvider, so every card on the page reads the
 * same value and no card needs its own listener.
 */
interface SpotlightCardProps {
  children: ReactNode;
  /** Render as a link when the whole card is clickable. */
  as?: "div" | "a";
  href?: string;
  className?: string;
  /** Cards that are links lift slightly on hover. */
  hoverLift?: boolean;
}

export function SpotlightCard({
  children,
  as = "div",
  href,
  className = "",
  hoverLift = false,
}: SpotlightCardProps) {
  const Tag = as;
  return (
    <Tag
      href={href}
      className={`ndi-spot flex flex-col items-start gap-[14px] rounded-2xl p-[26px] ${
        hoverLift ? "ndi-lift" : ""
      } ${className}`.trim()}
      style={{
        background: CARD_BACKGROUND,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), 0 18px 40px -26px rgba(0,0,0,0.9)",
      }}
    >
      <div className="ndi-spot-halo" />
      <div className="ndi-spot-fill" />
      {children}
    </Tag>
  );
}
