/**
 * Applicant documents: CVs, cover letters, certificates and transcripts.
 *
 * This collection is private. Not "hidden from the menu" private — every route
 * into it is closed to everyone except HR and superadmin, and that includes the
 * one people forget:
 *
 *  - `read` gates the API, and Payload runs the same rule before serving a
 *    *file*, so requesting `/api/applicant-documents/file/cv.pdf` without an
 *    HR session gets a 403 rather than a CV.
 *  - `create` is `noOne`, because applications arrive through the public
 *    submission endpoint, which creates documents with access control
 *    explicitly overridden after it has done its own validation. Nothing else
 *    can write here — an anonymous POST to the REST API is refused outright.
 *  - The S3 adapter writes these objects with a private ACL under their own
 *    prefix, so even a leaked bucket URL returns AccessDenied.
 *  - In development they are written to `.uploads/`, deliberately outside
 *    `public/`, so the dev server cannot serve them either.
 *
 * The one thing this collection does *not* do is optimise aggressively. See
 * `PRIVATE_STRATEGIES`: a certificate is evidence, and evidence is stored as it
 * arrived.
 */
import type { CollectionConfig } from "payload";

import { noOne, recruitmentAccess, recruitmentDelete } from "../access";
import { applyOptimizationReport, optimizationFields } from "../fields/optimization";
import { optimizeUploadHook, PRIVATE_STRATEGIES } from "../optimize";
import { APPLICANT_DOCUMENTS_SLUG, LOCAL_APPLICANT_DOCUMENTS_DIR } from "../storage";

/**
 * What an applicant may attach.
 *
 * PDF first because it is what a CV should be, Word because it is what a CV
 * usually is, and images because a certificate is something people photograph
 * rather than scan. Deliberately no archives: a ZIP cannot be checked, cannot
 * be previewed by the panel reading the application, and is the standard way to
 * smuggle something past a file-type check.
 */
export const APPLICANT_DOCUMENT_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
] as const;

/** The document slots an application currently has, as a first-class list. */
export const DOCUMENT_KINDS = [
  { value: "cv", label: "CV / Résumé" },
  { value: "cover-letter", label: "Cover letter" },
  { value: "class-10", label: "Class X certificate" },
  { value: "class-12", label: "Class XII certificate" },
  { value: "higher-education", label: "Higher education certificate" },
  { value: "experience", label: "Experience certificate" },
  { value: "other-education", label: "Other education document" },
  { value: "other", label: "Other supporting document" },
] as const;

export type DocumentKind = (typeof DOCUMENT_KINDS)[number]["value"];

export const ApplicantDocuments: CollectionConfig = {
  slug: APPLICANT_DOCUMENTS_SLUG,
  labels: { singular: "Applicant document", plural: "Applicant documents" },
  admin: {
    useAsTitle: "filename",
    defaultColumns: ["filename", "kind", "mimeType", "filesize", "createdAt"],
    group: "Recruitment",
    description:
      "Private. Files attached to job applications, reachable only from the application that owns them.",
    /**
     * Hidden from the sidebar for anyone who is not HR — cosmetic, and the
     * access rules above are what actually protect the data, but a PR user
     * should not be shown a door they cannot open.
     *
     * It is hidden as a *list* even for HR: these are read in the context of an
     * application, and a flat list of every CV ever submitted is not a view
     * anyone needs.
     */
    hidden: true,
  },
  access: {
    read: recruitmentAccess,
    /** Only the vetted submission endpoint writes here. */
    create: noOne,
    update: recruitmentAccess,
    delete: recruitmentDelete,
  },
  upload: {
    staticDir: LOCAL_APPLICANT_DOCUMENTS_DIR,
    mimeTypes: [...APPLICANT_DOCUMENT_MIME_TYPES],
    /**
     * No derivatives, no thumbnails, no crop tools.
     *
     * Generating a resized copy of a certificate would mean a second file on
     * disk with the same access story to get right, for a preview nobody asked
     * for. The admin panel shows the filename and a download link, which is
     * what reviewing a document actually involves.
     */
    imageSizes: [],
    crop: false,
    focalPoint: false,
    pasteURL: false,
    /** Public listings must never surface these; there is no size to serve. */
    displayPreview: false,
  },
  hooks: {
    beforeOperation: [optimizeUploadHook(PRIVATE_STRATEGIES, { integrity: "lossless" })],
    beforeChange: [applyOptimizationReport],
  },
  fields: [
    {
      name: "kind",
      type: "select",
      required: true,
      index: true,
      options: [...DOCUMENT_KINDS],
      admin: { description: "Which requirement this file was submitted against." },
    },
    {
      /**
       * The name the applicant's own file had.
       *
       * Payload rewrites the stored filename to keep it safe and unique, which
       * is right, but "Kinley_Dorji_CV.pdf" is how HR recognises a document in
       * a list of eight. Kept as data rather than trusted as a path.
       */
      name: "originalFilename",
      type: "text",
      label: "Original file name",
      admin: { readOnly: true, position: "sidebar" },
    },
    optimizationFields(),
  ],
  timestamps: true,
};
