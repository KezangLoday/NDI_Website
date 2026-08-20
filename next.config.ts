import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 only honours a `quality` prop whose value is listed here; anything
    // else silently falls back to 75. The credential cards ask for 95: they are
    // read at 370px wide but carry 14px-equivalent body text, and a second
    // generation of lossy encoding lands squarely on those thin strokes.
    qualities: [75, 95],
    /**
     * Where CMS images may be loaded from.
     *
     * `next/image` refuses a remote host it has not been told about, which is
     * the right default — the loader is an open proxy otherwise. In development
     * the storage adapter writes to disk and serves relative URLs, so nothing is
     * needed; in production it returns absolute S3 or CDN URLs, and the bucket's
     * host has to be listed here.
     *
     * Derived from the same environment variables the storage adapter reads, so
     * pointing the CMS at a different bucket does not also require remembering
     * to edit this file.
     */
    remotePatterns: remoteImagePatterns(),
  },
};

/**
 * The hosts CMS media can legitimately come from.
 *
 * `NEXT_PUBLIC_MEDIA_BASE_URL` covers a CDN in front of the bucket, which is
 * the arrangement to prefer; the direct S3 endpoints are there so a deployment
 * without a CDN still works rather than silently serving broken images.
 */
function remoteImagePatterns(): NonNullable<NextConfig["images"]>["remotePatterns"] {
  const patterns: { protocol: "https"; hostname: string }[] = [];

  const cdn = process.env.NEXT_PUBLIC_MEDIA_BASE_URL;
  if (cdn) {
    try {
      patterns.push({ protocol: "https", hostname: new URL(cdn).hostname });
    } catch {
      // A malformed value must not take the build down; the image simply is not
      // allow-listed, which fails visibly in one place rather than everywhere.
    }
  }

  const bucket = process.env.S3_BUCKET;
  const region = process.env.S3_REGION;
  if (bucket && region) {
    patterns.push({ protocol: "https", hostname: `${bucket}.s3.${region}.amazonaws.com` });
    patterns.push({ protocol: "https", hostname: `s3.${region}.amazonaws.com` });
  }

  const endpoint = process.env.S3_ENDPOINT;
  if (endpoint) {
    try {
      patterns.push({ protocol: "https", hostname: new URL(endpoint).hostname });
    } catch {
      /* As above. */
    }
  }

  return patterns;
}

export default withPayload(nextConfig);
