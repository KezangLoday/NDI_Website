import Link from "next/link";
import type { ReactNode } from "react";

import { Icon } from "./icons";

/** The mono uppercase "— Label" that opens every section. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">{children}</div>
  );
}

/** The bordered "View all →" pill on the right of a section header. */
export function ViewAllLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="ndi-va inline-flex h-[38px] flex-none items-center gap-[7px] rounded-[10px] border border-divider bg-[#18202c] px-[15px] font-display text-[13.5px] font-semibold text-strong transition-[border-color,background,color] duration-[280ms] ease-ndi"
    >
      {children}
      <Icon name="arrowRight" size={14} strokeWidth={1.9} />
    </Link>
  );
}

interface SectionHeaderProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  action?: ReactNode;
  /** The design varies this between 560px and 680px per section. */
  maxWidth?: number;
  titleClassName?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  maxWidth = 680,
  titleClassName = "",
}: SectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div style={{ maxWidth }}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2
          className={`mt-4 font-display text-[40px] font-bold leading-[1.1] tracking-[-0.01em] text-strong ${titleClassName}`}
        >
          {title}
        </h2>
        {description ? (
          <p className="mt-[14px] text-[17px] leading-[1.6] text-muted">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
