/**
 * Media Coverage: reporting about Bhutan NDI, published by other people.
 *
 * Every entry links off-site, and there is no detail route — which is a
 * deliberate decision the existing site already made and this preserves. The
 * article belongs to the outlet that published it; a local page restating
 * someone else's reporting would be redundant, and worse, would look like the
 * programme claiming the coverage as its own. The card says what was written and
 * hands the reader to the source.
 *
 * The consequence for the schema is that `url` is required and validated. It is
 * the only thing the card does.
 */
import type { CollectionConfig } from "payload";

import { prEditable, publishedOrSignedIn, superadminOnly } from "../access";
import { validateExternalUrl } from "../fields/externalUrl";
import { NEWEST_FIRST, draftPublish, publishedAtField } from "../fields/publishing";
import { slugField } from "../fields/slug";
import { categoryField } from "../fields/taxonomy";
import {
  MEDIA_COVERAGE_ROUTES,
  revalidateAfterChange,
  revalidateAfterDelete,
} from "../hooks/revalidate";

export const MediaCoverage: CollectionConfig = {
  slug: "media-coverage",
  labels: { singular: "Media coverage entry", plural: "Media Coverage" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "outlet", "category", "publishedAt", "_status"],
    group: "Company",
    description:
      "Articles, interviews and features published elsewhere. Each entry links straight out to the outlet.",
    listSearchableFields: ["title", "outlet", "excerpt"],
  },
  defaultSort: NEWEST_FIRST,
  versions: draftPublish,
  access: {
    read: publishedOrSignedIn,
    create: prEditable,
    update: prEditable,
    delete: superadminOnly,
  },
  hooks: {
    afterChange: [revalidateAfterChange(MEDIA_COVERAGE_ROUTES)],
    afterDelete: [revalidateAfterDelete(MEDIA_COVERAGE_ROUTES)],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      admin: { description: "The headline as the outlet published it." },
    },
    /**
     * A slug, despite there being no detail route.
     *
     * It costs a column and it means the entry has a stable, readable
     * identifier — for a future "/company/media-coverage/…" page, for an
     * anchor link into the grid, or simply for an editor confirming they are
     * looking at the right record. Unique, so it can be relied on later.
     */
    slugField({ from: "title" }),
    {
      name: "url",
      type: "text",
      label: "Article link",
      required: true,
      validate: validateExternalUrl,
      admin: {
        description:
          "Where the card sends the reader — the outlet's own page for this article. Must start with https://.",
      },
    },
    {
      name: "outlet",
      type: "text",
      required: true,
      index: true,
      admin: {
        description: "Who published it, e.g. Kuensel, BBS, The Bhutanese.",
      },
    },
    {
      name: "excerpt",
      type: "textarea",
      required: true,
      admin: {
        description:
          "A short description of what the piece covers, in your own words. Do not paste the article.",
      },
    },
    categoryField({ taxonomy: "media-coverage" }),
    publishedAtField("Date published"),
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: "Thumbnail",
      admin: {
        description:
          "Shown on the card. Use an image the programme owns or is licensed to use — not the outlet's own photography.",
      },
    },
    {
      name: "coverageType",
      type: "select",
      label: "Format",
      defaultValue: "article",
      options: [
        { value: "article", label: "Article" },
        { value: "interview", label: "Interview" },
        { value: "broadcast", label: "Television or radio" },
        { value: "podcast", label: "Podcast" },
        { value: "report", label: "Report" },
      ],
      admin: {
        position: "sidebar",
        description: "Extra metadata; not currently shown on the card.",
      },
    },
    {
      name: "language",
      type: "text",
      defaultValue: "English",
      admin: {
        position: "sidebar",
        description: "The language the piece was published in.",
      },
    },
  ],
  timestamps: true,
};
