"use client";

import { useMemo, useState } from "react";

import { ArticleCard } from "@/components/pages/resources/ArticleCard";
import { Icon } from "@/components/ui/icons";
import type { IconName } from "@/components/ui/icons";
import type { Insight, InsightCategory } from "@/content/types";

type Tab = "all" | InsightCategory;

const TABS: { id: Tab; label: string; icon: IconName }[] = [
  /* "All" rather than "All articles" or "All publications": the shelf holds
     research papers, case studies and blog posts, and every collective noun
     that fits one of those misdescribes the others. The page title already
     says what the list is; the tab only has to say it is unfiltered. */
  { id: "all", label: "All", icon: "book" },
  { id: "research", label: "Research", icon: "fileText" },
  { id: "case-studies", label: "Case studies", icon: "fileCheck" },
  { id: "blogs", label: "Blogs", icon: "penLine" },
];

const CATEGORY_LABEL: Record<InsightCategory, string> = {
  research: "Research",
  "case-studies": "Case study",
  blogs: "Blog",
};

/**
 * The insights index: category tabs, a search, and a grid that leads with two
 * wide cards before settling into rows of three.
 *
 * The lead pair is only used when there are enough entries to fill the rows
 * behind it. Promoting two cards out of a set of three leaves a single orphan
 * on the row below, which reads as a layout fault rather than as emphasis, so
 * short lists render as a plain grid of three and a pair renders as the pair.
 *
 * The chip on each card switches with the tab. Unfiltered, it names the
 * category, which is the thing the reader cannot otherwise tell at a glance.
 * Inside a category it names the specific form instead, since repeating the tab
 * you are already standing in tells you nothing.
 */
export function InsightsIndex({ insights }: { insights: Insight[] }) {
  const [tab, setTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");

  const searching = query.trim().length > 0;

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return insights
      .filter((item) => (tab === "all" ? true : item.category === tab))
      .filter((item) =>
        needle
          ? `${item.title} ${item.description} ${item.type}`.toLowerCase().includes(needle)
          : true,
      )
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }, [insights, tab, query]);

  const featureCount = visible.length >= 5 || visible.length === 2 ? 2 : 0;
  const lead = visible.slice(0, featureCount);
  const rest = visible.slice(featureCount);

  const chipFor = (item: Insight) => (tab === "all" ? CATEGORY_LABEL[item.category] : item.type);

  const count = visible.length;
  const countLabel = searching
    ? `${count} result${count === 1 ? "" : "s"}`
    : `${count} ${count === 1 ? "entry" : "entries"}`;

  return (
    <>
      <div className="flex flex-wrap items-center gap-4">
        {/* Four tabs measure wider than a phone, and the strip must not be
            allowed to push the page sideways, so it scrolls on its own. */}
        <div
          className="ndi-tabscroll -mx-1 max-w-full flex-none overflow-x-auto px-1"
          style={{ opacity: searching ? 0.45 : 1, transition: "opacity 0.22s var(--ease-out)" }}
        >
        <div
          className="inline-flex h-12 items-center gap-1 rounded-xl border border-grid bg-white/[0.02] p-1"
          role="tablist"
          aria-label="Publication type"
        >
          {TABS.map((entry) => (
            <button
              key={entry.id}
              type="button"
              role="tab"
              aria-selected={tab === entry.id}
              data-active={tab === entry.id ? "true" : "false"}
              data-tabbtn=""
              onClick={() => {
                setTab(entry.id);
                setQuery("");
              }}
              className="inline-flex h-full flex-none cursor-pointer items-center gap-2 rounded-[9px] border border-transparent bg-transparent px-4 font-display text-[14.5px] font-semibold text-muted transition-[background,color,border-color] duration-[220ms]"
            >
              <Icon name={entry.icon} size={15} />
              {entry.label}
            </button>
          ))}
        </div>
        </div>

        <label className="relative min-w-[200px] flex-1">
          <span className="sr-only">Search publications</span>
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint">
            <Icon name="search" size={16} />
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search publications"
            className="ndi-field h-12 w-full rounded-xl border border-grid bg-raised pl-11 pr-4 font-body text-sm text-strong outline-none"
          />
        </label>
      </div>

      <div className="mt-5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">
        {countLabel}
      </div>

      {count === 0 ? (
        <div className="mt-8 max-w-[52ch]">
          <p className="font-display text-[19px] font-semibold tracking-[-0.02em] text-strong">
            Nothing matches that yet
          </p>
          <p className="mt-2.5 text-[14.5px] leading-[1.65] text-muted">
            Try a shorter search, or clear it to see everything published so far.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setTab("all");
            }}
            className="ndi-backbtn mt-6 inline-flex h-[42px] items-center gap-2.5 rounded-full border border-grid px-5 font-display text-[14px] font-semibold text-body"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          {lead.length ? (
            <div className="mt-8 grid grid-cols-1 gap-5 min-[901px]:grid-cols-2">
              {lead.map((item) => (
                <ArticleCard
                  key={item.id}
                  size="feature"
                  href={`/resources/insights/${item.slug}`}
                  category={chipFor(item)}
                  title={item.title}
                  publishedAt={item.publishedAt}
                  excerpt={item.description}
                  image={item.image}
                />
              ))}
            </div>
          ) : null}

          {rest.length ? (
            <div
              className={`grid grid-cols-1 gap-5 min-[701px]:grid-cols-2 min-[1101px]:grid-cols-3 ${
                lead.length ? "mt-5" : "mt-8"
              }`}
            >
              {rest.map((item) => (
                <ArticleCard
                  key={item.id}
                  href={`/resources/insights/${item.slug}`}
                  category={chipFor(item)}
                  title={item.title}
                  publishedAt={item.publishedAt}
                  excerpt={item.description}
                  image={item.image}
                />
              ))}
            </div>
          ) : null}
        </>
      )}
    </>
  );
}
