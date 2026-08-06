import type { Media } from "@/content/types";

/**
 * Single place that turns a media record into a URL.
 *
 * Phase 1 serves everything from /public. In Phase 2 the Payload S3 adapter
 * returns absolute URLs, which pass through untouched; a bucket served from a
 * custom domain can be pointed at with NEXT_PUBLIC_MEDIA_BASE_URL instead of
 * touching any component.
 */
const MEDIA_BASE = process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? "";

export function mediaUrl(item: Media): string {
  if (/^(https?:)?\/\//.test(item.url)) return item.url;
  return `${MEDIA_BASE}${item.url}`;
}

/** Terse helper so the mock data reads cleanly. */
export function media(url: string, alt: string, width: number, height: number): Media {
  return { url, alt, width, height };
}
