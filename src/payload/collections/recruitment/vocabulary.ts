/** Recruitment vocabularies that more than one module needs. */

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
