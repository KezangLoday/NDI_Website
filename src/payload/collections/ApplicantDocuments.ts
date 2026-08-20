/** Applicant documents: CVs, cover letters, certificates and transcripts. */
import type { CollectionConfig } from "payload";

import { noOne, recruitmentAccess, recruitmentDelete } from "../access";
import { applyOptimizationReport, optimizationFields } from "../fields/optimization";
import { optimizeUploadHook, PRIVATE_STRATEGIES } from "../optimize";
import { APPLICANT_DOCUMENTS_SLUG, LOCAL_APPLICANT_DOCUMENTS_DIR } from "../storage";

/** What an applicant may attach. */
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
    /** Hidden from the sidebar for anyone who is not HR. */
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
    /** No derivatives, no thumbnails, no crop tools. */
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
      /** The name the applicant's own file had. */
      name: "originalFilename",
      type: "text",
      label: "Original file name",
      admin: { readOnly: true, position: "sidebar" },
    },
    optimizationFields(),
  ],
  timestamps: true,
};
