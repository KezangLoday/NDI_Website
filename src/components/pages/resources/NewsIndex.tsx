"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Icon } from "@/components/ui/icons";
import { ArticleCard } from "@/components/pages/resources/ArticleCard";
import { NewsRow } from "@/components/pages/resources/NewsRow";
import { Reveal } from "@/components/ui/Reveal";
import type { NewsItem } from "@/content/types";
import { formatNewsDate } from "@/lib/format";
import { mediaUrl } from "@/lib/media";

const PER_PAGE = 6;

/** The news index: a lead story beside the top reads, then the archive as a paginated grid. */

/** The lead: newest story, given the room to open the page. */
function LeadStory({ item }: { item: NewsItem }) {
  return (
    <article>
      <Link href={item.href} className="ndi-news-lead group block">
        {/* A lead story with no artwork falls back to the category plate the archive cards use, rather than an empty framed box. */}
        {item.image ? (
          <div className="ndi-news-shot relative aspect-[16/10] overflow-hidden rounded-2xl border border-grid">
            <Image
              src={mediaUrl(item.image)}
              /* The headline beside this is the link's name; a described photograph inside the same link would only read it out twice. */
              alt=""
              fill
              priority
              sizes="(max-width: 900px) 92vw, 700px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="ndi-news-plate relative flex aspect-[16/10] items-end rounded-2xl border border-grid p-6">
            <span className="font-display text-[30px] font-semibold leading-[1.1] tracking-[-0.03em] text-strong/70">
              {item.category}
            </span>
          </div>
        )}

        <div className="mt-5 flex items-center gap-3">
          <span className="ndi-news-chip">{item.category}</span>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-faint">
            {formatNewsDate(item.publishedAt)}
          </span>
        </div>

        <h3 className="ndi-news-title mt-3.5 font-display text-[clamp(22px,2.2vw,27px)] font-semibold leading-[1.18] tracking-[-0.02em] text-strong [text-wrap:balance]">
          {item.title}
        </h3>
        <p className="mt-3 max-w-[62ch] text-[15px] leading-[1.62] text-muted [text-wrap:pretty]">
          {item.excerpt}
        </p>
        <span className="ndi-tut mt-5 inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-accent">
          Read more
          <Icon name="arrowRight" size={14} strokeWidth={2} />
        </span>
      </Link>
    </article>
  );
}

/** An archive entry as the shared newsroom card. */
function ArchiveCard({ item }: { item: NewsItem }) {
  return (
    <ArticleCard
      href={item.href}
      external={item.external}
      category={item.category}
      title={item.title}
      publishedAt={item.publishedAt}
      excerpt={item.excerpt}
      image={item.image}
    />
  );
}

/** Page numbers with a previous and a next. */
function pageWindow(page: number, pages: number): (number | "gap")[] {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
  const keep = new Set([1, pages, page, page - 1, page + 1]);
  const out: (number | "gap")[] = [];
  for (let n = 1; n <= pages; n++) {
    if (keep.has(n)) out.push(n);
    else if (out[out.length - 1] !== "gap") out.push("gap");
  }
  return out;
}

function Pagination({
  page,
  pages,
  onPage,
}: {
  page: number;
  pages: number;
  onPage: (next: number) => void;
}) {
  if (pages < 2) return null;

  return (
    <nav aria-label="News pages" className="mt-12 flex justify-center">
      <ul className="flex flex-row items-center gap-1">
        <li>
          <button
            type="button"
            onClick={() => onPage(page - 1)}
            disabled={page === 1}
            className="ndi-page ndi-page-step"
          >
            <Icon name="chevronLeft" size={15} strokeWidth={2} />
            Previous
          </button>
        </li>

        {pageWindow(page, pages).map((entry, index) =>
          entry === "gap" ? (
            <li key={`gap-${index}`} aria-hidden="true" className="ndi-page-gap">
              <Icon name="ellipsis" size={15} strokeWidth={2.4} />
            </li>
          ) : (
            <li key={entry}>
              <button
                type="button"
                onClick={() => onPage(entry)}
                aria-current={entry === page ? "page" : undefined}
                aria-label={`Page ${entry}`}
                className="ndi-page ndi-page-n"
              >
                {entry}
              </button>
            </li>
          ),
        )}

        <li>
          <button
            type="button"
            onClick={() => onPage(page + 1)}
            disabled={page === pages}
            className="ndi-page ndi-page-step"
          >
            Next
            <Icon name="chevronRight" size={15} strokeWidth={2} />
          </button>
        </li>
      </ul>
    </nav>
  );
}

export function NewsIndex({ items }: { items: NewsItem[] }) {
  const [page, setPage] = useState(1);

  const byDate = (list: NewsItem[]) =>
    [...list].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  const dated = byDate(items);

  /* The lead: whichever story an editor flagged, or the newest one. */
  const stories = dated.filter((item) => item.format === "story");
  const lead = stories.find((item) => item.featured) ?? stories[0];

  const topReads = dated
    .filter((item) => item.popularRank !== undefined)
    .sort((a, b) => (a.popularRank ?? 0) - (b.popularRank ?? 0))
    .slice(0, 3);

  /* Everything except the lead, newest first. */
  const archive = dated.filter((item) => item.id !== lead?.id);

  const pages = Math.max(1, Math.ceil(archive.length / PER_PAGE));
  const current = Math.min(page, pages);
  const shown = archive.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  return (
    <>
      <Reveal className="grid grid-cols-1 gap-12 min-[1001px]:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)] min-[1001px]:gap-14">
        <section aria-labelledby="news-latest">
          <h2
            id="news-latest"
            className="font-display text-[22px] font-semibold tracking-[-0.02em] text-strong"
          >
            The latest
          </h2>
          <div className="mt-6">{lead ? <LeadStory item={lead} /> : null}</div>
        </section>

        {topReads.length ? (
          <section aria-labelledby="news-top">
            <h2
              id="news-top"
              className="font-display text-[22px] font-semibold tracking-[-0.02em] text-strong"
            >
              Top reads
            </h2>
            <div className="mt-6 flex flex-col gap-2">
              {topReads.map((item) => (
                <NewsRow key={item.id} item={item} />
              ))}
            </div>
          </section>
        ) : null}
      </Reveal>

      <Reveal delay={0.05} className="mt-20">
        <div className="flex items-end justify-between gap-6">
          <h2 className="font-display text-[22px] font-semibold tracking-[-0.02em] text-strong">
            More from the newsroom
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
            {archive.length} entries
          </span>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-5 min-[701px]:grid-cols-2 min-[1101px]:grid-cols-3">
          {shown.map((item) => (
            <ArchiveCard key={item.id} item={item} />
          ))}
        </div>

        <Pagination page={current} pages={pages} onPage={setPage} />
      </Reveal>
    </>
  );
}
