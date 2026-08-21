/** Insights & Publications: research papers, case studies, reports and writing from the team. */
import type { CollectionConfig } from "payload";

import { anyone, isPR, prEditable, superadminOnly, visibleTo } from "../access";
import { attachmentsField } from "../fields/attachments";
import { validateOptionalExternalUrl } from "../fields/externalUrl";
import { NEWEST_FIRST, publishedAtField } from "../fields/publishing";
import { bodyField } from "../fields/richText";
import { seoFields } from "../fields/seo";
import { slugField } from "../fields/slug";
import { categoryField } from "../fields/taxonomy";
import { INSIGHT_ROUTES, revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

export const Insights = {
  slug: "insights",
  labels: { singular: "Publication", plural: "Insights & Publications" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "kind", "category", "publishedAt"],
    group: "Resources",
    description: "Research, case studies, reports and blogs.",
    listSearchableFields: ["title", "description", "slug"],
    preview: (doc) => (typeof doc.slug === "string" ? `/resources/insights/${doc.slug}` : null),
    /** Nav clutter only — `access.read`/`create`/`update` are the enforcement. */
    hidden: visibleTo(isPR),
  },
  defaultSort: NEWEST_FIRST,
  access: {
    read: anyone,
    create: prEditable,
    update: prEditable,
    delete: superadminOnly,
  },
  hooks: {
    afterChange: [revalidateAfterChange(INSIGHT_ROUTES)],
    afterDelete: [revalidateAfterDelete(INSIGHT_ROUTES)],
  },
  fields: [
    { name: "title", type: "text", required: true },
    slugField({ from: "title", urlPrefix: "/resources/insights" }),
    {
      name: "description",
      type: "textarea",
      required: true,
      admin: {
        description: "The abstract: what the publication argues or reports, in two or three sentences.",
      },
    },
    categoryField({ taxonomy: "insight" }),
    {
      /** The specific form, printed on the card next to the category. */
      name: "kind",
      type: "text",
      label: "Type",
      required: true,
      defaultValue: "Research paper",
      admin: {
        description: "The form it takes, e.g. Research paper, Case study, Field note.",
      },
    },
    publishedAtField(),
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: "Cover image",
      admin: { description: "Shown on the card and at the top of the page. 16:9 crops best." },
    },
    {
      name: "document",
      type: "upload",
      relationTo: "media",
      label: "Publication document",
      admin: {
        description:
          "The paper or report itself, usually a PDF. Offered as a download at the top of the page.",
      },
    },
    {
      name: "readingMinutes",
      type: "number",
      label: "Reading time (minutes)",
      min: 1,
      admin: {
        position: "sidebar",
        description: "Shown beside the date. Roughly 200 words a minute.",
      },
    },
    {
      name: "authors",
      type: "array",
      label: "Authors",
      admin: {
        initCollapsed: true,
        description: "People or organisations credited. Left empty, no byline is shown.",
      },
      labels: { singular: "Author", plural: "Authors" },
      fields: [
        { name: "name", type: "text", required: true },
        {
          name: "affiliation",
          type: "text",
          admin: { description: "Optional, e.g. “Bhutan NDI” or a partner institution." },
        },
      ],
    },
    {
      /** Where the canonical version lives, when it is not here. */
      name: "canonicalUrl",
      type: "text",
      label: "Published elsewhere at",
      validate: validateOptionalExternalUrl,
      admin: {
        description:
          "Optional. Set when the version of record is on a journal or partner site; the page links out to it.",
      },
    },
    bodyField("The publication's text, where it is being published here in full."),
    attachmentsField("Datasets, appendices or supplementary files."),
    seoFields({ descriptionFallback: "abstract" }),
  ],
  timestamps: true,
} satisfies CollectionConfig;
