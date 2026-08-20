/**
 * The shared query vocabulary.
 *
 * Two things every public query in this directory has to get right, expressed
 * once:
 *
 *  - **Only published documents.** The Local API runs with access control
 *    overridden by default — which is what makes it usable at build time — so
 *    the collection's `read` rule is *not* what protects drafts here. This
 *    constraint is. It is the first of the two guards on draft content; the
 *    second is the `read` rule itself, which covers every other way in.
 *
 *  - **Only the fields being rendered.** `select` and `depth` are set per
 *    query rather than left to default. A listing that fetches whole article
 *    bodies to render a card is loading tens of kilobytes of Lexical JSON per
 *    row, and `depth: 2` on a collection with four relationships is a
 *    fan-out of joins nobody asked for.
 */
import type { Where } from "payload";

/**
 * Published only.
 *
 * A document that has never been published exists in the table with
 * `_status: 'draft'`, so this cannot be inferred from the absence of a draft —
 * it has to be asked for.
 */
export const PUBLISHED: Where = { _status: { equals: "published" } };

/** Combines the published constraint with a caller's own filter. */
export function published(...clauses: (Where | undefined)[]): Where {
  const extra = clauses.filter((clause): clause is Where => clause !== undefined);
  if (extra.length === 0) return PUBLISHED;
  return { and: [PUBLISHED, ...extra] };
}

/**
 * A page's worth of records.
 *
 * Listings on this site are small — a few dozen — but "small" is a property of
 * today's data, not of the schema, and an unbounded `find` is a query that gets
 * slower every time an editor publishes. Every listing takes a limit; the
 * default is generous enough that no page is truncated in practice and low
 * enough that a runaway import cannot exhaust memory.
 */
export const LISTING_LIMIT = 200;

/**
 * `depth` for a listing: resolve categories and images, and stop.
 *
 * Depth 1 populates the document's own relationships but not theirs — so a
 * news story arrives with its `category` object and its `image` object, and the
 * category does not drag its own relations along behind it.
 */
export const LISTING_DEPTH = 1;

/**
 * `depth` for a detail page.
 *
 * Two, because a detail page renders things one step further out: the gallery
 * rows and attachment rows are arrays whose `image`/`file` are themselves
 * relationships, which is one level deeper than the array.
 */
export const DETAIL_DEPTH = 2;

/**
 * Drops rows with no slug, and narrows the type as it does.
 *
 * A slug is enforced by `validate`, not by `required` — see `slugField` for why
 * — so the generated types make it optional and the mappers, which build public
 * URLs from it, cannot assume one. A published document without a slug should be
 * impossible; if one ever exists (imported data, a hand-run SQL update) the
 * right answer is to leave it out of a listing rather than to render a link to
 * nowhere or to take a build down.
 *
 * A type predicate rather than an assertion: the check and the narrowing are the
 * same statement, so they cannot drift apart.
 */
export function withSlug<T extends { slug?: string | null }>(docs: T[]): (T & { slug: string })[] {
  return docs.filter((doc): doc is T & { slug: string } =>
    typeof doc.slug === "string" && doc.slug.length > 0,
  );
}
