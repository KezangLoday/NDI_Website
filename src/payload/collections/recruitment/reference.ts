/** Application reference numbers: `APP-2026-00001`. */
import type { Payload, PayloadRequest } from "payload";

const PREFIX = "APP";
const DIGITS = 5;

export function formatReference(year: number, sequence: number): string {
  return `${PREFIX}-${year}-${String(sequence).padStart(DIGITS, "0")}`;
}

/** Pulls the sequence back out of a reference. */
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
    /* The numbering has to see every application, including ones the caller cannot read. */
    overrideAccess: true,
    ...(req ? { req } : {}),
  });

  const highest = docs[0]?.reference;
  const parsed = typeof highest === "string" ? parseReference(highest) : null;
  return formatReference(year, (parsed?.sequence ?? 0) + 1);
}

/** Postgres' unique-violation code. */
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
