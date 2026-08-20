/**
 * The shared taxonomy: one `categories` collection, partitioned by `taxonomy`.
 *
 * Five sections need configurable categories and all five want the same
 * behaviour — a name, a slug, an order, uniqueness, and nothing else. Five
 * collections would have meant five copies of that, five sets of access rules
 * to keep in step, and five sidebar entries. One collection with a required
 * discriminator gives the same editing experience (the relationship fields
 * below filter the options down to the relevant set) with one implementation.
 *
 * The discriminator is a fixed list rather than free text: a category whose
 * taxonomy is misspelt would silently vanish from the section it was meant for,
 * and a select turns that into an impossible state rather than a support
 * ticket.
 */
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

/**
 * A relationship to `categories`, pre-filtered to one taxonomy.
 *
 * `filterOptions` is what makes one shared collection feel like five: the
 * editor of a news story is offered news categories and nothing else. It is
 * also enforced server-side — Payload applies the same filter when validating
 * the incoming value — so it is a constraint and not just a narrower dropdown.
 */
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
