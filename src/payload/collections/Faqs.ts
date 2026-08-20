/**
 * FAQs.
 *
 * The two audiences the site needs — citizens and integrating organisations —
 * are category records rather than a hard-coded pair, which is what makes a
 * third ("For developers", say) an afternoon's work in the admin panel instead
 * of a deployment. The seed creates the two the requirements name.
 *
 * The page's search deliberately spans both audiences, which is why this is one
 * collection with a facet rather than two collections.
 */
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
    /**
     * Both editorial roles. FAQs straddle the line — the registration and
     * recovery answers are HR-adjacent support content, the integration answers
     * are PR's — and making either role wait on the other to fix a wrong answer
     * would be worse than sharing the collection.
     */
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
