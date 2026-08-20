import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageSection } from "@/components/layout/PageHero";
import { ArticleCard } from "@/components/pages/resources/ArticleCard";
import { Icon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { ArticleBody, hasRichText } from "@/content/cms/richText";
import { getInsightBySlug, getInsightSlugs, getInsights } from "@/content";
import { formatFileSize, formatNewsDate } from "@/lib/format";
import { mediaUrl } from "@/lib/media";

/**
 * A single publication.
 *
 * One column rather than the newsroom's article-plus-rail: a research paper is
 * read end to end, and a sticky list of other papers beside it competes with
 * the thing the reader came for. What is related goes underneath, after the
 * argument has finished.
 *
 * The category chip used to come from a hard-coded map of three values. It is
 * now whatever the CMS category is called, which is what makes a fourth
 * category an editorial act rather than a deployment.
 */

/**
 * Daily revalidation as a floor; publishing revalidates this route on demand.
 * See the same note on the news detail route.
 */
export const revalidate = 86_400;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getInsightSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const item = await getInsightBySlug(slug);
  if (!item) return { title: "Publication not found — Bhutan NDI" };
  return {
    title: `${item.seo.title} — Bhutan NDI`,
    description: item.seo.description,
    ...(item.seo.image ? { openGraph: { images: [{ url: mediaUrl(item.seo.image) }] } } : {}),
    ...(item.seo.noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function InsightPage({ params }: Params) {
  const { slug } = await params;
  const [item, all] = await Promise.all([getInsightBySlug(slug), getInsights()]);

  if (!item) notFound();

  /* Same category first, then anything else, so "related" means related. */
  const related = all
    .filter((entry) => entry.slug !== item.slug)
    .sort((a, b) => {
      const sameA = a.category === item.category ? 0 : 1;
      const sameB = b.category === item.category ? 0 : 1;
      if (sameA !== sameB) return sameA - sameB;
      return b.publishedAt.localeCompare(a.publishedAt);
    })
    .slice(0, 3);

  return (
    <PageSection className="pb-[104px] pt-36">
      <Reveal>
        <Link
          href="/resources/insights"
          className="ndi-backlink inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted"
        >
          <Icon name="arrowRight" size={13} strokeWidth={2} className="rotate-180" />
          All publications
        </Link>
      </Reveal>

      <article className="mt-8">
        <Reveal>
          <div className="flex flex-wrap items-center gap-3">
            <span className="ndi-news-chip">{item.category}</span>
            <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-faint">
              {formatNewsDate(item.publishedAt)}
            </span>
            <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-faint">
              {item.kind}
            </span>
            {/* Reading time is optional: a 60-page report does not have one, and
                an invented number is worse than none. */}
            {item.readingMinutes ? (
              <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-faint">
                {item.readingMinutes} min read
              </span>
            ) : null}
          </div>

          <h1 className="mt-5 max-w-[24ch] font-display text-[clamp(30px,3.6vw,44px)] font-semibold leading-[1.1] tracking-[-0.03em] text-strong [text-wrap:balance]">
            {item.title}
          </h1>

          <p className="mt-6 max-w-[66ch] text-[18px] leading-[1.6] text-body [text-wrap:pretty]">
            {item.description}
          </p>

          {item.authors.length ? (
            <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.14em] text-faint">
              {item.authors
                .map((author) =>
                  author.affiliation ? `${author.name} · ${author.affiliation}` : author.name,
                )
                .join("  ·  ")}
            </p>
          ) : null}

          {/* The document is often the point of the page, so it goes above the
              summary's fold rather than at the foot with the appendices. */}
          {item.document ? (
            <a
              href={item.document.url}
              className="ndi-backbtn mt-7 inline-flex h-[46px] items-center gap-2.5 rounded-full border border-grid px-[22px] font-display text-[14.5px] font-semibold text-body"
            >
              <Icon name="download" size={15} strokeWidth={2} />
              Download the {item.kind.toLowerCase()}
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                {formatFileSize(item.document.filesize)}
              </span>
            </a>
          ) : null}
        </Reveal>

        {item.image ? (
          <Reveal delay={0.05} className="mt-9">
            <div className="ndi-news-shot relative aspect-[16/9] max-w-[900px] overflow-hidden rounded-2xl border border-grid">
              <Image
                src={mediaUrl(item.image)}
                alt={item.image.alt}
                fill
                priority
                sizes="(max-width: 1000px) 92vw, 900px"
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
            <p className="max-w-[66ch] text-[15px] leading-[1.65] text-muted [text-wrap:pretty]">
              {item.document
                ? "This publication is the document itself — the summary above and the download are the whole page, which is the right shape for a report nobody reads on a phone."
                : "The full text of this publication has not been published here yet."}
            </p>
          )}
        </Reveal>

        {item.attachments.length ? (
          <Reveal delay={0.05} className="mt-12 max-w-[66ch] border-t border-subtle pt-8">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
              Supplementary files
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

        {item.canonicalUrl ? (
          <Reveal delay={0.05} className="mt-8 max-w-[66ch]">
            <a
              href={item.canonicalUrl}
              target="_blank"
              rel="noreferrer"
              className="ndi-tut inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-accent"
            >
              Read the published version
              <Icon name="arrowUpRight" size={14} strokeWidth={2} />
            </a>
          </Reveal>
        ) : null}

        <Reveal delay={0.05} className="mt-14 max-w-[66ch] border-t border-subtle pt-8">
          <Link
            href="/resources/insights"
            className="ndi-backbtn inline-flex h-[46px] items-center gap-2.5 rounded-full border border-grid px-[22px] font-display text-[14.5px] font-semibold text-body"
          >
            <Icon name="arrowRight" size={15} strokeWidth={2} className="rotate-180" />
            Back to all publications
          </Link>
        </Reveal>
      </article>

      {related.length ? (
        <Reveal delay={0.05} className="mt-20">
          <h2 className="font-display text-[22px] font-semibold tracking-[-0.02em] text-strong">
            Related reading
          </h2>
          <div className="mt-7 grid grid-cols-1 gap-5 min-[701px]:grid-cols-2 min-[1101px]:grid-cols-3">
            {related.map((entry) => (
              <ArticleCard
                key={entry.id}
                href={`/resources/insights/${entry.slug}`}
                category={entry.category}
                title={entry.title}
                publishedAt={entry.publishedAt}
                excerpt={entry.description}
                image={entry.image}
              />
            ))}
          </div>
        </Reveal>
      ) : null}
    </PageSection>
  );
}
