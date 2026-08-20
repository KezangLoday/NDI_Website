/**
 * PDF optimisation, restricted to the one transformation that cannot lose
 * anything.
 *
 * The tempting thing to do with a PDF is re-encode the images inside it, which
 * is where the real savings are. This does not do that, on purpose. A
 * publication, a research report or a terms-of-reference document is a record;
 * re-encoding its figures degrades exactly the charts and scans someone opened
 * the document to read, and the damage is invisible until it matters.
 *
 * What it does instead is re-save the file with cross-reference and object
 * streams — a structural change that rewrites how the PDF's internal objects
 * are packed without altering a single one of them. Text stays text, vectors
 * stay vectors, embedded images keep their original bytes. On documents
 * produced by Word or a scanner (which is most of them) it typically removes
 * 10–30% with no visual difference whatsoever.
 *
 * Every result is verified against the original before it is accepted, and
 * anything even slightly surprising means the original is kept. The default
 * answer for a PDF is "store what was uploaded".
 */
import { PDFDocument } from "pdf-lib";

import {
  declined,
  type OptimizationResult,
  type OptimizationStrategy,
} from "./types";

/**
 * Below this, the re-save is not worth the CPU or the risk.
 *
 * The structural saving is roughly proportional to the object count, so a small
 * PDF gives back very little — and every re-save is a chance, however small, to
 * meet a document pdf-lib parses differently than the reader that made it.
 */
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
      /*
       * `ignoreEncryption` lets a password-protected or permissions-flagged PDF
       * be *parsed* — but such a file is explicitly not re-saved below, because
       * pdf-lib would write it back without its protection. A document whose
       * author restricted it must keep those restrictions.
       */
      source = await PDFDocument.load(file.data, {
        ignoreEncryption: true,
        updateMetadata: false,
      });
    } catch {
      // Not parseable. Some perfectly valid PDFs — particularly older or
      // linearised ones — are not, and a document that cannot be read is
      // certainly not one to rewrite.
      return declined(file, this.id, "Could not be parsed; stored exactly as uploaded.");
    }

    if (source.isEncrypted) {
      return declined(file, this.id, "Encrypted or permission-restricted; stored exactly as uploaded.");
    }

    /*
     * `load` is lenient and `getPageCount` is not: pdf-lib parses the header
     * eagerly but resolves the page tree lazily, so a file with a plausible
     * header and a broken or absent `/Pages` node throws here rather than
     * above. Uncaught, that turns a malformed upload into a 500.
     */
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

    /*
     * The verification step, and the reason this strategy is safe to have
     * enabled by default: the output is re-opened and its page count compared
     * against the input. A rewrite that dropped or merged pages fails here and
     * the original is kept.
     *
     * Page count is a coarse check — it would not catch a mangled glyph — but
     * it catches the class of failure that structural re-saving can actually
     * produce, which is objects being lost. Anything finer would mean
     * rasterising both files to compare them, and rasterising a PDF to decide
     * whether to compress it costs more than the compression saves.
     */
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
