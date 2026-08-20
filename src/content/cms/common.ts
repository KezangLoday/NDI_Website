/**
 * The shared work every mapper does.
 *
 * Four recurring problems, solved once:
 *
 *  1. **Dates.** Payload returns full ISO timestamps; the site's date
 *     formatters are hand-rolled and UTC-based specifically so the server
 *     render and the client hydration are byte-identical. `isoDate` narrows a
 *     timestamp to the `YYYY-MM-DD` those formatters expect.
 *  2. **Relationships.** A `relationship` field is `number | Category`
 *     depending on the query's `depth`. Reading a label off one means handling
 *     both, every time, and forgetting once means `[object Object]` on a chip.
 *  3. **Nullability.** Almost every Payload field is nullable, because a draft
 *     may be half-finished. The view types are not, so the mappers narrow —
 *     and where a required value is genuinely absent, they supply the fallback
 *     rather than leaving a component to discover `undefined`.
 *  4. **Rich text in a search box.** The FAQ and glossary pages filter in the
 *     browser. Lexical trees cannot be searched with `includes`, so they are
 *     flattened to plain text once, here, on the server.
 */
import type { Media as PayloadMedia } from "@/payload-types";
import type { Attachment, Media, MediaVariants, RichTextContent, SeoView } from "@/content/types";
import { mediaUrl } from "@/lib/media";

/**
 * A calendar day, from whatever Payload stored.
 *
 * Deliberately string surgery rather than `Date` arithmetic: the value is
 * already an ISO-8601 UTC timestamp, and constructing a `Date` only to format
 * it back risks a timezone shifting the visible day.
 */
export function isoDate(value: string | null | undefined): string {
  if (!value) return "";
  return value.slice(0, 10);
}

/** An ISO timestamp, kept whole — used where a time of day is shown. */
export function isoDateTime(value: string | null | undefined): string {
  return value ?? "";
}

/**
 * A related document, if the query populated it.
 *
 * Returns null for an id, which is the honest answer: the caller asked for a
 * label and only has a foreign key. Every query in this directory sets the
 * `depth` it needs, so a null here means a query needs fixing rather than a
 * component needing a fallback.
 */
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

/**
 * The site's own origin, as Payload was configured with it.
 *
 * Read from the same variable Payload's `serverURL` uses, because the whole
 * point is to recognise URLs Payload built from it.
 */
const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? "";

/**
 * Turns a same-origin absolute URL into a relative one.
 *
 * Payload's local storage adapter builds `url` as
 * `${serverURL}/api/media/file/${filename}` — absolute, against the configured
 * origin. That breaks two things:
 *
 *  - `next/image` refuses an absolute URL whose host is not in
 *    `images.remotePatterns`, and returns 400. The site's own domain is not
 *    normally listed there, and listing it would be odd — it is not a remote.
 *  - The URL is pinned to whichever origin was configured, so the same database
 *    served from a different host or port returns broken images.
 *
 * A relative path fixes both, and is what a same-origin asset should be anyway.
 *
 * S3 URLs are left alone, which is the point of matching on the origin rather
 * than stripping any host: a bucket or CDN URL genuinely is remote, and
 * `remotePatterns` in `next.config.ts` is derived from the same environment
 * variables that produced it.
 */
export function siteRelative(url: string): string {
  if (!url.startsWith("http")) return url;
  if (SITE_ORIGIN && url.startsWith(SITE_ORIGIN)) {
    return url.slice(SITE_ORIGIN.length) || "/";
  }
  return url;
}

/**
 * A Payload upload document as the components want it.
 *
 * Returns undefined rather than a placeholder when there is no image. Every
 * component that takes an optional image already has a considered empty state —
 * the news notice card sets its category large instead, the team card shows a
 * monogram — and those are better than a grey box apologising for a missing
 * photograph.
 */
export function toMedia(
  value: number | string | PayloadMedia | null | undefined,
  fallbackAlt = "",
): MediaVariants | undefined {
  const doc = related(value);
  if (!doc?.url) return undefined;

  return {
    url: siteRelative(doc.url),
    alt: doc.alt ?? fallbackAlt,
    /*
     * Payload probes the stored file for these, so they describe the bytes
     * actually served. The 1 fallback is never right, but it is finite: a zero
     * or a NaN reaches `next/image` as an invalid aspect ratio and throws.
     */
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

/**
 * A downloadable file.
 *
 * `mediaUrl` is applied here rather than at render time because a download link
 * is a plain `<a href>` — there is no `next/image` in the path to resolve a
 * relative URL, so it has to be absolute by the time it reaches the component.
 */
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

/**
 * Resolves SEO against the page's own content.
 *
 * The fallback chain lives here rather than in a hook on the collection, so an
 * editor who later improves a headline improves the search result too — a
 * stored copy would have frozen the old wording the moment it was saved.
 */
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

/**
 * Flattens a Lexical tree to a searchable string.
 *
 * Only text is collected; a paragraph break becomes a space so two adjacent
 * paragraphs do not run their last and first words together into a false match.
 */
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
