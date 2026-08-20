/**
 * Media coverage.
 *
 * Every entry links off-site, so `href` is the outlet's URL and nothing else.
 * There is no detail route and there should not be: the article belongs to
 * whoever published it, and a local page restating someone else's reporting
 * would be both redundant and presumptuous.
 */
import type { MediaCoverage as PayloadMediaCoverage } from "@/payload-types";
import type { PressItem } from "@/content/types";
import { getPayloadClient } from "@/payload/lib/client";
import { categoryName, isoDate, nonEmpty, toMedia } from "./common";
import { LISTING_DEPTH, LISTING_LIMIT, published, withSlug } from "./queries";

/** The fields `toPressItem` reads. See the note on `NewsDoc`. */
export type MediaCoverageDoc = Pick<
  PayloadMediaCoverage,
  "id" | "slug" | "title" | "url" | "outlet" | "excerpt" | "category" | "publishedAt"
> &
  Partial<PayloadMediaCoverage>;

export function toPressItem(doc: MediaCoverageDoc & { slug: string }): PressItem {
  return {
    id: String(doc.id),
    slug: doc.slug,
    category: categoryName(doc.category, "Coverage"),
    title: doc.title,
    publishedAt: isoDate(doc.publishedAt),
    href: doc.url,
    excerpt: doc.excerpt,
    image: toMedia(doc.image, doc.title),
    outlet: doc.outlet,
    coverageType: nonEmpty(doc.coverageType),
    language: nonEmpty(doc.language),
  };
}

export async function queryPress(): Promise<PressItem[]> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "media-coverage",
    where: published(),
    sort: "-publishedAt",
    limit: LISTING_LIMIT,
    depth: LISTING_DEPTH,
    select: {
      slug: true,
      title: true,
      url: true,
      outlet: true,
      excerpt: true,
      category: true,
      publishedAt: true,
      image: true,
      coverageType: true,
      language: true,
    },
  });
  return withSlug(docs).map(toPressItem);
}
