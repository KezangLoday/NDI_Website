/** Webinars: sessions to come, and recordings of the ones that have been. */
import type { CollectionConfig } from "payload";

import { prEditable, publishedOrSignedIn, superadminOnly } from "../access";
import { attachmentsField, galleryField } from "../fields/attachments";
import { validateOptionalExternalUrl } from "../fields/externalUrl";
import { draftPublish } from "../fields/publishing";
import { bodyField } from "../fields/richText";
import { seoFields } from "../fields/seo";
import { slugField } from "../fields/slug";
import { categoryField } from "../fields/taxonomy";
import { WEBINAR_ROUTES, revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

export const Webinars: CollectionConfig = {
  slug: "webinars",
  labels: { singular: "Webinar", plural: "Webinars" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "sessionStatus", "startsAt", "category", "_status"],
    group: "Resources",
    description:
      "Walkthroughs, integration sessions and recorded talks. Set the upcoming session under Globals → Upcoming events.",
    listSearchableFields: ["title", "description", "slug"],
  },
  defaultSort: "-startsAt",
  versions: draftPublish,
  access: {
    read: publishedOrSignedIn,
    create: prEditable,
    update: prEditable,
    delete: superadminOnly,
  },
  hooks: {
    afterChange: [revalidateAfterChange(WEBINAR_ROUTES)],
    afterDelete: [revalidateAfterDelete(WEBINAR_ROUTES)],
  },
  fields: [
    {
      /** Named `sessionStatus` rather than `status` for two reasons. */
      name: "sessionStatus",
      type: "radio",
      required: true,
      defaultValue: "upcoming",
      index: true,
      label: "Session status",
      options: [
        { value: "upcoming", label: "Upcoming — shown as a banner with a registration link" },
        { value: "recorded", label: "Recorded — shown in the grid of recordings" },
      ],
      admin: { position: "sidebar" },
    },
    { name: "title", type: "text", required: true },
    slugField({ from: "title", urlPrefix: "/resources/webinars" }),
    {
      name: "description",
      type: "textarea",
      required: true,
      admin: {
        description: "One or two sentences, shown on the banner and the card.",
      },
    },
    categoryField({ taxonomy: "webinar" }),
    {
      /** The session's start, as a real timestamp. */
      name: "startsAt",
      type: "date",
      label: "Starts",
      required: true,
      index: true,
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayAndTime", displayFormat: "d MMM yyyy, HH:mm" },
        description: "Bhutan time (BTT). Shown on the banner.",
      },
    },
    {
      name: "endsAt",
      type: "date",
      label: "Ends",
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayAndTime", displayFormat: "d MMM yyyy, HH:mm" },
        description: "Optional. Used to work out the session's length.",
      },
    },
    {
      name: "platform",
      type: "text",
      admin: {
        description: "Where it happens — “Zoom”, “Microsoft Teams”, or a physical venue.",
        condition: (data) => data?.sessionStatus !== "recorded",
      },
    },
    {
      name: "speakers",
      type: "array",
      label: "Speakers",
      admin: { initCollapsed: true },
      labels: { singular: "Speaker", plural: "Speakers" },
      fields: [
        { name: "name", type: "text", required: true },
        {
          name: "role",
          type: "text",
          admin: { description: "Title and organisation, e.g. “Lead Engineer, Bhutan NDI”." },
        },
        { name: "photo", type: "upload", relationTo: "media" },
      ],
    },
    {
      name: "registration",
      type: "group",
      label: "Registration",
      admin: {
        description: "How people sign up. Shown as the banner's button.",
        condition: (data) => data?.sessionStatus !== "recorded",
      },
      fields: [
        {
          name: "url",
          type: "text",
          label: "Registration link",
          validate: validateOptionalExternalUrl,
          admin: {
            description:
              "The full address, including https://. With none set, the banner shows the session without a button.",
          },
        },
        {
          name: "label",
          type: "text",
          defaultValue: "Register to attend",
          admin: { description: "The button text." },
        },
        {
          name: "note",
          type: "text",
          admin: {
            description: "Optional. e.g. “Free, places limited to 100.”",
          },
        },
      ],
    },
    {
      name: "recording",
      type: "group",
      label: "Recording",
      admin: {
        description: "Where the recording lives, and how long it runs.",
        condition: (data) => data?.sessionStatus === "recorded",
      },
      fields: [
        {
          name: "url",
          type: "text",
          label: "Recording link",
          validate: validateOptionalExternalUrl,
          admin: { description: "The full address, including https://." },
        },
        {
          name: "durationMinutes",
          type: "number",
          label: "Length (minutes)",
          min: 1,
          admin: { description: "Shown on the card as “Recording · 48 min”." },
        },
      ],
    },
    {
      name: "thumbnail",
      type: "upload",
      relationTo: "media",
      admin: {
        description:
          "Shown on the recording card. With none set, the card falls back to the design's gradient and play icon.",
      },
    },
    bodyField("Optional. A longer description, agenda or write-up, shown on the session's own page."),
    galleryField("Slides or screenshots from the session."),
    attachmentsField("Slide decks, transcripts or handouts."),
    seoFields({ descriptionFallback: "description" }),
  ],
  timestamps: true,
};
