/**
 * The publication-date field, and the versions setting that gives a collection
 * its draft/published pair.
 *
 * Draft and published are the only two states this CMS has. Payload implements
 * drafts on top of its versions table, so versions are enabled — but capped
 * hard, because a stack of historical revisions is a thing to maintain and to
 * reason about, and nothing in the requirements asks to roll a page back to how
 * it read in March.
 */
import type { CollectionConfig, Field } from "payload";

/**
 * Two versions per document: the published one and the draft on top of it.
 *
 * That is the minimum Payload needs for "edit a published page without the
 * edits going live", which is the whole point of having drafts. Anything above
 * two would be version history by another name.
 */
export const draftPublish: CollectionConfig["versions"] = {
  drafts: {
    autosave: false,
    /** No scheduled publishing: there is no job runner to action it. */
    schedulePublish: false,
    /**
     * Drafts skip validation; publishing enforces it.
     *
     * A draft is work in progress, and the commonest thing an editor does is
     * save a headline and come back to the body. Validating drafts would make
     * "save what I have so far" impossible for exactly the documents that most
     * need it, while adding nothing: an incomplete draft is never public, and
     * the publish action validates in full.
     */
    validate: false,
  },
  maxPerDoc: 2,
};

/**
 * The date the content is published under.
 *
 * `dayOnly` because every date on the site renders as a calendar day — no time
 * of day is ever shown — and a picker that asks for one invites a value that
 * shifts across a timezone boundary and moves the visible date by a day.
 */
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

/**
 * Default sort for an editorial collection's list view: newest first.
 *
 * Matches what every listing page on the site does, so the admin list and the
 * public page agree on what "the latest" is.
 */
export const NEWEST_FIRST = "-publishedAt";
