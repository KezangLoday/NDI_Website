/**
 * The recruitment audit log.
 *
 * Append-only by construction: `create` is closed to every API caller, so the
 * only writes are the ones `writeAudit` makes from inside the operation being
 * recorded, and `update` is closed to everyone including superadmin. A log that
 * can be edited by the people it records is not a log.
 *
 * Deletion is superadmin-only and exists for one reason: data-retention. An
 * applicant's data is kept for a stated period and then removed, and the log
 * lines naming them have to go with it.
 */
import type { CollectionConfig } from "payload";

import { noOne, recruitmentAccess, superadminOnly } from "../access";
import { AUDIT_ACTIONS } from "./recruitment/history";

export const AuditLog: CollectionConfig = {
  slug: "audit-log",
  labels: { singular: "Audit entry", plural: "Audit log" },
  admin: {
    useAsTitle: "summary",
    defaultColumns: ["occurredAt", "action", "reference", "actor", "summary"],
    group: "Recruitment",
    description: "What was done to which application, when, and by whom.",
    listSearchableFields: ["summary", "reference"],
  },
  defaultSort: "-occurredAt",
  access: {
    read: recruitmentAccess,
    create: noOne,
    update: noOne,
    delete: superadminOnly,
  },
  fields: [
    {
      name: "occurredAt",
      type: "date",
      required: true,
      index: true,
      admin: { date: { pickerAppearance: "dayAndTime", displayFormat: "d MMM yyyy, HH:mm" } },
    },
    {
      name: "action",
      type: "select",
      required: true,
      index: true,
      options: [...AUDIT_ACTIONS],
    },
    { name: "summary", type: "text", required: true },
    {
      name: "actor",
      type: "relationship",
      relationTo: "users",
      label: "Done by",
      admin: {
        description: "Empty where the action was the applicant's own — a submission, say.",
      },
    },
    {
      /**
       * The document, as a slug and a stringified id rather than a
       * relationship.
       *
       * A relationship would cascade to null when the application is deleted,
       * which is precisely when the log line matters most — "who deleted this,
       * and when" has to survive the deletion. The reference number below is
       * what makes the orphaned line still readable.
       */
      name: "collectionSlug",
      type: "text",
      required: true,
      index: true,
      label: "Collection",
    },
    { name: "documentId", type: "text", required: true, index: true, label: "Document ID" },
    {
      name: "reference",
      type: "text",
      index: true,
      label: "Application reference",
      admin: { description: "Kept here so the entry stays meaningful if the application is removed." },
    },
  ],
  timestamps: true,
};
