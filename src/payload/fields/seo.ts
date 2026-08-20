/**
 * SEO fields, as one collapsible group.
 *
 * Every field here is optional and every one falls back to the editorial
 * field it shadows — meta title to the title, meta description to the
 * summary, OG image to the featured image. That fallback lives in the frontend
 * mappers rather than in a hook, so an editor who later improves the title also
 * improves the search result without having to remember to clear an override.
 *
 * The character counts in the descriptions are the point at which Google
 * truncates, not a hard limit; they are guidance for the person writing, so
 * they are `admin.description` rather than `maxLength`.
 */
import type { Field } from "payload";

export interface SeoFieldOptions {
  /** Field whose value stands in when `meta.title` is blank. */
  readonly titleFallback?: string;
  /** Field whose value stands in when `meta.description` is blank. */
  readonly descriptionFallback?: string;
}

export function seoFields(options: SeoFieldOptions = {}): Field {
  const { titleFallback = "title", descriptionFallback = "summary" } = options;
  return {
    name: "meta",
    type: "group",
    label: "SEO",
    admin: {
      description:
        "Optional. Anything left blank falls back to the page's own content, which is usually the right answer.",
    },
    fields: [
      {
        name: "title",
        type: "text",
        label: "Meta title",
        admin: {
          description: `Shown in search results and the browser tab. Around 60 characters. Defaults to the ${titleFallback}.`,
        },
      },
      {
        name: "description",
        type: "textarea",
        label: "Meta description",
        admin: {
          description: `The snippet under the search result. Around 155 characters. Defaults to the ${descriptionFallback}.`,
        },
      },
      {
        name: "image",
        type: "upload",
        relationTo: "media",
        label: "Social share image",
        admin: {
          description:
            "Used when the page is shared on social media. 1200×630 works everywhere. Defaults to the featured image.",
        },
      },
      {
        name: "noIndex",
        type: "checkbox",
        label: "Hide from search engines",
        defaultValue: false,
        admin: {
          description:
            "Keeps the page out of Google. The page stays reachable by anyone with the link.",
        },
      },
    ],
  };
}

/** The shape `seoFields` produces, for the frontend mappers to read. */
export interface SeoMeta {
  title?: string | null;
  description?: string | null;
  image?: unknown;
  noIndex?: boolean | null;
}
