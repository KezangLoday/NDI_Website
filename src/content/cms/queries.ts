/** The shared query vocabulary. */
import type { Where } from "payload";

/**
 * Combines a caller's filters into one `where`.
 *
 * This used to add a published-only constraint. Drafts existed then, and the
 * Local API runs with access control overridden — so the collection's `read`
 * rule could not be relied on to hide them and this was the guard that did.
 *
 * `versions` is now disabled on every collection, so there is no unpublished
 * state left to filter: a save is live. The helper stays because every query
 * calls it, and it is the one place a visibility rule would go if one is ever
 * reintroduced.
 */
export function published(...clauses: (Where | undefined)[]): Where {
  const filters = clauses.filter((clause): clause is Where => clause !== undefined);
  if (filters.length === 0) return {};
  if (filters.length === 1) return filters[0];
  return { and: filters };
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
