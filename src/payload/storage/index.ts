/**
 * Where uploaded files live.
 *
 * One switch, read from the environment: local disk in development, S3 in
 * production. No collection, hook or component knows which is in force —
 * Payload's storage adapter sits underneath the upload API, so the only thing
 * that changes between the two is the value of `url` on a media document, and
 * `mediaUrl()` on the frontend already handles both a relative path and an
 * absolute one.
 *
 * Public media and applicant documents get *separate adapter instances*, and
 * that separation is the security boundary the requirements ask for rather than
 * a tidiness measure:
 *
 *  - Public media is written with a public-read ACL under its own prefix and
 *    served straight from the bucket or a CDN in front of it, bypassing the
 *    application entirely. That is what makes images fast.
 *
 *  - Applicant documents are written private, under a different prefix (and
 *    optionally a different bucket), and are *only* reachable through Payload's
 *    own file route — which runs the collection's `read` access control before
 *    a single byte is returned. There is no configuration in which an applicant
 *    document is publicly readable, because the code path that would make it so
 *    does not exist.
 *
 * Getting this wrong in the other direction — one adapter for both — would mean
 * a single ACL for both kinds of file, and the only safe choice would then be
 * to make every site image private and proxy it.
 */
import { s3Storage } from "@payloadcms/storage-s3";
import type { Plugin } from "payload";

import { s3Env, storageDriver, storageWarning, type S3Env } from "../env";

export const MEDIA_SLUG = "media";
export const APPLICANT_DOCUMENTS_SLUG = "applicant-documents";

/** Local upload directories, relative to the project root. */
export const LOCAL_MEDIA_DIR = "media";

/**
 * Applicant documents land outside `public/` on purpose.
 *
 * A development setup that wrote CVs into `public/` would have Next.js serving
 * them at a guessable URL with no access control at all — the exact leak the
 * production configuration is built to prevent, reintroduced on the machine
 * where people actually experiment. `.uploads/` is gitignored and is not a
 * static root.
 */
export const LOCAL_APPLICANT_DOCUMENTS_DIR = ".uploads/applicant-documents";

export function storagePlugins(): Plugin[] {
  const warning = storageWarning();
  if (warning) console.warn(`[payload] ${warning}`);

  if (storageDriver() === "local") return [];

  const env = s3Env();
  return [publicMediaAdapter(env), privateDocumentsAdapter(env)];
}

function clientConfig(env: S3Env) {
  return {
    region: env.region,
    credentials: {
      accessKeyId: env.accessKeyId,
      secretAccessKey: env.secretAccessKey,
    },
    // Both only apply to S3-compatible providers; AWS needs neither.
    ...(env.endpoint ? { endpoint: env.endpoint } : {}),
    ...(env.forcePathStyle ? { forcePathStyle: true } : {}),
  };
}

function publicMediaAdapter(env: S3Env): Plugin {
  return s3Storage({
    bucket: env.bucket,
    clientCacheKey: "ndi-public-media",
    config: clientConfig(env),
    /*
     * `none` is for buckets with Object Ownership set to "bucket owner
     * enforced", which reject an ACL outright. Those need a bucket policy or a
     * CloudFront origin access control granting read on the public prefix
     * instead — see the deployment notes in the README.
     */
    ...(env.publicAcl === "none" ? {} : { acl: env.publicAcl }),
    /*
     * Fields are inserted whether or not the plugin is active, so the database
     * schema is identical in development and production. Without this, a
     * migration generated on a developer's machine would be missing the
     * `prefix` column that production expects.
     */
    alwaysInsertFields: true,
    collections: {
      [MEDIA_SLUG]: {
        prefix: env.publicPrefix,
        /*
         * Serve public artwork directly from the bucket rather than through
         * Payload. There is nothing to check — the whole collection is public —
         * and routing every image through the Node process would add a hop to
         * the slowest thing on the page for no benefit.
         */
        disablePayloadAccessControl: true,
      },
    },
  });
}

function privateDocumentsAdapter(env: S3Env): Plugin {
  return s3Storage({
    bucket: env.privateBucket,
    clientCacheKey: "ndi-applicant-documents",
    config: clientConfig(env),
    /** Never anything else. An applicant's CV is not public data. */
    acl: "private",
    alwaysInsertFields: true,
    collections: {
      [APPLICANT_DOCUMENTS_SLUG]: {
        prefix: env.privatePrefix,
        /*
         * Note the absence of `disablePayloadAccessControl`. Leaving it off is
         * what routes every request for these files through Payload's static
         * handler, which calls the collection's `read` access rule first. It is
         * the single line standing between an applicant's documents and anyone
         * who guesses a filename.
         */
      },
    },
  });
}
