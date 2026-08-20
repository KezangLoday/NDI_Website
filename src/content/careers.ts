import type { CareerValue } from "./types";

/**
 * The "why work here" cards on the careers page.
 *
 * Static, and deliberately so. These are four claims the organisation is making
 * about itself — they change when the organisation does, not when a vacancy
 * opens — and they belong to the page's design rather than to a collection HR
 * maintains. The vacancies themselves are CMS-managed; see the `jobs`
 * collection.
 */
export const careerValues: CareerValue[] = [
  {
    id: "national-impact",
    title: "National impact",
    description: "Ship infrastructure used by citizens and institutions every day.",
  },
  {
    id: "real-ownership",
    title: "Real ownership",
    description: "Small teams, whole problems, decisions made close to the work.",
  },
  {
    id: "frontier-technology",
    title: "Frontier technology",
    description: "Self-sovereign identity, verifiable credentials, applied cryptography.",
  },
  {
    id: "based-in-thimphu",
    title: "Based in Thimphu",
    description: "With partners and collaborators across the world.",
  },
];
