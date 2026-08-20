"use client";

import { useMemo, useState } from "react";

import { ProseBody } from "@/content/cms/richText";
import { Icon } from "@/components/ui/icons";
import type { FaqAudience, FaqItem } from "@/content/types";

/**
 * Icons for the audience tabs, keyed by category slug.
 *
 * The two the site needs are seeded records rather than a union in the code, so
 * a third added in the admin panel gets the generic mark and still works. The
 * page does not break waiting for a developer to pick an icon.
 */
const TAB_ICON: Record<string, "user" | "building2"> = {
  "for-users": "user",
  "for-organizations": "building2",
};

const DEFAULT_TAB_ICON = "building2" as const;

/**
 * Tabs plus live search over the FAQ list.
 *
 * The search deliberately spans both audiences: while a query is present the
 * tab filter is bypassed and the tabs dim, so a citizen searching "sandbox"
 * still finds the answer filed under organizations. Clearing happens by
 * picking a tab, which matches the prototype.
 */
export function FaqBrowser({
  items,
  audiences,
}: {
  items: FaqItem[];
  audiences: FaqAudience[];
}) {
  /* The first CMS audience is the default tab, so reordering the categories in
     the admin panel changes which one opens first. */
  const [audience, setAudience] = useState<string>(audiences[0]?.slug ?? "");
  const [query, setQuery] = useState("");

  const searching = query.trim().length > 0;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const inTab = q ? true : item.audience === audience;
      if (!inTab) return false;
      if (!q) return true;
      /* `searchText` is the answer flattened to plain text on the server —
         a Lexical tree cannot be searched with `includes`, and flattening it
         per keystroke in the browser would be wasteful. */
      return `${item.question} ${item.searchText}`.toLowerCase().includes(q);
    });
  }, [items, audience, query]);

  const count = visible.length;
  const countLabel = searching
    ? `— ${count} result${count === 1 ? "" : "s"}`
    : `— ${count} question${count === 1 ? "" : "s"}`;

  return (
    <>
      <div className="flex flex-wrap items-center gap-4">
        <div
          className="inline-flex h-12 flex-none items-center gap-1 rounded-xl border border-grid bg-white/[0.02] p-1"
          style={{ opacity: searching ? 0.45 : 1, transition: "opacity 0.22s var(--ease-out)" }}
          role="tablist"
          aria-label="Audience"
        >
          {audiences.map((tab) => (
            <button
              key={tab.slug}
              type="button"
              role="tab"
              aria-selected={audience === tab.slug}
              data-active={audience === tab.slug ? "true" : "false"}
              data-tabbtn=""
              onClick={() => {
                setAudience(tab.slug);
                setQuery("");
              }}
              className="inline-flex h-full cursor-pointer items-center gap-2 rounded-[9px] border border-transparent bg-transparent px-5 font-display text-[14.5px] font-semibold text-muted transition-[background,color,border-color] duration-[220ms]"
            >
              <Icon name={TAB_ICON[tab.slug] ?? DEFAULT_TAB_ICON} size={15} />
              {tab.label}
            </button>
          ))}
        </div>

        <label className="relative min-w-[240px] flex-1">
          <span className="sr-only">Search questions</span>
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint">
            <Icon name="search" size={16} />
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search questions and answers"
            className="ndi-field h-12 w-full rounded-xl border border-grid bg-raised pl-11 pr-4 font-body text-sm text-strong outline-none"
          />
        </label>
      </div>

      <div className="mt-5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">
        {countLabel}
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {visible.map((item) => (
          <details
            key={item.id}
            className="ndi-faq group rounded-2xl border border-grid bg-white/[0.02] px-5"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 font-display text-[16px] font-semibold text-strong">
              {item.question}
              <span className="ndi-faq-mark flex-none text-accent">
                <Icon name="plus" size={18} strokeWidth={2} />
              </span>
            </summary>
            <div className="pb-5 pr-9 text-[14.5px] leading-[1.65] text-muted [text-wrap:pretty]">
              <ProseBody content={item.answer} />
            </div>
          </details>
        ))}
      </div>

      {count === 0 ? (
        <div className="mt-6 font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">
          — No questions match that search
        </div>
      ) : null}
    </>
  );
}
