/** News & Updates, from the CMS. */
import type { News as PayloadNews } from "@/payload-types";
import type { NewsItem, NewsSource } from "@/content/types";
import {
  categoryName,
  isoDate,
  nonEmpty,
  toAttachments,
  toGallery,
  toMedia,
  toSeo,
} from "./common";
import { getPayloadClient } from "@/payload/lib/client";
import { DETAIL_DEPTH, LISTING_DEPTH, LISTING_LIMIT, published, withSlug } from "./queries";

/** The fields `toNewsItem` reads. */
export type NewsDoc = Pick<
  PayloadNews,
  "id" | "slug" | "format" | "title" | "excerpt" | "publishedAt" | "category"
> &
  Partial<PayloadNews>;

export function toNewsItem(doc: NewsDoc & { slug: string }): NewsItem {
  const image = toMedia(doc.image, doc.title);
  const external = doc.format === "notice" && nonEmpty(doc.externalUrl) !== undefined;

  return {
    id: String(doc.id),
    slug: doc.slug,
    format: doc.format,
    title: doc.title,
    excerpt: doc.excerpt,
    publishedAt: isoDate(doc.publishedAt),
    category: categoryName(doc.category, "Update"),
    image,
    href: external ? doc.externalUrl! : `/resources/news/${doc.slug}`,
    external,
    headline: nonEmpty(doc.headline),
    body: doc.body ?? undefined,
    gallery: toGallery(doc.gallery),
    attachments: toAttachments(doc.attachments),
    byline: nonEmpty(doc.byline),
    source: toSource(doc.source),
    featured: doc.featured === true,
    popularRank: doc.popularRank ?? undefined,
    seo: toSeo(doc, { title: doc.title, description: doc.excerpt, image }),
  };
}

function toSource(source: PayloadNews["source"]): NewsSource | undefined {
  const url = nonEmpty(source?.url);
  if (!url) return undefined;
  return {
    url,
    label: nonEmpty(source?.label) ?? "Read the full release",
    icon: source?.kind === "video" ? "playCircle" : "arrowRight",
  };
}

/** The whole newsroom, newest first. */
export async function queryNews(): Promise<NewsItem[]> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "news",
    where: published(),
    sort: "-publishedAt",
    limit: LISTING_LIMIT,
    depth: LISTING_DEPTH,
    select: {
      slug: true,
      format: true,
      title: true,
      headline: true,
      excerpt: true,
      publishedAt: true,
      category: true,
      image: true,
      externalUrl: true,
      source: true,
      featured: true,
      popularRank: true,
      meta: true,
    },
  });
  return withSlug(docs).map(toNewsItem);
}

/** One story, with everything its page renders. */
export async function queryNewsBySlug(slug: string): Promise<NewsItem | undefined> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "news",
    where: published({ slug: { equals: slug } }),
    limit: 1,
    depth: DETAIL_DEPTH,
  });
  const doc = withSlug(docs)[0];
  return doc ? toNewsItem(doc) : undefined;
}

/** Slugs for `generateStaticParams`. */
export async function queryNewsSlugs(): Promise<string[]> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "news",
    where: published({
      or: [{ format: { equals: "story" } }, { externalUrl: { exists: false } }],
    }),
    limit: LISTING_LIMIT,
    depth: 0,
    select: { slug: true },
  });
  return withSlug(docs).map((doc) => doc.slug);
}
