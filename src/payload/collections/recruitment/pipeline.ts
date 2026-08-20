/** The recruitment pipeline. */

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
