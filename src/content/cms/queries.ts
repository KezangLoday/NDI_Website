/** The shared query vocabulary. */
import type { Where } from "payload";

/** Published only. */
export const PUBLISHED: Where = { _status: { equals: "published" } };

/** Combines the published constraint with a caller's own filter. */
export function published(...clauses: (Where | undefined)[]): Where {
  const extra = clauses.filter((clause): clause is Where => clause !== undefined);
  if (extra.length === 0) return PUBLISHED;
  return { and: [PUBLISHED, ...extra] };
}

/** A page's worth of records. */
export const LISTING_LIMIT = 200;

/** `depth` for a listing: resolve categories and images, and stop. */
export const LISTING_DEPTH = 1;

/** `depth` for a detail page. */
export const DETAIL_DEPTH = 2;

/** Drops rows with no slug, and narrows the type as it does. */
export function withSlug<T extends { slug?: string | null }>(docs: T[]): (T & { slug: string })[] {
  return docs.filter((doc): doc is T & { slug: string } =>
    typeof doc.slug === "string" && doc.slug.length > 0,
  );
}
