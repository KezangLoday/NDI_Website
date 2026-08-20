/** The view types the components render. */

import type { News as PayloadNews } from "@/payload-types";
import type { IconName } from "@/components/ui/icons";

/** A Lexical document, as Payload stores it. */
export type RichTextContent = NonNullable<PayloadNews["body"]>;

/** An image or document from the CMS. */
export interface Media {
  url: string;
  alt: string;
  width: number;
  height: number;
}

/** One of Payload's generated `imageSizes` variants, where one exists. */
export interface MediaVariants extends Media {
  /** 640px wide — cards and grids. */
  card?: string;
  /** 240px square — rails and avatars. */
  thumbnail?: string;
}

/** A file offered for download, with the label an editor gave it. */
export interface Attachment {
  id: string;
  label: string;
  url: string;
  /** Bytes, for the "PDF · 2.4 MB" hint next to a download link. */
  filesize?: number;
  mimeType?: string;
}

/** Collection: `news` — a story or a notice. */
export interface NewsItem {
  id: string;
  slug: string;
  format: "story" | "notice";
  title: string;
  /** The standfirst: shown under the headline and on the card. */
  excerpt: string;
  publishedAt: string;
  /** Editorial label, shown on the cards and the detail page. */
  category: string;
  /** Absent on notices, and on a story whose artwork has not been supplied. */
  image?: MediaVariants;
  /** Where the card links. */
  href: string;
  /** True when `href` leaves the site, which changes the link's affordances. */
  external: boolean;
  /** The full formal headline, for the story page where there is room. */
  headline?: string;
  /** The article. Empty on a notice, and on a story held elsewhere. */
  body?: RichTextContent;
  gallery: GalleryImage[];
  attachments: Attachment[];
  byline?: string;
  /** A link out to the canonical version, where one was published elsewhere. */
  source?: NewsSource;
  /** Lead the newsroom with this story. */
  featured: boolean;
  /** Editorial ordering for the "Popular" rail, low number first. */
  popularRank?: number;
  seo: SeoView;
}

export interface NewsSource {
  url: string;
  label: string;
  /** Chooses the trailing icon: an arrow for an article, a play mark for video. */
  icon: Extract<IconName, "arrowRight" | "playCircle">;
}

export interface GalleryImage {
  id: string;
  image: Media;
  caption?: string;
}

/** Resolved SEO for a page. */
export interface SeoView {
  title: string;
  description: string;
  image?: Media;
  noIndex: boolean;
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
  /** Which display slots this logo appears in. */
  slots: number[];
  /** Per-logo optical sizing, carried over from the prototype. */
  maxWidth: string;
  maxHeight: string;
  /** Render the mark as supplied instead of flattening it to white. */
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
  audience: string;
  question: string;
  answer: RichTextContent;
  /** The answer as plain text, for the client-side search. */
  searchText: string;
}

/** One tab on the FAQ page, from the CMS's FAQ categories. */
export interface FaqAudience {
  id: string;
  slug: string;
  label: string;
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

/* ---- Resources ------------------------------------------------- */
/* Modelled as three arrays now, but shaped to collapse into one `posts` collection with a category facet in Phase 2. */

/** Collection: `webinars`. */
export interface Webinar {
  id: string;
  slug: string;
  sessionStatus: "upcoming" | "recorded";
  title: string;
  description: string;
  category: string;
  /** ISO timestamp — this is the one date on the site that carries a time. */
  startsAt: string;
  endsAt?: string;
  /** Pre-formatted for display, e.g. "21 Aug 2026 · 14:00 BTT". */
  when: string;
  platform?: string;
  speakers: WebinarSpeaker[];
  registration?: WebinarRegistration;
  recording?: WebinarRecording;
  thumbnail?: MediaVariants;
  body?: RichTextContent;
  gallery: GalleryImage[];
  attachments: Attachment[];
  /** e.g. "Recording · 48 min". Empty when no length was recorded. */
  kind?: string;
  seo: SeoView;
}

export interface WebinarSpeaker {
  id: string;
  name: string;
  role?: string;
  photo?: Media;
}

export interface WebinarRegistration {
  url: string;
  label: string;
  note?: string;
}

export interface WebinarRecording {
  url: string;
  durationMinutes?: number;
}

/** What the "Upcoming session" card shows. */
export interface UpcomingEvent {
  webinar: Webinar;
}

export interface UpcomingEventSlot {
  event?: UpcomingEvent;
  /** Shown in place of the card when there is nothing scheduled. */
  emptyStateNote: string;
}

/** Collection: `insights` — research, case studies, reports, blogs. */
export interface Insight {
  id: string;
  slug: string;
  /** The tab this sits under, and the chip shown when the tab is "All". */
  category: string;
  /** Slug of the category, for the tab's identity in the URL and in state. */
  categorySlug: string;
  /** The specific form, e.g. "Research paper". Shown on the card. */
  kind: string;
  title: string;
  description: string;
  publishedAt: string;
  image?: MediaVariants;
  /** The paper itself, offered as a download. */
  document?: Attachment;
  readingMinutes?: number;
  authors: InsightAuthor[];
  body?: RichTextContent;
  /** Set when the version of record lives elsewhere, e.g. a journal PDF. */
  canonicalUrl?: string;
  attachments: Attachment[];
  seo: SeoView;
}

export interface InsightAuthor {
  id: string;
  name: string;
  affiliation?: string;
}

/** A category as a filter tab, derived from what is actually published. */
export interface CategoryFacet {
  id: string;
  slug: string;
  label: string;
  /** How many published documents carry it — a tab with none is not shown. */
  count: number;
}

/** Collection: `glossary`. */
export interface GlossaryTerm {
  id: string;
  slug: string;
  term: string;
  definition: RichTextContent;
  /** The definition as plain text. */
  searchText: string;
  abbreviation?: string;
  category?: string;
  relatedTerms: GlossaryRef[];
}

export interface GlossaryRef {
  id: string;
  slug: string;
  term: string;
}

/* ---- Governance ------------------------------------------------ */
/* Statutory section references (§5–§10) render as inline mono chips, so they are a field rather than punctuation inside the prose. */

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

/** Collection: `team-members` — the people on the Company page. */
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  /** Leadership renders larger and in its own grid. */
  tier: "leadership" | "team";
  /** Absent until a portrait is supplied; a monogram stands in. */
  photo?: MediaVariants;
  /** CSS object-position, to pull the crop towards the face. */
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

/** Collection: `media-coverage`. */
export interface PressItem {
  id: string;
  slug: string;
  category: string;
  title: string;
  publishedAt: string;
  /** The outlet's own page for this article. Validated at the schema level. */
  href: string;
  excerpt: string;
  image?: MediaVariants;
  outlet: string;
  coverageType?: string;
  language?: string;
}

/** Collection: `jobs` — a vacancy and its terms of reference. */
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
  /** The signed notice, offered as a download. */
  torDocument?: Attachment;
  attachments: Attachment[];
  featured: boolean;
  applications: ApplicationWindow;
  seo: SeoView;
}

/** Whether and how this vacancy can be applied for. */
export interface ApplicationWindow {
  state: "open" | "closing-soon" | "closed";
  /** Why it is closed, in words an applicant can act on. */
  closedReason?: string;
  /** Days remaining, when the deadline is near enough to be worth saying. */
  daysRemaining?: number;
  requiredDocuments: DocumentRequirement[];
  optionalDocuments: DocumentRequirement[];
  instructions?: string;
}

/** One document slot on the application form. */
export interface DocumentRequirement {
  /** The `kind` value the form posts back, e.g. `cv`. */
  kind: string;
  label: string;
  required: boolean;
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
