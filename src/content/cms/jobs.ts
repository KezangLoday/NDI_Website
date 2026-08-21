/** Careers. */
import type { Job as PayloadJob } from "@/payload-types";
import type {
  ApplicationWindow,
  DocumentRequirement,
  EmploymentType,
  Job,
  JobSection,
} from "@/content/types";
import { getPayloadClient } from "@/payload/lib/client";
import { DOCUMENT_KINDS } from "@/payload/collections/ApplicantDocuments";
import { applicability } from "@/payload/collections/Jobs";
import { isoDate, nonEmpty, toAttachment, toAttachments, toSeo } from "./common";
import { DETAIL_DEPTH, LISTING_DEPTH, LISTING_LIMIT, published, withSlug } from "./queries";

/** Stored values to display labels. */
const EMPLOYMENT_LABELS: Record<PayloadJob["employmentType"], EmploymentType> = {
  "full-time": "Full time",
  "part-time": "Part time",
  contract: "Contract",
};

const DOCUMENT_LABELS = new Map<string, string>(
  DOCUMENT_KINDS.map((kind) => [kind.value, kind.label]),
);

/** How near a deadline has to be to be worth warning about. */
const CLOSING_SOON_DAYS = 14;

/** The fields `toJob` reads. See the note on `NewsDoc` in `news.ts`. */
export type JobDoc = Pick<
  PayloadJob,
  | "id"
  | "slug"
  | "title"
  | "summary"
  | "about"
  | "department"
  | "level"
  | "location"
  | "employmentType"
  | "slots"
  | "postedAt"
  | "closesAt"
  | "recruitmentStatus"
> &
  Partial<PayloadJob>;

export function toJob(doc: JobDoc & { slug: string }, now: Date = new Date()): Job {
  return {
    id: String(doc.id),
    slug: doc.slug,
    department: doc.department,
    title: doc.title,
    summary: doc.summary,
    location: doc.location,
    employmentType: EMPLOYMENT_LABELS[doc.employmentType],
    slots: doc.slots,
    postedAt: isoDate(doc.postedAt),
    closesAt: isoDate(doc.closesAt),
    level: doc.level,
    about: doc.about,
    sections: toSections(doc.sections),
    torDocument: toAttachment(doc.torDocument, `${doc.title} — terms of reference`),
    attachments: toAttachments(doc.attachments),
    featured: doc.featured === true,
    applications: toApplicationWindow(doc, now),
    seo: toSeo(doc, { title: doc.title, description: doc.summary }),
  };
}

/** The nested arrays flattened into the shape the ToR renderer already takes. */
function toSections(rows: JobDoc["sections"]): JobSection[] {
  if (!rows) return [];
  return rows.flatMap((row) => {
    const items = (row.items ?? [])
      .map((item) => item.text)
      .filter((text): text is string => typeof text === "string" && text.trim().length > 0);
    /* A clause with a heading and no points is an unfinished draft, not a section — rendering it would leave a heading over nothing. */
    if (items.length === 0) return [];
    return [{ heading: row.heading, items }];
  });
}

export function toApplicationWindow(doc: JobDoc, now: Date = new Date()): ApplicationWindow {
  const requiredDocuments = toRequirements(doc.requiredDocuments, true);
  const optionalDocuments = toRequirements(doc.optionalDocuments, false);
  const instructions = nonEmpty(doc.applicationInstructions);

  const openness = applicability(
    { recruitmentStatus: doc.recruitmentStatus, closesAt: doc.closesAt },
    now,
  );

  if (!openness.open) {
    return {
      state: "closed",
      closedReason: CLOSED_REASONS[openness.reason],
      requiredDocuments,
      optionalDocuments,
      instructions,
    };
  }

  const daysRemaining = daysUntil(doc.closesAt, now);
  const closingSoon = daysRemaining !== undefined && daysRemaining <= CLOSING_SOON_DAYS;

  return {
    state: closingSoon ? "closing-soon" : "open",
    daysRemaining,
    requiredDocuments,
    optionalDocuments,
    instructions,
  };
}

const CLOSED_REASONS: Record<"closed" | "expired" | "no-deadline", string> = {
  closed: "Applications for this vacancy are closed.",
  expired: "The deadline for this vacancy has passed.",
  "no-deadline": "This vacancy is not yet accepting applications.",
};

function toRequirements(
  kinds: string[] | null | undefined,
  isRequired: boolean,
): DocumentRequirement[] {
  if (!kinds) return [];
  return kinds.map((kind) => ({
    kind,
    label: DOCUMENT_LABELS.get(kind) ?? kind,
    required: isRequired,
  }));
}

/** Whole days until the deadline, counting the closing day itself. */
function daysUntil(closesAt: string | null | undefined, now: Date): number | undefined {
  if (!closesAt) return undefined;
  const deadline = new Date(closesAt);
  if (Number.isNaN(deadline.getTime())) return undefined;

  const endOfDay = Date.UTC(
    deadline.getUTCFullYear(),
    deadline.getUTCMonth(),
    deadline.getUTCDate(),
    23,
    59,
    59,
    999,
  );
  const remaining = endOfDay - now.getTime();
  return remaining < 0 ? 0 : Math.ceil(remaining / 86_400_000);
}

/** Open vacancies, newest posting first. */
export async function queryJobs(): Promise<Job[]> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "jobs",
    where: published({ recruitmentStatus: { equals: "open" } }),
    sort: "-postedAt",
    limit: LISTING_LIMIT,
    depth: LISTING_DEPTH,
    select: {
      slug: true,
      title: true,
      summary: true,
      department: true,
      level: true,
      location: true,
      employmentType: true,
      slots: true,
      postedAt: true,
      closesAt: true,
      recruitmentStatus: true,
      about: true,
      featured: true,
      requiredDocuments: true,
      optionalDocuments: true,
      applicationInstructions: true,
      meta: true,
    },
  });

  const now = new Date();
  const jobs = withSlug(docs).map((doc) => toJob(doc, now));

  /* A lapsed deadline closes a vacancy without anyone touching it, so the listing filters on the resolved window rather than on the stored status. */
  return jobs
    .filter((job) => job.applications.state !== "closed")
    .sort((a, b) => Number(b.featured) - Number(a.featured) || b.postedAt.localeCompare(a.postedAt));
}

/** One vacancy, whatever its state. */
export async function queryJobBySlug(slug: string): Promise<Job | undefined> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "jobs",
    where: published({ slug: { equals: slug } }),
    limit: 1,
    depth: DETAIL_DEPTH,
  });
  const doc = withSlug(docs)[0];
  return doc ? toJob(doc) : undefined;
}

export async function queryJobSlugs(): Promise<string[]> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "jobs",
    where: published(),
    limit: LISTING_LIMIT,
    depth: 0,
    select: { slug: true },
  });
  return withSlug(docs).map((doc) => doc.slug);
}
