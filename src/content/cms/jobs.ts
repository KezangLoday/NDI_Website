/**
 * Careers.
 *
 * The mapper's real work is `toApplicationWindow`: it collapses three
 * independent conditions — published, recruitment status, deadline — into the
 * one thing the page needs to know, and it does so using the same
 * `applicability` function the submission endpoint enforces with. That shared
 * function is the point. A page that decided for itself whether to show the form
 * would eventually disagree with the server that accepts the submission, and the
 * failure mode is an applicant filling in eleven fields and then being refused.
 */
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

/**
 * Stored values to display labels.
 *
 * The collection stores `full-time` because an enum value with a space in it is
 * a nuisance in a query string and a URL; the card has always read "Full time".
 */
const EMPLOYMENT_LABELS: Record<PayloadJob["employmentType"], EmploymentType> = {
  "full-time": "Full time",
  "part-time": "Part time",
  contract: "Contract",
};

const DOCUMENT_LABELS = new Map<string, string>(
  DOCUMENT_KINDS.map((kind) => [kind.value, kind.label]),
);

/**
 * How near a deadline has to be to be worth warning about.
 *
 * Two weeks: long enough that someone can still gather certificates, short
 * enough that the warning means something. A banner that says "closing soon"
 * for two months trains people to ignore it.
 */
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
    /* A clause with a heading and no points is an unfinished draft, not a
       section — rendering it would leave a heading over nothing. */
    if (items.length === 0) return [];
    return [{ heading: row.heading, items }];
  });
}

export function toApplicationWindow(doc: JobDoc, now: Date = new Date()): ApplicationWindow {
  const requiredDocuments = toRequirements(doc.requiredDocuments, true);
  const optionalDocuments = toRequirements(doc.optionalDocuments, false);
  const instructions = nonEmpty(doc.applicationInstructions);

  const openness = applicability(
    {
      status: doc._status ?? null,
      recruitmentStatus: doc.recruitmentStatus,
      closesAt: doc.closesAt,
    },
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

const CLOSED_REASONS: Record<"unpublished" | "closed" | "expired" | "no-deadline", string> = {
  unpublished: "This vacancy is not currently open for applications.",
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

/**
 * Whole days until the deadline, counting the closing day itself.
 *
 * Matches how the endpoint treats the deadline — inclusive, ending at the close
 * of that UTC day — so "1 day remaining" is true right up until the vacancy
 * actually shuts.
 */
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

/**
 * Open vacancies, newest posting first.
 *
 * Only jobs that are actually accepting applications appear on the careers
 * page. A closed vacancy stays published so its notice remains readable at its
 * own URL — which is what people who were sent the link expect — but listing it
 * among the openings would waste the reader's time.
 */
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
      /*
       * `_status` is read by `toApplicationWindow`, which decides whether the
       * vacancy is accepting applications. Leaving it out of the select does
       * not fail — it arrives as `undefined`, `applicability` reads that as
       * unpublished, and every vacancy is silently filtered out of the listing.
       * The careers page comes back empty with nothing in the logs.
       */
      _status: true,
    },
  });

  const now = new Date();
  const jobs = withSlug(docs).map((doc) => toJob(doc, now));

  /* A lapsed deadline closes a vacancy without anyone touching it, so the
     listing filters on the resolved window rather than on the stored status. */
  return jobs
    .filter((job) => job.applications.state !== "closed")
    .sort((a, b) => Number(b.featured) - Number(a.featured) || b.postedAt.localeCompare(a.postedAt));
}

/**
 * One vacancy, whatever its state.
 *
 * Unlike the listing, this does not filter on recruitment status: a closed
 * notice still has to render at its own URL, with a closed message where the
 * form was. Draft jobs are still excluded — an unpublished vacancy is not a
 * page.
 */
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
