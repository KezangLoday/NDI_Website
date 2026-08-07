"use client";

import { useEffect, useState, type RefObject } from "react";

import { useReducedMotion } from "./useReducedMotion";

export interface CircuitBand {
  top: number;
  height: number;
  ref: string;
}

const VARIANTS = ["#ndiTA", "#ndiTB", "#ndiTC"];

/**
 * Tiles the circuit-trace SVG variants down the full document height.
 *
 * Band height scales with viewport width exactly as the prototype does, and
 * the set is recomputed on resize and again after layout settles, because
 * fonts and images keep growing the page after first paint.
 */
export function useCircuitBands() {
  const [bands, setBands] = useState<CircuitBand[]>([]);
  const [documentHeight, setDocumentHeight] = useState(0);

  useEffect(() => {
    const compute = () => {
      const height = Math.max(document.documentElement.scrollHeight, window.innerHeight);
      const bandHeight = Math.round(900 * (Math.min(window.innerWidth, 1920) / 1440));
      const count = Math.ceil(height / bandHeight);

      setDocumentHeight(height);
      setBands((previous) => {
        if (previous.length === count && previous[0]?.height === bandHeight) return previous;
        return Array.from({ length: count }, (_, i) => ({
          top: i * bandHeight,
          height: bandHeight,
          ref: VARIANTS[i % VARIANTS.length],
        }));
      });
    };

    compute();
    const settle = [setTimeout(compute, 700), setTimeout(compute, 1600)];

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(compute, 200);
    };
    window.addEventListener("resize", onResize);

    return () => {
      settle.forEach(clearTimeout);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return { bands, documentHeight };
}

interface CircuitMask {
  topFade: string;
  glowFade: string;
  textHole: string;
}

/**
 * Layout-only geometry. `getBoundingClientRect` would bake in the hero's
 * entrance transform, so the offset chain is walked by hand instead — the
 * mask is then correct whenever it happens to be measured.
 */
function documentBox(element: HTMLElement) {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = element;
  while (node) {
    x += node.offsetLeft || 0;
    y += node.offsetTop || 0;
    node = node.offsetParent as HTMLElement | null;
  }
  return { left: x, top: y, width: element.offsetWidth, height: element.offsetHeight };
}

function measureMask(): CircuitMask {
  const hero = document.querySelector<HTMLElement>("[data-hero-grid]");
  const heroBox = hero ? documentBox(hero) : { top: 0, height: 700, left: 0, width: 0 };
  const heroTop = heroBox.top;
  const heroBottom = heroBox.top + heroBox.height;

  const heading = hero?.querySelector<HTMLElement>("h1") ?? null;
  const storeButton = hero?.querySelector<HTMLElement>(".ndi-store") ?? null;

  // Fallback ellipse, used before the hero exists (e.g. on the stub routes).
  let holeX = 300;
  let holeY = (heroTop + heroBottom) / 2;
  let holeWidth = 560;
  let holeHeight = 260;

  if (heading) {
    const headingBox = documentBox(heading);
    const buttonBox = storeButton ? documentBox(storeButton) : headingBox;
    const top = headingBox.top;
    const bottom = Math.max(buttonBox.top + buttonBox.height, headingBox.top + headingBox.height);
    holeX = headingBox.left + headingBox.width * 0.42;
    holeY = (top + bottom) / 2;
    holeWidth = Math.max(360, headingBox.width * 0.98);
    holeHeight = Math.max(150, (bottom - top) * 0.62);
  }

  const fadeIn = Math.round(heroTop + 280);
  const fadeFull = Math.round(heroTop + 440);

  // The fade completes at the next section's eyebrow, ramping across the gap.
  const feature = document.getElementById("how-it-works");
  const featureTop = feature ? documentBox(feature).top : heroBottom + 200;
  const eyebrow = feature?.querySelector<HTMLElement>("div, p, span") ?? null;
  const fadeEnd = Math.round(eyebrow ? documentBox(eyebrow).top : featureTop + 56);

  // Ramp backwards from the eyebrow so every stop strictly increases.
  const rampLength = Math.min(Math.max(260, fadeEnd - heroTop - 600), 520);
  const rampStart = Math.max(fadeFull + 40, fadeEnd - rampLength);
  const span = fadeEnd - rampStart;
  const stop1 = Math.round(rampStart + span * 0.42);
  const stop2 = Math.round(rampStart + span * 0.75);

  return {
    topFade:
      `linear-gradient(to bottom, transparent 0, transparent ${fadeIn}px, #000 ${fadeFull}px, ` +
      `#000 ${Math.round(rampStart)}px, rgba(0,0,0,0.6) ${stop1}px, rgba(0,0,0,0.2) ${stop2}px, ` +
      `transparent ${fadeEnd}px)`,
    glowFade: `linear-gradient(to bottom, transparent 0, transparent ${fadeIn}px, #000 ${fadeFull}px, #000 100%)`,
    textHole:
      `radial-gradient(ellipse ${Math.round(holeWidth)}px ${Math.round(holeHeight)}px at ` +
      `${Math.round(holeX)}px ${Math.round(holeY)}px, transparent 0%, transparent 44%, ` +
      `rgba(0,0,0,0.35) 66%, rgba(0,0,0,0.72) 84%, #000 100%)`,
  };
}

function setMask(element: HTMLElement, layers: string) {
  element.style.webkitMaskImage = layers;
  element.style.maskImage = layers;
  // Safari spells the intersection differently.
  element.style.webkitMaskComposite = "source-in";
  element.style.maskComposite = "intersect";
}

/**
 * The cursor-reactive circuit glow.
 *
 * The dim base layer is masked so traces never run through the headline. The
 * bright layer is additionally masked to a spotlight that follows the cursor
 * in page coordinates — the layers span the whole document, so page coords
 * keep the spotlight glued to the pointer at any scroll depth. When the cursor
 * has been still for a moment a softer spotlight drifts on its own, so the
 * effect is discoverable without hovering.
 */
/**
 * Subpages use a plainer treatment than the home page: the dim base layer is
 * hidden entirely so only the cursor-revealed traces show, the fade is a fixed
 * gradient rather than one measured off the hero, and there is no ambient
 * roaming — the glow returns to nothing when the pointer leaves the document.
 */
const SUBPAGE_FADE =
  "linear-gradient(to bottom, transparent 0, transparent 480px, #000 780px, #000 100%)";

export function useCircuitGlow(
  baseRef: RefObject<HTMLDivElement | null>,
  glowRef: RefObject<HTMLDivElement | null>,
  variant: "home" | "subpage" = "home",
) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (variant === "subpage") {
      const base = baseRef.current;
      if (base) {
        base.style.opacity = "0";
        base.style.webkitMaskImage = SUBPAGE_FADE;
        base.style.maskImage = SUBPAGE_FADE;
      }

      const applySpot = (x: number, y: number) => {
        const glow = glowRef.current;
        if (!glow) return;
        const spot = `radial-gradient(300px circle at ${x}px ${y}px, #000 0%, transparent 72%)`;
        setMask(glow, `${spot}, ${SUBPAGE_FADE}`);
        glow.style.opacity = "1";
      };

      const onMove = (event: MouseEvent) => applySpot(event.pageX, event.pageY);
      const onLeave = () => {
        if (glowRef.current) glowRef.current.style.opacity = "0";
      };

      if (reduced) {
        applySpot(window.innerWidth / 2, window.scrollY + window.innerHeight * 0.55);
        return;
      }

      window.addEventListener("mousemove", onMove, { passive: true });
      document.addEventListener("mouseleave", onLeave);
      return () => {
        window.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseleave", onLeave);
      };
    }

    let mask: CircuitMask | null = null;

    const remeasure = () => {
      mask = measureMask();
      if (baseRef.current) setMask(baseRef.current, `${mask.topFade}, ${mask.textHole}`);
      return mask;
    };

    const apply = (x: number, y: number, radius: number, strong: boolean) => {
      const glow = glowRef.current;
      if (!glow) return;
      const current = mask ?? remeasure();
      const spot = `radial-gradient(${radius}px circle at ${x}px ${y}px, #000 0%, transparent 72%)`;
      setMask(glow, `${spot}, ${current.glowFade}, ${current.textHole}`);
      glow.style.opacity = strong ? "1" : "0.85";
    };

    remeasure();

    // Entrance transforms mean first-paint geometry is wrong; re-measure once
    // things settle, on load, and after fonts swap.
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(remeasure, 120);
    };
    const settle = setTimeout(remeasure, 950);
    window.addEventListener("resize", onResize);
    window.addEventListener("load", remeasure);
    document.fonts?.ready.then(remeasure).catch(() => {});

    let lastMove = -9999;
    const onMove = (event: MouseEvent) => {
      lastMove = performance.now();
      apply(event.pageX, event.pageY, 300, true);
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    let frame = 0;
    if (reduced) {
      apply(window.innerWidth / 2, window.scrollY + window.innerHeight * 0.55, 300, false);
    } else {
      const roam = () => {
        const now = performance.now();
        if (now - lastMove > 1100) {
          const t = now / 1000;
          const x = window.innerWidth * (0.5 + 0.34 * Math.sin(t * 0.18));
          const y = window.scrollY + window.innerHeight * (0.52 + 0.3 * Math.cos(t * 0.13));
          apply(x, y, 360, false);
        }
        frame = requestAnimationFrame(roam);
      };
      frame = requestAnimationFrame(roam);
    }

    return () => {
      clearTimeout(resizeTimer);
      clearTimeout(settle);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", remeasure);
      window.removeEventListener("mousemove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [baseRef, glowRef, reduced, variant]);
}
