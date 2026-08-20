/**
 * The optimisation pipeline: a registry of strategies and the hook that runs
 * them.
 *
 * Adding a strategy means writing one object and putting it in the list below —
 * nothing else in the CMS needs to know. That is the extensibility the
 * requirement asks for, and it is why the strategies are data rather than a
 * chain of `if (mimeType === …)`.
 *
 * The pipeline runs in a `beforeOperation` collection hook, which is the last
 * point at which `req.file` can still be replaced: Payload's own
 * `generateFileData` reads it immediately afterwards to compute the stored
 * filename, probe the dimensions and generate every `imageSizes` variant. So a
 * file normalised to WebP here has its thumbnails generated as WebP for free,
 * and the dimensions Payload records are the dimensions actually stored.
 */
import type { CollectionBeforeOperationHook } from "payload";

import { imagePreserveStrategy, imageStrategy } from "./image";
import { pdfStrategy } from "./pdf";
import type {
  OptimizationContext,
  OptimizationReport,
  OptimizationStrategy,
  UploadedFile,
} from "./types";

export type { OptimizationContext, OptimizationReport, OptimizationResult, OptimizationStrategy, UploadedFile } from "./types";
export { MAX_EDGE, MAX_EDGE_DOCUMENT } from "./image";

/**
 * Site media: convert what is worth converting, cap what is too large.
 *
 * PDFs are re-saved losslessly. There is no strategy for Word documents,
 * spreadsheets or archives, and that is the intended state — a `.docx` is a ZIP
 * that is already deflated, and rewriting one to save a fraction of a percent
 * risks handing back a file Word will not open.
 */
export const PUBLIC_STRATEGIES: readonly OptimizationStrategy[] = [imageStrategy, pdfStrategy];

/**
 * Applicant documents: dimensions capped, bytes otherwise untouched.
 *
 * No PDF strategy here at all. A CV or a certificate is evidence in a
 * recruitment decision, and the requirement is explicit that integrity beats
 * compression — so the only transformation permitted is resizing a photograph
 * that is far larger than any reader needs.
 */
export const PRIVATE_STRATEGIES: readonly OptimizationStrategy[] = [imagePreserveStrategy];

/** Nothing ran. Recorded so the admin panel can say so rather than show a gap. */
function untouched(file: UploadedFile, note: string): OptimizationReport {
  return { strategy: "none", originalBytes: file.size, optimizedBytes: file.size, note };
}

/**
 * Runs the first strategy that accepts the file.
 *
 * First rather than all: the strategies are alternatives, not stages, and a
 * file that has been converted to WebP should not then be offered to a second
 * image strategy.
 */
export async function optimize(
  file: UploadedFile,
  strategies: readonly OptimizationStrategy[],
  context: OptimizationContext,
): Promise<{ file?: UploadedFile; report: OptimizationReport }> {
  const strategy = strategies.find((candidate) => candidate.accepts(file, context));
  if (!strategy) {
    return { report: untouched(file, `No optimisation available for ${file.mimeType}; stored as uploaded.`) };
  }

  try {
    const result = await strategy.run(file, context);
    if (!result.file) return { report: result.report };
    return {
      file: {
        name: result.file.name,
        mimeType: result.file.mimeType,
        data: result.file.data,
        size: result.file.data.byteLength,
      },
      report: result.report,
    };
  } catch (error) {
    /*
     * A strategy that threw must never fail the upload. The editor's job is to
     * get the file into the CMS; optimisation is something the CMS does for
     * them, and a sharp build that cannot handle one exotic colour profile is
     * not a reason to reject their document. The original is stored and the
     * reason is recorded on the row.
     */
    const reason = error instanceof Error ? error.message : String(error);
    return { report: untouched(file, `Optimisation failed (${reason}); stored as uploaded.`) };
  }
}

/**
 * The collection hook.
 *
 * Writes its findings to `req.context` rather than returning them, because
 * `beforeOperation` cannot contribute to the document's data. A `beforeChange`
 * hook on the same collection picks them up — see `optimizationFields` below.
 */
export function optimizeUploadHook(
  strategies: readonly OptimizationStrategy[],
  context: OptimizationContext,
): CollectionBeforeOperationHook {
  return async ({ args, operation, req }) => {
    /*
     * `updateByID` is the operation the admin panel's save button produces;
     * `update` is the bulk form. Both carry a replacement file, and leaving
     * either out means an image re-uploaded onto an existing document is stored
     * unoptimised while the first upload was not.
     */
    if (operation !== "create" && operation !== "update" && operation !== "updateByID") {
      return args;
    }

    const incoming = req.file;
    if (!incoming) return args;

    const result = await optimize(
      {
        name: incoming.name,
        mimeType: incoming.mimetype,
        data: incoming.data,
        size: incoming.size,
      },
      strategies,
      context,
    );

    if (result.file) {
      // Mutating the request's file in place is how Payload's own upload
      // extensions do this; `generateFileData` reads these three properties a
      // few lines later in the same operation.
      req.file = {
        ...incoming,
        name: result.file.name,
        mimetype: result.file.mimeType,
        data: result.file.data,
        size: result.file.size,
      };
    }

    req.context[OPTIMIZATION_CONTEXT_KEY] = result.report;
    return args;
  };
}

export const OPTIMIZATION_CONTEXT_KEY = "ndiOptimizationReport";
