import type { Media } from "@/content/types";

/** Single place that turns a media record into a URL. */
const MEDIA_BASE = process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? "";

export function mediaUrl(item: Media): string {
  if (/^(https?:)?\/\//.test(item.url)) return item.url;
  return `${MEDIA_BASE}${item.url}`;
}

/** Terse helper so the mock data reads cleanly. */
export function media(url: string, alt: string, width: number, height: number): Media {
  return { url, alt, width, height };
}
