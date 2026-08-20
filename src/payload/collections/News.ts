/**
 * News & Updates.
 *
 * One collection, two shapes, because the newsroom page renders two: a story
 * has artwork, a standfirst and an article behind it; a notice is a dated line
 * announcing a maintenance window or a milestone. They share a category
 * vocabulary, a date, an archive grid and a publishing workflow, which is most
 * of what a collection is — so splitting them would have meant two of
 * everything to keep in step for the sake of four fields.
 *
 * `format` drives which fields the admin shows, and the frontend keeps the two
 * apart at render time exactly as it does today.
 */
import type { CollectionConfig } from "payload";

import { prEditable, publishedOrSignedIn, superadminOnly } from "../access";
import { categoryField } from "../fields/taxonomy";
import { NEWEST_FIRST, draftPublish, publishedAtField } from "../fields/publishing";
import { bodyField } from "../fields/richText";
import { seoFields } from "../fields/seo";
import { slugField } from "../fields/slug";
import { validateOptionalExternalUrl } from "../fields/externalUrl";
import { NEWS_ROUTES, revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";
import { attachmentsField, galleryField } from "../fields/attachments";

export const News: CollectionConfig = {
  slug: "news",
  labels: { singular: "News entry", plural: "News & Updates" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "format", "category", "publishedAt", "_status"],
    group: "Resources",
    description:
      "Announcements, launches and press releases. Stories get their own page; notices are a dated line in the archive.",
    listSearchableFields: ["title", "headline", "excerpt", "slug"],
    /** Stories are what an editor is usually looking for. */
    preview: (doc) => (typeof doc.slug === "string" ? `/resources/news/${doc.slug}` : null),
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
    afterChange: [revalidateAfterChange(NEWS_ROUTES)],
    afterDelete: [revalidateAfterDelete(NEWS_ROUTES)],
  },
  fields: [
    {
      name: "format",
      type: "radio",
      required: true,
      defaultValue: "story",
      index: true,
      options: [
        { value: "story", label: "Story — artwork, standfirst and an article" },
        { value: "notice", label: "Notice — a dated announcement, no artwork" },
      ],
      admin: {
        position: "sidebar",
        description: "Which shape this entry takes in the archive.",
      },
    },
    {
      name: "title",
      type: "text",
      required: true,
      admin: {
        description:
          "The card headline. Keep it short — around eight words. A press-release headline set at card size wraps to five lines and buries everything under it.",
      },
    },
    {
      name: "headline",
      type: "text",
      admin: {
        description:
          "Optional. The full formal headline, used on the story page where there is room. Falls back to the title.",
        condition: (data) => data?.format !== "notice",
      },
    },
    slugField({ from: "title", urlPrefix: "/resources/news" }),
    {
      name: "excerpt",
      type: "textarea",
      required: true,
      admin: {
        description:
          "The standfirst: one or two sentences under the headline, and the summary shown on cards and in search results.",
      },
    },
    categoryField({ taxonomy: "news" }),
    publishedAtField(),
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: "Featured image",
      admin: {
        description: "Shown on the card and at the top of the story. 16:9 crops best.",
        condition: (data) => data?.format !== "notice",
      },
    },
    bodyField(
      "The article itself. Left empty, the page shows the headline, standfirst and artwork alone — which is the right answer for a story whose full text lives elsewhere.",
    ),
    galleryField("Additional images shown after the article."),
    attachmentsField("Press releases, statements or data files offered alongside the story."),
    {
      name: "byline",
      type: "text",
      admin: {
        position: "sidebar",
        description:
          "Optional. An author or issuing office, e.g. “Bhutan NDI Communications”. Left blank, no byline is shown.",
      },
    },
    {
      /**
       * Where a notice sends the reader.
       *
       * Notices are usually pointers — a circular on another site, a partner's
       * announcement — and the design links them straight out. A notice with no
       * external link instead gets its own page, so an announcement that has no
       * home elsewhere still has somewhere to live.
       */
      name: "externalUrl",
      type: "text",
      label: "External link",
      validate: validateOptionalExternalUrl,
      admin: {
        description:
          "Optional. Where the notice links to. Leave blank and the notice gets its own page on this site instead.",
        condition: (data) => data?.format === "notice",
      },
    },
    {
      name: "source",
      type: "group",
      label: "Original source",
      admin: {
        description:
          "Optional. Shown as a link at the foot of a story whose canonical version was published elsewhere.",
        condition: (data) => data?.format !== "notice",
      },
      fields: [
        {
          name: "url",
          type: "text",
          validate: validateOptionalExternalUrl,
          admin: { description: "The full address, including https://." },
        },
        {
          name: "label",
          type: "text",
          defaultValue: "Read the full release",
          admin: { description: "The link text." },
        },
        {
          name: "kind",
          type: "select",
          defaultValue: "article",
          options: [
            { value: "article", label: "Article — arrow icon" },
            { value: "video", label: "Video — play icon" },
          ],
        },
      ],
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      index: true,
      admin: {
        position: "sidebar",
        description:
          "Lead the newsroom with this story. With none set, the newest story leads; with several, the newest of them does.",
        condition: (data) => data?.format !== "notice",
      },
    },
    {
      /**
       * Editorial ranking for the "Popular" rail.
       *
       * Nothing here measures readership, so this is a judgement for the
       * newsroom to make rather than something the code should invent. Stories
       * left unranked simply do not appear in that rail.
       */
      name: "popularRank",
      type: "number",
      label: "Popular rank",
      index: true,
      min: 1,
      admin: {
        position: "sidebar",
        description:
          "Optional. 1 appears first in the “Popular” rail. Leave blank to keep a story out of it.",
      },
    },
    seoFields({ descriptionFallback: "standfirst" }),
  ],
  timestamps: true,
};
