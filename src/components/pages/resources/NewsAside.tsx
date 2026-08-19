"use client";

import { useState } from "react";

import { NewsRow } from "@/components/pages/resources/NewsRow";
import type { NewsItem } from "@/content/types";

/**
 * The detail page's right-hand rail: the rest of the newsroom, as Latest or
 * Popular.
 *
 * Two tabs over one list rather than two stacked lists — the whole point of the
 * rail is that it stays beside the article, and stacking both would push the
 * second below the fold of a long read.
 *
 * "Popular" is an editorial order held in the content (`popularRank`), not a
 * measurement. Nothing on this site counts reads, and a tab that claims to rank
 * by readership while sorting by date would be a lie in the interface.
 */
export function NewsAside({ latest, popular }: { latest: NewsItem[]; popular: NewsItem[] }) {
  const [tab, setTab] = useState<"latest" | "popular">("latest");
  const list = tab === "latest" ? latest : popular;

  return (
    <aside className="ndi-news-aside min-[1001px]:sticky min-[1001px]:top-[110px]">
      <div role="tablist" aria-label="More news" className="flex items-center gap-6">
        {(["latest", "popular"] as const).map((key) => (
          <button
            key={key}
            role="tab"
            type="button"
            id={`news-tab-${key}`}
            aria-selected={tab === key}
            aria-controls="news-tab-panel"
            onClick={() => setTab(key)}
            className="ndi-news-tab font-display text-[16.5px] font-semibold tracking-[-0.02em] capitalize"
          >
            {key}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id="news-tab-panel"
        aria-labelledby={`news-tab-${tab}`}
        className="mt-4 flex flex-col gap-0.5"
      >
        {list.length ? (
          /* The index's Top reads row, at the width this narrower rail allows. */
          list.map((item) => <NewsRow key={item.id} item={item} thumb={84} />)
        ) : (
          <p className="border-t border-subtle py-5 text-[13.5px] leading-[1.6] text-muted">
            No stories have been ranked yet.
          </p>
        )}
      </div>
    </aside>
  );
}
