/**
 * Content types for the Bhutan NDI site.
 *
 * These are shaped deliberately like Payload CMS documents so Phase 2 is a
 * data-source swap rather than a rewrite:
 *
 *  - every record has an `id`, and routable records have a `slug`
 *  - images use {@link Media}, which mirrors Payload's upload document shape,
 *    so moving from /public to S3 only changes `url`
 *  - dates are ISO strings, formatted at render time
 *  - `icon` is a key into the local icon registry, which maps to a Payload
 *    `select` field rather than storing markup in the database
 */

import type { IconName } from "@/components/ui/icons";

/** Mirrors a Payload upload document. */
export interface Media {
  url: string;
  alt: string;
  width: number;
  height: number;
}

/** Collection: `news` */
export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  /** In Payload this becomes richText; a plain string is enough for Phase 1. */
  excerpt: string;
  publishedAt: string;
  image: Media;
  /** Where the story was originally published. The detail route is internal. */
  href: string;
  ctaLabel: string;
  ctaIcon: Extract<IconName, "arrowRight" | "playCircle">;
  /** Editorial label, shown on the cards and the detail page. */
  category: string;
  /**
   * Editorial ordering for the "Popular" tab, low number first. Nothing here
   * measures readership, so this is a field for the newsroom to set rather than
   * something the code should infer — unranked stories simply do not appear.
   */
  popularRank?: number;
  /**
   * The full formal headline, for the story page where there is room. Cards
   * keep the shorter `title` — a press-release headline set at card size wraps
   * to five lines and buries everything under it.
   */
  headline?: string;
  /**
   * The article itself, as blocks. Payload will hold richText; until then this
   * is the smallest shape that carries what a release actually contains —
   * running paragraphs, the "About" sections at the foot, and the links out to
   * each partner. Stories with no body render without it rather than having
   * copy invented for them.
   */
  body?: NewsBlock[];
}

/**
 * A block of article copy.
 *
 * A paragraph may carry one trailing link, which is how the "To learn more,
 * visit:" lines read in the source. Keeping the lead-in in the content rather
 * than the component means the wording stays editorial, not hard-coded.
 */
export type NewsBlock =
  | { kind: "heading"; text: string }
  | { kind: "paragraph"; text: string; link?: { label: string; href: string } };

/** Collection: `organizations` — the "Trusted by" tiles. */
export interface Organization {
  id: string;
  name: string;
  category: string;
  description: string;
  logo: Media;
  /** Which of the three scrolling columns this tile belongs to. */
  column: 1 | 2 | 3;
}

/** Collection: `collaborators` — the partner logo carousel. */
export interface Collaborator {
  id: string;
  name: string;
  logo: Media;
  group: CollaboratorGroupId;
  /**
   * Which display slots this logo appears in. Logos sharing a slot cross-fade
   * between each other; a logo may appear in more than one slot, in which case
   * the carousel guarantees two slots never show it simultaneously.
   */
  slots: number[];
  /** Per-logo optical sizing, carried over from the prototype. */
  maxWidth: string;
  maxHeight: string;
  /**
   * Render the mark as supplied instead of flattening it to white.
   *
   * The row is monochrome by default so a dozen unrelated brands read as one
   * set. Some owners do not permit that — AWS requires its smile to stay
   * orange — so those opt out and are also shown at full opacity, since the
   * dimming is part of the same normalising treatment.
   */
  preserveColor?: boolean;
}

export type CollaboratorGroupId = "service-providers" | "international-partners";

export interface CollaboratorGroup {
  id: CollaboratorGroupId;
  label: string;
}

/** Collection: `capabilities` — the six spotlight cards. */
export interface Capability {
  id: string;
  title: string;
  description: string;
  icon: IconName;
}

/** Collection: `useCases` — the four "What you can do" cards. */
export interface UseCase {
  id: string;
  title: string;
  description: string;
  icon: IconName;
}

/** Global: wallet benefits listed beside the user-guide video. */
export interface WalletBenefit {
  id: string;
  text: string;
}

/** Collection: `services` — options in the contact form dropdown. */
export interface ServiceOption {
  id: string;
  label: string;
}

/** Collection: `faqs`. */
export interface FaqItem {
  id: string;
  audience: "users" | "orgs";
  question: string;
  answer: string;
}

/* ---- Users page ------------------------------------------------ */

export interface HeroStat {
  id: string;
  value: string;
  label: string;
}

export interface UserUseCase {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  /** Bento placement, e.g. "1 / 1 / 2 / 5" — layout travels with the record. */
  gridArea: string;
  tutorialHref?: string;
}

export interface JourneyChapter {
  id: string;
  step: string;
  title: string;
  /** Position along the strip, 0-1, that this chapter settles on. */
  anchor: number;
  caption: string;
}

export interface UserBenefit {
  id: string;
  title: string;
  description: string;
  icon: IconName;
}

export interface StartStep {
  number: string;
  text: string;
}

/* ---- Organizations page ---------------------------------------- */

/** Service → use case → benefit, the structure the requirement docs asked for. */
export interface OrgService {
  id: string;
  tier: "core" | "advanced";
  title: string;
  useCase: string;
  /** Core services state an organizational benefit; advanced ones do not. */
  value?: string;
  icon: IconName;
}

export interface WhyPartnerRow {
  id: string;
  number: string;
  title: string;
  tag: string;
  description: string;
}

export interface PipelineStep {
  code: string;
  title: string;
  tag: string;
  body: string;
  input: string;
  output: string;
  owners: string;
}

/* ---- Resources -------------------------------------------------
   Modelled as three arrays now, but shaped to collapse into one `posts`
   collection with a category facet in Phase 2 — the requirement docs
   explicitly merged Publications and Blogs because the types overlap. */

export interface ResourceNews {
  id: string;
  category: string;
  title: string;
  publishedAt: string;
  href: string;
  excerpt?: string;
  featured?: boolean;
  /** The design leaves the featured artwork unfilled; client to supply. */
  image?: Media;
}

export interface Webinar {
  id: string;
  status: "upcoming" | "recorded";
  title: string;
  href: string;
  description?: string;
  /** Upcoming sessions only. */
  when?: string;
  ctaLabel?: string;
  /** Recorded sessions only, e.g. "Recording · 48 min". */
  kind?: string;
  thumbnail?: Media;
}

export interface Insight {
  id: string;
  slug: string;
  /** Which tab this sits under, and the chip shown when the tab is "All". */
  category: InsightCategory;
  /** The specific form, e.g. "Research paper" or "Field note". Shown on the card. */
  type: string;
  title: string;
  description: string;
  publishedAt: string;
  image: Media;
  readingMinutes: number;
  body?: NewsBlock[];
  /** Set when the canonical version lives elsewhere, e.g. a journal PDF. */
  href?: string;
}

export type InsightCategory = "research" | "case-studies" | "blogs";

/** Collection: `glossary`. */
export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
}

/* ---- Governance ------------------------------------------------
   Statutory section references (§5–§10) render as inline mono chips, so
   they are a field rather than punctuation inside the prose. */

export interface GovernanceBullet {
  text: string;
  ref?: string;
}

export interface TocEntry {
  href: string;
  label: string;
}

export interface InstitutionalBody {
  id: string;
  label: string;
  subtitle: string;
  paragraphs: string[];
  ref: string;
}

export interface GovernanceSpec {
  id: string;
  title: string;
  description: string;
  ref?: string;
}

export interface GovernanceOffence {
  id: string;
  offence: string;
  grade: string;
}

export interface GovernanceChapter {
  number: string;
  title: string;
}

/** Collection: `team` — the people on the Company page. */
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  /** Leadership renders larger and in its own grid. */
  tier: "leadership" | "team";
  /** Absent until the client supplies a portrait; a monogram stands in. */
  photo?: Media;
  /** CSS object-position, carried over from the design tool's crop. */
  photoPosition?: string;
}

export interface VisionPillar {
  id: string;
  label: string;
  icon: Media;
}

/** One run of text in a mission statement; `emphasis` renders it in mint. */
export interface TextSegment {
  text: string;
  emphasis?: boolean;
}

export interface MissionStatement {
  id: string;
  icon: Media;
  segments: TextSegment[];
}

export interface StoryStat {
  id: string;
  value: string;
  label: string;
}

/** Collection: `press` — Media Coverage entries. */
export interface PressItem {
  id: string;
  category: string;
  title: string;
  publishedAt: string;
  /** Always the outlet's own page. This collection has no detail route: the
   *  point of press coverage is to read it where it was published. */
  href: string;
  excerpt: string;
  image: Media;
  /** Not present in the design, but a real press page needs it. */
  outlet?: string;
}

/** Collection: `jobs` — Careers listings. HR-editable in Phase 2. */
/** What the contract is, shown as a pill on the vacancy card. */
export type EmploymentType = "Full time" | "Part time" | "Contract";

/** One numbered clause of the terms of reference. */
export interface JobSection {
  heading: string;
  items: string[];
}

export interface Job {
  id: string;
  slug: string;
  department: string;
  title: string;
  summary: string;
  location: string;
  /** Key into the local icon registry — a Payload `select`, not stored markup. */
  icon: IconName;
  employmentType: EmploymentType;
  /** How many people are being hired into this role. */
  slots: number;
  postedAt: string;
  closesAt: string;
  /** Seniority, shown beside the department. */
  level: string;
  /** The opening paragraph of the terms of reference. */
  about: string;
  /** The body of the ToR: duties, eligibility, what is offered. */
  sections: JobSection[];
}

/** Global: the "why work here" cards. */
export interface CareerValue {
  id: string;
  title: string;
  description: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface MegaMenuCard extends NavLink {
  description: string;
  icon: IconName;
}

export interface MegaMenu {
  key: string;
  label: string;
  /** Width of the dropdown panel, which differs per menu in the design. */
  panelWidth: number;
  cards: MegaMenuCard[];
  links: MegaMenuCard[];
}

export interface SocialLink {
  label: string;
  href: string;
  icon: IconName;
}

/** Global: `siteSettings` */
export interface SiteSettings {
  nav: {
    primary: (NavLink & { navKey: string })[];
    menus: MegaMenu[];
  };
  footer: {
    tagline: string;
    columns: { heading: string; links: NavLink[] }[];
    legal: string;
    legalLinks: string;
  };
  contact: {
    email: string;
    /** Displayed alongside the office number in the footer. */
    phoneDisplay: string;
    phoneHref: string;
    /** Same number as phoneHref, as a wa.me deep link. */
    whatsappHref: string;
    officePhoneDisplay: string;
    officePhoneHref: string;
    location: string;
    responseTime: string;
  };
  social: SocialLink[];
  /** Social links shown in the mobile sheet, a subset of the footer's. */
  mobileSocial: SocialLink[];
}
