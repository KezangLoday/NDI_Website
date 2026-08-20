/** Webinars, and the upcoming-event card. */
import type { Webinar as PayloadWebinar } from "@/payload-types";
import type {
  UpcomingEventSlot,
  Webinar,
  WebinarRecording,
  WebinarRegistration,
  WebinarSpeaker,
} from "@/content/types";
import { getPayloadClient } from "@/payload/lib/client";
import {
  categoryName,
  isoDateTime,
  nonEmpty,
  related,
  toAttachments,
  toGallery,
  toMedia,
  toPlainMedia,
  toSeo,
} from "./common";
import { DETAIL_DEPTH, LISTING_DEPTH, LISTING_LIMIT, published, withSlug } from "./queries";
import { formatSessionTime } from "@/lib/format";

/** The fields `toWebinar` reads. See the note on `NewsDoc` in `news.ts`. */
export type WebinarDoc = Pick<
  PayloadWebinar,
  "id" | "slug" | "sessionStatus" | "title" | "description" | "category" | "startsAt"
> &
  Partial<PayloadWebinar>;

export function toWebinar(doc: WebinarDoc & { slug: string }): Webinar {
  const thumbnail = toMedia(doc.thumbnail, doc.title);
  const recording = toRecording(doc.recording);

  return {
    id: String(doc.id),
    slug: doc.slug,
    sessionStatus: doc.sessionStatus,
    title: doc.title,
    description: doc.description,
    category: categoryName(doc.category, "Session"),
    startsAt: isoDateTime(doc.startsAt),
    endsAt: doc.endsAt ?? undefined,
    when: formatSessionTime(doc.startsAt),
    platform: nonEmpty(doc.platform),
    speakers: toSpeakers(doc.speakers),
    registration: toRegistration(doc.registration),
    recording,
    thumbnail,
    body: doc.body ?? undefined,
    gallery: toGallery(doc.gallery),
    attachments: toAttachments(doc.attachments),
    kind: recording?.durationMinutes
      ? `Recording · ${recording.durationMinutes} min`
      : doc.sessionStatus === "recorded"
        ? "Recording"
        : undefined,
    seo: toSeo(doc, { title: doc.title, description: doc.description, image: thumbnail }),
  };
}

function toSpeakers(rows: PayloadWebinar["speakers"]): WebinarSpeaker[] {
  if (!rows) return [];
  return rows.map((row, index) => ({
    id: row.id ?? String(index),
    name: row.name,
    role: nonEmpty(row.role),
    photo: toPlainMedia(row.photo, row.name),
  }));
}

function toRegistration(
  registration: PayloadWebinar["registration"],
): WebinarRegistration | undefined {
  const url = nonEmpty(registration?.url);
  if (!url) return undefined;
  return {
    url,
    label: nonEmpty(registration?.label) ?? "Register to attend",
    note: nonEmpty(registration?.note),
  };
}

function toRecording(recording: PayloadWebinar["recording"]): WebinarRecording | undefined {
  const url = nonEmpty(recording?.url);
  if (!url) return undefined;
  return { url, durationMinutes: recording?.durationMinutes ?? undefined };
}

/** Every published session, upcoming soonest first, then recordings newest first. */
export async function queryWebinars(): Promise<Webinar[]> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "webinars",
    where: published(),
    sort: "-startsAt",
    limit: LISTING_LIMIT,
    depth: LISTING_DEPTH,
    select: {
      slug: true,
      sessionStatus: true,
      title: true,
      description: true,
      category: true,
      startsAt: true,
      endsAt: true,
      platform: true,
      registration: true,
      recording: true,
      thumbnail: true,
      meta: true,
    },
  });

  const webinars = withSlug(docs).map(toWebinar);

  /* Upcoming sessions sort ascending — the next one first, because that is what a reader wants. */
  return webinars.sort((a, b) => {
    if (a.sessionStatus !== b.sessionStatus) {
      return a.sessionStatus === "upcoming" ? -1 : 1;
    }
    return a.sessionStatus === "upcoming"
      ? a.startsAt.localeCompare(b.startsAt)
      : b.startsAt.localeCompare(a.startsAt);
  });
}

export async function queryWebinarBySlug(slug: string): Promise<Webinar | undefined> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "webinars",
    where: published({ slug: { equals: slug } }),
    limit: 1,
    depth: DETAIL_DEPTH,
  });
  const doc = withSlug(docs)[0];
  return doc ? toWebinar(doc) : undefined;
}

/** What the "Upcoming session" card should show. */
export async function queryUpcomingEvent(now: Date = new Date()): Promise<UpcomingEventSlot> {
  const payload = await getPayloadClient();
  const global = await payload.findGlobal({ slug: "upcoming-events", depth: 1 });

  const emptyStateNote =
    nonEmpty(global.emptyStateNote) ??
    "There is no session scheduled at the moment. The next one will be announced here.";

  const chosen = withSlug(
    (global.featured ?? [])
      .map((entry) => related(entry))
      .filter((doc): doc is PayloadWebinar => doc !== null),
  )
    .map(toWebinar)
    .filter((webinar) => isStillAhead(webinar, now));

  if (chosen[0]) return { event: { webinar: chosen[0] }, emptyStateNote };

  if (global.fallback === false) return { emptyStateNote };

  const { docs } = await payload.find({
    collection: "webinars",
    where: published({
      sessionStatus: { equals: "upcoming" },
      startsAt: { greater_than: now.toISOString() },
    }),
    sort: "startsAt",
    limit: 1,
    depth: LISTING_DEPTH,
  });

  const next = withSlug(docs)[0];
  return next ? { event: { webinar: toWebinar(next) }, emptyStateNote } : { emptyStateNote };
}

function isStillAhead(webinar: Webinar, now: Date): boolean {
  if (webinar.sessionStatus !== "upcoming") return false;
  const starts = new Date(webinar.startsAt);
  if (Number.isNaN(starts.getTime())) return false;
  /* An hour's grace. */
  return starts.getTime() + 60 * 60_000 > now.getTime();
}
