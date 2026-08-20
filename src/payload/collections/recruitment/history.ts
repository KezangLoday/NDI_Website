/** The status history, and the audit trail behind it. */
import type {
  CollectionAfterChangeHook,
  CollectionBeforeChangeHook,
  Field,
  PayloadRequest,
} from "payload";

import { statusLabel } from "./pipeline";

/** The read-only timeline shown on the application. */
export function statusHistoryField(): Field {
  return {
    name: "statusHistory",
    type: "array",
    label: "Recruitment timeline",
    admin: {
      readOnly: true,
      initCollapsed: false,
      description:
        "Every status change, in order. Appended automatically — there is nothing to fill in here.",
    },
    labels: { singular: "Change", plural: "Changes" },
    fields: [
      { name: "from", type: "text", label: "From" },
      { name: "to", type: "text", label: "To", required: true },
      { name: "changedAt", type: "date", label: "When", required: true },
      {
        name: "changedBy",
        type: "relationship",
        relationTo: "users",
        label: "By",
      },
      {
        name: "note",
        type: "textarea",
        label: "Reason",
        admin: { description: "Carried over from the reason given at the time." },
      },
    ],
  };
}

/** Appends to the timeline whenever the status changes. */
export const recordStatusChange: CollectionBeforeChangeHook = ({
  data,
  operation,
  originalDoc,
  req,
}) => {
  const nextStatus = typeof data.status === "string" ? data.status : undefined;
  if (!nextStatus) return data;

  const previousStatus =
    operation === "update" && typeof originalDoc?.status === "string" ? originalDoc.status : undefined;

  // Nothing moved.
  if (operation === "update" && previousStatus === nextStatus) {
    return { ...data, statusChangeNote: null };
  }

  const existing = Array.isArray(data.statusHistory)
    ? data.statusHistory
    : Array.isArray(originalDoc?.statusHistory)
      ? originalDoc.statusHistory
      : [];

  const entry = {
    from: previousStatus ?? null,
    to: nextStatus,
    changedAt: new Date().toISOString(),
    /* Null on the initial submission, which is correct: the applicant made that change and the applicant is not a CMS user. */
    changedBy: req.user?.id ?? null,
    note: typeof data.statusChangeNote === "string" && data.statusChangeNote.length > 0
      ? data.statusChangeNote
      : null,
  };

  return {
    ...data,
    statusHistory: [...existing, entry],
    statusChangeNote: null,
  };
};

/** The transient "why" box that sits next to the status select. */
export function statusChangeNoteField(): Field {
  return {
    name: "statusChangeNote",
    type: "textarea",
    label: "Reason for this change",
    admin: {
      description:
        "Optional. Recorded against this change in the timeline, then cleared. Use it for the one line that explains the decision.",
    },
  };
}

/* ---- The audit log --------------------------------------------- */

export const AUDIT_ACTIONS = [
  { value: "application.submitted", label: "Application submitted" },
  { value: "application.status-changed", label: "Status changed" },
  { value: "application.assigned", label: "Assigned to HR" },
  { value: "application.note-added", label: "Internal note added" },
  { value: "application.updated", label: "Applicant details changed" },
  { value: "application.deleted", label: "Application deleted" },
  { value: "job.closed", label: "Job closed" },
  { value: "job.reopened", label: "Job reopened" },
] as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[number]["value"];

export interface AuditEntry {
  readonly action: AuditAction;
  readonly summary: string;
  readonly collectionSlug: string;
  readonly documentId: string | number;
  readonly reference?: string;
}

/** Writes one line to the audit log. */
export async function writeAudit(req: PayloadRequest, entry: AuditEntry): Promise<void> {
  try {
    await req.payload.create({
      collection: "audit-log",
      data: {
        action: entry.action,
        summary: entry.summary,
        collectionSlug: entry.collectionSlug,
        documentId: String(entry.documentId),
        reference: entry.reference ?? null,
        actor: req.user?.id ?? null,
        occurredAt: new Date().toISOString(),
      },
      /* The log is append-only and nobody may write to it directly, so the write has to come from inside the operation being recorded. */
      overrideAccess: true,
      req,
    });
  } catch (error) {
    req.payload.logger.error(
      { err: error, entry },
      "Could not write audit-log entry; the recorded action itself succeeded.",
    );
  }
}

/** `afterChange` on job applications, logging the things HR would want to look back at. */
export const auditApplicationChange: CollectionAfterChangeHook = async ({
  doc,
  operation,
  previousDoc,
  req,
}) => {
  const reference = typeof doc.reference === "string" ? doc.reference : undefined;
  const base = { collectionSlug: "job-applications", documentId: doc.id, reference } as const;

  if (operation === "create") {
    await writeAudit(req, {
      ...base,
      action: "application.submitted",
      summary: `Application ${reference ?? doc.id} submitted for ${jobLabel(doc)}.`,
    });
    return doc;
  }

  if (doc.status !== previousDoc?.status) {
    await writeAudit(req, {
      ...base,
      action: "application.status-changed",
      summary: `${statusLabel(String(previousDoc?.status ?? "—"))} → ${statusLabel(String(doc.status))}.`,
    });
  }

  if (idOf(doc.assignedTo) !== idOf(previousDoc?.assignedTo)) {
    const assigned = idOf(doc.assignedTo);
    await writeAudit(req, {
      ...base,
      action: "application.assigned",
      summary: assigned ? `Assigned to user ${assigned}.` : "Assignment cleared.",
    });
  }

  const noteCount = countOf(doc.internalNotes);
  if (noteCount > countOf(previousDoc?.internalNotes)) {
    await writeAudit(req, {
      ...base,
      action: "application.note-added",
      summary: `Internal note added (${noteCount} in total).`,
    });
  }

  return doc;
};

/** The job's title, however deeply the relationship happens to be populated. */
function jobLabel(doc: Record<string, unknown>): string {
  if (typeof doc.jobTitleSnapshot === "string" && doc.jobTitleSnapshot.length > 0) {
    return doc.jobTitleSnapshot;
  }
  const job = doc.job;
  if (typeof job === "object" && job !== null && "title" in job) {
    const title = (job as { title?: unknown }).title;
    if (typeof title === "string") return title;
  }
  return "an unnamed vacancy";
}

/** A relationship field's id, whether Payload returned it populated or not. */
function idOf(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "object" && "id" in value) {
    const id = (value as { id?: unknown }).id;
    if (typeof id === "string" || typeof id === "number") return String(id);
  }
  return null;
}

function countOf(value: unknown): number {
  return Array.isArray(value) ? value.length : 0;
}
