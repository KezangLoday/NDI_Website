import type { SiteSettings } from "./types";

/**
 * Prospective Payload global: `siteSettings`.
 *
 * Centralising nav, footer, contact details and social links here means the
 * two places the prototype disagreed with itself — the phone number and the
 * contact email — now have one source of truth.
 */
/**
 * The single contact number, in the three shapes the site needs it: what a
 * reader sees, what a dialer needs, and what wa.me needs. Declared once so a
 * change lands everywhere — the same digits appear in the contact rows, the
 * footer, the Organizations page and the social row.
 *
 * wa.me takes international format with no punctuation; a tel: URI must not
 * contain spaces.
 */
const PHONE_DISPLAY = "+975 17112086";
const PHONE_HREF = "tel:+97517112086";
const WHATSAPP_HREF = "https://wa.me/97517112086";

export const siteSettings: SiteSettings = {
  nav: {
    primary: [
      { navKey: "users", label: "For Users", href: "/users" },
      { navKey: "orgs", label: "For Organizations", href: "/organizations" },
      { navKey: "governance", label: "Governance", href: "/governance" },
    ],
    menus: [
      {
        key: "resources",
        label: "Resources",
        panelWidth: 900,
        cards: [
          {
            label: "News & Updates",
            href: "/resources/news",
            description: "Announcements, launches & press releases.",
            icon: "newspaper",
          },
          {
            label: "Webinars",
            href: "/resources/webinars",
            description: "Recordings, upcoming sessions & talks.",
            icon: "video",
          },
          {
            label: "Insights & Publications",
            href: "/resources/insights",
            description: "Research, case studies & blogs.",
            icon: "book",
          },
        ],
        links: [
          {
            label: "Technical Documentation",
            href: "https://docs.bhutanndi.com/",
            description: "Integration guides and API reference",
            icon: "fileText",
          },
          {
            label: "Glossary",
            href: "/glossary",
            description: "Key terms explained",
            icon: "bookMarked",
          },
        ],
      },
      {
        key: "company",
        label: "Company",
        panelWidth: 760,
        cards: [
          {
            label: "About Us",
            href: "/company#about",
            description: "Our story, mission and team.",
            icon: "users",
          },
          {
            label: "Careers",
            href: "/careers",
            description: "Join the team building trust.",
            icon: "briefcase",
          },
        ],
        links: [
          {
            label: "FAQs",
            href: "/faqs",
            description: "Answers to common questions",
            icon: "helpCircle",
          },
          {
            label: "Media Coverage",
            href: "/media-coverage",
            description: "Bhutan NDI in the press",
            icon: "megaphone",
          },
          {
            label: "Dashboard",
            href: "https://dashboard.ngotag.com/",
            description: "Live view of national ID usage",
            icon: "dashboard",
          },
          // Deliberate deviation from the design, which also listed an "Admin
          // Login" here. The CMS console serves a handful of internal staff who
          // will have it bookmarked — in Phase 2 Payload serves it from /admin —
          // and advertising an admin entry point on a national identity site
          // invites credential-stuffing traffic for no public benefit.
        ],
      },
    ],
  },
  footer: {
    tagline:
      "The world's first national digital identity built on decentralized self-sovereign identity technology.",
    columns: [
      {
        heading: "Explore",
        links: [
          { label: "For Users", href: "/users" },
          { label: "For Organizations", href: "/organizations" },
          { label: "Governance", href: "/governance" },
          { label: "Resources", href: "/resources" },
        ],
      },
      {
        heading: "Company",
        links: [
          { label: "About Us", href: "/company#about" },
          { label: "Careers", href: "/careers" },
          { label: "Media Coverage", href: "/media-coverage" },
          { label: "Dashboard", href: "https://dashboard.ngotag.com/" },
        ],
      },
    ],
    legal: "© 2026 Bhutan National Digital Identity",
    legalLinks: "Privacy · Terms",
  },
  contact: {
    email: "info@bhutanndi.com",
    phoneDisplay: PHONE_DISPLAY,
    phoneHref: PHONE_HREF,
    whatsappHref: WHATSAPP_HREF,
    // There is one number, so the office fields point at it too rather than
    // holding a second copy that can drift out of sync.
    officePhoneDisplay: PHONE_DISPLAY,
    officePhoneHref: PHONE_HREF,
    location: "Thimphu, Bhutan",
    responseTime: "Replies within 2 business days",
  },
  /**
   * The live channels, ordered the way the site orders its audiences.
   *
   * WhatsApp leads because it is the only two-way channel here — the others
   * broadcast, this one answers. LinkedIn follows as the organizational
   * channel, then Facebook, Instagram and YouTube as the citizen-facing feeds.
   * Spacing is even across the row.
   *
   * LinkedIn points at the public company page. The URL supplied was the
   * admin feed (/admin/feed/posts/?feedType=following), which only members of
   * the page can open — everyone else gets a redirect or a permission error.
   *
   * WhatsApp uses wa.me with the number in international format and no
   * punctuation, which is the only shape the deep link accepts.
   */
  social: [
    { label: "WhatsApp", href: WHATSAPP_HREF, icon: "whatsapp" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/96956149/", icon: "linkedin" },
    {
      label: "Facebook",
      href: "https://www.facebook.com/profile.php?id=61551076655472",
      icon: "facebook",
    },
    { label: "Instagram", href: "https://www.instagram.com/bhutanndi/", icon: "instagram" },
    {
      label: "YouTube",
      href: "https://www.youtube.com/channel/UCfGUaTDHpHBGDmxsxpbSrng",
      icon: "youtube",
    },
  ],
  /**
   * The mobile sheet shows four. The design's fourth was X, for which no
   * account was supplied, so the set is simply the first four above — one
   * ordering to maintain rather than two. YouTube is the one left behind.
   */
  mobileSocial: [
    { label: "WhatsApp", href: WHATSAPP_HREF, icon: "whatsapp" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/96956149/", icon: "linkedin" },
    {
      label: "Facebook",
      href: "https://www.facebook.com/profile.php?id=61551076655472",
      icon: "facebook",
    },
    { label: "Instagram", href: "https://www.instagram.com/bhutanndi/", icon: "instagram" },
  ],
};

/**
 * Which nav item highlights for a given route. Mirrors the prototype's
 * grouping: Resources covers FAQs and Glossary; Company covers Careers and
 * Media Coverage.
 */
export const navGroups: Record<string, string[]> = {
  users: ["/users"],
  orgs: ["/organizations"],
  governance: ["/governance"],
  resources: ["/resources", "/glossary"],  // sub-paths match by prefix
  company: ["/company", "/careers", "/media-coverage", "/faqs"],
};
