import type { Insight, ResourceNews, Webinar } from "./types";

/**
 * Resources content.
 *
 * The requirement docs merged Publications and Blogs into a single "Insights
 * and Publications" bucket because the categories overlap. That points at one
 * `posts` collection in Phase 2 with a `category` (news | webinar | insight)
 * and a `type` sub-field, rather than three separate collections — the three
 * arrays here are shaped so they can collapse into that.
 *
 * The featured story and the three webinar thumbnails have no artwork: those
 * image slots were left empty in the design and need supplying by the client.
 */

export const resourceNews: ResourceNews[] = [
  {
    id: "120-connected-services",
    category: "Announcement",
    title: "Bhutan NDI crosses 120 connected services",
    excerpt:
      "Banks, universities and government agencies now issue or verify credentials through the national wallet.",
    publishedAt: "2026-07-14",
    href: "#",
    featured: true,
  },
  {
    id: "bob-remote-onboarding",
    category: "Integration",
    title: "Bank of Bhutan enables remote account opening with NDI",
    publishedAt: "2026-06-29",
    href: "#",
  },
  {
    id: "wallet-backup-recovery",
    category: "Product",
    title: "Wallet backup & recovery arrives for all users",
    publishedAt: "2026-06-02",
    href: "#",
  },
  {
    id: "ssi-interop-working-group",
    category: "Partnership",
    title: "Bhutan NDI joins global SSI interoperability working group",
    publishedAt: "2026-05-18",
    href: "#",
  },
  {
    id: "scheduled-maintenance",
    category: "Public notice",
    title: "Scheduled maintenance window — credential issuance",
    publishedAt: "2026-04-30",
    href: "#",
  },
];

export const webinars: Webinar[] = [
  {
    id: "credential-design",
    status: "upcoming",
    title: "Credential design for national ecosystems",
    description:
      "A working session on schema design, selective disclosure and revocation, with the Bhutan NDI engineering team.",
    when: "2026-08-21 · 14:00 BTT",
    ctaLabel: "Register to attend",
    href: "#",
  },
  {
    id: "ssi-first-national-identity",
    status: "recorded",
    title: "How Bhutan built an SSI-first national identity",
    kind: "Recording · 48 min",
    href: "#",
  },
  {
    id: "ekyc-in-practice",
    status: "recorded",
    title: "eKYC in practice: lessons from Bhutanese banks",
    kind: "Recording · 36 min",
    href: "#",
  },
  {
    id: "sovereign-identity-keynote",
    status: "recorded",
    title: "Sovereign identity as public infrastructure",
    kind: "Conference · Keynote",
    href: "#",
  },
];

export const insights: Insight[] = [
  {
    id: "measuring-trust",
    type: "Research paper",
    title: "Measuring trust in decentralized national identity",
    description:
      "A framework for evaluating citizen trust in credential-based service delivery.",
    href: "#",
  },
  {
    id: "remote-account-opening",
    type: "Case study",
    title: "Remote account opening at a national bank",
    description:
      "From branch queues to a five-minute digital flow — what changed operationally.",
    href: "#",
  },
  {
    id: "why-ssi",
    type: "Blog",
    title: "Why we chose self-sovereign identity",
    description: "The architectural decision that shaped every service on the platform.",
    href: "#",
  },
  {
    id: "regional-forum",
    type: "Event summary",
    title: "Notes from the regional digital identity forum",
    description:
      "Interoperability, cross-border credentials and what comes next for the region.",
    href: "#",
  },
  {
    id: "digital-transcripts",
    type: "Success story",
    title: "A university issues digital transcripts",
    description: "Graduates carry verifiable records that employers can check in seconds.",
    href: "#",
  },
];
