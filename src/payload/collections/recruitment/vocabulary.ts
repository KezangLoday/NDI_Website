/**
 * Recruitment vocabularies that more than one module needs.
 *
 * These live here rather than on the collection that displays them because the
 * collection imports its own submission endpoint, and the endpoint needs to
 * validate against the same lists — which through the collection would be a
 * cycle. A vocabulary is not owned by the form that renders it, so this is
 * where it belongs anyway.
 */

/** Highest level of education an applicant may declare. */
export const EDUCATION_LEVELS = [
  { value: "class-10", label: "Class X" },
  { value: "class-12", label: "Class XII" },
  { value: "diploma", label: "Diploma" },
  { value: "bachelors", label: "Bachelor's degree" },
  { value: "masters", label: "Master's degree" },
  { value: "doctorate", label: "Doctorate" },
] as const;

export type EducationLevel = (typeof EDUCATION_LEVELS)[number]["value"];
