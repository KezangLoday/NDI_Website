/** The recruitment audit log. */
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
      /** The document, as a slug and a stringified id rather than a relationship. */
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
