"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { NewsItem } from "@/content/types";
import { formatNewsDate } from "@/lib/format";
import { mediaUrl } from "@/lib/media";

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
        className="mt-5 flex flex-col"
      >
        {list.length ? (
          list.map((item) => (
            <Link
              key={item.id}
              href={`/resources/news/${item.slug}`}
              className="ndi-news-row group grid grid-cols-[76px_minmax(0,1fr)] gap-3.5 border-t border-subtle py-4"
            >
              <div className="ndi-news-shot relative aspect-[4/3] overflow-hidden rounded-lg border border-grid">
                <Image
                  src={mediaUrl(item.image)}
                  alt=""
                  fill
                  sizes="76px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                  {formatNewsDate(item.publishedAt)}
                </span>
                <h3 className="ndi-news-title mt-1.5 font-display text-[13.5px] font-semibold leading-[1.35] tracking-[-0.01em] text-strong">
                  {item.title}
                </h3>
                <span className="mt-1.5 inline-block font-mono text-[9px] uppercase tracking-[0.14em] text-accent">
                  {item.category}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <p className="border-t border-subtle py-5 text-[13.5px] leading-[1.6] text-muted">
            No stories have been ranked yet.
          </p>
        )}
      </div>
    </aside>
  );
}
