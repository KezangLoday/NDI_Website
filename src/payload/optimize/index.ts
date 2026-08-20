/** The optimisation pipeline: a registry of strategies and the hook that runs them. */
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

/** Site media: convert what is worth converting, cap what is too large. */
export const PUBLIC_STRATEGIES: readonly OptimizationStrategy[] = [imageStrategy, pdfStrategy];

/** Applicant documents: dimensions capped, bytes otherwise untouched. */
export const PRIVATE_STRATEGIES: readonly OptimizationStrategy[] = [imagePreserveStrategy];

/** Nothing ran. Recorded so the admin panel can say so rather than show a gap. */
function untouched(file: UploadedFile, note: string): OptimizationReport {
  return { strategy: "none", originalBytes: file.size, optimizedBytes: file.size, note };
}

/** Runs the first strategy that accepts the file. */
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
    /* A strategy that threw must never fail the upload. */
    const reason = error instanceof Error ? error.message : String(error);
    return { report: untouched(file, `Optimisation failed (${reason}); stored as uploaded.`) };
  }
}

/** The collection hook. */
export function optimizeUploadHook(
  strategies: readonly OptimizationStrategy[],
  context: OptimizationContext,
): CollectionBeforeOperationHook {
  return async ({ args, operation, req }) => {
    /* `updateByID` is the operation the admin panel's save button produces; `update` is the bulk form. */
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
      // Mutating the request's file in place is how Payload's own upload extensions do this.
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
