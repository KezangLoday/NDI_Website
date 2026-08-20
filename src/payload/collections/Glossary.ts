/** The glossary. */
import type { CollectionConfig } from "payload";

import { prEditable, publishedOrSignedIn, superadminOnly } from "../access";
import { draftPublish } from "../fields/publishing";
import { proseEditor } from "../fields/richText";
import { slugField } from "../fields/slug";
import { categoryField } from "../fields/taxonomy";
import { GLOSSARY_ROUTES, revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

export const Glossary: CollectionConfig = {
  slug: "glossary",
  labels: { singular: "Glossary term", plural: "Glossary" },
  admin: {
    useAsTitle: "term",
    defaultColumns: ["term", "category", "_status", "updatedAt"],
    group: "Resources",
    description: "Definitions for the vocabulary of decentralised identity.",
    listSearchableFields: ["term", "slug"],
  },
/** Alphabetical, because that is how the page presents it. */
  defaultSort: "term",
  versions: draftPublish,
  access: {
    read: publishedOrSignedIn,
    create: prEditable,
    update: prEditable,
    delete: superadminOnly,
  },
  hooks: {
    afterChange: [revalidateAfterChange(GLOSSARY_ROUTES)],
    afterDelete: [revalidateAfterDelete(GLOSSARY_ROUTES)],
  },
  fields: [
    {
      name: "term",
      type: "text",
      required: true,
      index: true,
      admin: {
        description:
          "The term as it should read, e.g. “Verifiable Credential”. Capitalise it the way the field does.",
      },
    },
    slugField({ from: "term" }),
    {
      name: "definition",
      type: "richText",
      editor: proseEditor(),
      required: true,
      admin: {
        description:
          "Plainly, in one or two sentences, without using the term itself to define it.",
      },
    },
    {
      name: "abbreviation",
      type: "text",
      admin: {
        position: "sidebar",
        description: "Optional, e.g. “VC”. Searchable alongside the term.",
      },
    },
    categoryField({
      taxonomy: "glossary",
      required: false,
      description: "Optional. Groups terms on the page once there are enough to need grouping.",
    }),
    {
      /** Related terms, as a relationship to this same collection. */
      name: "relatedTerms",
      type: "relationship",
      relationTo: "glossary",
      hasMany: true,
      admin: {
        description: "Optional. Other entries a reader of this one should see.",
      },
      filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true),
    },
  ],
  timestamps: true,
};
