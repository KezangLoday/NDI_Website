/** FAQs. */
import type { CollectionConfig } from "payload";

import { anyone, isPR, prEditable, superadminOnly, visibleTo } from "../access";

import { proseEditor } from "../fields/richText";
import { categoryField } from "../fields/taxonomy";
import { FAQ_ROUTES, revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

export const Faqs: CollectionConfig = {
  slug: "faqs",
  labels: { singular: "FAQ", plural: "FAQs" },
  admin: {
    useAsTitle: "question",
    defaultColumns: ["question", "category", "order"],
    group: "Company",
    description: "Questions and answers, grouped by who is asking.",
    listSearchableFields: ["question"],
    /** Nav clutter only — `access.read`/`create`/`update` are the enforcement. */
    hidden: visibleTo(isPR),
  },
  defaultSort: ["category", "order"],
  access: {
    read: anyone,
    /** Both editorial roles. */
    create: prEditable,
    update: prEditable,
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
