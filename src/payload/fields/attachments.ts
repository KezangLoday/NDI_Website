/**
 * The two ways content carries files: extra images, and documents to download.
 *
 * Both are arrays rather than a `hasMany` upload field, because both need a
 * label per item. A gallery image needs its own caption — the `alt` on the
 * media document describes the picture, which is a different job from saying
 * what it is doing in this article — and a document needs a link title, since
 * "Download 2026-ar-final-v3.pdf" is not a link anyone should be shown.
 */
import type { Field } from "payload";

export function galleryField(description: string): Field {
  return {
    name: "gallery",
    type: "array",
    label: "Additional images",
    admin: { description, initCollapsed: true },
    labels: { singular: "Image", plural: "Images" },
    fields: [
      {
        name: "image",
        type: "upload",
        relationTo: "media",
        required: true,
      },
      {
        name: "caption",
        type: "text",
        admin: {
          description:
            "Optional. Printed under the image. Leave blank where the picture speaks for itself.",
        },
      },
    ],
  };
}

export function attachmentsField(description: string): Field {
  return {
    name: "attachments",
    type: "array",
    label: "Documents",
    admin: { description, initCollapsed: true },
    labels: { singular: "Document", plural: "Documents" },
    fields: [
      {
        name: "file",
        type: "upload",
        relationTo: "media",
        required: true,
      },
      {
        name: "label",
        type: "text",
        required: true,
        admin: {
          description: "The link text, e.g. “Annual report 2026”. Not the file name.",
        },
      },
    ],
  };
}
