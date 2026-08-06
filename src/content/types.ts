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
