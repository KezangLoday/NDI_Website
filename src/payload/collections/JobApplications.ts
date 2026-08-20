/**
 * Job applications — the internal recruitment record.
 *
 * The most sensitive collection in the CMS. Everything in it is either personal
 * data an applicant gave in confidence or an internal assessment of them, so
 * the access model is the opposite of the editorial collections': closed by
 * default, opened only to HR and superadmin, and never to the public under any
 * configuration.
 *
 * `create` is `noOne` on purpose. Applications arrive through
 * `submitApplication`, a Payload endpoint that validates the job is genuinely
 * open, checks the documents against what the job requires, and only then
 * creates the record with access control overridden. Leaving `create` open —
 * even to authenticated users — would mean an anonymous POST to
 * `/api/job-applications` could invent an application against a closed
 * vacancy, skipping every one of those checks.
 *
 * The layout is tabbed rather than one long form, because the requirement is
 * that HR can open an application and understand it. Five tabs in the order a
 * recruiter reads: who they are, what they have studied, what they have done,
 * what they sent, and what we think.
 */
import type { CollectionConfig } from "payload";

import { noOne, recruitmentAccess, recruitmentDelete } from "../access";
import { isSuperadmin, type Role } from "../access/roles";
import { DOCUMENT_KINDS } from "./ApplicantDocuments";
import {
  auditApplicationChange,
  recordStatusChange,
  statusChangeNoteField,
  statusHistoryField,
} from "./recruitment/history";
import { APPLICATION_STATUS_OPTIONS, INITIAL_STATUS } from "./recruitment/pipeline";
import { EDUCATION_LEVELS } from "./recruitment/vocabulary";
import { submitApplicationEndpoint } from "../endpoints/submitApplication";

export const JobApplications: CollectionConfig = {
  slug: "job-applications",
  labels: { singular: "Application", plural: "Applications" },
  admin: {
    useAsTitle: "reference",
    /**
     * The columns a recruiter scans down a list of 124 applications: who, for
     * what, where in the pipeline, whose desk it is on, and when it arrived.
     */
    defaultColumns: ["reference", "applicantName", "job", "status", "assignedTo", "createdAt"],
    group: "Recruitment",
    description:
      "Everything submitted through the site. Private to HR and superadmin — never visible on the public site.",
    listSearchableFields: ["reference", "applicantName", "applicantEmail"],
    /** Applications are read one at a time; a bulk-create button is meaningless. */
    hideAPIURL: true,
  },
  defaultSort: "-createdAt",
  access: {
    read: recruitmentAccess,
    /** Only the submission endpoint, which overrides access after its own checks. */
    create: noOne,
    update: recruitmentAccess,
    delete: recruitmentDelete,
  },
  hooks: {
    beforeChange: [recordStatusChange],
    afterChange: [auditApplicationChange],
  },
  /**
   * `POST /api/job-applications/submit` — the public submission route.
   *
   * A collection endpoint rather than a Next route handler, so it sits inside
   * Payload's own request lifecycle: it gets a `req` with the payload instance,
   * a transaction and a logger already attached, and it lives next to the
   * collection whose rules it is enforcing.
   */
  endpoints: [submitApplicationEndpoint],
  /**
   * The list HR filters most: applications for one job, in one status. A
   * compound index turns that from two index scans and an intersection into one.
   */
  indexes: [{ fields: ["job", "status"] }],
  fields: [
    /* ---- Sidebar: the identifiers and the pipeline ------------- */
    {
      name: "reference",
      type: "text",
      required: true,
      unique: true,
      index: true,
      label: "Reference",
      admin: {
        position: "sidebar",
        readOnly: true,
        description: "Quoted to the applicant. Generated on submission.",
      },
    },
    {
      name: "status",
      type: "select",
      required: true,
      index: true,
      defaultValue: INITIAL_STATUS,
      options: APPLICATION_STATUS_OPTIONS,
      admin: {
        position: "sidebar",
        description: "Where this application has got to. Every change is recorded in the timeline.",
      },
    },
    {
      name: "assignedTo",
      type: "relationship",
      relationTo: "users",
      label: "Assigned to",
      index: true,
      /**
       * Only people who can actually open an application may be assigned one.
       * Without this filter the dropdown would offer PR users, and assigning to
       * one would produce an application nobody is working on that looks
       * handled.
       */
      filterOptions: () => ({ roles: { in: ["hr", "superadmin"] } }),
      admin: {
        position: "sidebar",
        description: "Whose desk this is on. Leave empty for the shared pool.",
      },
    },
    {
      name: "job",
      type: "relationship",
      relationTo: "jobs",
      required: true,
      index: true,
      label: "Applied for",
      admin: {
        position: "sidebar",
        readOnly: true,
        description: "Set on submission and fixed — an application belongs to one vacancy.",
      },
    },
    {
      /**
       * The job title as it stood when the application was made.
       *
       * A vacancy can be retitled, and it can be deleted. Either way, "which
       * post was this person applying for" has to stay answerable, and a
       * relationship alone does not guarantee that.
       */
      name: "jobTitleSnapshot",
      type: "text",
      label: "Job title at submission",
      admin: { position: "sidebar", readOnly: true },
    },
    {
      name: "applicantName",
      type: "text",
      required: true,
      index: true,
      label: "Applicant",
      admin: {
        position: "sidebar",
        readOnly: true,
        description: "Copied from the form so the list and search have something to show.",
      },
    },

    /* ---- Tabs: the application itself -------------------------- */
    {
      type: "tabs",
      tabs: [
        {
          label: "Applicant",
          description: "Who they are and how to reach them.",
          fields: [
            {
              name: "applicant",
              type: "group",
              label: false,
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "fullName", type: "text", required: true, admin: { width: "50%" } },
                    { name: "email", type: "email", required: true, admin: { width: "50%" } },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    {
                      name: "phone",
                      type: "text",
                      required: true,
                      admin: { width: "50%", description: "As given, e.g. +975 17 000 000." },
                    },
                    {
                      name: "citizenshipId",
                      type: "text",
                      label: "Citizenship ID",
                      admin: {
                        width: "50%",
                        description:
                          "The 11-digit CID. Collected because Bhutanese citizenship is an eligibility criterion on these posts.",
                      },
                    },
                  ],
                },
                {
                  name: "location",
                  type: "text",
                  required: true,
                  label: "Current location",
                  admin: { description: "Dzongkhag, or the city they are applying from." },
                },
                {
                  name: "address",
                  type: "textarea",
                  admin: { description: "Optional. Full postal address, where one was given." },
                },
                {
                  name: "dateOfBirth",
                  type: "date",
                  admin: {
                    date: { pickerAppearance: "dayOnly", displayFormat: "d MMM yyyy" },
                    description:
                      "Only collected where a post carries an age criterion. Otherwise left empty.",
                  },
                },
                {
                  name: "nationality",
                  type: "text",
                  admin: { description: "Where citizenship is a stated criterion." },
                },
              ],
            },
          ],
        },
        {
          label: "Education",
          description: "What they have studied, and the certificates to show it.",
          fields: [
            {
              name: "education",
              type: "group",
              label: false,
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "highestLevel",
                      type: "select",
                      options: [...EDUCATION_LEVELS],
                      label: "Highest level",
                      admin: { width: "50%" },
                    },
                    {
                      name: "graduationYear",
                      type: "number",
                      min: 1950,
                      max: 2100,
                      admin: { width: "50%" },
                    },
                  ],
                },
                {
                  name: "qualification",
                  type: "text",
                  label: "Degree and institution",
                  admin: { description: "e.g. BE Computer Science, CST Phuentsholing." },
                },
                {
                  type: "row",
                  fields: [
                    {
                      name: "classXPercent",
                      type: "number",
                      label: "Class X (%)",
                      min: 0,
                      max: 100,
                      admin: { width: "33%" },
                    },
                    {
                      name: "classXIIPercent",
                      type: "number",
                      label: "Class XII (%)",
                      min: 0,
                      max: 100,
                      admin: { width: "33%" },
                    },
                    {
                      name: "degreePercent",
                      type: "number",
                      label: "Degree (%)",
                      min: 0,
                      max: 100,
                      admin: { width: "33%" },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Experience",
          description: "What they have done, and why they want this post.",
          fields: [
            {
              name: "experience",
              type: "group",
              label: false,
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "years",
                      type: "number",
                      label: "Relevant experience (years)",
                      min: 0,
                      max: 60,
                      admin: { width: "50%" },
                    },
                    {
                      name: "currentEmployer",
                      type: "text",
                      admin: { width: "50%" },
                    },
                  ],
                },
                {
                  name: "portfolioUrl",
                  type: "text",
                  label: "Portfolio or published work",
                  admin: { description: "Whatever link they gave. Not validated — treat with care." },
                },
                {
                  name: "statement",
                  type: "textarea",
                  label: "Why this role",
                  admin: { description: "Their own words, as submitted." },
                },
              ],
            },
          ],
        },
        {
          label: "Documents",
          description: "Private files. Downloading one is access-controlled and logged by the server.",
          fields: [
            {
              name: "documents",
              type: "array",
              label: "Submitted documents",
              admin: {
                readOnly: true,
                initCollapsed: false,
                description:
                  "What the applicant attached. Read-only: these are their submission, not a working folder.",
              },
              labels: { singular: "Document", plural: "Documents" },
              fields: [
                {
                  name: "kind",
                  type: "select",
                  required: true,
                  options: [...DOCUMENT_KINDS],
                },
                {
                  name: "document",
                  type: "upload",
                  relationTo: "applicant-documents",
                  required: true,
                },
              ],
            },
            {
              /**
               * Room for HR to add a file of their own — an interview
               * scoresheet, a reference reply — without it being mistaken for
               * something the applicant sent.
               */
              name: "internalDocuments",
              type: "array",
              label: "Documents added by HR",
              admin: {
                initCollapsed: true,
                description: "Internal. Never shown to the applicant.",
              },
              labels: { singular: "Document", plural: "Documents" },
              fields: [
                {
                  name: "document",
                  type: "upload",
                  relationTo: "applicant-documents",
                  required: true,
                },
                { name: "label", type: "text", required: true },
              ],
            },
          ],
        },
        {
          label: "Recruitment",
          description: "Internal only. None of this is ever visible outside the CMS.",
          fields: [
            statusChangeNoteField(),
            statusHistoryField(),
            {
              name: "internalNotes",
              type: "array",
              label: "Internal notes",
              admin: {
                initCollapsed: false,
                description:
                  "Screening, interview and reference notes. Strictly internal — this collection is unreadable to anyone but HR and superadmin, and no public endpoint returns it.",
              },
              labels: { singular: "Note", plural: "Notes" },
              fields: [
                { name: "note", type: "textarea", required: true },
                {
                  name: "author",
                  type: "relationship",
                  relationTo: "users",
                  admin: { readOnly: true },
                  /*
                   * Stamped rather than chosen. A note whose author is a
                   * dropdown is a note whose attribution means nothing.
                   */
                  hooks: {
                    beforeChange: [
                      ({ req, value }) => value ?? req.user?.id ?? null,
                    ],
                  },
                },
                {
                  name: "createdAt",
                  type: "date",
                  admin: {
                    readOnly: true,
                    date: { pickerAppearance: "dayAndTime", displayFormat: "d MMM yyyy, HH:mm" },
                  },
                  hooks: {
                    beforeChange: [({ value }) => value ?? new Date().toISOString()],
                  },
                },
              ],
            },
            {
              name: "interview",
              type: "group",
              label: "Interview",
              admin: { description: "Filled in once an interview is arranged." },
              fields: [
                {
                  name: "scheduledAt",
                  type: "date",
                  admin: {
                    date: { pickerAppearance: "dayAndTime", displayFormat: "d MMM yyyy, HH:mm" },
                  },
                },
                {
                  name: "mode",
                  type: "select",
                  options: [
                    { value: "in-person", label: "In person" },
                    { value: "video", label: "Video call" },
                    { value: "phone", label: "Telephone" },
                  ],
                },
                { name: "panel", type: "text", admin: { description: "Who is interviewing." } },
                { name: "notes", type: "textarea", label: "Interview notes" },
              ],
            },
            {
              name: "assessment",
              type: "group",
              label: "Assessment",
              fields: [
                {
                  name: "score",
                  type: "number",
                  admin: { description: "However the panel scores it. No scale is imposed here." },
                },
                { name: "notes", type: "textarea", label: "Assessment notes" },
              ],
            },
            {
              name: "referenceCheck",
              type: "group",
              label: "Reference check",
              fields: [
                { name: "completed", type: "checkbox", defaultValue: false },
                { name: "notes", type: "textarea" },
              ],
            },
            {
              name: "rejectionReason",
              type: "textarea",
              admin: {
                description:
                  "Why this application did not proceed. Internal — but write it as though the applicant may one day ask.",
                condition: (data) => data?.status === "rejected",
              },
            },
          ],
        },
      ],
    },

    /* ---- Duplicate handling ------------------------------------ */
    {
      name: "duplicateOf",
      type: "relationship",
      relationTo: "job-applications",
      label: "Possible duplicate of",
      admin: {
        position: "sidebar",
        readOnly: true,
        description:
          "Set automatically when the same email applies to the same vacancy twice. Both records are kept — the later one is usually a correction — and it is for HR to decide which to progress.",
      },
    },
    {
      name: "submittedAt",
      type: "date",
      label: "Submitted",
      admin: {
        position: "sidebar",
        readOnly: true,
        date: { pickerAppearance: "dayAndTime", displayFormat: "d MMM yyyy, HH:mm" },
      },
    },
    {
      /**
       * The consent recorded at submission.
       *
       * Kept because it is the lawful basis for holding everything else on this
       * record. Read-only: it is a fact about what the applicant agreed to, not
       * a setting.
       */
      name: "consent",
      type: "group",
      label: "Consent",
      admin: { position: "sidebar", readOnly: true },
      fields: [
        { name: "given", type: "checkbox", defaultValue: false },
        { name: "at", type: "date" },
        {
          name: "statement",
          type: "textarea",
          admin: { description: "The wording the applicant agreed to, as it stood that day." },
        },
      ],
    },
  ],
  timestamps: true,
};

/**
 * Whether a user may reassign applications.
 *
 * HR can pick up work and hand it on; only a superadmin can take something off
 * someone else's desk. Exported for the endpoint and the tests to share.
 */
export function canReassign(user: { id: number | string; roles?: Role[] | null } | null): boolean {
  return isSuperadmin(user);
}
