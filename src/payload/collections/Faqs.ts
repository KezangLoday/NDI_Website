/** FAQs. */
import type { CollectionConfig } from "payload";

import { hrOrPrEditable, publishedOrSignedIn, superadminOnly } from "../access";
import { draftPublish } from "../fields/publishing";
import { proseEditor } from "../fields/richText";
import { categoryField } from "../fields/taxonomy";
import { FAQ_ROUTES, revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

export const Faqs: CollectionConfig = {
  slug: "faqs",
  labels: { singular: "FAQ", plural: "FAQs" },
  admin: {
    useAsTitle: "question",
    defaultColumns: ["question", "category", "order", "_status"],
    group: "Company",
    description: "Questions and answers, grouped by who is asking.",
    listSearchableFields: ["question"],
  },
  defaultSort: ["category", "order"],
  versions: draftPublish,
  access: {
    read: publishedOrSignedIn,
    /** Both editorial roles. */
    create: hrOrPrEditable,
    update: hrOrPrEditable,
    delete: superadminOnly,
  },
  hooks: {
    afterChange: [revalidateAfterChange(FAQ_ROUTES)],
    afterDelete: [revalidateAfterDelete(FAQ_ROUTES)],
  },
  fields: [
    {
      name: "question",
      type: "text",
      required: true,
      admin: {
        description: "As a visitor would ask it, e.g. “What happens if I lose my phone?”",
      },
    },
    {
      name: "answer",
      type: "richText",
      editor: proseEditor(),
      required: true,
      admin: { description: "Answer it directly in the first sentence, then explain." },
    },
    categoryField({
      taxonomy: "faq",
      description: "Which audience this answer is for. Managed under Categories.",
    }),
    {
      name: "order",
      type: "number",
      required: true,
      defaultValue: 0,
      admin: {
        position: "sidebar",
        description:
          "Lower numbers appear first within the category. Put the questions everyone asks at the top.",
      },
    },
  ],
  timestamps: true,
};
