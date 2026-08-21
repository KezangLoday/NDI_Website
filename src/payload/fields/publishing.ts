/**
 * The publication-date field, and the default sort for editorial collections.
 *
 * There is no draft/publish workflow: `versions` is disabled everywhere, so a
 * save is immediately live. `publishedAt` is therefore editorial metadata — the
 * date printed on the page and ordered by — not a gate on visibility.
 */
import type { Field } from "payload";

/** Two versions per document: the published one and the draft on top of it. */

/** The date the content is published under. */
export function publishedAtField(label = "Publication date"): Field {
  return {
    name: "publishedAt",
    type: "date",
    label,
    required: true,
    index: true,
    defaultValue: () => new Date().toISOString(),
    admin: {
      position: "sidebar",
      date: { pickerAppearance: "dayOnly", displayFormat: "d MMM yyyy" },
      description: "The date shown on the page and used for ordering.",
    },
  };
}

/** Default sort for an editorial collection's list view: newest first. */
export const NEWEST_FIRST = "-publishedAt";
