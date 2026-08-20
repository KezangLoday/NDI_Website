/** Raster image optimisation, in two modes. */
import sharp from "sharp";

import {
  declined,
  type OptimizationResult,
  type OptimizationStrategy,
  type UploadedFile,
} from "./types";

/** The longest edge any stored image needs. */
export const MAX_EDGE = 2560;

/** A more generous cap for documents. */
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

/** Site artwork: normalise to WebP and cap the dimensions. */
export const imageStrategy: OptimizationStrategy = {
  id: "image-webp",

  accepts(file) {
    return ALREADY_EFFICIENT.has(file.mimeType) || DECODABLE.has(file.mimeType);
  },

  async run(file) {
    const info = await probe(file);
    if (!info) {
      // Not decodable despite its MIME type: either corrupt, in which case mangling it further helps nobody, or a format this sharp build lacks — and the person who uploaded it should get their file back rather than a broken derivative.
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

    // A still encode of an animated GIF or WebP keeps the first frame and discards the rest.
    if (info.pages > 1) {
      return declined(file, this.id, "Animated image; stored as uploaded to keep every frame.");
    }

    const data = await pipeline(file, oversized ? MAX_EDGE : null)
      .webp({ quality: WEBP_QUALITY, effort: 4 })
      .toBuffer();

    // A conversion that made the file bigger is not an optimisation.
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

/** Applicant photographs and scans. */
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

/** Encoders for the formats where re-encoding costs no fidelity. */
const LOSSLESS_ENCODERS: Record<string, ((p: sharp.Sharp) => Promise<Buffer>) | undefined> = {
  "image/png": (p) => p.png({ compressionLevel: 9 }).toBuffer(),
  "image/tiff": (p) => p.tiff({ compression: "lzw" }).toBuffer(),
};

/** The shared front of both pipelines. */
function pipeline(file: UploadedFile, maxEdge: number | null): sharp.Sharp {
  const base = sharp(file.data, { failOn: "none" }).rotate();
  if (maxEdge === null) return base;
  return base.resize({ width: maxEdge, height: maxEdge, fit: "inside", withoutEnlargement: true });
}

function label(mimeType: string): string {
  return mimeType.replace("image/", "").toUpperCase();
}

/** Swaps a filename's extension. */
export function replaceExtension(name: string, extension: string): string {
  const lastDot = name.lastIndexOf(".");
  const stem = lastDot > 0 ? name.slice(0, lastDot) : name;
  return `${stem}.${extension}`;
}
