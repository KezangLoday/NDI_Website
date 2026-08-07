"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ShinyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

/**
 * Animated conic-gradient CTA (the shadcn ShinyButton), themed to NDI mint.
 *
 * The styles live in `src/styles/ndi-effects.css` under `.shiny-cta` rather
 * than in a `<style jsx>` block here — `@property` is a global at-rule that
 * styled-jsx cannot scope, and registering the gradient angle as an `<angle>`
 * is what lets the browser interpolate it smoothly instead of snapping.
 *
 * Size and palette are custom properties, so a call site can restyle it
 * inline without new CSS:
 *
 *   <ShinyButton style={{ "--shiny-cta-px": "26px" } as CSSProperties} />
 *
 * Note the wrapping `<span>`: the shimmer and glow are `::before`/`::after`
 * on both the button and that span, so the element is required.
 */
export function ShinyButton({
  children,
  className = "",
  type = "button",
  ...props
}: ShinyButtonProps) {
  return (
    <button type={type} className={`shiny-cta ${className}`.trim()} {...props}>
      <span>{children}</span>
    </button>
  );
}
