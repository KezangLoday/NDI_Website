"use client";

import Image from "next/image";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader, ViewAllLink } from "@/components/ui/SectionHeader";
import { Icon } from "@/components/ui/icons";
import type { NewsItem } from "@/content/types";
import { formatNewsDate } from "@/lib/format";
import { mediaUrl } from "@/lib/media";
import { useNewsCarousel } from "@/hooks/useCarousels";

const FEATURED_BACKGROUND =
  "radial-gradient(115% 78% at 26% -6%, rgba(111,224,169,0.20) 0%, rgba(90,201,148,0.06) 42%, rgba(90,201,148,0) 68%), " +
  "linear-gradient(162deg, #103440 0%, #101827 64%)";

/** Featured pane plus a selectable list. */
export function NewsFeed({ items }: { items: NewsItem[] }) {
  const { index, select, pause, resume } = useNewsCarousel(items.length);

  return (
    <section
      data-news-section="1"
      className="mx-auto max-w-[1200px] px-8 py-[72px]"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <Reveal>
        <SectionHeader
          eyebrow="— News & updates"
          title="Latest from Bhutan NDI"
          maxWidth={560}
          action={<ViewAllLink href="/resources#news">View all</ViewAllLink>}
        />
      </Reveal>

      <Reveal
        delay={0.05}
        className="mt-10 grid grid-cols-1 items-start gap-7 min-[901px]:grid-cols-[1.06fr_0.94fr]"
      >
        <div
          data-news-featured="1"
          className="relative overflow-hidden rounded-2xl"
          style={{ background: FEATURED_BACKGROUND, boxShadow: "var(--inset-top)" }}
        >
          <div className="relative aspect-[16/10] bg-sunken">
            {items.map((item, i) => (
              <div
                key={item.id}
                className="ndi-news-pane absolute inset-0"
                data-active={i === index ? "true" : "false"}
              >
                {/* A story with no artwork keeps the pane's own gradient rather than showing an empty frame. */}
                {item.image ? (
                  <Image
                    src={mediaUrl(item.image)}
                    alt={item.image.alt}
                    fill
                    sizes="(max-width: 900px) 100vw, 620px"
                    className="object-cover"
                    priority={i === 0}
                  />
                ) : null}
              </div>
            ))}
          </div>

          <div className="relative px-[26px] pb-7 pt-[26px]">
            {items.map((item, i) => (
              <div
                key={item.id}
                className="ndi-news-cap"
                data-active={i === index ? "true" : "false"}
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                  {formatNewsDate(item.publishedAt)}
                </div>
                <h3 className="mb-2 mt-3 font-display text-[26px] font-bold leading-[1.2] tracking-[-0.01em] text-strong">
                  {item.title}
                </h3>
                <p className="text-[15px] leading-[1.6] text-muted">{item.excerpt}</p>
                <a
                  href={item.href}
                  {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="ndi-news-read mt-4 inline-flex items-center gap-[7px] font-display text-sm font-semibold text-accent"
                >
                  Read more
                  <Icon
                    name={item.external ? "arrowUpRight" : "arrowRight"}
                    size={15}
                    strokeWidth={1.9}
                  />
                </a>
              </div>
            ))}
          </div>
        </div>

        <div>
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              className="ndi-news-row relative grid w-full cursor-pointer grid-cols-[1fr_auto] items-center gap-[18px] border-0 border-t border-subtle bg-transparent py-[18px] pl-[18px] pr-1 text-left"
              data-active={i === index ? "true" : "false"}
              aria-pressed={i === index}
              onMouseEnter={() => select(i)}
              onFocus={() => select(i)}
              onClick={() => select(i)}
            >
              <span className="flex min-w-0 flex-col gap-[7px]">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                  {formatNewsDate(item.publishedAt)}
                </span>
                <span className="ndi-news-title font-display text-[17px] font-semibold leading-[1.3] text-body">
                  {item.title}
                </span>
              </span>
              <Icon
                name="arrowRight"
                size={17}
                strokeWidth={1.9}
                className="ndi-news-arrow flex-none text-faint"
              />
              <span
                aria-hidden="true"
                className="ndi-news-bar absolute bottom-0 left-0 top-px w-0.5 bg-accent"
              />
            </button>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
