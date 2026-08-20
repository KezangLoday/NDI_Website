/** The read-only record of what the optimisation pipeline did to a file. */
import type { CollectionBeforeChangeHook, Field } from "payload";

import { OPTIMIZATION_CONTEXT_KEY, type OptimizationReport } from "../optimize";

export function optimizationFields(): Field {
  return {
    name: "optimization",
    type: "group",
    label: "Processing",
    admin: {
      description: "What the CMS did to this file when it was uploaded. Set automatically.",
      readOnly: true,
    },
    fields: [
      { name: "strategy", type: "text", label: "Strategy" },
      { name: "originalBytes", type: "number", label: "Original size (bytes)" },
      { name: "optimizedBytes", type: "number", label: "Stored size (bytes)" },
      { name: "note", type: "textarea", label: "Notes" },
    ],
  };
}

/** Reads the report off the request and writes it onto the document. */
export const applyOptimizationReport: CollectionBeforeChangeHook = ({ data, req }) => {
  const report = req.context[OPTIMIZATION_CONTEXT_KEY];
  if (!isReport(report)) return data;
  return {
    ...data,
    optimization: {
      strategy: report.strategy,
      originalBytes: report.originalBytes,
      optimizedBytes: report.optimizedBytes,
      note: report.note ?? null,
    },
  };
};

/** `req.context` is an open bag of unknowns, so the value coming back out of it is checked rather than asserted. */
function isReport(value: unknown): value is OptimizationReport {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.strategy === "string" &&
    typeof candidate.originalBytes === "number" &&
    typeof candidate.optimizedBytes === "number"
  );
}
