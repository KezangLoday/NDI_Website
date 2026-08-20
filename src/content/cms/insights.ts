/**
 * Insights & Publications.
 *
 * The tabs on the index page used to be a hard-coded union of three values.
 * They are now derived from the categories that actually have something
 * published under them, which is what makes adding a fourth an editorial act
 * rather than a deployment.
 */
import type { Insight as PayloadInsight } from "@/payload-types";
import type { CategoryFacet, Insight, InsightAuthor } from "@/content/types";
import { getPayloadClient } from "@/payload/lib/client";
import {
  categoryName,
  categorySlug,
  isoDate,
  nonEmpty,
  toAttachment,
  toAttachments,
  toMedia,
  toSeo,
} from "./common";
import { DETAIL_DEPTH, LISTING_DEPTH, LISTING_LIMIT, published, withSlug } from "./queries";

/** The fields `toInsight` reads. See the note on `NewsDoc`. */
export type InsightDoc = Pick<
  PayloadInsight,
  "id" | "slug" | "title" | "description" | "category" | "kind" | "publishedAt"
> &
  Partial<PayloadInsight>;

export function toInsight(doc: InsightDoc & { slug: string }): Insight {
  const image = toMedia(doc.image, doc.title);
  return {
    id: String(doc.id),
    slug: doc.slug,
    category: categoryName(doc.category, "Publication"),
    categorySlug: categorySlug(doc.category, "other"),
    kind: doc.kind,
    title: doc.title,
    description: doc.description,
    publishedAt: isoDate(doc.publishedAt),
    image,
    document: toAttachment(doc.document, `${doc.title} (${doc.kind})`),
    readingMinutes: doc.readingMinutes ?? undefined,
    authors: toAuthors(doc.authors),
    body: doc.body ?? undefined,
    canonicalUrl: nonEmpty(doc.canonicalUrl),
    attachments: toAttachments(doc.attachments),
    seo: toSeo(doc, { title: doc.title, description: doc.description, image }),
  };
}

function toAuthors(rows: PayloadInsight["authors"]): InsightAuthor[] {
  if (!rows) return [];
  return rows.map((row, index) => ({
    id: row.id ?? String(index),
    name: row.name,
    affiliation: nonEmpty(row.affiliation),
  }));
}

export async function queryInsights(): Promise<Insight[]> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "insights",
    where: published(),
    sort: "-publishedAt",
    limit: LISTING_LIMIT,
    depth: LISTING_DEPTH,
    select: {
      slug: true,
      title: true,
      description: true,
      category: true,
      kind: true,
      publishedAt: true,
      image: true,
      document: true,
      readingMinutes: true,
      authors: true,
      canonicalUrl: true,
      meta: true,
    },
  });
  return withSlug(docs).map(toInsight);
}

export async function queryInsightBySlug(slug: string): Promise<Insight | undefined> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "insights",
    where: published({ slug: { equals: slug } }),
    limit: 1,
    depth: DETAIL_DEPTH,
  });
  const doc = withSlug(docs)[0];
  return doc ? toInsight(doc) : undefined;
}

export async function queryInsightSlugs(): Promise<string[]> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "insights",
    where: published(),
    limit: LISTING_LIMIT,
    depth: 0,
    select: { slug: true },
  });
  return withSlug(docs).map((doc) => doc.slug);
}

/**
 * The filter tabs, counted from what is published.
 *
 * Derived from the insights already in hand rather than from a second query
 * against `categories`: an empty tab is a dead end for a reader, and the count
 * beside each label is something the page shows anyway.
 */
export function insightFacets(insights: Insight[]): CategoryFacet[] {
  const counts = new Map<string, CategoryFacet>();

  for (const insight of insights) {
    const existing = counts.get(insight.categorySlug);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(insight.categorySlug, {
        id: insight.categorySlug,
        slug: insight.categorySlug,
        label: insight.category,
        count: 1,
      });
    }
  }

  return [...counts.values()].sort((a, b) => a.label.localeCompare(b.label));
}
