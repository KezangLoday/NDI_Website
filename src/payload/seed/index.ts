/** Seeds the CMS with the content the site was built against. */
import { readFile } from "node:fs/promises";
import path from "node:path";

import type { Payload } from "payload";

import type { Taxonomy } from "../fields/taxonomy";
import { seedSuperadmin } from "../env";
import { SEED_CATEGORIES, categorySlugFor } from "./categories";
import { blocksToLexical, emptyLexical, plainToLexical } from "./lexical";
import { faqs } from "./data/faqs";
import { glossary } from "./data/glossary";
import { jobs } from "./data/careers";
import { news } from "./data/news";
import { press } from "./data/press";
import { insights, resourceNews, webinars } from "./data/resources";
import { team } from "./data/team";
import type { SeedMedia } from "./data/types";

export interface SeedReport {
  readonly created: Record<string, number>;
  readonly skipped: Record<string, number>;
  readonly warnings: string[];
}

class Tally {
  readonly created: Record<string, number> = {};
  readonly skipped: Record<string, number> = {};
  readonly warnings: string[] = [];

  create(kind: string): void {
    this.created[kind] = (this.created[kind] ?? 0) + 1;
  }

  skip(kind: string): void {
    this.skipped[kind] = (this.skipped[kind] ?? 0) + 1;
  }

  warn(message: string): void {
    this.warnings.push(message);
  }
}

export async function seed(payload: Payload): Promise<SeedReport> {
  const tally = new Tally();

  await seedUsers(payload, tally);
  const categories = await seedCategories(payload, tally);
  const mediaIds = await seedMedia(payload, tally);

  await seedNews(payload, tally, categories, mediaIds);
  await seedWebinars(payload, tally, categories, mediaIds);
  await seedInsights(payload, tally, categories, mediaIds);
  await seedGlossary(payload, tally);
  await seedFaqs(payload, tally, categories);
  await seedTeam(payload, tally, mediaIds);
  await seedJobs(payload, tally);
  await seedMediaCoverage(payload, tally, categories, mediaIds);
  await seedUpcomingEvents(payload, tally);

  return { created: tally.created, skipped: tally.skipped, warnings: tally.warnings };
}

/* ---- Users ------------------------------------------------------ */

/** The first superadmin, plus one HR and one PR account. */
async function seedUsers(payload: Payload, tally: Tally): Promise<void> {
  const { email, password } = seedSuperadmin();

  const accounts = [
    { email, name: "Superadmin", roles: ["superadmin"], jobTitle: "System administrator" },
    { email: hrEmail(email), name: "HR", roles: ["hr"], jobTitle: "Human Resources" },
    { email: prEmail(email), name: "PR", roles: ["pr"], jobTitle: "Communications" },
  ] as const;

  for (const account of accounts) {
    const existing = await payload.find({
      collection: "users",
      where: { email: { equals: account.email } },
      limit: 1,
      overrideAccess: true,
    });

    if (existing.totalDocs > 0) {
      tally.skip("users");
      continue;
    }

    await payload.create({
      collection: "users",
      data: {
        email: account.email,
        password,
        name: account.name,
        roles: [...account.roles],
        jobTitle: account.jobTitle,
      },
      overrideAccess: true,
    });
    tally.create("users");
  }
}

/** `admin@x.bt` → `hr@x.bt`, so the demo accounts land in the same domain. */
function hrEmail(email: string): string {
  return withLocalPart(email, "hr");
}

function prEmail(email: string): string {
  return withLocalPart(email, "pr");
}

function withLocalPart(email: string, localPart: string): string {
  const at = email.lastIndexOf("@");
  return at === -1 ? `${localPart}@bhutanndi.bt` : `${localPart}${email.slice(at)}`;
}

/* ---- Categories ------------------------------------------------- */

/** Maps `taxonomy:slug` to the created category's id. */
type CategoryIndex = Map<string, number>;

function categoryKey(taxonomy: Taxonomy, slug: string): string {
  return `${taxonomy}:${slug}`;
}

async function seedCategories(payload: Payload, tally: Tally): Promise<CategoryIndex> {
  const index: CategoryIndex = new Map();

  for (const category of SEED_CATEGORIES) {
    const existing = await payload.find({
      collection: "categories",
      where: {
        and: [{ taxonomy: { equals: category.taxonomy } }, { slug: { equals: category.slug } }],
      },
      limit: 1,
      overrideAccess: true,
    });

    const found = existing.docs[0];
    if (found) {
      index.set(categoryKey(category.taxonomy, category.slug), found.id);
      tally.skip("categories");
      continue;
    }

    const created = await payload.create({
      collection: "categories",
      data: {
        name: category.name,
        slug: category.slug,
        taxonomy: category.taxonomy,
        order: category.order,
      },
      overrideAccess: true,
    });
    index.set(categoryKey(category.taxonomy, category.slug), created.id);
    tally.create("categories");
  }

  return index;
}

/** Resolves an editorial label to a category id. */
function categoryId(
  index: CategoryIndex,
  taxonomy: Taxonomy,
  label: string,
  tally: Tally,
): number {
  const slug = categorySlugFor(taxonomy, label);
  const id = index.get(categoryKey(taxonomy, slug));
  if (id !== undefined) return id;

  const prefix = `${taxonomy}:`;
  for (const [key, fallback] of index) {
    if (key.startsWith(prefix)) {
      tally.warn(
        `No ${taxonomy} category for “${label}” (looked for slug “${slug}”); used the first ${taxonomy} category instead.`,
      );
      return fallback;
    }
  }
  throw new Error(`No categories were seeded for the ${taxonomy} taxonomy.`);
}

/* ---- Media ------------------------------------------------------ */

/** Maps a `/media/...` path from the fixtures to the created upload's id. */
type MediaIndex = Map<string, number>;

/** Uploads the images the fixtures reference from `public/`. */
async function seedMedia(payload: Payload, tally: Tally): Promise<MediaIndex> {
  const index: MediaIndex = new Map();
  const wanted = collectMediaReferences();

  for (const asset of wanted) {
    const filename = path.basename(asset.url);

    const existing = await payload.find({
      collection: "media",
      where: { filename: { like: stemOf(filename) } },
      limit: 1,
      overrideAccess: true,
    });

    const found = existing.docs[0];
    if (found) {
      index.set(asset.url, found.id);
      tally.skip("media");
      continue;
    }

    const absolute = path.join(process.cwd(), "public", asset.url.replace(/^\//, ""));
    let data: Buffer;
    try {
      data = await readFile(absolute);
    } catch {
      tally.warn(`Image not found on disk, skipped: public${asset.url}`);
      continue;
    }

    const created = await payload.create({
      collection: "media",
      data: {
        /* `alt` is required, and some fixtures carry an empty one on purpose. */
        alt: asset.alt.trim().length > 0 ? asset.alt : " ",
      },
      file: {
        data,
        name: filename,
        mimetype: mimeTypeOf(filename),
        size: data.byteLength,
      },
      overrideAccess: true,
    });
    index.set(asset.url, created.id);
    tally.create("media");
  }

  return index;
}

/** The filename without its extension. */
function stemOf(filename: string): string {
  const dot = filename.lastIndexOf(".");
  return dot > 0 ? filename.slice(0, dot) : filename;
}

const MIME_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
};

function mimeTypeOf(filename: string): string {
  const dot = filename.lastIndexOf(".");
  const extension = dot > 0 ? filename.slice(dot).toLowerCase() : "";
  return MIME_TYPES[extension] ?? "application/octet-stream";
}

/** Every distinct image the fixtures point at, de-duplicated by path. */
function collectMediaReferences(): SeedMedia[] {
  const seen = new Map<string, SeedMedia>();
  const add = (asset: SeedMedia | undefined) => {
    if (asset && !seen.has(asset.url)) seen.set(asset.url, asset);
  };

  for (const item of news) add(item.image);
  for (const item of resourceNews) add(item.image);
  for (const item of webinars) add(item.thumbnail);
  for (const item of insights) add(item.image);
  for (const item of press) add(item.image);
  for (const member of team) add(member.photo);

  return [...seen.values()];
}

/* ---- Content --------------------------------------------------- */

/** True when a document with this slug already exists. */
async function exists(payload: Payload, collection: "news" | "webinars" | "insights" | "glossary" | "jobs" | "media-coverage", slug: string): Promise<boolean> {
  const result = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: true,
  });
  return result.totalDocs > 0;
}

async function seedNews(
  payload: Payload,
  tally: Tally,
  categories: CategoryIndex,
  mediaIds: MediaIndex,
): Promise<void> {
  /* Stories first: they carry artwork and a body. */
  for (const item of news) {
    if (await exists(payload, "news", item.slug)) {
      tally.skip("news");
      continue;
    }

    await payload.create({
      collection: "news",
      data: {
        format: "story",
        title: item.title,
        headline: item.headline ?? null,
        slug: item.slug,
        excerpt: item.excerpt,
        publishedAt: item.publishedAt,
        category: categoryId(categories, "news", item.category, tally),
        image: mediaIds.get(item.image.url) ?? null,
        body: blocksToLexical(item.body),
        popularRank: item.popularRank ?? null,
        /* The newest story leads the newsroom unless an editor says otherwise; the seed does not pick a favourite. */
        featured: false,
        source:
          item.href && item.href !== "#"
            ? {
                url: item.href,
                label: item.ctaLabel,
                kind: item.ctaIcon === "playCircle" ? "video" : "article",
              }
            : undefined,
        _status: "published",
      },
      overrideAccess: true,
    });
    tally.create("news");
  }

  /* Then the dated notices. */
  for (const item of resourceNews) {
    const slug = item.id;
    if (await exists(payload, "news", slug)) {
      tally.skip("news");
      continue;
    }

    await payload.create({
      collection: "news",
      data: {
        format: "notice",
        title: item.title,
        slug,
        /* The fixtures leave most notices without a standfirst; the field is required, so the title stands in. */
        excerpt: item.excerpt ?? item.title,
        publishedAt: item.publishedAt,
        category: categoryId(categories, "news", item.category, tally),
        /* `#` in the fixtures means "no destination supplied", which becomes a notice with its own page rather than a link to nowhere. */
        externalUrl: item.href && item.href !== "#" ? item.href : null,
        _status: "published",
      },
      overrideAccess: true,
    });
    tally.create("news");
  }
}

async function seedWebinars(
  payload: Payload,
  tally: Tally,
  categories: CategoryIndex,
  mediaIds: MediaIndex,
): Promise<void> {
  for (const item of webinars) {
    const slug = item.id;
    if (await exists(payload, "webinars", slug)) {
      tally.skip("webinars");
      continue;
    }

    await payload.create({
      collection: "webinars",
      data: {
        sessionStatus: item.status,
        title: item.title,
        slug,
        description: item.description ?? item.title,
        category: categoryId(
          categories,
          "webinar",
          item.status === "upcoming" ? "Integration session" : "Talk",
          tally,
        ),
        startsAt: parseSessionTime(item.when) ?? new Date().toISOString(),
        registration:
          item.status === "upcoming" && item.href && item.href !== "#"
            ? { url: item.href, label: item.ctaLabel ?? "Register to attend" }
            : undefined,
        recording:
          item.status === "recorded" && item.href && item.href !== "#"
            ? { url: item.href, durationMinutes: parseMinutes(item.kind) }
            : item.status === "recorded"
              ? { durationMinutes: parseMinutes(item.kind) }
              : undefined,
        thumbnail: item.thumbnail ? (mediaIds.get(item.thumbnail.url) ?? null) : null,
        _status: "published",
      },
      overrideAccess: true,
    });
    tally.create("webinars");
  }
}

/** `"2026-08-21 · 14:00 BTT"` to an ISO timestamp. */
function parseSessionTime(when: string | undefined): string | undefined {
  if (!when) return undefined;
  const match = /(\d{4})-(\d{2})-(\d{2}).*?(\d{2}):(\d{2})/.exec(when);
  if (!match) return undefined;
  const [, year, month, day, hour, minute] = match;
  const utc = Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour) - 6, Number(minute));
  return new Date(utc).toISOString();
}

/** `"Recording · 48 min"` → 48. */
function parseMinutes(kind: string | undefined): number | undefined {
  if (!kind) return undefined;
  const match = /(\d+)\s*min/.exec(kind);
  return match ? Number(match[1]) : undefined;
}

async function seedInsights(
  payload: Payload,
  tally: Tally,
  categories: CategoryIndex,
  mediaIds: MediaIndex,
): Promise<void> {
  for (const item of insights) {
    if (await exists(payload, "insights", item.slug)) {
      tally.skip("insights");
      continue;
    }

    await payload.create({
      collection: "insights",
      data: {
        title: item.title,
        slug: item.slug,
        description: item.description,
        category: categoryId(categories, "insight", item.category, tally),
        kind: item.type,
        publishedAt: item.publishedAt,
        image: mediaIds.get(item.image.url) ?? null,
        readingMinutes: item.readingMinutes,
        body: blocksToLexical(item.body),
        canonicalUrl: item.href && item.href !== "#" ? item.href : null,
        _status: "published",
      },
      overrideAccess: true,
    });
    tally.create("insights");
  }
}

async function seedGlossary(payload: Payload, tally: Tally): Promise<void> {
  for (const term of glossary) {
    if (await exists(payload, "glossary", term.id)) {
      tally.skip("glossary");
      continue;
    }

    await payload.create({
      collection: "glossary",
      data: {
        term: term.term,
        slug: term.id,
        definition: plainToLexical(term.definition),
        _status: "published",
      },
      overrideAccess: true,
    });
    tally.create("glossary");
  }
}

async function seedFaqs(payload: Payload, tally: Tally, categories: CategoryIndex): Promise<void> {
  /* FAQs have no slug, so existence is checked on the question. */
  let order = 0;
  for (const faq of faqs) {
    order += 10;

    const existing = await payload.find({
      collection: "faqs",
      where: { question: { equals: faq.question } },
      limit: 1,
      overrideAccess: true,
    });
    if (existing.totalDocs > 0) {
      tally.skip("faqs");
      continue;
    }

    /* The fixtures' two audiences map onto the two seeded FAQ categories. */
    const label = faq.audience === "users" ? "For Users" : "For Organizations";
    await payload.create({
      collection: "faqs",
      data: {
        question: faq.question,
        answer: plainToLexical(faq.answer),
        category: categoryId(categories, "faq", label, tally),
        order,
        _status: "published",
      },
      overrideAccess: true,
    });
    tally.create("faqs");
  }
}

async function seedTeam(payload: Payload, tally: Tally, mediaIds: MediaIndex): Promise<void> {
  let order = 0;
  for (const member of team) {
    order += 10;

    const existing = await payload.find({
      collection: "team-members",
      where: { name: { equals: member.name } },
      limit: 1,
      overrideAccess: true,
    });
    if (existing.totalDocs > 0) {
      tally.skip("team-members");
      continue;
    }

    await payload.create({
      collection: "team-members",
      data: {
        name: member.name,
        role: member.role,
        tier: member.tier,
        photo: member.photo ? (mediaIds.get(member.photo.url) ?? null) : null,
        photoPosition: member.photoPosition ?? null,
        order,
        _status: "published",
      },
      overrideAccess: true,
    });
    tally.create("team-members");
  }
}

const EMPLOYMENT_VALUES: Record<string, "full-time" | "part-time" | "contract"> = {
  "Full time": "full-time",
  "Part time": "part-time",
  Contract: "contract",
};

async function seedJobs(payload: Payload, tally: Tally): Promise<void> {
  for (const job of jobs) {
    if (await exists(payload, "jobs", job.slug)) {
      tally.skip("jobs");
      continue;
    }

    await payload.create({
      collection: "jobs",
      data: {
        title: job.title,
        slug: job.slug,
        summary: job.summary,
        about: job.about,
        sections: job.sections.map((section) => ({
          heading: section.heading,
          items: section.items.map((text) => ({ text })),
        })),
        department: job.department,
        level: job.level,
        location: job.location,
        employmentType: EMPLOYMENT_VALUES[job.employmentType] ?? "full-time",
        slots: job.slots,
        postedAt: job.postedAt,
        closesAt: job.closesAt,
        recruitmentStatus: "open",
        /* The eligibility clauses in these fixtures name Class X, Class XII and a degree, so the document requirements match. */
        requiredDocuments: ["cv", "class-10", "class-12", "higher-education"],
        optionalDocuments: ["cover-letter", "experience"],
        allowResubmission: true,
        featured: false,
        _status: "published",
      },
      overrideAccess: true,
    });
    tally.create("jobs");
  }
}

async function seedMediaCoverage(
  payload: Payload,
  tally: Tally,
  categories: CategoryIndex,
  mediaIds: MediaIndex,
): Promise<void> {
  for (const item of press) {
    const slug = item.id;
    if (await exists(payload, "media-coverage", slug)) {
      tally.skip("media-coverage");
      continue;
    }

    /* `url` is required and validated, so a fixture without a real destination cannot be seeded. */
    if (!item.href || item.href === "#" || !/^https?:\/\//.test(item.href)) {
      tally.warn(`Media coverage “${item.title}” has no external URL; skipped.`);
      continue;
    }

    await payload.create({
      collection: "media-coverage",
      data: {
        title: item.title,
        slug,
        url: item.href,
        outlet: item.outlet ?? "Unattributed",
        excerpt: item.excerpt,
        category: categoryId(categories, "media-coverage", item.category, tally),
        publishedAt: item.publishedAt,
        image: mediaIds.get(item.image.url) ?? null,
        _status: "published",
      },
      overrideAccess: true,
    });
    tally.create("media-coverage");
  }
}

/** Points the upcoming-event card at the seeded upcoming session. */
async function seedUpcomingEvents(payload: Payload, tally: Tally): Promise<void> {
  const existing = await payload.findGlobal({ slug: "upcoming-events", depth: 0 });
  if (Array.isArray(existing.featured) && existing.featured.length > 0) {
    tally.skip("upcoming-events");
    return;
  }

  const { docs } = await payload.find({
    collection: "webinars",
    where: { sessionStatus: { equals: "upcoming" } },
    sort: "startsAt",
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });

  const next = docs[0];
  if (!next) {
    tally.warn("No upcoming webinar to feature; the card will use its empty state.");
    return;
  }

  await payload.updateGlobal({
    slug: "upcoming-events",
    data: { featured: [next.id], fallback: true },
    overrideAccess: true,
  });
  tally.create("upcoming-events");
}

/** `emptyLexical` is re-exported for the tests, which build fixtures with it. */
export { emptyLexical };
