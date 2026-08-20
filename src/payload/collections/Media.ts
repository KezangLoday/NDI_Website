/**
 * Public site media: artwork, logos, portraits, and the documents attached to
 * published content.
 *
 * Everything in here is readable by anyone, which is correct — it is the
 * material the public website is made of — and is exactly why applicant
 * documents live in a different collection with different rules. Keeping the
 * two apart means no access rule on this collection can ever be the thing that
 * exposes a CV.
 *
 * There is no file-size limit. The requirement is explicit about that, and it
 * is the right call: a limit on a CMS upload is a message to an editor saying
 * "make this smaller yourself", which they will do by picking a worse export
 * setting. The optimisation pipeline is what handles size, and it can do a
 * better job than a person guessing at a JPEG quality slider.
 */
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
    /**
     * Deleting media is not restricted further, but it is worth knowing that
     * Payload does not cascade: a document still pointing at a deleted image
     * renders a broken slot. The listing components all treat a missing image
     * as "no image" rather than assuming one is there.
     */
    delete: hrOrPrEditable,
  },
  upload: {
    staticDir: LOCAL_MEDIA_DIR,
    /**
     * Derivatives, generated once at upload.
     *
     * The widths are the widths the design actually asks for, read off the
     * `sizes` attributes already in the components — a card at 370px, a
     * thumbnail in the news rail, the 800px article image, the 1200px hero.
     * Generating arbitrary round numbers instead would mean the browser always
     * picking a variant slightly too large.
     *
     * None of them declare a format. They inherit it from the main file, which
     * the optimisation pipeline has already normalised to WebP — so adding a
     * size later cannot accidentally leave one variant as a 900KB PNG.
     */
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
    /**
     * What an editor is offered in the file picker.
     *
     * A list rather than the default open door: `allowRestrictedFileTypes`
     * defaults to blocking the executable formats, but an open picker still
     * accepts anything else — and a public media library that will accept an
     * `.html` file is a stored-XSS vector, because the file is served from the
     * site's own origin.
     */
    mimeTypes: [
      "image/*",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ],
    /** Uploading by pasting a URL would let the server be used to fetch
     *  arbitrary internal addresses. Editors upload files they have. */
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
