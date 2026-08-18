"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Stagger, in seconds, as declared on the sibling cards in the design. */
  delay?: number;
  id?: string;
}

/**
 * Slide-up-on-scroll wrapper.
 *
 * Matches the prototype's observer settings exactly (threshold 0.1, an -8%
 * bottom margin, unobserve after firing) and animates the transform only —
 * content is fully opaque from first paint, so nothing is ever left invisible
 * if a transition is dropped. The transition itself lives in ndi-effects.css.
 *
 * The revealed flag is written straight to the DOM rather than held in state:
 * it is a one-way visual toggle driven by an external observer, and routing it
 * through a re-render would buy nothing.
 */
export function Reveal({ children, className, style, delay = 0, id }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reveal = () => {
      element.dataset.revealed = "true";
    };

    /* Marks that the observer is attached, so an entrance may hold its subject
       somewhere it could not sensibly be left. Most reveals here offset by a
       few pixels and are fine either way; the capabilities entries start piled
       on the phone, and without this they would sit there for anyone whose JS
       never arrives. */
    element.dataset.ready = "";

    if (!("IntersectionObserver" in window)) {
      reveal();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      id={id}
      data-reveal=""
      data-revealed="false"
      className={className}
      style={delay ? { ...style, transitionDelay: `${delay}s` } : style}
    >
      {children}
    </div>
  );
}
