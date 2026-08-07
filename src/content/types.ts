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
  href: string;
  ctaLabel: string;
  ctaIcon: Extract<IconName, "arrowRight" | "playCircle">;
}

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
  /** Logos share a slot and cross-fade; this groups them into that slot. */
  slot: number;
  /** Per-logo optical sizing, carried over from the prototype. */
  maxWidth: string;
  maxHeight: string;
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
  href: string;
  /** Not present in the design, but a real press page needs it. */
  outlet?: string;
}

/** Collection: `jobs` — Careers listings. HR-editable in Phase 2. */
export interface Job {
  id: string;
  slug: string;
  department: string;
  title: string;
  summary: string;
  location: string;
  href: string;
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
    officePhoneDisplay: string;
    officePhoneHref: string;
    location: string;
    responseTime: string;
  };
  social: SocialLink[];
  /** Social links shown in the mobile sheet, a subset of the footer's. */
  mobileSocial: SocialLink[];
}
