import type { CareerValue, Job } from "./types";

/**
 * Prospective Payload collection: `jobs`.
 *
 * The requirement docs assign vacancy management to an HR role, so this is
 * the collection that needs its own access rules in Phase 2.
 *
 * Note the design only carries department, title, summary and location — no
 * employment type, posted date, closing date or full description, and the
 * card links nowhere. A real listing needs those fields and a detail route.
 */
export const jobs: Job[] = [
  {
    id: "senior-backend-engineer",
    slug: "senior-backend-engineer",
    department: "Engineering",
    title: "Senior Backend Engineer",
    summary: "Credential issuance and verification services at national scale.",
    location: "Thimphu",
    href: "#",
  },
  {
    id: "mobile-engineer-wallet",
    slug: "mobile-engineer-wallet",
    department: "Engineering",
    title: "Mobile Engineer — Wallet",
    summary: "Own wallet flows: consent, credentials, backup and recovery.",
    location: "Thimphu",
    href: "#",
  },
  {
    id: "product-designer",
    slug: "product-designer",
    department: "Design",
    title: "Product Designer",
    summary: "Make cryptography feel calm and obvious for every citizen.",
    location: "Thimphu",
    href: "#",
  },
  {
    id: "communications-officer",
    slug: "communications-officer",
    department: "Communications",
    title: "Communications Officer",
    summary: "Tell the NDI story to citizens, partners and the international press.",
    location: "Thimphu",
    href: "#",
  },
];

/** Global: the "why work here" cards in the Careers hero. */
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
