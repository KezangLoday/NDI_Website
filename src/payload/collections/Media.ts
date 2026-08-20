/** Public site media: artwork, logos, portraits, and the documents attached to published content. */
import type { CollectionConfig } from "payload";

import { anyone, hrOrPrEditable } from "../access";
import { applyOptimizationReport, optimizationFields } from "../fields/optimization";
import { optimizeUploadHook, PUBLIC_STRATEGIES } from "../optimize";
import { LOCAL_MEDIA_DIR, MEDIA_SLUG } from "../storage";

export const Media: CollectionConfig = {
  slug: MEDIA_SLUG,
  admin: {
    useAsTitle: "alt",
    defaultColumns: ["filename", "alt", "mimeType", "filesize", "updatedAt"],
    group: "Library",
    description:
      "Images and documents used across the site. Images are converted to WebP and resized automatically.",
  },
  access: {
    read: anyone,
    create: hrOrPrEditable,
    update: hrOrPrEditable,
    /** Deleting media is not restricted further, but it is worth knowing that Payload does not cascade: a document still pointing at a deleted image renders a broken slot. */
    delete: hrOrPrEditable,
  },
  upload: {
    staticDir: LOCAL_MEDIA_DIR,
    /** Derivatives, generated once at upload. */
    imageSizes: [
      {
        name: "thumbnail",
        width: 240,
        height: 240,
        fit: "cover",
        withoutEnlargement: true,
      },
      { name: "card", width: 640, withoutEnlargement: true },
      { name: "content", width: 1024, withoutEnlargement: true },
      { name: "hero", width: 1600, withoutEnlargement: true },
    ],
    adminThumbnail: "thumbnail",
    focalPoint: true,
    crop: true,
    /** What an editor is offered in the file picker. */
    mimeTypes: [
      "image/*",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ],
    /** Uploading by pasting a URL would let the server be used to fetch arbitrary internal addresses. */
    pasteURL: false,
  },
  hooks: {
    beforeOperation: [optimizeUploadHook(PUBLIC_STRATEGIES, { integrity: "lossy" })],
    beforeChange: [applyOptimizationReport],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: {
        description:
          "What the image shows, for screen readers and for when it fails to load. Describe it; do not start with \"image of\". Leave it as a single space for purely decorative artwork.",
      },
    },
    {
      name: "credit",
      type: "text",
      admin: {
        position: "sidebar",
        description: "Optional photographer or source, where one has to be shown.",
      },
    },
    optimizationFields(),
  ],
};
