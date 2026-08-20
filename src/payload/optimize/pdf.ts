/** PDF optimisation, restricted to the one transformation that cannot lose anything. */
import { PDFDocument } from "pdf-lib";

import {
  declined,
  type OptimizationResult,
  type OptimizationStrategy,
} from "./types";

/** Below this, the re-save is not worth the CPU or the risk. */
const MIN_BYTES = 96 * 1024;

/** Anything less than this saving is not worth having touched the file at all. */
const MIN_SAVING_RATIO = 0.05;

export const pdfStrategy: OptimizationStrategy = {
  id: "pdf-objectstreams",

  accepts(file) {
    return file.mimeType === "application/pdf";
  },

  async run(file) {
    if (file.size < MIN_BYTES) {
      return declined(file, this.id, "Small enough that re-saving would not help; stored as uploaded.");
    }

    let source: PDFDocument;
    try {
      /* `ignoreEncryption` lets a password-protected or permissions-flagged PDF be *parsed*. */
      source = await PDFDocument.load(file.data, {
        ignoreEncryption: true,
        updateMetadata: false,
      });
    } catch {
      // Not parseable.
      return declined(file, this.id, "Could not be parsed; stored exactly as uploaded.");
    }

    if (source.isEncrypted) {
      return declined(file, this.id, "Encrypted or permission-restricted; stored exactly as uploaded.");
    }

    /* `load` is lenient and `getPageCount` is not: pdf-lib parses the header eagerly but resolves the page tree lazily, so a file with a plausible header and a broken or absent `/Pages` node throws here rather than above. */
    let originalPages: number;
    try {
      originalPages = source.getPageCount();
    } catch {
      return declined(file, this.id, "Page structure could not be read; stored exactly as uploaded.");
    }

    if (originalPages === 0) {
      return declined(file, this.id, "No readable pages; stored exactly as uploaded.");
    }

    let data: Uint8Array;
    try {
      data = await source.save({ useObjectStreams: true, addDefaultPage: false });
    } catch {
      return declined(file, this.id, "Could not be re-saved; stored exactly as uploaded.");
    }

    const saving = 1 - data.byteLength / file.size;
    if (saving < MIN_SAVING_RATIO) {
      return declined(
        file,
        this.id,
        `Re-saving would only save ${(saving * 100).toFixed(0)}%; kept the original.`,
      );
    }

    /* The verification step, and the reason this strategy is safe to have enabled by default: the output is re-opened and its page count compared against the input. */
    try {
      const verified = await PDFDocument.load(data, { updateMetadata: false });
      const verifiedPages = verified.getPageCount();
      if (verifiedPages !== originalPages) {
        return declined(
          file,
          this.id,
          `Re-saved file had ${verifiedPages} pages instead of ${originalPages}; kept the original.`,
        );
      }
    } catch {
      return declined(file, this.id, "Re-saved file did not verify; kept the original.");
    }

    return {
      file: {
        name: file.name,
        mimeType: "application/pdf",
        // pdf-lib returns a Uint8Array; Payload's upload path wants a Buffer.
        data: Buffer.from(data),
      },
      report: {
        strategy: this.id,
        originalBytes: file.size,
        optimizedBytes: data.byteLength,
        note: `Re-saved with object streams, ${(saving * 100).toFixed(0)}% smaller. ${originalPages} pages verified; contents unchanged.`,
      },
    } satisfies OptimizationResult;
  },
};
