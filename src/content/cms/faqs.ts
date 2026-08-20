/** FAQs and their audience tabs. */
import type { Category, Faq as PayloadFaq } from "@/payload-types";
import type { FaqAudience, FaqItem } from "@/content/types";
import { getPayloadClient } from "@/payload/lib/client";
import { categorySlug, related, richTextToPlain } from "./common";
import { LISTING_DEPTH, LISTING_LIMIT, published } from "./queries";

export function toFaqItem(doc: PayloadFaq): FaqItem {
  return {
    id: String(doc.id),
    audience: categorySlug(doc.category, "other"),
    question: doc.question,
    answer: doc.answer,
    searchText: richTextToPlain(doc.answer),
  };
}

export async function queryFaqs(): Promise<FaqItem[]> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "faqs",
    where: published(),
    /* Category then order, so each tab reads in the sequence HR chose. */
    sort: ["category", "order"],
    limit: LISTING_LIMIT,
    depth: LISTING_DEPTH,
  });
  return docs.map(toFaqItem);
}

/** The audience tabs. */
export async function queryFaqAudiences(): Promise<FaqAudience[]> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "faqs",
    where: published(),
    limit: LISTING_LIMIT,
    depth: 1,
    select: { category: true },
  });

  const seen = new Map<string, { audience: FaqAudience; order: number }>();
  for (const doc of docs) {
    const category = related<Category>(doc.category);
    /* The tab is keyed by slug, so a category without one cannot be a tab. */
    if (!category?.slug || seen.has(category.slug)) continue;
    seen.set(category.slug, {
      audience: { id: String(category.id), slug: category.slug, label: category.name },
      order: category.order,
    });
  }

  return [...seen.values()]
    .sort((a, b) => a.order - b.order || a.audience.label.localeCompare(b.audience.label))
    .map((entry) => entry.audience);
}
