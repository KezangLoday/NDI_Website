/**
 * The glossary.
 *
 * Definitions are rich text but the page searches them in the browser, so each
 * term also carries its definition flattened to plain text. That flattening
 * happens once on the server rather than per keystroke in the client.
 */
import type { Glossary as PayloadGlossary } from "@/payload-types";
import type { GlossaryRef, GlossaryTerm } from "@/content/types";
import { getPayloadClient } from "@/payload/lib/client";
import { categoryName, nonEmpty, related, richTextToPlain } from "./common";
import { LISTING_DEPTH, LISTING_LIMIT, published, withSlug } from "./queries";

export function toGlossaryTerm(doc: PayloadGlossary & { slug: string }): GlossaryTerm {
  return {
    id: String(doc.id),
    slug: doc.slug,
    term: doc.term,
    definition: doc.definition,
    searchText: richTextToPlain(doc.definition),
    abbreviation: nonEmpty(doc.abbreviation),
    category: doc.category ? categoryName(doc.category, "") || undefined : undefined,
    relatedTerms: toRefs(doc.relatedTerms),
  };
}

function toRefs(value: PayloadGlossary["relatedTerms"]): GlossaryRef[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    const doc = related(entry);
    /* A cross-reference is rendered as a link, so a term with no slug is not
       one — dropping it beats rendering a link to nowhere. */
    if (!doc?.slug) return [];
    return [{ id: String(doc.id), slug: doc.slug, term: doc.term }];
  });
}

/** Alphabetical, which is how the page's A–Z index reads it. */
export async function queryGlossary(): Promise<GlossaryTerm[]> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "glossary",
    where: published(),
    sort: "term",
    limit: LISTING_LIMIT,
    depth: LISTING_DEPTH,
  });
  return withSlug(docs).map(toGlossaryTerm);
}
