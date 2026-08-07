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
}: {
  eyebrow: string;
  title: ReactNode;
  lead: string;
}) {
  return (
    <Reveal className="max-w-[820px]">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="mt-5 font-display text-[clamp(38px,5vw,58px)] font-semibold leading-[1.04] tracking-[-0.03em] text-strong [text-wrap:pretty]">
        {title}
      </h1>
      <p className="mt-6 max-w-[600px] text-[17px] leading-[1.62] text-muted [text-wrap:pretty]">
        {lead}
      </p>
    </Reveal>
  );
}

/** Section heading used across the subpages — smaller and tighter than Home's. */
export function SubSectionHeader({
  eyebrow,
  title,
  lead,
  maxWidth = 600,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  maxWidth?: number;
}) {
  return (
    <div style={{ maxWidth }}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-4 font-display text-[clamp(28px,3.4vw,40px)] font-semibold leading-[1.1] tracking-[-0.03em] text-strong">
        {title}
      </h2>
      {lead ? (
        <p className="mt-4 text-[15.5px] leading-[1.62] text-muted">{lead}</p>
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
