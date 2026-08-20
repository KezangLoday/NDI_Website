/**
 * Job postings, and the configuration that governs applying for them.
 *
 * The job is the central entity in the recruitment system: applications hang
 * off it, HR reads its count to know what is coming in, and it — not the
 * application form — is what decides whether an application may be submitted at
 * all. Three independent conditions have to hold, and all three are checked on
 * the server when a submission arrives:
 *
 *   `_status === 'published'`  ·  `recruitmentStatus === 'open'`  ·  deadline in the future
 *
 * The Apply button being absent from the page is a courtesy, not a control.
 *
 * The terms of reference are a `sections` array rather than a fixed set of
 * "Responsibilities" / "Qualifications" / "Skills" fields. That is a considered
 * choice: a real vacancy notice varies in what it needs — one post needs a
 * Competencies clause, another a Remuneration one, a consultancy needs
 * Deliverables — and a fixed schema would leave HR either padding an irrelevant
 * heading or hiding a needed clause inside another. The default value below
 * pre-fills the headings the requirements name, so the structure is there
 * without being a cage.
 */
import type { CollectionConfig } from "payload";

import { hrEditable, publishedOrSignedIn, superadminOnly } from "../access";
import { attachmentsField } from "../fields/attachments";
import { draftPublish } from "../fields/publishing";
import { seoFields } from "../fields/seo";
import { slugField } from "../fields/slug";
import { JOB_ROUTES, revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";
import { DOCUMENT_KINDS } from "./ApplicantDocuments";

export const EMPLOYMENT_TYPES = [
  { value: "full-time", label: "Full time" },
  { value: "part-time", label: "Part time" },
  { value: "contract", label: "Contract" },
] as const;

export type EmploymentTypeValue = (typeof EMPLOYMENT_TYPES)[number]["value"];

export const Jobs: CollectionConfig = {
  slug: "jobs",
  labels: { singular: "Job posting", plural: "Careers" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "department", "recruitmentStatus", "closesAt", "_status"],
    group: "Recruitment",
    description:
      "Vacancies, their terms of reference, and what each one asks applicants to submit.",
    listSearchableFields: ["title", "department", "summary", "slug"],
    preview: (doc) => (typeof doc.slug === "string" ? `/careers/${doc.slug}` : null),
  },
  defaultSort: "-postedAt",
  versions: draftPublish,
  access: {
    read: publishedOrSignedIn,
    create: hrEditable,
    update: hrEditable,
    delete: superadminOnly,
  },
  hooks: {
    afterChange: [revalidateAfterChange(JOB_ROUTES)],
    afterDelete: [revalidateAfterDelete(JOB_ROUTES)],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Posting",
          description: "What the vacancy is, and the notice a candidate reads.",
          fields: [
            { name: "title", type: "text", required: true, label: "Job title" },
            slugField({ from: "title", urlPrefix: "/careers" }),
            {
              name: "summary",
              type: "textarea",
              required: true,
              admin: {
                description:
                  "One line on the vacancy card. What the role is responsible for, not what the team does.",
              },
            },
            {
              name: "about",
              type: "textarea",
              required: true,
              label: "Opening paragraph",
              admin: {
                description:
                  "The paragraph under the job title. What the person will own, and how the work is measured.",
              },
            },
            {
              name: "sections",
              type: "array",
              label: "Terms of reference",
              required: true,
              minRows: 1,
              admin: {
                description:
                  "The body of the notice. Add, rename or reorder these to match the post.",
                initCollapsed: false,
              },
              labels: { singular: "Clause", plural: "Clauses" },
              defaultValue: [
                { heading: "Duties and responsibilities", items: [] },
                { heading: "Qualifications and eligibility", items: [] },
                { heading: "Skills and competencies", items: [] },
                { heading: "Experience required", items: [] },
                { heading: "What we offer", items: [] },
              ],
              fields: [
                {
                  name: "heading",
                  type: "text",
                  required: true,
                  admin: { description: "e.g. Duties and responsibilities." },
                },
                {
                  name: "items",
                  type: "array",
                  label: "Points",
                  required: true,
                  minRows: 1,
                  labels: { singular: "Point", plural: "Points" },
                  admin: { description: "One statement per point. Full sentences." },
                  fields: [{ name: "text", type: "textarea", required: true }],
                },
              ],
            },
          ],
        },
        {
          label: "Details",
          description: "The facts a candidate checks before reading any further.",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "department",
                  type: "text",
                  required: true,
                  index: true,
                  admin: { width: "50%", description: "e.g. Engineering, Communications." },
                },
                {
                  name: "level",
                  type: "text",
                  required: true,
                  admin: { width: "50%", description: "Seniority, e.g. Senior, Officer, Intern." },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "location",
                  type: "text",
                  required: true,
                  defaultValue: "Thimphu",
                  admin: { width: "50%" },
                },
                {
                  name: "employmentType",
                  type: "select",
                  required: true,
                  defaultValue: "full-time",
                  options: [...EMPLOYMENT_TYPES],
                  admin: { width: "50%" },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "slots",
                  type: "number",
                  required: true,
                  defaultValue: 1,
                  min: 1,
                  label: "Positions",
                  admin: { width: "50%", description: "How many people are being hired." },
                },
                {
                  name: "postedAt",
                  type: "date",
                  required: true,
                  index: true,
                  defaultValue: () => new Date().toISOString(),
                  admin: {
                    width: "50%",
                    date: { pickerAppearance: "dayOnly", displayFormat: "d MMM yyyy" },
                  },
                },
              ],
            },
            {
              name: "torDocument",
              type: "upload",
              relationTo: "media",
              label: "Terms of reference (PDF)",
              admin: {
                description:
                  "The signed notice, offered as a download on the vacancy page. The clauses above are what a candidate reads on screen; this is the document of record.",
              },
            },
            attachmentsField("Any other document the notice refers to — a job description, a pay scale."),
          ],
        },
        {
          label: "Applications",
          description: "Whether applications are open, and what each applicant must submit.",
          fields: [
            {
              name: "recruitmentStatus",
              type: "radio",
              required: true,
              defaultValue: "open",
              index: true,
              options: [
                { value: "open", label: "Open — accepting applications" },
                { value: "closed", label: "Closed — no longer accepting applications" },
              ],
              admin: {
                description:
                  "Independent of publishing. A closed vacancy can stay published so the notice remains readable, but submissions are refused.",
              },
            },
            {
              name: "closesAt",
              type: "date",
              required: true,
              index: true,
              label: "Application deadline",
              admin: {
                date: { pickerAppearance: "dayOnly", displayFormat: "d MMM yyyy" },
                description:
                  "The last day applications are accepted, inclusive. Enforced on the server — reopening a lapsed vacancy means moving this date, not just switching the status back to open.",
              },
            },
            {
              name: "requiredDocuments",
              type: "select",
              hasMany: true,
              required: true,
              defaultValue: ["cv"],
              options: [...DOCUMENT_KINDS],
              admin: {
                description:
                  "An application missing any of these is refused. Ask for what the eligibility clauses actually test — every extra document is a barrier and a data-protection obligation.",
              },
            },
            {
              name: "optionalDocuments",
              type: "select",
              hasMany: true,
              defaultValue: ["cover-letter"],
              options: [...DOCUMENT_KINDS],
              admin: {
                description: "Offered on the form, but an application without them is accepted.",
              },
            },
            {
              name: "allowResubmission",
              type: "checkbox",
              defaultValue: true,
              label: "Allow a candidate to submit again",
              admin: {
                description:
                  "On, a second application from the same email replaces nothing and is flagged as a duplicate for HR to reconcile — which is usually what someone correcting a mistake needs. Off, the second attempt is refused.",
              },
            },
            {
              name: "applicationInstructions",
              type: "textarea",
              admin: {
                description:
                  "Optional. Shown above the form, e.g. what to name files, or who to contact about access needs.",
              },
            },
            {
              /**
               * The count, and the way into the applications for this post.
               *
               * A `join` rather than a computed number: it gives HR the actual
               * list, filterable and sortable, inside the job they are looking
               * at — which is the workflow the requirements describe. The count
               * comes along with it for free, and no denormalised total can
               * drift out of step with reality.
               */
              name: "applications",
              type: "join",
              collection: "job-applications",
              on: "job",
              label: "Applications received",
              defaultSort: "-createdAt",
              admin: {
                description: "Everything submitted for this vacancy, newest first.",
                allowCreate: false,
              },
            },
          ],
        },
        {
          label: "SEO",
          fields: [seoFields({ descriptionFallback: "summary" })],
        },
      ],
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "Highlight this vacancy at the top of the careers page.",
      },
    },
  ],
  timestamps: true,
};

/**
 * Whether a job may accept an application right now.
 *
 * Exported because three callers need to agree on it exactly: the submission
 * endpoint that refuses a late application, the frontend that decides whether
 * to render the form, and the tests. A second implementation of this rule is a
 * second answer to the question.
 */
export interface ApplicabilityInput {
  readonly status: string | null | undefined;
  readonly recruitmentStatus: string | null | undefined;
  readonly closesAt: string | null | undefined;
}

export type Applicability =
  | { readonly open: true }
  | { readonly open: false; readonly reason: "unpublished" | "closed" | "expired" | "no-deadline" };

export function applicability(job: ApplicabilityInput, now: Date = new Date()): Applicability {
  if (job.status !== "published") return { open: false, reason: "unpublished" };
  if (job.recruitmentStatus !== "open") return { open: false, reason: "closed" };
  if (!job.closesAt) return { open: false, reason: "no-deadline" };

  /*
   * The deadline is inclusive and expressed as a calendar day, so it lapses at
   * the end of that day rather than at the moment it was stored. An applicant
   * submitting at 21:00 on the closing date is on time; treating the stored
   * midnight timestamp as the cut-off would have quietly closed the vacancy a
   * day early.
   *
   * UTC throughout, matching how every other date on the site is formatted.
   * Bhutan is UTC+6, so this is in fact six hours of grace rather than a day
   * lost — the forgiving direction to err in.
   */
  const deadline = new Date(job.closesAt);
  if (Number.isNaN(deadline.getTime())) return { open: false, reason: "no-deadline" };
  const endOfDay = Date.UTC(
    deadline.getUTCFullYear(),
    deadline.getUTCMonth(),
    deadline.getUTCDate(),
    23,
    59,
    59,
    999,
  );
  if (now.getTime() > endOfDay) return { open: false, reason: "expired" };

  return { open: true };
}
