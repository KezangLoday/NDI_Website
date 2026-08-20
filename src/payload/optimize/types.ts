/** The optimisation pipeline's contract. */

export interface UploadedFile {
  readonly name: string;
  readonly mimeType: string;
  readonly data: Buffer;
  readonly size: number;
}

/** What a strategy did, recorded on the document for the admin to see. */
export interface OptimizationReport {
  /** Identifier of the strategy that ran, or `none`. */
  readonly strategy: string;
  readonly originalBytes: number;
  readonly optimizedBytes: number;
  /** Why a strategy declined, when it did. Shown in the admin panel. */
  readonly note?: string;
}

export interface OptimizationResult {
  /** Absent when the strategy declined; the original file is then kept. */
  readonly file?: {
    readonly name: string;
    readonly mimeType: string;
    readonly data: Buffer;
  };
  readonly report: OptimizationReport;
}

export interface OptimizationContext {
  /** How much integrity matters relative to size. */
  readonly integrity: "lossy" | "lossless";
}

export interface OptimizationStrategy {
  readonly id: string;
  /** Whether this strategy handles the given file. */
  accepts(file: UploadedFile, context: OptimizationContext): boolean;
  run(file: UploadedFile, context: OptimizationContext): Promise<OptimizationResult>;
}

/** Convenience for a strategy that decided to leave the file alone. */
export function declined(
  file: UploadedFile,
  strategy: string,
  note: string,
): OptimizationResult {
  return {
    report: {
      strategy,
      originalBytes: file.size,
      optimizedBytes: file.size,
      note,
    },
  };
}
