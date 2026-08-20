/**
 * Application reference numbers: `APP-2026-00001`.
 *
 * Two properties matter. It has to be unique, because HR quotes it to
 * candidates and searches on it. And it must not encode anything — the
 * requirement is explicit that the database id is not to be used as the public
 * reference, and the reason is that a sequential primary key tells an applicant
 * how many people applied and lets them enumerate other people's records if any
 * endpoint ever takes an id.
 *
 * Uniqueness is guaranteed by the unique index on the column, not by this
 * function. That distinction is the whole design:
 *
 *   - `nextReference` reads the highest reference for the year and adds one.
 *     Two simultaneous submissions can and will read the same value.
 *   - The insert then fails for one of them on the unique index, and
 *     `createWithReference` retries with a freshly read number.
 *
 * The alternative — an atomic counter row, or a Postgres sequence — would be
 * race-free on the first attempt but would mean reaching past Payload's public
 * API into the Drizzle instance and the request's transaction. At the volume a
 * national programme's vacancy attracts, a retry loop is both correct and much
 * less to go wrong.
 *
 * The zero padding is what makes `sort: '-reference'` a numeric sort: `00010`
 * orders after `00009` as a string, where `10` would not.
 */
import type { Payload, PayloadRequest } from "payload";

const PREFIX = "APP";
const DIGITS = 5;

export function formatReference(year: number, sequence: number): string {
  return `${PREFIX}-${year}-${String(sequence).padStart(DIGITS, "0")}`;
}

/**
 * Pulls the sequence back out of a reference.
 *
 * Returns null for anything that does not match the format, which is how a
 * hand-edited or legacy value is kept from poisoning the next number.
 */
export function parseReference(reference: string): { year: number; sequence: number } | null {
  const match = /^APP-(\d{4})-(\d+)$/.exec(reference);
  if (!match) return null;
  const year = Number(match[1]);
  const sequence = Number(match[2]);
  if (!Number.isInteger(year) || !Number.isInteger(sequence)) return null;
  return { year, sequence };
}

export interface NextReferenceArgs {
  readonly payload: Payload;
  readonly req?: PayloadRequest;
  readonly year?: number;
}

/** The next reference for the given year, read off the highest one in use. */
export async function nextReference({
  payload,
  req,
  year = new Date().getUTCFullYear(),
}: NextReferenceArgs): Promise<string> {
  const { docs } = await payload.find({
    collection: "job-applications",
    where: { reference: { like: `${PREFIX}-${year}-` } },
    sort: "-reference",
    limit: 1,
    depth: 0,
    select: { reference: true },
    /*
     * The numbering has to see every application, including ones the caller
     * cannot read — and the caller here is often the public submission
     * endpoint, which has no user at all. Only the maximum is read; nothing
     * about any application is returned to anyone.
     */
    overrideAccess: true,
    ...(req ? { req } : {}),
  });

  const highest = docs[0]?.reference;
  const parsed = typeof highest === "string" ? parseReference(highest) : null;
  return formatReference(year, (parsed?.sequence ?? 0) + 1);
}

/**
 * Postgres' unique-violation code.
 *
 * Matched on the code rather than the message so it survives a locale change or
 * a Payload error-wrapping change.
 */
const UNIQUE_VIOLATION = "23505";

/** Whether a thrown error is a collision on the reference column. */
export function isUniqueViolation(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const candidate = error as { code?: unknown; cause?: unknown; name?: unknown };
  if (candidate.code === UNIQUE_VIOLATION) return true;
  // Payload wraps database errors in a ValidationError for unique fields.
  if (candidate.name === "ValidationError") return true;
  return candidate.cause !== undefined && isUniqueViolation(candidate.cause);
}

export const MAX_REFERENCE_ATTEMPTS = 5;
