import Image from "next/image";

import { Icon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import type { NewsItem, ResourceNews } from "@/content/types";
import { formatNewsDate } from "@/lib/format";
import { mediaUrl } from "@/lib/media";

/**
 * The full news index.
 *
 * This page used to render the same panel the home page does — one featured
 * story beside four title-only rows and an "all news" link that went nowhere.
 * That is a summary, and a summary is the wrong thing for the page the summary
 * links to. Every story is here, in full, newest first.
 *
 * Two groups, because the material genuinely is two things and pretending
 * otherwise costs more than it saves. Six stories carry artwork, a standfirst
 * and their own call to action; five announcements are a line and a date, and
 * were only ever a line and a date. Rendering the second group in the first
 * group's shape would mean an empty image slot on every one, which is what the
 * old featured card did with its "Artwork to come" box.
 *
 * Rows rather than a card grid. The stories vary in length and importance, a
 * grid of equal boxes flattens that, and a row can give the standfirst its full
 * measure instead of the third of a column a card leaves it.
 */

/** The lead: newest story, given the room to open the page. */
function LeadStory({ item }: { item: NewsItem }) {
  return (
    <a
      href={item.href}
      className="ndi-news-lead group grid grid-cols-1 items-center gap-8 min-[901px]:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] min-[901px]:gap-12"
    >
      <div className="ndi-news-shot relative aspect-[16/9] overflow-hidden rounded-2xl border border-grid">
        <Image
          src={mediaUrl(item.image)}
          /* The title beside this is the link's name; a described photo inside
             the same link would only read it out twice. */
          alt=""
          fill
          sizes="(max-width: 900px) 92vw, 560px"
          className="object-cover"
        />
      </div>

      <div>
        <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-accent">
          {formatNewsDate(item.publishedAt)}
        </div>
        <h2 className="ndi-news-title mt-4 font-display text-[clamp(24px,2.4vw,30px)] font-semibold leading-[1.16] tracking-[-0.02em] text-strong [text-wrap:balance]">
          {item.title}
        </h2>
        <p className="mt-4 max-w-[54ch] text-[15.5px] leading-[1.62] text-muted [text-wrap:pretty]">
          {item.excerpt}
        </p>
        <span className="ndi-tut mt-6 inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-accent">
          {item.ctaLabel}
          <Icon name={item.ctaIcon} size={14} strokeWidth={2} />
        </span>
      </div>
    </a>
  );
}

/** Every other story, at full detail. */
function StoryRow({ item }: { item: NewsItem }) {
  return (
    <a
      href={item.href}
      className="ndi-news-row group grid grid-cols-1 gap-5 border-t border-subtle py-8 min-[701px]:grid-cols-[232px_minmax(0,1fr)] min-[701px]:gap-8"
    >
      <div className="ndi-news-shot relative aspect-[16/9] overflow-hidden rounded-xl border border-grid">
        <Image
          src={mediaUrl(item.image)}
          alt=""
          fill
          sizes="(max-width: 700px) 92vw, 232px"
          className="object-cover"
        />
      </div>

      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
          {formatNewsDate(item.publishedAt)}
        </div>
        <h3 className="ndi-news-title mt-2.5 font-display text-[19px] font-semibold leading-[1.26] tracking-[-0.02em] text-strong [text-wrap:balance]">
          {item.title}
        </h3>
        <p className="mt-2.5 max-w-[62ch] text-[14.5px] leading-[1.62] text-muted [text-wrap:pretty]">
          {item.excerpt}
        </p>
        <span className="ndi-tut mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
          {item.ctaLabel}
          <Icon name={item.ctaIcon} size={13} strokeWidth={2} />
        </span>
      </div>
    </a>
  );
}

/** The announcements: a category, a line and a date, which is all they are. */
function NoticeRow({ item }: { item: ResourceNews }) {
  return (
    <a
      href={item.href}
      className="ndi-news-row group grid grid-cols-1 items-baseline gap-2 border-t border-subtle py-[18px] min-[701px]:grid-cols-[130px_minmax(0,1fr)_auto] min-[701px]:gap-6"
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
        {formatNewsDate(item.publishedAt)}
      </span>
      <span>
        <span className="ndi-news-title font-display text-[16.5px] font-semibold leading-[1.35] tracking-[-0.02em] text-strong">
          {item.title}
        </span>
        {item.excerpt ? (
          <span className="mt-1.5 block max-w-[62ch] text-[14px] leading-[1.6] text-muted">
            {item.excerpt}
          </span>
        ) : null}
      </span>
      <span className="justify-self-start font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted min-[701px]:justify-self-end">
        {item.category}
      </span>
    </a>
  );
}

export function NewsIndex({ stories, notices }: { stories: NewsItem[]; notices: ResourceNews[] }) {
  /* Newest first. The arrays are already in that order, but an index that
     silently depends on how its source happens to be typed out is one content
     edit away from being wrong. */
  const byDate = <T extends { publishedAt: string }>(list: T[]) =>
    [...list].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  const [lead, ...rest] = byDate(stories);
  const dated = byDate(notices);

  return (
    <>
      {lead ? (
        <Reveal>
          <LeadStory item={lead} />
        </Reveal>
      ) : null}

      {rest.length ? (
        <Reveal delay={0.05} className="mt-14">
          {rest.map((item) => (
            <StoryRow key={item.id} item={item} />
          ))}
        </Reveal>
      ) : null}

      {dated.length ? (
        <Reveal delay={0.05} className="mt-20">
          <h2 className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-accent">
            — Announcements &amp; notices
          </h2>
          <div className="mt-6">
            {dated.map((item) => (
              <NoticeRow key={item.id} item={item} />
            ))}
          </div>
        </Reveal>
      ) : null}
    </>
  );
}
