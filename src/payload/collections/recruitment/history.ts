/**
 * The status history, and the audit trail behind it.
 *
 * HR needs to answer "what happened to this application, and who did it" — for
 * their own coordination, and because a recruitment decision in a public body
 * is a decision that can be asked about later. Storing only the current status
 * makes that unanswerable.
 *
 * Two mechanisms, deliberately:
 *
 *  - **`statusHistory` on the application** is the timeline HR reads. It lives
 *    on the document, so it is right there when the application is open, and it
 *    is read-only in the admin — appended by the hook below, never typed.
 *
 *  - **The `audit-log` collection** is the wider record: assignments, note
 *    additions, jobs being closed. Separate because it spans documents and
 *    collections, and because an append-only log is a different thing from a
 *    field on a row.
 *
 * Neither is a general-purpose event-sourcing system, which the requirements
 * explicitly do not want. They record the handful of actions that matter.
 */
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

/**
 * Appends to the timeline whenever the status changes.
 *
 * Runs on `beforeChange` so the new entry is written in the same operation as
 * the status itself: there is no window in which the status has moved and the
 * timeline has not, and no second write to fail independently.
 *
 * The reason is taken from `statusChangeNote`, a transient field HR fills in
 * when moving someone along. It is cleared afterwards so the box is empty for
 * the next change rather than repeating the last one.
 */
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

  // Nothing moved. The commonest update by far — HR adding a note, or assigning
  // someone — and it must not litter the timeline.
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
    /*
     * Null on the initial submission, which is correct: the applicant made that
     * change and the applicant is not a CMS user. An entry attributing it to
     * nobody is more honest than one attributing it to whoever happens to be
     * signed in.
     */
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

/**
 * The transient "why" box that sits next to the status select.
 *
 * Not stored: `recordStatusChange` moves its value into the timeline entry and
 * nulls it. Keeping it as a real field rather than a UI component means it
 * arrives through the API too, so a status change made programmatically can
 * carry its reason.
 */
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

/**
 * Writes one line to the audit log.
 *
 * Failures are swallowed and logged. An audit entry that could not be written
 * must never roll back the thing it was recording — refusing to accept an
 * application because the log write failed would be a far worse outcome than an
 * incomplete log, and the application itself is the record that matters.
 */
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
      /* The log is append-only and nobody may write to it directly, so the
       * write has to come from inside the operation being recorded. */
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

/**
 * `afterChange` on job applications, logging the things HR would want to look
 * back at.
 *
 * Deliberately not "log every field that changed". A diff of an entire
 * application on every save is noise that buries the four events anybody
 * actually asks about: it arrived, it moved, it was assigned, it was annotated.
 */
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

/**
 * A relationship field's id, whether Payload returned it populated or not.
 *
 * `depth` decides which, and it differs between the admin panel and an API
 * call — so comparing the raw values would report a spurious change whenever
 * the two sides of a comparison were populated differently.
 */
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
