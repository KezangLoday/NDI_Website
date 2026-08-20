/**
 * The shapes the seed data is written in.
 *
 * These used to be the site's own content types, and they moved here when the
 * CMS took over the collections they describe. Keeping them separate from
 * `src/content/types.ts` is deliberate: those types now describe what a
 * *rendered page* needs, and this data is what goes *into* the database. Tying
 * the two together would mean a change to a card's props rippling into the seed
 * fixtures, which is backwards.
 */

/** A file under `public/`, to be uploaded into the Media collection. */
export interface SeedMedia {
  url: string;
  alt: string;
  width: number;
  height: number;
}

/**
 * A block of article copy.
 *
 * The seed converts these to Lexical before writing them — see
 * `seed/lexical.ts`. A paragraph may carry one trailing link, which is how the
 * "To learn more, visit:" lines read in the source releases.
 */
export type SeedBlock =
  | { kind: "heading"; text: string }
  | { kind: "paragraph"; text: string; link?: { label: string; href: string } };

export interface SeedNewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  image: SeedMedia;
  href: string;
  ctaLabel: string;
  ctaIcon: "arrowRight" | "playCircle";
  category: string;
  popularRank?: number;
  headline?: string;
  body?: SeedBlock[];
}

export interface SeedNotice {
  id: string;
  category: string;
  title: string;
  publishedAt: string;
  href: string;
  excerpt?: string;
  featured?: boolean;
  image?: SeedMedia;
}

export interface SeedWebinar {
  id: string;
  status: "upcoming" | "recorded";
  title: string;
  href: string;
  description?: string;
  when?: string;
  ctaLabel?: string;
  kind?: string;
  thumbnail?: SeedMedia;
}

export interface SeedInsight {
  id: string;
  slug: string;
  category: "research" | "case-studies" | "blogs";
  type: string;
  title: string;
  description: string;
  publishedAt: string;
  image: SeedMedia;
  readingMinutes: number;
  body?: SeedBlock[];
  href?: string;
}

export interface SeedGlossaryTerm {
  id: string;
  term: string;
  definition: string;
}

export interface SeedFaq {
  id: string;
  audience: "users" | "orgs";
  question: string;
  answer: string;
}

export interface SeedPressItem {
  id: string;
  category: string;
  title: string;
  publishedAt: string;
  href: string;
  excerpt: string;
  image: SeedMedia;
  outlet?: string;
}

export interface SeedJobSection {
  heading: string;
  items: string[];
}

export interface SeedJob {
  id: string;
  slug: string;
  department: string;
  title: string;
  summary: string;
  location: string;
  employmentType: "Full time" | "Part time" | "Contract";
  slots: number;
  postedAt: string;
  closesAt: string;
  level: string;
  about: string;
  sections: SeedJobSection[];
}

export interface SeedTeamMember {
  id: string;
  name: string;
  role: string;
  tier: "leadership" | "team";
  photo?: SeedMedia;
  photoPosition?: string;
}
