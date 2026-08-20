/**
 * The recruitment pipeline.
 *
 * This file is the single place a status is defined. Adding "Second interview"
 * means adding one entry below and nothing else — the select options, the
 * admin filters, the status-history labels and the terminal-state logic are all
 * derived from this list.
 *
 * A note on why these are a typed constant rather than a `recruitment-statuses`
 * collection, since the requirements raise the option: the statuses are an
 * internal workflow, not content. Nothing on the public site reads them, so
 * there is no frontend to "hard-code them throughout" — the concern the
 * requirement is guarding against. Against that, a select column is what makes
 * Payload's list-view filters and `where` clauses work directly on the status,
 * which is the single most useful thing HR does with this data ("show me
 * everyone shortlisted for this post"). A relationship would turn every such
 * filter into a join and every status change into a lookup. If the statuses ever
 * need to be editable by HR without a deploy, this list is what a seeded
 * collection would be populated from.
 */

export const APPLICATION_STATUSES = [
  {
    value: "submitted",
    label: "Submitted",
    /** `active` still in play, `closed` finished either way. */
    stage: "active",
    description: "Received and not yet looked at.",
  },
  { value: "under-review", label: "Under review", stage: "active", description: "Being screened." },
  { value: "shortlisted", label: "Shortlisted", stage: "active", description: "Through screening." },
  {
    value: "interview-scheduled",
    label: "Interview scheduled",
    stage: "active",
    description: "Invited; interview in the diary.",
  },
  { value: "interviewed", label: "Interviewed", stage: "active", description: "Interview done." },
  {
    value: "assessment",
    label: "Assessment",
    stage: "active",
    description: "Sitting a written or practical test.",
  },
  {
    value: "reference-check",
    label: "Reference check",
    stage: "active",
    description: "References and clearances being verified.",
  },
  {
    value: "selected",
    label: "Selected",
    stage: "active",
    description: "Chosen, offer not yet sent.",
  },
  {
    value: "offer-sent",
    label: "Offer sent",
    stage: "active",
    description: "Awaiting the candidate's answer.",
  },
  { value: "hired", label: "Hired", stage: "closed", description: "Accepted and joining." },
  { value: "rejected", label: "Rejected", stage: "closed", description: "Not proceeding." },
  {
    value: "withdrawn",
    label: "Withdrawn",
    stage: "closed",
    description: "The candidate pulled out.",
  },
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]["value"];

export const INITIAL_STATUS: ApplicationStatus = "submitted";

/** The status that requires a reason to be recorded. */
export const REJECTED_STATUS: ApplicationStatus = "rejected";

export const APPLICATION_STATUS_OPTIONS = APPLICATION_STATUSES.map(({ value, label }) => ({
  value,
  label,
}));

const BY_VALUE = new Map<string, (typeof APPLICATION_STATUSES)[number]>(
  APPLICATION_STATUSES.map((status) => [status.value, status]),
);

export function statusLabel(value: string): string {
  return BY_VALUE.get(value)?.label ?? value;
}

/** Whether an application in this status is still being progressed. */
export function isActiveStatus(value: string): boolean {
  return BY_VALUE.get(value)?.stage === "active";
}

export function isApplicationStatus(value: unknown): value is ApplicationStatus {
  return typeof value === "string" && BY_VALUE.has(value);
}
