/**
 * Keeps the statically rendered site in step with the CMS.
 *
 * The public pages are prerendered — that is the whole reason the site is fast,
 * and it is worth preserving rather than trading away for a database query on
 * every request. The consequence is that publishing something has to tell
 * Next.js which pages are now stale, and that is what these hooks do.
 *
 * `revalidatePath` is used rather than `revalidateTag` deliberately. Tagging
 * would mean wrapping every Payload query in a cache primitive so the tags had
 * something to attach to; paths need nothing, because the unit being invalidated
 * — a prerendered route — is the unit Next.js already has. The mapping from a
 * collection to the routes that render it is small, explicit and in one place
 * below, which is easier to keep correct than a scattering of tag strings.
 *
 * Draft saves do not revalidate. A draft cannot appear on the public site, so
 * rebuilding a page because someone typed a sentence into one would be pure
 * waste — and an editor working through a long article saves many times.
 */
import { revalidatePath } from "next/cache";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from "payload";

/**
 * A route to invalidate.
 *
 * `type` is required by `revalidatePath` whenever the path contains a dynamic
 * segment, and omitting it silently invalidates nothing — so the two forms are
 * modelled separately rather than left to a caller to remember.
 */
export type RevalidationTarget =
  | { readonly path: string }
  | { readonly path: string; readonly type: "page" | "layout" };

/**
 * Fires the invalidation, tolerating the contexts where it cannot run.
 *
 * `revalidatePath` requires a Next.js request scope. Payload's hooks run inside
 * one when the change came from the admin panel or the REST API, which is the
 * case that matters — but the same hooks also run from the seed script and the
 * integration tests, where there is no such scope and the call throws. Those
 * runs have no page cache to invalidate, so swallowing the error is correct
 * rather than merely convenient.
 */
function invalidate(targets: readonly RevalidationTarget[], label: string): void {
  for (const target of targets) {
    try {
      if ("type" in target) {
        revalidatePath(target.path, target.type);
      } else {
        revalidatePath(target.path);
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        const reason = error instanceof Error ? error.message : String(error);
        console.warn(`[payload] could not revalidate ${target.path} for ${label}: ${reason}`);
      }
      return;
    }
  }
}

/**
 * True when a change could alter what the public site shows.
 *
 * Both sides have to be considered: publishing (draft → published) and
 * unpublishing (published → draft) both change the public site, and only a
 * draft edited while still a draft does not. Collections without drafts have no
 * `_status` at all and always count.
 */
function affectsPublicSite(doc: unknown, previousDoc: unknown): boolean {
  const status = statusOf(doc);
  if (status === undefined) return true;
  return status === "published" || statusOf(previousDoc) === "published";
}

function statusOf(doc: unknown): string | undefined {
  if (typeof doc !== "object" || doc === null) return undefined;
  const status = (doc as { _status?: unknown })._status;
  return typeof status === "string" ? status : undefined;
}

export interface RevalidateOptions {
  /** Routes that always change when a document in this collection changes. */
  readonly paths: readonly RevalidationTarget[];
  /**
   * The document's own detail route, as a pattern.
   *
   * Passed as a pattern with `type: 'page'` rather than an interpolated slug so
   * that renaming a slug invalidates both the old URL and the new one. Getting
   * that wrong leaves the previous URL serving the article under its old
   * address indefinitely.
   */
  readonly detailRoute?: string;
}

/** `afterChange`, for a collection whose documents appear on the public site. */
export function revalidateAfterChange(options: RevalidateOptions): CollectionAfterChangeHook {
  return ({ collection, doc, previousDoc }) => {
    if (affectsPublicSite(doc, previousDoc)) {
      invalidate(targetsFor(options), collection.slug);
    }
    return doc;
  };
}

/** `afterDelete`. A deleted document always changes the public site. */
export function revalidateAfterDelete(options: RevalidateOptions): CollectionAfterDeleteHook {
  return ({ collection, doc }) => {
    invalidate(targetsFor(options), collection.slug);
    return doc;
  };
}

/** `afterChange`, for a global. Globals have no per-document route. */
export function revalidateGlobalAfterChange(
  paths: readonly RevalidationTarget[],
): GlobalAfterChangeHook {
  return ({ doc, global }) => {
    invalidate(paths, global.slug);
    return doc;
  };
}

function targetsFor(options: RevalidateOptions): RevalidationTarget[] {
  const targets: RevalidationTarget[] = [...options.paths];
  if (options.detailRoute) {
    targets.push({ path: options.detailRoute, type: "page" });
  }
  return targets;
}

/* ---- The routes each collection feeds --------------------------- */

/**
 * The homepage carries the three most recent news stories, so it is stale
 * whenever the newsroom changes. Nothing else on it is CMS-managed.
 */
const HOME: RevalidationTarget = { path: "/" };

export const NEWS_ROUTES: RevalidateOptions = {
  paths: [HOME, { path: "/resources/news" }, { path: "/resources" }],
  detailRoute: "/resources/news/[slug]",
};

export const WEBINAR_ROUTES: RevalidateOptions = {
  paths: [{ path: "/resources/webinars" }, { path: "/resources" }],
};

export const INSIGHT_ROUTES: RevalidateOptions = {
  paths: [{ path: "/resources/insights" }, { path: "/resources" }],
  detailRoute: "/resources/insights/[slug]",
};

export const GLOSSARY_ROUTES: RevalidateOptions = {
  paths: [{ path: "/glossary" }],
};

export const FAQ_ROUTES: RevalidateOptions = {
  paths: [{ path: "/faqs" }],
};

export const TEAM_ROUTES: RevalidateOptions = {
  paths: [{ path: "/company" }],
};

export const JOB_ROUTES: RevalidateOptions = {
  paths: [{ path: "/careers" }],
  detailRoute: "/careers/[slug]",
};

export const MEDIA_COVERAGE_ROUTES: RevalidateOptions = {
  paths: [{ path: "/media-coverage" }],
};

/**
 * A category rename shows up wherever its label is printed, which is every
 * listing and every detail page that displays a chip. Renames are rare enough
 * that invalidating broadly is the right trade against tracking which documents
 * referenced which category.
 */
export const CATEGORY_ROUTES: RevalidateOptions = {
  paths: [
    HOME,
    { path: "/resources" },
    { path: "/resources/news" },
    { path: "/resources/news/[slug]", type: "page" },
    { path: "/resources/webinars" },
    { path: "/resources/insights" },
    { path: "/resources/insights/[slug]", type: "page" },
    { path: "/media-coverage" },
    { path: "/faqs" },
    { path: "/glossary" },
  ],
};

/** The upcoming-event card appears on the webinars page and the resources index. */
export const UPCOMING_EVENT_ROUTES: readonly RevalidationTarget[] = [
  { path: "/resources/webinars" },
  { path: "/resources" },
];
