/** Keeps the statically rendered site in step with the CMS. */
import { revalidatePath } from "next/cache";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from "payload";

/** A route to invalidate. */
export type RevalidationTarget =
  | { readonly path: string }
  | { readonly path: string; readonly type: "page" | "layout" };

/** Fires the invalidation, tolerating the contexts where it cannot run. */
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

/** True when a change could alter what the public site shows. */
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
  /** The document's own detail route, as a pattern. */
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

/** The homepage carries the three most recent news stories, so it is stale whenever the newsroom changes. */
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

/** A category rename shows up wherever its label is printed, which is every listing and every detail page that displays a chip. */
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
