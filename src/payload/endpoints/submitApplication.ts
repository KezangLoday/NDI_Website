/**
 * The public job-application endpoint.
 *
 * This is the only path by which an unauthenticated request causes a write, so
 * it is the security boundary of the recruitment system and it does the work
 * that boundary implies. In order:
 *
 *   1. The job is loaded and checked — published, open, deadline in the future.
 *      All three, server-side, because a hidden Apply button is not a control.
 *   2. The applicant's fields are validated.
 *   3. Each file's declared type is verified against its actual bytes, and the
 *      set of files is checked against what *this* job requires.
 *   4. Duplicates are detected and either flagged or refused, per the job.
 *   5. Documents are stored privately, then the application is created with a
 *      unique reference — and if that create fails, the documents just written
 *      are cleaned up rather than left orphaned.
 *
 * It is an endpoint rather than a Server Action for one concrete reason: a
 * Server Action body goes through Next's `bodySizeLimit`, which defaults to 1MB
 * and would reject a perfectly ordinary set of scanned certificates. This route
 * streams multipart form data with no such ceiling.
 *
 * The response deliberately carries the reference number, the job title and the
 * submission date, and nothing else. No id, no status, no internal field — an
 * applicant learns what they need to follow up and nothing about how they will
 * be assessed.
 */
import { APIError, type Endpoint, type PayloadRequest, type Where } from "payload";

import type { ApplicantDocument, Job, JobApplication } from "@/payload-types";

/**
 * Document id types, taken from the generated types rather than assumed.
 *
 * Payload's Postgres adapter is configured with serial ids, so these are
 * numbers today — but writing `number` here would silently become wrong if the
 * adapter were switched to UUIDs, and this file would keep compiling while
 * failing at runtime.
 */
type ApplicantDocumentID = ApplicantDocument["id"];
type ApplicationID = JobApplication["id"];

/** The education levels the collection accepts, for narrowing form input. */
type EducationLevel = NonNullable<NonNullable<JobApplication["education"]>["highestLevel"]>;

/** Derived from the collection's own option list, not restated here. */
const EDUCATION_LEVEL_VALUES = new Set<string>(EDUCATION_LEVELS.map((level) => level.value));

function isEducationLevel(value: string): value is EducationLevel {
  return EDUCATION_LEVEL_VALUES.has(value);
}

import { APPLICANT_DOCUMENT_MIME_TYPES, DOCUMENT_KINDS, type DocumentKind } from "../collections/ApplicantDocuments";
import { applicability } from "../collections/Jobs";
import { INITIAL_STATUS } from "../collections/recruitment/pipeline";
import { EDUCATION_LEVELS } from "../collections/recruitment/vocabulary";
import {
  MAX_REFERENCE_ATTEMPTS,
  isUniqueViolation,
  nextReference,
} from "../collections/recruitment/reference";
import { safeDisplayFilename, verifyFileType } from "../lib/fileType";

/** Form field carrying a file, e.g. `document:cv`. */
const DOCUMENT_FIELD_PREFIX = "document:";

const VALID_KINDS = new Set<string>(DOCUMENT_KINDS.map((kind) => kind.value));

function isDocumentKind(value: string): value is DocumentKind {
  return VALID_KINDS.has(value);
}
const VALID_MIME_TYPES = new Set<string>(APPLICANT_DOCUMENT_MIME_TYPES);

const KIND_LABELS = new Map<string, string>(
  DOCUMENT_KINDS.map((kind) => [kind.value, kind.label]),
);

/** The consent wording, stored with each application as the basis for holding it. */
export const CONSENT_STATEMENT =
  "I confirm the details above are accurate, and I consent to Bhutan NDI holding them for this recruitment.";

interface SubmittedDocument {
  readonly kind: DocumentKind;
  readonly filename: string;
  readonly mimeType: string;
  readonly data: Buffer;
}

/** A validation failure the applicant should see, as opposed to a server fault. */
class SubmissionError extends APIError {
  constructor(message: string, status = 400) {
    super(message, status);
  }
}

export const submitApplicationEndpoint: Endpoint = {
  path: "/submit",
  method: "post",
  handler: async (req) => {
    try {
      const result = await handleSubmission(req);
      return Response.json(result, { status: 201 });
    } catch (error) {
      if (error instanceof APIError) {
        return Response.json({ error: error.message }, { status: error.status });
      }
      req.payload.logger.error({ err: error }, "Job application submission failed.");
      return Response.json(
        {
          error:
            "Something went wrong saving your application. Nothing was submitted — please try again.",
        },
        { status: 500 },
      );
    }
  },
};

export interface SubmissionReceipt {
  readonly reference: string;
  readonly jobTitle: string;
  readonly submittedAt: string;
  /** True when an earlier application from this address exists for this job. */
  readonly duplicate: boolean;
}

async function handleSubmission(req: PayloadRequest): Promise<SubmissionReceipt> {
  if (typeof req.formData !== "function") {
    throw new SubmissionError("Send the application as multipart form data.", 415);
  }

  const form = await req.formData();

  /* ---- 1. The job, and whether it is accepting applications ---- */

  const jobId = text(form, "job");
  if (!jobId) throw new SubmissionError("No vacancy was named on this application.");

  const job = await loadJob(req, jobId);
  const openness = applicability(
    {
      status: job._status ?? null,
      recruitmentStatus: job.recruitmentStatus,
      closesAt: job.closesAt,
    },
    new Date(),
  );

  if (!openness.open) {
    throw new SubmissionError(REFUSAL_MESSAGES[openness.reason], 409);
  }

  /* ---- 2. The applicant ---------------------------------------- */

  const applicant = readApplicant(form);

  /* ---- 3. The documents ---------------------------------------- */

  const submitted = await readDocuments(form);
  const required: string[] = job.requiredDocuments ?? [];
  const missing = required.filter((kind) => !submitted.some((doc) => doc.kind === kind));

  if (missing.length > 0) {
    const names = missing.map((kind) => KIND_LABELS.get(kind) ?? kind);
    throw new SubmissionError(
      `This vacancy requires ${formatList(names)}. Attach ${missing.length === 1 ? "it" : "them"} and submit again.`,
    );
  }

  /* ---- 4. Duplicates ------------------------------------------- */

  const existing = await findExistingApplication(req, job.id, applicant.email);
  const allowsResubmission = job.allowResubmission !== false;

  if (existing && !allowsResubmission) {
    throw new SubmissionError(
      `You have already applied for this vacancy. Your application reference is ${existing.reference}. This post does not accept a second submission — contact us if you need to correct something.`,
      409,
    );
  }

  /* ---- 5. Store the documents, then the application ------------ */

  const storedIds: ApplicantDocumentID[] = [];
  try {
    const documents: { kind: DocumentKind; document: ApplicantDocumentID }[] = [];

    for (const doc of submitted) {
      const created = await req.payload.create({
        collection: "applicant-documents",
        data: { kind: doc.kind, originalFilename: doc.filename },
        file: {
          data: doc.data,
          mimetype: doc.mimeType,
          name: doc.filename,
          size: doc.data.byteLength,
        },
        /*
         * The collection's `create` is closed to every caller, including this
         * one. Overriding it here is the point: the checks above are what earn
         * the write, and they have all now passed.
         */
        overrideAccess: true,
        req,
      });
      storedIds.push(created.id);
      documents.push({ kind: doc.kind, document: created.id });
    }

    const submittedAt = new Date().toISOString();
    const application = await createWithReference(req, {
      job: job.id,
      jobTitleSnapshot: job.title,
      applicantName: applicant.fullName,
      status: INITIAL_STATUS,
      submittedAt,
      applicant,
      education: readEducation(form),
      experience: readExperience(form),
      documents,
      duplicateOf: existing ? existing.id : null,
      consent: { given: true, at: submittedAt, statement: CONSENT_STATEMENT },
    });

    return {
      reference: application.reference,
      jobTitle: job.title,
      submittedAt,
      duplicate: existing !== null,
    };
  } catch (error) {
    /*
     * Documents written before the failure would otherwise sit in storage
     * attached to nothing — unreachable through the admin panel, and still
     * personal data the programme is responsible for. They go.
     */
    await Promise.allSettled(
      storedIds.map((id) =>
        req.payload.delete({
          collection: "applicant-documents",
          id,
          overrideAccess: true,
          req,
        }),
      ),
    );
    throw error;
  }
}

const REFUSAL_MESSAGES: Record<"unpublished" | "closed" | "expired" | "no-deadline", string> = {
  unpublished: "That vacancy is not open for applications.",
  closed: "Applications for this vacancy have closed.",
  expired: "The deadline for this vacancy has passed, so applications are no longer accepted.",
  "no-deadline":
    "That vacancy has no application deadline set, so it is not accepting applications yet.",
};

/* ---- Reading the job ------------------------------------------- */

/**
 * Loads the job including its draft status.
 *
 * `overrideAccess` and a direct query rather than `findByID`, because the
 * decision to refuse an unpublished job has to be made here, from the real
 * `_status` — and a request that respected access control would simply not see
 * a draft job at all, which is indistinguishable from a mistyped id.
 */
async function loadJob(req: PayloadRequest, id: string): Promise<Job> {
  const { docs } = await req.payload.find({
    collection: "jobs",
    where: { id: { equals: id } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  });

  const job = docs[0];
  if (!job) throw new SubmissionError("That vacancy could not be found.", 404);
  return job;
}

async function findExistingApplication(
  req: PayloadRequest,
  jobId: Job["id"],
  email: string,
): Promise<{ id: ApplicationID; reference: string } | null> {
  const where: Where = {
    and: [{ job: { equals: jobId } }, { "applicant.email": { equals: email } }],
  };

  const { docs } = await req.payload.find({
    collection: "job-applications",
    where,
    limit: 1,
    depth: 0,
    sort: "-createdAt",
    select: { reference: true },
    overrideAccess: true,
    req,
  });

  const found = docs[0];
  if (!found || typeof found.reference !== "string") return null;
  return { id: found.id, reference: found.reference };
}

/* ---- Creating the application --------------------------------- */

/**
 * Creates the application, retrying if the reference was taken.
 *
 * See `reference.ts` for why the collision is expected rather than prevented.
 * The retry re-reads the highest reference each time, so two racing submissions
 * settle on consecutive numbers rather than fighting over one.
 */
/**
 * The application as this endpoint builds it, before the reference is attached.
 *
 * Derived from the generated `JobApplication` type rather than declared
 * independently, so a field renamed in the collection config becomes a type
 * error here instead of a silently-dropped value.
 */
type NewApplication = Omit<
  JobApplication,
  "id" | "reference" | "createdAt" | "updatedAt" | "sizes" | "statusHistory"
>;

async function createWithReference(
  req: PayloadRequest,
  data: NewApplication,
): Promise<{ id: ApplicationID; reference: string }> {
  let lastError: unknown;

  for (let attempt = 0; attempt < MAX_REFERENCE_ATTEMPTS; attempt += 1) {
    const reference = await nextReference({ payload: req.payload, req });
    try {
      const created = await req.payload.create({
        collection: "job-applications",
        data: { ...data, reference },
        overrideAccess: true,
        req,
      });
      return { id: created.id, reference };
    } catch (error) {
      if (!isUniqueViolation(error)) throw error;
      lastError = error;
    }
  }

  req.payload.logger.error(
    { err: lastError },
    `Could not allocate an application reference after ${MAX_REFERENCE_ATTEMPTS} attempts.`,
  );
  throw new SubmissionError(
    "We could not allocate a reference number for your application. Please try again in a moment.",
    503,
  );
}

/* ---- Reading the form ----------------------------------------- */

function text(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function optionalText(form: FormData, key: string): string | null {
  const value = text(form, key);
  return value.length > 0 ? value : null;
}

function optionalNumber(form: FormData, key: string): number | null {
  const value = text(form, key);
  if (value.length === 0) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function required(form: FormData, key: string, label: string): string {
  const value = text(form, key);
  if (value.length === 0) throw new SubmissionError(`${label} is required.`);
  return value;
}

/**
 * Email validation, kept deliberately loose.
 *
 * A strict pattern rejects valid addresses — the grammar allows far more than
 * people expect — and the cost of a wrong rejection here is an applicant who
 * cannot apply at all. So this checks the shape and leaves proving it
 * deliverable to the moment someone is contacted.
 */
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ApplicantData {
  readonly fullName: string;
  readonly email: string;
  readonly phone: string;
  readonly location: string;
  readonly citizenshipId: string | null;
  readonly address: string | null;
  readonly dateOfBirth: string | null;
  readonly nationality: string | null;
}

function readApplicant(form: FormData): ApplicantData {
  const email = required(form, "email", "An email address").toLowerCase();
  if (!EMAIL_SHAPE.test(email)) {
    throw new SubmissionError("That email address does not look right. Check it and try again.");
  }

  if (text(form, "consent") !== "true") {
    throw new SubmissionError(
      "The application cannot be submitted without your consent to hold these details.",
    );
  }

  return {
    fullName: required(form, "fullName", "Your full name"),
    email,
    phone: required(form, "phone", "A contact number"),
    location: required(form, "location", "Your current location"),
    citizenshipId: optionalText(form, "citizenshipId"),
    address: optionalText(form, "address"),
    dateOfBirth: optionalText(form, "dateOfBirth"),
    nationality: optionalText(form, "nationality"),
  };
}

function readEducation(form: FormData): NonNullable<JobApplication["education"]> {
  return {
    highestLevel: readEducationLevel(form),
    qualification: optionalText(form, "qualification"),
    graduationYear: optionalNumber(form, "graduationYear"),
    classXPercent: optionalNumber(form, "classXPercent"),
    classXIIPercent: optionalNumber(form, "classXIIPercent"),
    degreePercent: optionalNumber(form, "degreePercent"),
  };
}

/**
 * The declared education level, or null.
 *
 * A value the collection does not recognise is discarded rather than rejected:
 * it is a secondary field, and refusing an entire application because a select
 * arrived with an unexpected option would be a poor trade.
 */
function readEducationLevel(form: FormData): EducationLevel | null {
  const value = text(form, "highestLevel");
  return isEducationLevel(value) ? value : null;
}

function readExperience(form: FormData): NonNullable<JobApplication["experience"]> {
  return {
    years: optionalNumber(form, "experienceYears"),
    currentEmployer: optionalText(form, "currentEmployer"),
    portfolioUrl: optionalText(form, "portfolioUrl"),
    statement: optionalText(form, "statement"),
  };
}

/**
 * Reads and verifies every attached file.
 *
 * The MIME type is checked twice over, against different things: the allow-list
 * catches a type nobody asked for, and `verifyFileType` catches a file whose
 * contents are not what its name claims. The second is the one that matters —
 * the first is only as trustworthy as the browser that sent it.
 */
async function readDocuments(form: FormData): Promise<SubmittedDocument[]> {
  const documents: SubmittedDocument[] = [];

  for (const [key, value] of form.entries()) {
    if (!key.startsWith(DOCUMENT_FIELD_PREFIX)) continue;
    if (typeof value === "string") continue;

    const kind = key.slice(DOCUMENT_FIELD_PREFIX.length);
    if (!isDocumentKind(kind)) {
      throw new SubmissionError(`“${kind}” is not a document this application asks for.`);
    }

    const file = value;
    // An empty file input still submits an entry, with zero bytes.
    if (file.size === 0) continue;

    const mimeType = file.type || "application/octet-stream";
    if (!VALID_MIME_TYPES.has(mimeType)) {
      throw new SubmissionError(
        `${file.name} is a ${mimeType || "file of unknown type"}. Attach a PDF, a Word document, or a photograph.`,
      );
    }

    const data = Buffer.from(await file.arrayBuffer());
    const verified = verifyFileType(data, mimeType);
    if (!verified.ok) {
      throw new SubmissionError(`${file.name}: ${verified.reason}`);
    }

    documents.push({
      kind,
      filename: safeDisplayFilename(file.name),
      mimeType,
      data,
    });
  }

  if (documents.length === 0) {
    throw new SubmissionError("An application needs at least one document attached.");
  }

  return documents;
}

/* ---- Small helpers -------------------------------------------- */

/** "a CV", "a CV and a cover letter", "a CV, a cover letter and Class X". */
function formatList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}
