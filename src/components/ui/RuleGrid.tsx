import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { Icon } from "@/components/ui/icons";
import type { IconName } from "@/components/ui/icons";

/**
 * A grid of items separated by hairlines instead of boxed into cards.
 *
 * The site had 419 card-like containers across ten pages, which left the card
 * carrying no information: prose, sequences, single facts and genuinely
 * comparable records all wore the same rounded border and glass fill. These
 * sections are lists of comparable items, so they keep the grid and lose the
 * box — a rule above each item is enough to separate them.
 *
 * Horizontal rules only. Vertical dividers would need a selector keyed to the
 * column count, which breaks at every breakpoint the grid reflows at.
 */
export function RuleGrid({
  children,
  className = "",
  ...rest
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div className={`grid gap-x-10 ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
}

export function RuleItem({
  icon,
  eyebrow,
  title,
  children,
  className = "",
}: {
  icon?: IconName;
  /** A number or kicker above the title, where there is no icon. */
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`border-t border-subtle pb-8 pt-5 ${className}`.trim()}>
      {icon ? (
        <span className="mb-4 inline-flex h-6 items-center text-accent">
          <Icon name={icon} size={22} />
        </span>
      ) : null}
      {eyebrow ? (
        <div className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">
          {eyebrow}
        </div>
      ) : null}
      <h3 className="mb-[7px] font-display text-[17px] font-semibold tracking-[-0.01em] text-strong">
        {title}
      </h3>
      {children ? <p className="text-sm leading-[1.6] text-muted">{children}</p> : null}
    </div>
  );
}
