/**
 * Raster image optimisation, in two modes.
 *
 * Both run before Payload's own upload handling, so the buffer they produce is
 * what gets stored *and* what Payload's `imageSizes` derive their variants
 * from. That ordering matters: normalising the main file here means every
 * generated size inherits the format without each one declaring it, and the
 * expensive decode happens once.
 *
 * Neither mode touches SVG. A vector file has no pixels to optimise,
 * rasterising it would be a downgrade, and Payload runs its own SVG validation
 * that this must not get in front of.
 */
import sharp from "sharp";

import {
  declined,
  type OptimizationResult,
  type OptimizationStrategy,
  type UploadedFile,
} from "./types";

/**
 * The longest edge any stored image needs.
 *
 * The widest slot in the design is the careers hero collage at 1560px, which on
 * a 2× display asks for 3120px. 2560 is the pragmatic cap: it covers every 1×
 * and 1.5× case exactly and the largest 2× slot at a quality nobody can pick
 * out, while keeping a phone camera's 8000px original from being stored at full
 * size for a card that renders it 370px wide.
 */
export const MAX_EDGE = 2560;

/**
 * A more generous cap for documents.
 *
 * A scanned certificate is read, not glanced at — small print and a stamp have
 * to survive — so it gets roughly A4 at 300dpi before anything is resized.
 */
export const MAX_EDGE_DOCUMENT = 3508;

/** Visually lossless for photographic content at the sizes this site uses. */
const WEBP_QUALITY = 82;

/** Formats already efficient enough that re-encoding costs more than it saves. */
const ALREADY_EFFICIENT = new Set(["image/webp", "image/avif"]);

/** Formats sharp can safely decode and re-encode. */
const DECODABLE = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/tiff",
  "image/gif",
  "image/heic",
  "image/heif",
]);

interface Probe {
  readonly width: number;
  readonly height: number;
  readonly pages: number;
}

/** Reads dimensions, or returns null when the bytes are not a decodable image. */
async function probe(file: UploadedFile): Promise<Probe | null> {
  try {
    const metadata = await sharp(file.data).metadata();
    return {
      width: metadata.width ?? 0,
      height: metadata.height ?? 0,
      pages: metadata.pages ?? 1,
    };
  } catch {
    return null;
  }
}

/**
 * Site artwork: normalise to WebP and cap the dimensions.
 *
 * The one case it declines is an image that is already WebP or AVIF and within
 * the cap. A second generation of lossy encoding costs visible quality on thin
 * strokes and saves almost nothing, and this is not hypothetical — the site's
 * own exported artwork arrives as WebP.
 */
export const imageStrategy: OptimizationStrategy = {
  id: "image-webp",

  accepts(file) {
    return ALREADY_EFFICIENT.has(file.mimeType) || DECODABLE.has(file.mimeType);
  },

  async run(file) {
    const info = await probe(file);
    if (!info) {
      // Not decodable despite its MIME type: either corrupt, in which case
      // mangling it further helps nobody, or a format this sharp build lacks —
      // and the person who uploaded it should get their file back rather than a
      // broken derivative.
      return declined(file, this.id, "Could not be read as an image; stored as uploaded.");
    }

    const oversized = Math.max(info.width, info.height) > MAX_EDGE;

    if (ALREADY_EFFICIENT.has(file.mimeType) && !oversized) {
      return declined(
        file,
        this.id,
        `Already ${label(file.mimeType)} at ${info.width}×${info.height}; left as uploaded.`,
      );
    }

    // A still encode of an animated GIF or WebP keeps the first frame and
    // discards the rest. That is a bug, not a saving.
    if (info.pages > 1) {
      return declined(file, this.id, "Animated image; stored as uploaded to keep every frame.");
    }

    const data = await pipeline(file, oversized ? MAX_EDGE : null)
      .webp({ quality: WEBP_QUALITY, effort: 4 })
      .toBuffer();

    // A conversion that made the file bigger is not an optimisation. Small PNG
    // line art and screenshots of flat colour both hit this.
    if (data.byteLength >= file.size && !oversized) {
      return declined(file, this.id, "WebP came out larger than the original; kept the original.");
    }

    return {
      file: { name: replaceExtension(file.name, "webp"), mimeType: "image/webp", data },
      report: {
        strategy: this.id,
        originalBytes: file.size,
        optimizedBytes: data.byteLength,
        note: oversized
          ? `Resized from ${info.width}×${info.height} to fit ${MAX_EDGE}px and converted to WebP.`
          : "Converted to WebP.",
      },
    } satisfies OptimizationResult;
  },
};

/**
 * Applicant photographs and scans.
 *
 * The integrity-first mode, and deliberately much less clever than the one
 * above. It never changes format, and it only ever re-encodes a *lossless*
 * one — which is the distinction that took a measurement to get right, so it
 * is worth recording why.
 *
 * The obvious design was "cap the dimensions of anything too large". Measured
 * on realistic inputs, that turns out to be a bad trade for a lossy format: a
 * 4000px phone photograph resized to 3508px and re-encoded at a quality safe
 * for small print comes out roughly *twice* the size of the original, because
 * the original was encoded at a camera's quality and 4:2:0 chroma. So the
 * resize costs a second generation of lossy encoding on a document that may be
 * evidence in a hiring decision, and saves nothing. A 12% reduction in linear
 * dimensions is not worth that on any reading of the requirements.
 *
 * For a lossless format the calculus is completely different: re-encoding a PNG
 * costs no fidelity at all, and resizing an oversized scan reliably halves it —
 * measured at 48% on a photographed certificate. So:
 *
 *   - **JPEG, WebP, HEIC** — stored exactly as uploaded. Always.
 *   - **PNG, TIFF** — resized if oversized, re-encoded losslessly, and kept only
 *     if the result is actually smaller.
 *
 * The upshot is that the overwhelmingly common case is byte-for-byte
 * preservation, which is what "integrity takes priority over aggressive
 * compression" should mean in practice.
 */
export const imagePreserveStrategy: OptimizationStrategy = {
  id: "image-preserve",

  accepts(file) {
    return ALREADY_EFFICIENT.has(file.mimeType) || DECODABLE.has(file.mimeType);
  },

  async run(file) {
    const encoder = LOSSLESS_ENCODERS[file.mimeType];
    if (!encoder) {
      return declined(
        file,
        this.id,
        `${label(file.mimeType)} is a lossy format; stored exactly as uploaded to avoid a second generation of encoding.`,
      );
    }

    const info = await probe(file);
    if (!info) {
      return declined(file, this.id, "Could not be read as an image; stored exactly as uploaded.");
    }

    if (Math.max(info.width, info.height) <= MAX_EDGE_DOCUMENT) {
      return declined(file, this.id, `${info.width}×${info.height}; stored exactly as uploaded.`);
    }

    if (info.pages > 1) {
      return declined(file, this.id, "Animated image; stored exactly as uploaded.");
    }

    const data = await encoder(pipeline(file, MAX_EDGE_DOCUMENT));

    // Belt and braces: never store a larger file than was uploaded.
    if (data.byteLength >= file.size) {
      return declined(file, this.id, "Resize did not reduce the file; kept the original.");
    }

    return {
      file: { name: file.name, mimeType: file.mimeType, data },
      report: {
        strategy: this.id,
        originalBytes: file.size,
        optimizedBytes: data.byteLength,
        note: `Resized from ${info.width}×${info.height} to fit ${MAX_EDGE_DOCUMENT}px. Format unchanged and re-encoded losslessly.`,
      },
    } satisfies OptimizationResult;
  },
};

/**
 * Encoders for the formats where re-encoding costs no fidelity.
 *
 * JPEG, WebP and HEIC are deliberately absent — see the note above. Their
 * absence is what makes `imagePreserveStrategy` decline them, so this table is
 * the policy rather than a helper for it.
 */
const LOSSLESS_ENCODERS: Record<string, ((p: sharp.Sharp) => Promise<Buffer>) | undefined> = {
  "image/png": (p) => p.png({ compressionLevel: 9 }).toBuffer(),
  "image/tiff": (p) => p.tiff({ compression: "lzw" }).toBuffer(),
};

/**
 * The shared front of both pipelines.
 *
 * `.rotate()` bakes in the EXIF orientation flag before metadata is dropped;
 * skipping it is what makes phone photographs appear on their side.
 *
 * Dropping the rest of the metadata is a privacy measure as much as a size one.
 * A phone photograph carries GPS coordinates, and neither a team portrait on a
 * public page nor an applicant's scan should publish where it was taken.
 */
function pipeline(file: UploadedFile, maxEdge: number | null): sharp.Sharp {
  const base = sharp(file.data, { failOn: "none" }).rotate();
  if (maxEdge === null) return base;
  return base.resize({ width: maxEdge, height: maxEdge, fit: "inside", withoutEnlargement: true });
}

function label(mimeType: string): string {
  return mimeType.replace("image/", "").toUpperCase();
}

/**
 * Swaps a filename's extension.
 *
 * Payload derives the stored filename from `file.name`, so a converted image
 * whose name still ends in `.png` would be served as `photo.png` containing
 * WebP bytes — which browsers cope with, but every other tool that trusts the
 * extension does not.
 */
export function replaceExtension(name: string, extension: string): string {
  const lastDot = name.lastIndexOf(".");
  const stem = lastDot > 0 ? name.slice(0, lastDot) : name;
  return `${stem}.${extension}`;
}
