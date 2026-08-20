/** The shared taxonomy for every section that needs configurable categories. */
import type { CollectionConfig, Where } from "payload";

import { anyone, hrOrPrEditable, superadminOnly } from "../access";
import { slugField, slugify } from "../fields/slug";
import { CATEGORY_ROUTES, revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";
import { TAXONOMY_OPTIONS } from "../fields/taxonomy";

export const Categories: CollectionConfig = {
  slug: "categories",
  labels: { singular: "Category", plural: "Categories" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "taxonomy", "order", "updatedAt"],
    group: "Library",
    description:
      "The labels that group content across the site. Each one belongs to a single section.",
    listSearchableFields: ["name", "slug"],
  },
  /** Grouped by section, then by the editor's chosen order within it. */
  defaultSort: ["taxonomy", "order", "name"],
  /** The guarantee. */
  indexes: [{ fields: ["taxonomy", "slug"], unique: true }],
  access: {
    /** Category names are printed on public pages, so they are public data. */
    read: anyone,
    create: hrOrPrEditable,
    update: hrOrPrEditable,
    /** Deleting is superadmin-only. */
    delete: superadminOnly,
  },
  hooks: {
    beforeValidate: [
      async ({ data, operation, originalDoc, req }) => {
        if (!data) return data;

        const taxonomy = data.taxonomy ?? originalDoc?.taxonomy;
        const name = data.name ?? originalDoc?.name;
        if (typeof taxonomy !== "string" || typeof name !== "string") return data;

        const slug = typeof data.slug === "string" && data.slug.length > 0 ? data.slug : slugify(name);

        const where: Where = {
          and: [{ taxonomy: { equals: taxonomy } }, { slug: { equals: slug } }],
        };
        // On update, the document is allowed to collide with itself.
        if (operation === "update" && originalDoc?.id !== undefined) {
          where.and!.push({ id: { not_equals: originalDoc.id } });
        }

        const existing = await req.payload.find({
          collection: "categories",
          where,
          limit: 1,
          depth: 0,
          /* The check has to see rows the caller may not be allowed to read, or a duplicate would slip past whenever the two categories were visible to different people. */
          overrideAccess: true,
          req,
        });

        if (existing.totalDocs > 0) {
          const match = TAXONOMY_OPTIONS.find((option) => option.value === taxonomy);
          /* `label` is typed loosely enough to be a component or a translation record, so it is narrowed rather than interpolated blindly. */
          const section = typeof match?.label === "string" ? match.label : taxonomy;
          throw new Error(`There is already a ${section} category using the name “${name}”.`);
        }

        return data;
      },
    ],
    afterChange: [revalidateAfterChange(CATEGORY_ROUTES)],
    afterDelete: [revalidateAfterDelete(CATEGORY_ROUTES)],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      index: true,
      admin: {
        description: "The label as it appears on the site, e.g. Announcement, Case study.",
      },
    },
    {
      name: "taxonomy",
      type: "select",
      required: true,
      index: true,
      options: TAXONOMY_OPTIONS,
      admin: {
        position: "sidebar",
        description:
          "Which section this category belongs to. It will only be offered to content in that section.",
      },
    },
    /** Not unique on its own — uniqueness is per taxonomy, via the index above. */
    slugField({ from: "name", unique: false }),
    {
      name: "order",
      type: "number",
      required: true,
      defaultValue: 0,
      admin: {
        position: "sidebar",
        description:
          "Lower numbers appear first in filters and tabs. Ties fall back to alphabetical order.",
      },
    },
    {
      name: "description",
      type: "textarea",
      admin: {
        description: "Optional. Not currently shown on the site; useful context for editors.",
      },
    },
  ],
  timestamps: true,
};
