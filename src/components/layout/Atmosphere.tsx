"use client";

import { usePathname } from "next/navigation";
import { useRef } from "react";

import { useCircuitBands, useCircuitGlow } from "@/hooks/useCircuit";

import { CircuitDefs } from "./CircuitDefs";

/** Fades each band into its neighbours so the tiling seam never shows. */
const BAND_FADE =
  "linear-gradient(to bottom, transparent 0, #000 9%, #000 91%, transparent 100%)";

/** Routes that carry the full circuit field behind their hero, not just the
 *  cursor reveal. */
const CIRCUIT_FIELD = new Set(["/", "/company"]);

/**
 * The fixed decorative background: a depth gradient, a dim field of circuit
 * traces, a brighter copy of the same traces revealed under the cursor, and a
 * set of ambient edge pools.
 *
 * The two trace layers span the whole document rather than the viewport, which
 * is why the glow spotlight tracks page coordinates — see useCircuitGlow.
 */
export function Atmosphere() {
  const baseRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const { bands, documentHeight } = useCircuitBands();
  const pathname = usePathname();

  // These pages show the dim base traces and the ambient roaming glow; the
  // rest reveal traces only under the cursor. Both need a hero to measure the
  // mask against — `[data-hero-grid]` or `[data-circuit-hero]`.
  const variant = CIRCUIT_FIELD.has(pathname) ? "home" : "subpage";

  useCircuitGlow(baseRef, glowRef, variant);

  const layerHeight = documentHeight ? `${documentHeight}px` : "100%";

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{ background: "var(--grad-depth)" }}
      />

      <CircuitDefs />

      {/* Dim base traces */}
      <div
        ref={baseRef}
        className="pointer-events-none absolute left-0 top-0 z-0 w-full overflow-hidden"
        style={{ height: layerHeight, color: "rgba(90,201,148,0.36)" }}
      >
        {bands.map((band) => (
          <svg
            key={band.top}
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            className="absolute left-0 w-full"
            style={{
              top: band.top,
              height: band.height,
              WebkitMaskImage: BAND_FADE,
              maskImage: BAND_FADE,
            }}
          >
            <use href={band.ref} />
          </svg>
        ))}
      </div>

      {/* Bright traces, revealed only under the cursor */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute left-0 top-0 z-0 w-full overflow-hidden opacity-0 transition-opacity duration-[450ms] ease-ndi"
        style={{ height: layerHeight, color: "#7fe6b3" }}
      >
        {bands.map((band) => (
          <svg
            key={band.top}
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            className="absolute left-0 w-full"
            style={{
              top: band.top,
              height: band.height,
              WebkitMaskImage: BAND_FADE,
              maskImage: BAND_FADE,
            }}
          >
            <g filter="url(#cglow)">
              <use href={band.ref} />
            </g>
          </svg>
        ))}
      </div>

      {/* Ambient lighting — one continuous set of edge pools, no tiling, no seams */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse 62% 13% at -4% 1%, rgba(90,201,148,0.15) 0%, rgba(90,201,148,0.055) 36%, transparent 74%)",
            "radial-gradient(ellipse 58% 12% at 104% 15%, rgba(18,65,67,0.4) 0%, rgba(18,65,67,0.13) 38%, transparent 76%)",
            "radial-gradient(ellipse 60% 12% at -6% 36%, rgba(90,201,148,0.1) 0%, rgba(90,201,148,0.04) 36%, transparent 74%)",
            "radial-gradient(ellipse 58% 11% at 106% 56%, rgba(18,65,67,0.32) 0%, rgba(18,65,67,0.11) 38%, transparent 76%)",
            "radial-gradient(ellipse 60% 12% at -4% 76%, rgba(90,201,148,0.09) 0%, rgba(90,201,148,0.035) 36%, transparent 74%)",
            "radial-gradient(ellipse 58% 11% at 104% 95%, rgba(18,65,67,0.28) 0%, rgba(18,65,67,0.09) 38%, transparent 76%)",
          ].join(", "),
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
        }}
      />
    </>
  );
}
