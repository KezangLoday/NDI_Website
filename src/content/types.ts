/**
 * The view types the components render.
 *
 * These sit between Payload and the components on purpose, and the boundary is
 * worth keeping rather than passing generated document types straight through:
 *
 *  - **Payload's types describe storage; these describe a rendered page.** A
 *    news story's `category` is a relationship in the database and a word on a
 *    chip on screen. Resolving that once, in a mapper, is better than every
 *    component learning to cope with `number | Category`.
 *  - **Optionality means different things on each side.** Almost every Payload
 *    field is nullable because a draft can be half-finished; by the time a
 *    published document reaches a component, the required things are required.
 *  - **Dates stay plain `YYYY-MM-DD` strings.** `formatNewsDate` is hand-rolled
 *    and UTC-based so the server render and the client hydration are
 *    byte-identical, and Payload returns full ISO timestamps — so the mappers
 *    narrow them rather than every caller remembering to.
 *
 * Anything not managed by the CMS — the home page, the users and organizations
 * pages, governance, site settings — still comes from the modules in this
 * directory and keeps its shape here unchanged.
 */

import type { News as PayloadNews } from "@/payload-types";
import type { IconName } from "@/components/ui/icons";

/**
 * A Lexical document, as Payload stores it.
 *
 * Derived from a generated field type rather than restated, so the renderer
 * cannot drift from what the editor actually produces. Payload emits the Lexical
 * shape inline on each `richText` field rather than as a named type, so one
 * field stands in for all of them — they are structurally identical. Rendered with `ArticleBody` or
 * `ProseBody`; tested for emptiness with `hasRichText`, because Lexical's empty
 * value is a populated tree rather than null.
 */
export type RichTextContent = NonNullable<PayloadNews["body"]>;

/**
 * An image or document from the CMS.
 *
 * `url` is relative when the local storage adapter is in force and absolute
 * when S3 is; `mediaUrl()` handles both. `width` and `height` come from
 * Payload's own probe of the stored file, which is what lets `next/image`
 * reserve the right space and avoid a layout shift.
 */
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

/**
 * Collection: `news` — a story or a notice.
 *
 * One type for both shapes, because the archive grid renders them side by side
 * and the difference is which optional fields are filled. `format` is what a
 * component narrows on.
 */
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
  /**
   * Where the card links.
   *
   * A story always links to its own page. A notice links out when it carries an
   * external URL, and to its own page when it does not — so an announcement
   * with no home elsewhere still has somewhere to live.
   */
  href: string;
  /** True when `href` leaves the site, which changes the link's affordances. */
  external: boolean;
  /**
   * The full formal headline, for the story page where there is room. Cards
   * keep the shorter `title` — a press-release headline set at card size wraps
   * to five lines and buries everything under it.
   */
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
  /**
   * Editorial ordering for the "Popular" rail, low number first. Nothing here
   * measures readership, so this is a field for the newsroom to set rather than
   * something the code should infer — unranked stories simply do not appear.
   */
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

/**
 * Resolved SEO for a page.
 *
 * The fallbacks are applied in the mapper, not in the page, so a component
 * never has to know that a blank meta title means "use the headline".
 */
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

/**
 * Collection: `faqs`.
 *
 * `audience` is a category slug rather than a fixed union: the two the site
 * needs are seeded records, and a third can be added in the admin panel without
 * a deployment. {@link FaqAudience} is what the tabs are built from.
 */
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

/* ---- Resources -------------------------------------------------
   Modelled as three arrays now, but shaped to collapse into one `posts`
   collection with a category facet in Phase 2 — the requirement docs
   explicitly merged Publications and Blogs because the types overlap. */

/**
 * Collection: `webinars`.
 *
 * `sessionStatus` decides which of two very different cards renders: an
 * upcoming session is a banner with a registration button, a recording is a
 * thumbnail in a grid.
 */
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

/**
 * What the "Upcoming session" card shows.
 *
 * A resolved answer rather than a list to filter: the global's selection, the
 * fallback rule and the "has it already happened" check are all applied in the
 * mapper, so the component either has a session or renders the empty state.
 */
export interface UpcomingEvent {
  webinar: Webinar;
}

export interface UpcomingEventSlot {
  event?: UpcomingEvent;
  /** Shown in place of the card when there is nothing scheduled. */
  emptyStateNote: string;
}

/**
 * Collection: `insights` — research, case studies, reports, blogs.
 *
 * `category` is the tab and the chip; `kind` is the specific form printed
 * beside it ("Research paper", "Field note"). Both come from the CMS, and
 * neither is a fixed list in the frontend any more — which is why the index
 * page derives its tabs from the data rather than from a constant.
 */
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
  /**
   * The definition as plain text.
   *
   * The page searches across terms and definitions in the browser, and rich
   * text cannot be searched with `includes`. Flattening it once on the server
   * keeps the search instant and keeps the Lexical tree out of the client
   * bundle's hot path.
   */
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

/**
 * Collection: `team-members` — the people on the Company page.
 *
 * The page shows three things and this type carries three things. The extra
 * fields the collection holds — department, biography, email, social links —
 * are deliberately not surfaced here: adding one to the page later means
 * widening this type and the mapper, which is a change someone makes on
 * purpose rather than data appearing on a public page because it was in the
 * database.
 */
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

/**
 * Collection: `media-coverage`.
 *
 * Every entry links off-site and there is no detail route, which is deliberate:
 * the article belongs to the outlet that published it. `href` is therefore
 * always external and always required.
 */
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

/**
 * Collection: `jobs` — a vacancy and its terms of reference.
 *
 * `applications` carries the resolved answer to "may this be applied for right
 * now", worked out on the server from three separate conditions. The form and
 * the deadline notice both read it; neither re-derives it, because a second
 * implementation of that rule is a second answer.
 */
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

/**
 * Whether and how this vacancy can be applied for.
 *
 * `state` drives what the page says: an open form, a "closing soon" warning
 * above it, or a closed notice in place of it.
 */
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
