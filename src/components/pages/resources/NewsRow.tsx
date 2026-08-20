import Image from "next/image";
import Link from "next/link";

import type { NewsItem } from "@/content/types";
import { formatNewsDate } from "@/lib/format";
import { mediaUrl } from "@/lib/media";

/**
 * The compact news row, shared by the index's "Top reads" and the story page's
 * Latest/Popular rail so the two cannot drift apart.
 *
 * The thumbnail stretches to the row's height rather than holding a fixed
 * aspect ratio. Matching a 4:3 box to the text only works while the headline
 * wraps to the line count it was tuned for — at two lines the index's 96px
 * shot happened to land exactly on 72px of text, but a third line already put
 * it 10px out, and in the narrower story rail the text ran to twice the
 * picture's height. Letting the grid size the picture keeps the two edges
 * level whatever the headline does.
 *
 * Rounded with its own padding rather than separated by a rule: the row's
 * hover tint fills the whole box, and on a square-cornered full-bleed row that
 * reads as a slab rather than a highlight.
 */
export function NewsRow({ item, thumb = 96 }: { item: NewsItem; thumb?: number }) {
  return (
    <Link
      href={item.href}
      className="ndi-news-row group grid gap-3.5 rounded-xl p-2.5"
      style={{ gridTemplateColumns: `${thumb}px minmax(0,1fr)` }}
    >
      <div className="ndi-news-shot relative h-full min-h-[60px] overflow-hidden rounded-lg border border-grid">
        {/* A row with no artwork keeps its frame and shows the plate tint. At
            84px there is no room for a label, and an empty tinted box reads as
            "no picture" without pretending otherwise. */}
        {item.image ? (
          <Image
            src={mediaUrl(item.image)}
            alt=""
            fill
            sizes={`${thumb}px`}
            className="object-cover"
          />
        ) : (
          <div className="ndi-news-plate absolute inset-0" />
        )}
      </div>
      <div className="min-w-0">
        <h3 className="ndi-news-title font-display text-[14px] font-semibold leading-[1.35] tracking-[-0.01em] text-strong">
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
