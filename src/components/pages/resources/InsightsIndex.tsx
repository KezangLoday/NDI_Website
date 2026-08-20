"use client";

import { useMemo, useState } from "react";

import { ArticleCard } from "@/components/pages/resources/ArticleCard";
import { Icon } from "@/components/ui/icons";
import type { IconName } from "@/components/ui/icons";
import type { CategoryFacet, Insight } from "@/content/types";

/**
 * Icons for the tabs.
 *
 * Keyed by category slug, with a fallback — the categories are CMS data now, so
 * a new one appears the moment an editor adds it, and it gets the generic mark
 * rather than no tab. Adding a nicer icon for it later is a one-line change
 * here; the page does not break in the meantime.
 */
const TAB_ICON: Record<string, IconName> = {
  research: "fileText",
  "case-studies": "fileCheck",
  blogs: "penLine",
};

const DEFAULT_TAB_ICON: IconName = "book";

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
export function InsightsIndex({
  insights,
  facets,
}: {
  insights: Insight[];
  facets: CategoryFacet[];
}) {
  const [tab, setTab] = useState<string>("all");
  const [query, setQuery] = useState("");

  const searching = query.trim().length > 0;

  /*
   * "All" rather than "All articles" or "All publications": the shelf holds
   * research papers, case studies and blog posts, and every collective noun
   * that fits one of those misdescribes the others. The page title already says
   * what the list is; the tab only has to say it is unfiltered.
   *
   * The rest come from the CMS, and only categories with something published
   * under them appear — a tab that opens onto nothing is a dead end.
   */
  const tabs = useMemo(
    () => [
      { id: "all", label: "All", icon: DEFAULT_TAB_ICON },
      ...facets.map((facet) => ({
        id: facet.slug,
        label: facet.label,
        icon: TAB_ICON[facet.slug] ?? DEFAULT_TAB_ICON,
      })),
    ],
    [facets],
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return insights
      .filter((item) => (tab === "all" ? true : item.categorySlug === tab))
      .filter((item) =>
        needle
          ? `${item.title} ${item.description} ${item.kind}`.toLowerCase().includes(needle)
          : true,
      )
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }, [insights, tab, query]);

  const featureCount = visible.length >= 5 || visible.length === 2 ? 2 : 0;
  const lead = visible.slice(0, featureCount);
  const rest = visible.slice(featureCount);

  /* Unfiltered, the chip names the category — the thing a reader cannot
     otherwise tell at a glance. Inside a category it names the specific form
     instead, since repeating the tab you are standing in tells you nothing. */
  const chipFor = (item: Insight) => (tab === "all" ? item.category : item.kind);

  const count = visible.length;
  const countLabel = searching
    ? `${count} result${count === 1 ? "" : "s"}`
    : `${count} ${count === 1 ? "entry" : "entries"}`;

  return (
    <>
      <div className="flex flex-wrap items-center gap-4">
        {/* Four tabs on one row at 375px.
            The width comes from dropping the icon on the inactive tabs: the
            label is what identifies a filter, and three redundant glyphs cost
            about 70px that the words needed. The active tab keeps its icon, so
            the selected filter reads as selected by tint, border and mark
            together rather than by tint alone.
            `flex-wrap` stays as the floor: if a longer label ever arrives the
            row breaks to a second line instead of clipping a word. */}
        <div
          className="ndi-tabwrap w-full min-[641px]:w-auto min-[641px]:flex-none"
          style={{ opacity: searching ? 0.45 : 1, transition: "opacity 0.22s var(--ease-out)" }}
        >
        <div
          /* Phones only distribute. At 375px the four tabs very nearly fill
                 the row, so sizing them to content bunched them left behind 33px
                 of dead space; the spare width belongs in the gaps. From 641px
                 the control goes inline and hugs its tabs instead: distributing
                 there pushed them 117px apart, which stops reading as one
                 control. */
              className="flex flex-wrap items-center justify-between gap-0.5 rounded-xl border border-grid bg-white/[0.02] p-1 min-[641px]:inline-flex min-[641px]:flex-nowrap min-[641px]:justify-start min-[641px]:gap-1 min-[901px]:h-12"
          role="tablist"
          aria-label="Publication type"
        >
          {tabs.map((entry) => (
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
              className="inline-flex h-11 flex-none cursor-pointer items-center gap-1.5 rounded-[9px] border border-transparent bg-transparent px-2.5 font-display text-[13.5px] font-semibold text-muted transition-[background,color,border-color] duration-[220ms] min-[641px]:gap-2 min-[641px]:px-3.5 min-[641px]:text-[14px] min-[901px]:h-full min-[901px]:px-4 min-[901px]:text-[14.5px]"
            >
              {/* The selected tab keeps its mark at every width. The other three
                  drop theirs only on phones, where those glyphs are the 70px
                  that stands between four tabs and one row; from 641px the
                  control is content-width and has room for all four. */}
              {tab === entry.id ? (
                <Icon name={entry.icon} size={15} />
              ) : (
                <span className="hidden min-[641px]:inline-flex">
                  <Icon name={entry.icon} size={15} />
                </span>
              )}
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
