/** The two ways content carries files: extra images, and documents to download. */
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
