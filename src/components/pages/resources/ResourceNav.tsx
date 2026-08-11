import Link from "next/link";

import { resourceSections } from "@/content/resourceSections";

/**
 * Sibling navigation across the three resource pages.
 *
 * It looks like the tab strip it replaces, but it is a set of links: the
 * current page is marked with aria-current rather than aria-selected, and each
 * one is a real destination you can open in a new tab or link to directly.
 */
export function ResourceNav({ current }: { current: string }) {
  return (
    <nav
      aria-label="Resource sections"
      className="flex w-fit flex-wrap gap-2 rounded-[14px] border border-grid bg-white/[0.02] p-1.5"
    >
      {resourceSections.map((section) => {
        const active = section.id === current;
        return (
          <Link
            key={section.id}
            href={section.href}
            aria-current={active ? "page" : undefined}
            data-tabbtn=""
            data-active={active ? "true" : "false"}
            className="rounded-[10px] border border-transparent px-5 py-[11px] font-display text-[14px] font-medium text-muted transition-[background,color,border-color] duration-[220ms]"
          >
            {section.label}
          </Link>
        );
      })}
    </nav>
  );
}
