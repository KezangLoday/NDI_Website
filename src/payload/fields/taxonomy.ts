/** The shared taxonomy: one `categories` collection, partitioned by `taxonomy`. */
import type { Field, OptionObject } from "payload";

export const TAXONOMIES = [
  "news",
  "webinar",
  "insight",
  "faq",
  "media-coverage",
  "glossary",
] as const;

export type Taxonomy = (typeof TAXONOMIES)[number];

export const TAXONOMY_OPTIONS: OptionObject[] = [
  { value: "news", label: "News & Updates" },
  { value: "webinar", label: "Webinars" },
  { value: "insight", label: "Insights & Publications" },
  { value: "faq", label: "FAQs" },
  { value: "media-coverage", label: "Media Coverage" },
  { value: "glossary", label: "Glossary" },
];

export interface CategoryFieldOptions {
  readonly taxonomy: Taxonomy;
  /** Categories are optional on Glossary terms and required everywhere else. */
  readonly required?: boolean;
  readonly label?: string;
  readonly description?: string;
}

/** A relationship to `categories`, pre-filtered to one taxonomy. */
export function categoryField(options: CategoryFieldOptions): Field {
  const { taxonomy, required = true, label = "Category", description } = options;
  return {
    name: "category",
    type: "relationship",
    relationTo: "categories",
    required,
    index: true,
    label,
    filterOptions: () => ({ taxonomy: { equals: taxonomy } }),
    admin: {
      description:
        description ??
        "Managed under Categories. Add one there if the right label does not exist yet.",
    },
  };
}
