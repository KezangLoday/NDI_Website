/**
 * The optimisation pipeline's contract.
 *
 * A strategy takes an uploaded file and either returns a replacement for it or
 * declines. Declining is the default and the safe answer: the requirement is to
 * optimise where there is a reliable mechanism, which means every file type
 * without one passes through byte-for-byte rather than being run through
 * something hopeful.
 */

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
  /**
   * How much integrity matters relative to size.
   *
   * `lossy` is right for site artwork, where a smaller WebP that looks the same
   * is a straight win. `lossless` is right for anything an applicant uploads:
   * a certificate that has been re-encoded is a certificate whose authenticity
   * is now arguable, and no saving is worth that.
   */
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
