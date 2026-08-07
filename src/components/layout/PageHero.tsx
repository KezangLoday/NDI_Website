import type { ReactNode } from "react";

import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeader";

/** The animated mint gradient applied to the emphasised words in a heading. */
export function Emphasis({ children }: { children: ReactNode }) {
  return <span className="ndi-wave-text">{children}</span>;
}

/**
 * The hero every subpage opens with: eyebrow, a display heading with one
 * emphasised phrase, and a lead paragraph.
 *
 * The page owns its own <section> and padding, since the design varies the
 * bottom gap per page.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  size = "clamp(38px,5vw,58px)",
  leadWidth = 620,
  leadSize = 17,
  children,
}: {
  /** Omitted on Glossary, which opens straight on the headline. */
  eyebrow?: string;
  title: ReactNode;
  lead: string;
  size?: string;
  leadWidth?: number;
  leadSize?: number;
  children?: ReactNode;
}) {
  return (
    <Reveal className="max-w-[820px]">
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      {/* The design keeps the headline's 20px top margin even on Glossary,
          where there is no eyebrow above it. */}
      <h1
        className="mt-5 font-display font-semibold leading-[1.04] tracking-[-0.03em] text-strong [text-wrap:pretty]"
        style={{ fontSize: size }}
      >
        {title}
      </h1>
      <p
        className="mt-6 leading-[1.62] text-muted [text-wrap:pretty]"
        style={{ maxWidth: leadWidth, fontSize: leadSize }}
      >
        {lead}
      </p>
      {children}
    </Reveal>
  );
}

/**
 * Section heading used across the subpages.
 *
 * The design does not run one scale for these: it picks a clamp per section,
 * from 30px flat on Governance up to `clamp(30px, 3.6vw, 44px)` on the Users
 * and Organizations service sections. `size` carries that per-section value, so
 * each call site states the design's own figure.
 */
export function SubSectionHeader({
  eyebrow,
  title,
  lead,
  maxWidth = 600,
  size = "clamp(28px,3.4vw,40px)",
  leadSize = 15.5,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  maxWidth?: number;
  size?: string;
  leadSize?: number;
}) {
  return (
    <div style={{ maxWidth }}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        className="mt-4 font-display font-semibold leading-[1.1] tracking-[-0.03em] text-strong"
        style={{ fontSize: size }}
      >
        {title}
      </h2>
      {lead ? (
        <p className="mt-4 leading-[1.62] text-muted" style={{ fontSize: leadSize }}>
          {lead}
        </p>
      ) : null}
    </div>
  );
}

/** Standard subpage section shell — 1200px, 32px gutters. */
export function PageSection({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`mx-auto max-w-[1200px] px-5 min-[641px]:px-8 ${className}`}>
      {children}
    </section>
  );
}
