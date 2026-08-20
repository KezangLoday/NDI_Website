/** Where uploaded files live. */
import { s3Storage } from "@payloadcms/storage-s3";
import type { Plugin } from "payload";

import { s3Env, storageDriver, storageWarning, type S3Env } from "../env";

export const MEDIA_SLUG = "media";
export const APPLICANT_DOCUMENTS_SLUG = "applicant-documents";

/** Local upload directories, relative to the project root. */
export const LOCAL_MEDIA_DIR = "media";

/** Applicant documents land outside `public/` on purpose. */
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
    /* `none` is for buckets with Object Ownership set to "bucket owner enforced", which reject an ACL outright. */
    ...(env.publicAcl === "none" ? {} : { acl: env.publicAcl }),
    /* Fields are inserted whether or not the plugin is active, so the database schema is identical in development and production. */
    alwaysInsertFields: true,
    collections: {
      [MEDIA_SLUG]: {
        prefix: env.publicPrefix,
        /* Serve public artwork directly from the bucket rather than through Payload. */
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
        /* Note the absence of `disablePayloadAccessControl`. */
      },
    },
  });
}
