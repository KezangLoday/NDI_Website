import Image from "next/image";
import Link from "next/link";

import { Icon } from "@/components/ui/icons";
import type { IconName } from "@/components/ui/icons";
import type { Media } from "@/content/types";
import { formatNewsDate } from "@/lib/format";
import { mediaUrl } from "@/lib/media";

export interface ArticleCardProps {
  href: string;
  /** Shown as a chip over the artwork, or as the plate label when there is none. */
  category: string;
  title: string;
  publishedAt: string;
  excerpt?: string;
  image?: Media;
  /** Set for links that leave the site, so the label and icon say so. */
  external?: boolean;
  ctaLabel?: string;
  /** Feature cards run wider and carry more copy; the grid decides, not the card. */
  size?: "regular" | "feature";
}

/**
 * The newsroom card: artwork, category, date, headline, standfirst, read-more.
 *
 * Extracted from the news archive so the insights index and the press page use
 * the same object rather than three near-copies drifting apart. The only thing
 * the caller varies is scale and where the link goes.
 *
 * Stories without artwork fall back to a label plate. A placeholder graphic
 * standing in for a photograph that was never taken says less than the category
 * set large.
 */
export function ArticleCard({
  href,
  category,
  title,
  publishedAt,
  excerpt,
  image,
  external = false,
  ctaLabel = "Read more",
  size = "regular",
}: ArticleCardProps) {
  const feature = size === "feature";
  const Tag = external ? "a" : Link;
  const linkProps = external
    ? { href, target: "_blank", rel: "noreferrer" }
    : { href };
  const cta: IconName = external ? "arrowUpRight" : "arrowRight";

  return (
    <Tag
      {...linkProps}
      data-gov-card="1"
      className="ndi-news-card group flex h-full flex-col overflow-hidden rounded-2xl border border-grid"
    >
      {image ? (
        <div
          className={`ndi-news-shot relative overflow-hidden border-b border-grid ${
            feature ? "aspect-[16/9]" : "aspect-[16/10]"
          }`}
        >
          <Image
            src={mediaUrl(image)}
            alt={image.alt}
            fill
            sizes={
              feature
                ? "(max-width: 700px) 92vw, (max-width: 1100px) 92vw, 580px"
                : "(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 360px"
            }
            className="object-cover"
          />
          <span className="ndi-news-chip absolute left-3.5 top-3.5">{category}</span>
        </div>
      ) : (
        <div className="ndi-news-plate relative flex aspect-[16/10] items-end border-b border-grid p-5">
          <span className="font-display text-[26px] font-semibold leading-[1.1] tracking-[-0.03em] text-strong/70">
            {category}
          </span>
        </div>
      )}

      <div className={`flex flex-1 flex-col ${feature ? "p-6" : "p-5"}`}>
        <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-faint">
          {formatNewsDate(publishedAt)}
        </span>
        <h3
          className={`ndi-news-title mt-2.5 font-display font-semibold leading-[1.3] tracking-[-0.02em] text-strong [text-wrap:balance] ${
            feature ? "text-[21px]" : "text-[16.5px]"
          }`}
        >
          {title}
        </h3>
        {excerpt ? (
          <p
            className={`mt-2.5 leading-[1.6] text-muted [text-wrap:pretty] ${
              feature ? "text-[14.5px]" : "text-[13.5px]"
            }`}
          >
            {excerpt}
          </p>
        ) : null}
        <span className="ndi-tut mt-auto inline-flex items-center gap-2 pt-4 font-mono text-[9.5px] uppercase tracking-[0.16em] text-accent">
          {ctaLabel}
          <Icon name={cta} size={13} strokeWidth={2} />
        </span>
      </div>
    </Tag>
  );
}
