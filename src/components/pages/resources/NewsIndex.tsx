"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Icon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import type { NewsItem, ResourceNews } from "@/content/types";
import { formatNewsDate } from "@/lib/format";
import { mediaUrl } from "@/lib/media";

const PER_PAGE = 6;

/**
 * The news index: a lead story beside the top reads, then the archive as a
 * paginated grid.
 *
 * Pagination is client state rather than a `?page=` search param. Reading a
 * search param opts the route out of static generation, and every other page on
 * this site prerenders; with two pages of six the trade is a deep link nobody
 * would send for an instant page turn and a route that stays static. Worth
 * revisiting when the archive is long enough that people link into it.
 *
 * Announcements sit in the same archive as the stories. They carry no artwork —
 * they never did — so their card leads with the category set large instead of a
 * grey box apologising for a missing photograph.
 */

type Entry =
  | { kind: "story"; item: NewsItem }
  | { kind: "notice"; item: ResourceNews };

/** The lead: newest story, given the room to open the page. */
function LeadStory({ item }: { item: NewsItem }) {
  return (
    <article>
      <Link href={`/resources/news/${item.slug}`} className="ndi-news-lead group block">
        <div className="ndi-news-shot relative aspect-[16/10] overflow-hidden rounded-2xl border border-grid">
          <Image
            src={mediaUrl(item.image)}
            /* The headline beside this is the link's name; a described
               photograph inside the same link would only read it out twice. */
            alt=""
            fill
            priority
            sizes="(max-width: 900px) 92vw, 700px"
            className="object-cover"
          />
        </div>

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

/** A top read: thumbnail, headline, date — the compact form. */
function TopRead({ item }: { item: NewsItem }) {
  return (
    <Link
      href={`/resources/news/${item.slug}`}
      className="ndi-news-row group grid grid-cols-[96px_minmax(0,1fr)] gap-4 rounded-xl p-2.5"
    >
      <div className="ndi-news-shot relative aspect-[4/3] overflow-hidden rounded-lg border border-grid">
        <Image src={mediaUrl(item.image)} alt="" fill sizes="96px" className="object-cover" />
      </div>
      <div className="min-w-0">
        <h3 className="ndi-news-title font-display text-[14.5px] font-semibold leading-[1.35] tracking-[-0.01em] text-strong">
          {item.title}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-2.5">
          <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-faint">
            {formatNewsDate(item.publishedAt)}
          </span>
          <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-accent">
            {item.category}
          </span>
        </div>
      </div>
    </Link>
  );
}

/** An archive card. Stories lead with their photograph, notices with a label. */
function ArchiveCard({ entry }: { entry: Entry }) {
  const { item } = entry;
  /* Both shapes carry a category and a date; only the story has artwork and a
     slug, which is the only place the union needs narrowing. */
  const href = entry.kind === "story" ? `/resources/news/${entry.item.slug}` : entry.item.href;

  return (
    <Link
      href={href}
      data-gov-card="1"
      className="ndi-news-card group flex flex-col overflow-hidden rounded-2xl border border-grid"
    >
      {entry.kind === "story" ? (
        <div className="ndi-news-shot relative aspect-[16/10] overflow-hidden border-b border-grid">
          <Image
            src={mediaUrl(entry.item.image)}
            alt=""
            fill
            sizes="(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 360px"
            className="object-cover"
          />
          <span className="ndi-news-chip absolute left-3.5 top-3.5">{item.category}</span>
        </div>
      ) : (
        /* No artwork, and none was ever written for these. The label carries
           the card instead of a placeholder standing in for a photograph. */
        <div className="ndi-news-plate relative flex aspect-[16/10] items-end border-b border-grid p-5">
          <span className="font-display text-[26px] font-semibold leading-[1.1] tracking-[-0.03em] text-strong/70">
            {item.category}
          </span>
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-faint">
          {formatNewsDate(item.publishedAt)}
        </span>
        <h3 className="ndi-news-title mt-2.5 font-display text-[16.5px] font-semibold leading-[1.3] tracking-[-0.02em] text-strong [text-wrap:balance]">
          {item.title}
        </h3>
        {item.excerpt ? (
          <p className="mt-2.5 text-[13.5px] leading-[1.6] text-muted [text-wrap:pretty]">
            {item.excerpt}
          </p>
        ) : null}
        <span className="ndi-tut mt-auto inline-flex items-center gap-2 pt-4 font-mono text-[9.5px] uppercase tracking-[0.16em] text-accent">
          Read more
          <Icon name="arrowRight" size={13} strokeWidth={2} />
        </span>
      </div>
    </Link>
  );
}

/**
 * Page numbers with a previous and a next.
 *
 * Built on this project's own primitives rather than the shadcn pagination the
 * shape came from: that one needs lucide-react, radix-ui,
 * class-variance-authority, tw-animate-css and a `cn` helper, plus a second
 * token set (--primary, --accent, --ring, --destructive-foreground) beside the
 * NDI one. This repo has three dependencies in total and hand-authored icon
 * paths. Six packages and a parallel design system for one control on one page
 * is the wrong trade; the shape is the part worth having.
 *
 * The window keeps the first page, the last, and the current with a neighbour
 * either side, collapsing the gaps to an ellipsis. Two pages never sees it, but
 * the archive is the one list on this site that grows on its own.
 */
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

export function NewsIndex({ stories, notices }: { stories: NewsItem[]; notices: ResourceNews[] }) {
  const [page, setPage] = useState(1);

  const byDate = <T extends { publishedAt: string }>(list: T[]) =>
    [...list].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  const ranked = byDate(stories);
  const [lead, ...restStories] = ranked;
  const topReads = ranked
    .filter((item) => item.popularRank !== undefined)
    .sort((a, b) => a.popularRank! - b.popularRank!)
    .slice(0, 3);

  /* Everything except the lead, newest first. The top reads stay in the archive
     too — leaving them out would put holes in a chronology. */
  const archive: Entry[] = byDate([
    ...restStories.map((item) => ({ kind: "story" as const, item, publishedAt: item.publishedAt })),
    ...notices.map((item) => ({ kind: "notice" as const, item, publishedAt: item.publishedAt })),
  ]).map(({ kind, item }) => ({ kind, item }) as Entry);

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
                <TopRead key={item.id} item={item} />
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
          {shown.map((entry) => (
            <ArchiveCard key={entry.item.id} entry={entry} />
          ))}
        </div>

        <Pagination page={current} pages={pages} onPage={setPage} />
      </Reveal>
    </>
  );
}
