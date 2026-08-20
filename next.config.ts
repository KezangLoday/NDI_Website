import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 only honours a `quality` prop whose value is listed here; anything else silently falls back to 75.
    qualities: [75, 95],
    /** Where CMS images may be loaded from. */
    remotePatterns: remoteImagePatterns(),
  },
};

/** The hosts CMS media can legitimately come from. */
function remoteImagePatterns(): NonNullable<NextConfig["images"]>["remotePatterns"] {
  const patterns: { protocol: "https"; hostname: string }[] = [];

  const cdn = process.env.NEXT_PUBLIC_MEDIA_BASE_URL;
  if (cdn) {
    try {
      patterns.push({ protocol: "https", hostname: new URL(cdn).hostname });
    } catch {
      // A malformed value must not take the build down.
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
