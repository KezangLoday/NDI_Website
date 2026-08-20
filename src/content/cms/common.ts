/** The shared work every mapper does. */
import type { Media as PayloadMedia } from "@/payload-types";
import type { Attachment, Media, MediaVariants, RichTextContent, SeoView } from "@/content/types";
import { mediaUrl } from "@/lib/media";

/** A calendar day, from whatever Payload stored. */
export function isoDate(value: string | null | undefined): string {
  if (!value) return "";
  return value.slice(0, 10);
}

/** An ISO timestamp, kept whole — used where a time of day is shown. */
export function isoDateTime(value: string | null | undefined): string {
  return value ?? "";
}

/** A related document, if the query populated it. */
export function related<T extends object>(value: number | string | T | null | undefined): T | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "number" || typeof value === "string") return null;
  return value;
}

/** The name of a populated category, or a fallback label. */
export function categoryName(
  value: number | string | { name?: string | null } | null | undefined,
  fallback = "Update",
): string {
  const doc = related(value);
  return doc?.name ?? fallback;
}

/** The slug of a populated category, for tabs and filters. */
export function categorySlug(
  value: number | string | { slug?: string | null } | null | undefined,
  fallback = "",
): string {
  const doc = related(value);
  return doc?.slug ?? fallback;
}

/* ---- Media ----------------------------------------------------- */

/** The site's own origin, as Payload was configured with it. */
const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? "";

/** Turns a same-origin absolute URL into a relative one. */
export function siteRelative(url: string): string {
  if (!url.startsWith("http")) return url;
  if (SITE_ORIGIN && url.startsWith(SITE_ORIGIN)) {
    return url.slice(SITE_ORIGIN.length) || "/";
  }
  return url;
}

/** A Payload upload document as the components want it. */
export function toMedia(
  value: number | string | PayloadMedia | null | undefined,
  fallbackAlt = "",
): MediaVariants | undefined {
  const doc = related(value);
  if (!doc?.url) return undefined;

  return {
    url: siteRelative(doc.url),
    alt: doc.alt ?? fallbackAlt,
    /* Payload probes the stored file for these, so they describe the bytes actually served. */
    width: doc.width ?? 1,
    height: doc.height ?? 1,
    card: optionalRelative(doc.sizes?.card?.url),
    thumbnail: optionalRelative(doc.sizes?.thumbnail?.url),
  };
}

function optionalRelative(url: string | null | undefined): string | undefined {
  return url ? siteRelative(url) : undefined;
}

/** The plain `Media` shape, for the components that do not use variants. */
export function toPlainMedia(
  value: number | string | PayloadMedia | null | undefined,
  fallbackAlt = "",
): Media | undefined {
  const media = toMedia(value, fallbackAlt);
  if (!media) return undefined;
  return { url: media.url, alt: media.alt, width: media.width, height: media.height };
}

/** A downloadable file. */
export function toAttachment(
  value: number | string | PayloadMedia | null | undefined,
  label?: string,
): Attachment | undefined {
  const doc = related(value);
  if (!doc?.url) return undefined;

  return {
    id: String(doc.id),
    label: label ?? doc.alt ?? doc.filename ?? "Download",
    url: mediaUrl({ url: siteRelative(doc.url), alt: "", width: 0, height: 0 }),
    filesize: doc.filesize ?? undefined,
    mimeType: doc.mimeType ?? undefined,
  };
}

/** The `attachments` array field, with unpopulated or deleted rows dropped. */
export function toAttachments(
  rows:
    | { id?: string | null; label?: string | null; file?: number | string | PayloadMedia | null }[]
    | null
    | undefined,
): Attachment[] {
  if (!rows) return [];
  return rows.flatMap((row) => {
    const attachment = toAttachment(row.file, row.label ?? undefined);
    return attachment ? [{ ...attachment, id: row.id ?? attachment.id }] : [];
  });
}

/** The `gallery` array field. */
export function toGallery(
  rows:
    | {
        id?: string | null;
        caption?: string | null;
        image?: number | string | PayloadMedia | null;
      }[]
    | null
    | undefined,
): { id: string; image: Media; caption?: string }[] {
  if (!rows) return [];
  return rows.flatMap((row, index) => {
    const image = toPlainMedia(row.image, row.caption ?? "");
    if (!image) return [];
    return [{ id: row.id ?? String(index), image, caption: row.caption ?? undefined }];
  });
}

/* ---- SEO -------------------------------------------------------- */

export interface SeoInput {
  meta?:
    | {
        title?: string | null;
        description?: string | null;
        image?: number | string | PayloadMedia | null;
        noIndex?: boolean | null;
      }
    | null;
}

/** Resolves SEO against the page's own content. */
export function toSeo(
  doc: SeoInput,
  fallbacks: { title: string; description: string; image?: MediaVariants },
): SeoView {
  const meta = doc.meta;
  const image = toPlainMedia(meta?.image) ?? fallbacks.image;
  return {
    title: nonEmpty(meta?.title) ?? fallbacks.title,
    description: nonEmpty(meta?.description) ?? fallbacks.description,
    image,
    noIndex: meta?.noIndex === true,
  };
}

export function nonEmpty(value: string | null | undefined): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/* ---- Rich text to plain text ----------------------------------- */

/** Flattens a Lexical tree to a searchable string. */
export function richTextToPlain(content: RichTextContent | null | undefined): string {
  if (!content) return "";
  const parts: string[] = [];
  collectText(content.root, parts);
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

function collectText(node: unknown, out: string[]): void {
  if (typeof node !== "object" || node === null) return;
  const candidate = node as { text?: unknown; children?: unknown };
  if (typeof candidate.text === "string") out.push(candidate.text);
  if (Array.isArray(candidate.children)) {
    for (const child of candidate.children) collectText(child, out);
  }
}
