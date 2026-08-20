/** The categories the CMS starts with. */
import type { Taxonomy } from "../fields/taxonomy";

export interface SeedCategory {
  readonly taxonomy: Taxonomy;
  readonly name: string;
  readonly slug: string;
  readonly order: number;
}

export const SEED_CATEGORIES: readonly SeedCategory[] = [
  /* News & Updates — the labels the existing newsroom entries carry. */
  { taxonomy: "news", name: "Announcement", slug: "announcement", order: 10 },
  { taxonomy: "news", name: "Partnership", slug: "partnership", order: 20 },
  { taxonomy: "news", name: "Integration", slug: "integration", order: 30 },
  { taxonomy: "news", name: "Product", slug: "product", order: 40 },
  { taxonomy: "news", name: "Recognition", slug: "recognition", order: 50 },
  { taxonomy: "news", name: "Public notice", slug: "public-notice", order: 60 },
  { taxonomy: "news", name: "Ecosystem", slug: "ecosystem", order: 70 },
  { taxonomy: "news", name: "Infrastructure", slug: "infrastructure", order: 80 },
  { taxonomy: "news", name: "Podcast", slug: "podcast", order: 90 },

  /* Webinars. */
  { taxonomy: "webinar", name: "Integration session", slug: "integration-session", order: 10 },
  { taxonomy: "webinar", name: "Wallet walkthrough", slug: "wallet-walkthrough", order: 20 },
  { taxonomy: "webinar", name: "Talk", slug: "talk", order: 30 },

  /* Insights — the three the index page used to hard-code, with the slugs the tab icons are keyed to. */
  { taxonomy: "insight", name: "Research", slug: "research", order: 10 },
  { taxonomy: "insight", name: "Case studies", slug: "case-studies", order: 20 },
  { taxonomy: "insight", name: "Blogs", slug: "blogs", order: 30 },

  /* FAQs — the two the requirements name. */
  { taxonomy: "faq", name: "For Users", slug: "for-users", order: 10 },
  { taxonomy: "faq", name: "For Organizations", slug: "for-organizations", order: 20 },

  /* Media coverage. */
  { taxonomy: "media-coverage", name: "National press", slug: "national-press", order: 10 },
  { taxonomy: "media-coverage", name: "International press", slug: "international-press", order: 20 },
  { taxonomy: "media-coverage", name: "Feature", slug: "feature", order: 30 },
  { taxonomy: "media-coverage", name: "Interview", slug: "interview", order: 40 },
  { taxonomy: "media-coverage", name: "Podcast", slug: "podcast", order: 50 },
  { taxonomy: "media-coverage", name: "Report", slug: "report", order: 60 },

  /* Glossary — one starter grouping. */
  { taxonomy: "glossary", name: "Core concepts", slug: "core-concepts", order: 10 },
];

/** Maps an editorial label from the seed fixtures onto a category slug. */
export function categorySlugFor(taxonomy: Taxonomy, label: string): string {
  const overrides: Record<string, string> = {
    "case study": "case-studies",
    blog: "blogs",
    "case studies": "case-studies",
  };
  const key = label.trim().toLowerCase();
  return (
    overrides[key] ??
    key
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  );
}
