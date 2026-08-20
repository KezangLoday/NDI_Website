/** The people on the Company page. */
import type { CollectionConfig } from "payload";

import { hrEditable, publishedOrSignedIn, superadminOnly } from "../access";
import { draftPublish } from "../fields/publishing";
import { TEAM_ROUTES, revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

export const TeamMembers: CollectionConfig = {
  slug: "team-members",
  labels: { singular: "Team member", plural: "Team members" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "role", "tier", "order", "_status"],
    group: "Company",
    description: "Who appears in the team section of the Company page.",
    listSearchableFields: ["name", "role"],
  },
  defaultSort: ["tier", "order", "name"],
  versions: draftPublish,
  access: {
    read: publishedOrSignedIn,
    /** People are HR's record to keep. */
    create: hrEditable,
    update: hrEditable,
    delete: superadminOnly,
  },
  hooks: {
    afterChange: [revalidateAfterChange(TEAM_ROUTES)],
    afterDelete: [revalidateAfterDelete(TEAM_ROUTES)],
  },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "role",
      type: "text",
      required: true,
      admin: { description: "The job title as it should appear, e.g. “Head of Engineering”." },
    },
    {
      name: "tier",
      type: "radio",
      required: true,
      defaultValue: "team",
      index: true,
      options: [
        { value: "leadership", label: "Leadership — larger cards, own grid" },
        { value: "team", label: "Team" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "photo",
      type: "upload",
      relationTo: "media",
      label: "Photograph",
      admin: {
        description:
          "A portrait, square or taller. With none set, the card shows a monogram — which is the intended fallback, not a placeholder to rush.",
      },
    },
    {
      /** Where the crop sits inside the frame. */
      name: "photoPosition",
      type: "text",
      label: "Photo focus",
      admin: {
        position: "sidebar",
        description:
          "Optional. A CSS object-position such as “50% 20%”, to pull the crop up towards the face. Defaults to centre.",
      },
    },
    {
      name: "order",
      type: "number",
      required: true,
      defaultValue: 0,
      admin: {
        position: "sidebar",
        description: "Lower numbers appear first within their tier. Ties fall back to name.",
      },
    },
    {
      name: "department",
      type: "text",
      admin: {
        description: "Not shown on the site yet. Recorded for grouping the team page later.",
      },
    },
    {
      name: "biography",
      type: "textarea",
      admin: {
        description: "Not shown on the site yet. Kept for a future profile page.",
      },
    },
    {
      name: "email",
      type: "email",
      admin: {
        description:
          "Not shown on the site. Publishing individual addresses on a public page invites scraping; the footer's shared inbox is the contact route.",
      },
    },
    {
      name: "socialLinks",
      type: "array",
      label: "Social links",
      admin: {
        initCollapsed: true,
        description: "Not shown on the site yet.",
      },
      labels: { singular: "Link", plural: "Links" },
      fields: [
        {
          name: "platform",
          type: "select",
          required: true,
          options: [
            { value: "linkedin", label: "LinkedIn" },
            { value: "x", label: "X" },
            { value: "github", label: "GitHub" },
            { value: "website", label: "Website" },
          ],
        },
        { name: "url", type: "text", required: true },
      ],
    },
  ],
  timestamps: true,
};
