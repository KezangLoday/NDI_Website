/**
 * Server-only environment access for the CMS.
 *
 * Every credential, connection string and storage switch the CMS needs is read
 * here and nowhere else, so there is exactly one place to look when an
 * environment is misconfigured and exactly one place a new secret gets added.
 *
 * Nothing here may be imported from a Client Component — the S3 secret would
 * end up in the browser bundle. The usual guard for that is `import
 * "server-only"`, which cannot be used in this module: `payload.config.ts`
 * imports it and the Payload CLI loads that file through plain Node rather than
 * Next's bundler, where the specifier does not resolve. The runtime check below
 * fails loudly in a browser instead.
 */
if (typeof window !== "undefined") {
  throw new Error(
    "src/payload/env.ts was imported into client code. It reads CMS credentials and must stay on the server.",
  );
}

/** Throws rather than starting the CMS with a missing credential. */
function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. Copy .env.example to .env and fill it in.`,
    );
  }
  return value;
}

function optional(name: string): string | undefined {
  const value = process.env[name];
  return value && value.length > 0 ? value : undefined;
}

function flag(name: string, fallback: boolean): boolean {
  const value = optional(name);
  if (value === undefined) return fallback;
  return value === "true" || value === "1";
}

export const isProduction = process.env.NODE_ENV === "production";
export const isTest = process.env.NODE_ENV === "test";

/**
 * Which storage adapter uploads go to.
 *
 * Resolved from configuration rather than from `NODE_ENV`, and the difference
 * matters: `next build` runs with `NODE_ENV=production`, so keying off it means
 * a production build cannot be produced without live S3 credentials in the
 * build environment. Building is not running, and requiring a bucket to compile
 * is the wrong constraint.
 *
 * So:
 *
 *  1. `MEDIA_STORAGE` wins if set. An explicit `s3` with no credentials still
 *     throws, which is right — it is a request that cannot be honoured.
 *  2. Otherwise S3 if a bucket is configured. Setting `S3_BUCKET` is an
 *     unambiguous statement of intent.
 *  3. Otherwise local disk.
 *
 * A production deployment that resolves to local disk is almost certainly a
 * mistake — a container's filesystem is ephemeral, so uploads would vanish on
 * the next deploy — so `warnIfMisconfigured` says so loudly at startup rather
 * than letting it be discovered later.
 */
export type StorageDriver = "local" | "s3";

export function storageDriver(): StorageDriver {
  const override = optional("MEDIA_STORAGE");
  if (override === "local" || override === "s3") return override;
  return optional("S3_BUCKET") !== undefined ? "s3" : "local";
}

/**
 * Shouts about a production deployment writing uploads to local disk.
 *
 * A warning rather than a thrown error, because the same code path is what makes
 * `next build`, a smoke test and a bucket-less staging environment work. The
 * message is deliberately hard to miss in a log.
 */
export function storageWarning(): string | undefined {
  if (!isProduction || storageDriver() === "s3") return undefined;
  return (
    "CMS uploads are being written to the local filesystem in a production build. " +
    "On most hosts that directory is ephemeral, so uploaded media will disappear on the next deploy. " +
    "Set S3_BUCKET, S3_REGION, S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY, or set MEDIA_STORAGE=local to acknowledge this deliberately."
  );
}

export interface S3Env {
  readonly bucket: string;
  readonly region: string;
  readonly accessKeyId: string;
  readonly secretAccessKey: string;
  /** Set for S3-compatible providers (MinIO, R2, Spaces); unset for AWS. */
  readonly endpoint: string | undefined;
  readonly forcePathStyle: boolean;
  /** Bucket for private applicant documents. Defaults to the public bucket. */
  readonly privateBucket: string;
  readonly publicPrefix: string;
  readonly privatePrefix: string;
  /**
   * ACL for public media. Buckets created with Object Ownership set to
   * "bucket owner enforced" reject ACLs outright — those need this set to
   * `none` and a bucket policy or CloudFront OAC granting read on the public
   * prefix instead.
   */
  readonly publicAcl: "public-read" | "private" | "none";
}

export function s3Env(): S3Env {
  const bucket = required("S3_BUCKET");
  return {
    bucket,
    region: required("S3_REGION"),
    accessKeyId: required("S3_ACCESS_KEY_ID"),
    secretAccessKey: required("S3_SECRET_ACCESS_KEY"),
    endpoint: optional("S3_ENDPOINT"),
    forcePathStyle: flag("S3_FORCE_PATH_STYLE", false),
    privateBucket: optional("S3_PRIVATE_BUCKET") ?? bucket,
    publicPrefix: optional("S3_PUBLIC_PREFIX") ?? "media",
    privatePrefix: optional("S3_PRIVATE_PREFIX") ?? "applicant-documents",
    publicAcl: parsePublicAcl(optional("S3_PUBLIC_ACL")),
  };
}

function parsePublicAcl(value: string | undefined): S3Env["publicAcl"] {
  if (value === "private" || value === "none" || value === "public-read") return value;
  return "public-read";
}

export function databaseURI(): string {
  return required("DATABASE_URI");
}

export function payloadSecret(): string {
  return required("PAYLOAD_SECRET");
}

/**
 * Absolute origin, shared with the frontend's `metadataBase`.
 *
 * Payload needs it to build absolute file and preview URLs; keeping it on the
 * same variable the site already uses means one origin to change per
 * environment rather than two that can drift apart.
 */
export function serverURL(): string {
  return optional("NEXT_PUBLIC_SITE_URL") ?? "http://localhost:3000";
}

/** Credentials the seed script uses to create the first superadmin. */
export function seedSuperadmin(): { email: string; password: string } {
  return {
    email: required("PAYLOAD_SEED_SUPERADMIN_EMAIL"),
    password: required("PAYLOAD_SEED_SUPERADMIN_PASSWORD"),
  };
}

/**
 * Whether Payload pushes schema changes straight to the database.
 *
 * On in development so a field added to a collection appears without a
 * migration round-trip; off in production, where `payload migrate` owns the
 * schema and an accidental push could drop a column.
 */
export function databasePush(): boolean {
  return flag("DATABASE_PUSH", !isProduction);
}
