/** The publication-date field, and the versions setting that gives a collection its draft/published pair. */
import type { CollectionConfig, Field } from "payload";

/** Two versions per document: the published one and the draft on top of it. */
export const draftPublish: CollectionConfig["versions"] = {
  drafts: {
    autosave: false,
    /** No scheduled publishing: there is no job runner to action it. */
    schedulePublish: false,
    /** Drafts skip validation; publishing enforces it. */
    validate: false,
  },
  maxPerDoc: 2,
};

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
