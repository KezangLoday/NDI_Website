import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageSection } from "@/components/layout/PageHero";
import { ArticleCard } from "@/components/pages/resources/ArticleCard";
import { Icon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { getInsightBySlug, getInsights } from "@/content";
import type { InsightCategory } from "@/content/types";
import { formatNewsDate } from "@/lib/format";
import { mediaUrl } from "@/lib/media";

/**
 * A single publication.
 *
 * One column rather than the newsroom's article-plus-rail: a research paper is
 * read end to end, and a sticky list of other papers beside it competes with
 * the thing the reader came for. What is related goes underneath, after the
 * argument has finished.
 */

const CATEGORY_LABEL: Record<InsightCategory, string> = {
  research: "Research",
  "case-studies": "Case study",
  blogs: "Blog",
};

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const items = await getInsights();
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const item = await getInsightBySlug(slug);
  if (!item) return { title: "Publication not found — Bhutan NDI" };
  return {
    title: `${item.title} — Bhutan NDI`,
    description: item.description,
    openGraph: { images: [{ url: mediaUrl(item.image) }] },
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
            <span className="ndi-news-chip">{CATEGORY_LABEL[item.category]}</span>
            <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-faint">
              {formatNewsDate(item.publishedAt)}
            </span>
            <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-faint">
              {item.readingMinutes} min read
            </span>
          </div>

          <h1 className="mt-5 max-w-[24ch] font-display text-[clamp(30px,3.6vw,44px)] font-semibold leading-[1.1] tracking-[-0.03em] text-strong [text-wrap:balance]">
            {item.title}
          </h1>

          <p className="mt-6 max-w-[66ch] text-[18px] leading-[1.6] text-body [text-wrap:pretty]">
            {item.description}
          </p>
        </Reveal>

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
            <p className="max-w-[66ch] text-[15px] leading-[1.65] text-muted [text-wrap:pretty]">
              The full text of this publication is held in the CMS and has not been loaded into this
              build.
            </p>
          )}
        </Reveal>

        {item.href && item.href !== "#" ? (
          <Reveal delay={0.05} className="mt-8 max-w-[66ch]">
            <a
              href={item.href}
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
                category={CATEGORY_LABEL[entry.category]}
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
