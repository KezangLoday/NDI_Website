import type { SiteSettings } from "./types";

/**
 * Prospective Payload global: `siteSettings`.
 *
 * Centralising nav, footer, contact details and social links here means the
 * two places the prototype disagreed with itself — the phone number and the
 * contact email — now have one source of truth.
 */
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
            label: "FAQs",
            href: "/faqs",
            description: "Answers to common questions",
            icon: "helpCircle",
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
    phoneDisplay: "+975 17 12 34 56",
    // The prototype's href contained a literal space ("tel:+9751712 3456"),
    // which is not a dialable tel: URI — normalised here.
    phoneHref: "tel:+97517123456",
    officePhoneDisplay: "+975 2 335 566",
    officePhoneHref: "tel:+9752335566",
    location: "Thimphu, Bhutan",
    responseTime: "Replies within 2 business days",
  },
  social: [
    { label: "WhatsApp", href: "#", icon: "whatsapp" },
    { label: "LinkedIn", href: "#", icon: "linkedin" },
    { label: "Facebook", href: "#", icon: "facebook" },
    { label: "YouTube", href: "#", icon: "youtube" },
    { label: "Instagram", href: "#", icon: "instagram" },
  ],
  mobileSocial: [
    { label: "WhatsApp", href: "#", icon: "whatsapp" },
    { label: "LinkedIn", href: "#", icon: "linkedin" },
    { label: "X", href: "#", icon: "x" },
    { label: "YouTube", href: "#", icon: "youtube" },
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
  resources: ["/resources", "/faqs", "/glossary"],  // sub-paths match by prefix
  company: ["/company", "/careers", "/media-coverage"],
};
