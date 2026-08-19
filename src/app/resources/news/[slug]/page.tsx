import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageSection } from "@/components/layout/PageHero";
import { NewsAside } from "@/components/pages/resources/NewsAside";
import { Icon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { getNews, getNewsBySlug, getPopularNews } from "@/content";
import { formatNewsDate } from "@/lib/format";
import { mediaUrl } from "@/lib/media";

/**
 * A single story.
 *
 * Three quarters article, one quarter rail — the rail sticks, so the rest of
 * the newsroom stays reachable however long the read is.
 *
 * The article sets straight onto the page rather than inside a panel: a card is
 * a thing to pick out of a grid, and a body of running copy is the page's whole
 * purpose here, so framing it only narrows the measure and boxes the reading.
 *
 * Where a story has no body yet the same holds — the note says so in plain copy
 * rather than in a card pretending to be an article. Writing that text would
 * mean inventing claims about real partners. In Phase 2 `body` is Payload
 * richText and the fallback goes.
 */

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const stories = await getNews();
  return stories.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) return { title: "Story not found — Bhutan NDI" };
  return {
    title: `${item.title} — Bhutan NDI`,
    description: item.excerpt,
    openGraph: { images: [{ url: mediaUrl(item.image) }] },
  };
}

export default async function NewsStoryPage({ params }: Params) {
  const { slug } = await params;
  const [item, all, popular] = await Promise.all([
    getNewsBySlug(slug),
    getNews(),
    getPopularNews(),
  ]);

  if (!item) notFound();

  const latest = all
    .filter((entry) => entry.slug !== item.slug)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 5);
  const alsoPopular = popular.filter((entry) => entry.slug !== item.slug).slice(0, 5);

  return (
    <PageSection className="pb-[104px] pt-36">
      <Reveal>
        <Link
          href="/resources/news"
          className="ndi-backlink inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted"
        >
          <Icon name="arrowRight" size={13} strokeWidth={2} className="rotate-180" />
          All news
        </Link>
      </Reveal>

      <div className="mt-8 grid grid-cols-1 gap-14 min-[1001px]:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] min-[1001px]:gap-16">
        <article>
          <Reveal>
            <div className="flex flex-wrap items-center gap-3">
              <span className="ndi-news-chip">{item.category}</span>
              <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-faint">
                {formatNewsDate(item.publishedAt)}
              </span>
            </div>

            <h1 className="mt-5 max-w-[26ch] font-display text-[clamp(30px,3.6vw,44px)] font-semibold leading-[1.1] tracking-[-0.03em] text-strong [text-wrap:balance]">
              {item.headline ?? item.title}
            </h1>

            <p className="mt-6 max-w-[66ch] text-[18px] leading-[1.6] text-body [text-wrap:pretty]">
              {item.excerpt}
            </p>
          </Reveal>

          <Reveal delay={0.05} className="mt-9">
            <div className="ndi-news-shot relative aspect-[16/9] overflow-hidden rounded-2xl border border-grid">
              <Image
                src={mediaUrl(item.image)}
                alt={item.image.alt}
                fill
                priority
                sizes="(max-width: 1000px) 92vw, 800px"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={0.05} className="mt-10">
            {item.body?.length ? (
              <div className="max-w-[66ch]">
                {item.body.map((block, index) =>
                  block.kind === "heading" ? (
                    <h2
                      key={block.text}
                      className="mt-11 font-display text-[21px] font-semibold leading-[1.25] tracking-[-0.02em] text-strong first:mt-0 [text-wrap:balance]"
                    >
                      {block.text}
                    </h2>
                  ) : (
                    <p
                      key={`${index}-${block.text.slice(0, 32)}`}
                      className="mt-5 text-[16.5px] leading-[1.75] text-body first:mt-0 [text-wrap:pretty]"
                    >
                      {block.text}
                      {block.link ? (
                        <>
                          {" "}
                          <a
                            href={block.link.href}
                            target="_blank"
                            rel="noreferrer"
                            className="ndi-inline-link"
                          >
                            {block.link.label}
                          </a>
                        </>
                      ) : null}
                    </p>
                  ),
                )}
              </div>
            ) : (
              <div className="max-w-[66ch]">
                <p className="text-[15px] leading-[1.65] text-muted [text-wrap:pretty]">
                  The article text for this story is held in the CMS and has not been loaded into
                  this build. Everything else on the page — the headline, the standfirst, the
                  artwork and the date — is the real record.
                </p>
                {item.href && item.href !== "#" ? (
                  <a
                    href={item.href}
                    className="ndi-tut mt-5 inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-accent"
                  >
                    {item.ctaLabel}
                    <Icon name={item.ctaIcon} size={14} strokeWidth={2} />
                  </a>
                ) : null}
              </div>
            )}
          </Reveal>

          {/* The article ends and the reader needs somewhere to go. */}
          <Reveal delay={0.05} className="mt-14 max-w-[66ch] border-t border-subtle pt-8">
            <Link
              href="/resources/news"
              className="ndi-backbtn inline-flex h-[46px] items-center gap-2.5 rounded-full border border-grid px-[22px] font-display text-[14.5px] font-semibold text-body"
            >
              <Icon name="arrowRight" size={15} strokeWidth={2} className="rotate-180" />
              Back to all news
            </Link>
          </Reveal>
        </article>

        <Reveal delay={0.05}>
          <NewsAside latest={latest} popular={alsoPopular} />
        </Reveal>
      </div>
    </PageSection>
  );
}
