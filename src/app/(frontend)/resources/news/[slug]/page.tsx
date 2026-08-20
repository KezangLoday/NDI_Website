import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageSection } from "@/components/layout/PageHero";
import { NewsAside } from "@/components/pages/resources/NewsAside";
import { Icon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { ArticleBody, hasRichText } from "@/content/cms/richText";
import { getNews, getNewsBySlug, getNewsSlugs, getPopularNews } from "@/content";
import { formatFileSize, formatNewsDate } from "@/lib/format";
import { mediaUrl } from "@/lib/media";

/** A single story. */

/** Revalidate daily as a floor. */
export const revalidate = 86_400;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getNewsSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) return { title: "Story not found — Bhutan NDI" };
  return {
    title: `${item.seo.title} — Bhutan NDI`,
    description: item.seo.description,
    ...(item.seo.image ? { openGraph: { images: [{ url: mediaUrl(item.seo.image) }] } } : {}),
    ...(item.seo.noIndex ? { robots: { index: false, follow: true } } : {}),
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

          {item.image ? (
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
          ) : null}

          <Reveal delay={0.05} className="mt-10">
            {hasRichText(item.body) && item.body ? (
              <div className="max-w-[66ch]">
                <ArticleBody content={item.body} />
              </div>
            ) : (
              <div className="max-w-[66ch]">
                <p className="text-[15px] leading-[1.65] text-muted [text-wrap:pretty]">
                  The full text of this release was published elsewhere. Everything on this page —
                  the headline, the standfirst, the artwork and the date — is the record held here.
                </p>
                {item.source ? (
                  <a
                    href={item.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ndi-tut mt-5 inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-accent"
                  >
                    {item.source.label}
                    <Icon name={item.source.icon} size={14} strokeWidth={2} />
                  </a>
                ) : null}
              </div>
            )}
          </Reveal>

          {/* The source link, for a story published here in full whose canonical version is still someone else's. */}
          {hasRichText(item.body) && item.source ? (
            <Reveal delay={0.05} className="mt-9 max-w-[66ch]">
              <a
                href={item.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ndi-tut inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-accent"
              >
                {item.source.label}
                <Icon name={item.source.icon} size={14} strokeWidth={2} />
              </a>
            </Reveal>
          ) : null}

          {item.gallery.length ? (
            <Reveal delay={0.05} className="mt-12 max-w-[66ch]">
              <div className="flex flex-col gap-7">
                {item.gallery.map((entry) => (
                  <figure key={entry.id} className="m-0">
                    <div className="ndi-news-shot relative aspect-[16/9] overflow-hidden rounded-2xl border border-grid">
                      <Image
                        src={mediaUrl(entry.image)}
                        alt={entry.image.alt}
                        fill
                        sizes="(max-width: 1000px) 92vw, 800px"
                        className="object-cover"
                      />
                    </div>
                    {entry.caption ? (
                      <figcaption className="mt-2.5 text-[13px] leading-[1.55] text-faint">
                        {entry.caption}
                      </figcaption>
                    ) : null}
                  </figure>
                ))}
              </div>
            </Reveal>
          ) : null}

          {item.attachments.length ? (
            <Reveal delay={0.05} className="mt-12 max-w-[66ch] border-t border-subtle pt-8">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                Documents
              </h2>
              <div className="mt-4 flex flex-col">
                {item.attachments.map((file) => (
                  <a
                    key={file.id}
                    href={file.url}
                    className="ndi-otherjob group flex items-center justify-between gap-4 border-t border-subtle py-3.5"
                  >
                    <span className="font-display text-[14.5px] font-semibold leading-[1.35] tracking-[-0.01em] text-strong">
                      {file.label}
                    </span>
                    <span className="flex-none font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                      {formatFileSize(file.filesize)}
                    </span>
                  </a>
                ))}
              </div>
            </Reveal>
          ) : null}

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
