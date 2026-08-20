/**
 * The one place components read content from.
 *
 * This module was built as a seam for exactly this change: every accessor was
 * already async and every component already went through one of them, so
 * swapping the bodies from "return a TypeScript array" to "query Payload" left
 * the call sites untouched.
 *
 * What changed and what did not:
 *
 *  - **CMS-managed** — news, webinars, insights, glossary, FAQs, team members,
 *    careers, media coverage — now query Payload's Local API. That is an
 *    in-process call to Postgres, not HTTP, so these run happily inside a
 *    Server Component being prerendered at build time.
 *  - **Everything else** — the home page, the users and organizations pages,
 *    governance, site settings, the icon-keyed feature cards — still returns
 *    the static modules in this directory. That is deliberate, and it is what
 *    the requirements ask for: those pages are marketing copy with bespoke
 *    layouts, and modelling them as CMS documents would buy an editor a form
 *    they should not be filling in and cost the site a page-builder it does not
 *    need.
 *
 * Draft content cannot come through here. Every query filters for published
 * documents explicitly — see `cms/queries.ts` for why the collection's own
 * access rule is not sufficient on the Local API — and the access rule is the
 * second guard behind it.
 */

import { capabilities, useCases, walletBenefits, walletInHand } from "./capabilities";
import { careerValues } from "./careers";
import {
  missionStatements,
  storyBullets,
  storyImage,
  storyImagePosition,
  storyStats,
  visionPillars,
} from "./company";
import { collaboratorGroups, collaborators } from "./collaborators";
import { organizationColumnDurations, organizations } from "./organizations";
import {
  orgHeroImage,
  orgServiceOptions,
  orgServices,
  pipeline,
  whyPartnerRows,
} from "./organizationsPage";
import { services } from "./services";
import { siteSettings } from "./siteSettings";

import { queryFaqAudiences, queryFaqs } from "./cms/faqs";
import { queryGlossary } from "./cms/glossary";
import { insightFacets, queryInsightBySlug, queryInsightSlugs, queryInsights } from "./cms/insights";
import { queryJobBySlug, queryJobSlugs, queryJobs } from "./cms/jobs";
import { queryPress } from "./cms/mediaCoverage";
import { queryNews, queryNewsBySlug, queryNewsSlugs } from "./cms/news";
import { queryTeam } from "./cms/team";
import { queryUpcomingEvent, queryWebinarBySlug, queryWebinars } from "./cms/webinars";
import {
  credentialCards,
  journeyChapters,
  journeyStrip,
  startSteps,
  userBenefits,
  userHeroStats,
  userUseCases,
} from "./users";

import type {
  Capability,
  CareerValue,
  CategoryFacet,
  Collaborator,
  CollaboratorGroup,
  FaqAudience,
  FaqItem,
  GlossaryTerm,
  Insight,
  Job,
  MissionStatement,
  NewsItem,
  HeroStat,
  JourneyChapter,
  Organization,
  OrgService,
  PipelineStep,
  PressItem,
  ServiceOption,
  SiteSettings,
  StartStep,
  StoryStat,
  TeamMember,
  UserBenefit,
  UserUseCase,
  UpcomingEventSlot,
  UseCase,
  VisionPillar,
  Webinar,
  WhyPartnerRow,
  WalletBenefit,
} from "./types";

/**
 * The whole newsroom — stories and notices together, newest first.
 *
 * One accessor for both because the archive interleaves them by date. Callers
 * that want only one narrow on `format`, which is cheaper than a second query.
 */
export async function getNews(): Promise<NewsItem[]> {
  return queryNews();
}

/** Just the stories: the ones with artwork, a body and a page of their own. */
export async function getNewsStories(): Promise<NewsItem[]> {
  const news = await queryNews();
  return news.filter((item) => item.format === "story");
}

/** Just the notices: dated announcements, mostly linking off-site. */
export async function getNewsNotices(): Promise<NewsItem[]> {
  const news = await queryNews();
  return news.filter((item) => item.format === "notice");
}

/**
 * Slugs to prerender for `/resources/news/[slug]`.
 *
 * Separate from `getNews` so `generateStaticParams` costs one narrow query
 * rather than fetching every field of every story to read one column off each.
 */
export async function getNewsSlugs(): Promise<string[]> {
  return queryNewsSlugs();
}

export async function getOrganizations(): Promise<Organization[]> {
  return organizations;
}

export async function getCollaborators(): Promise<Collaborator[]> {
  return collaborators;
}

export async function getCollaboratorGroups(): Promise<CollaboratorGroup[]> {
  return collaboratorGroups;
}

export async function getCapabilities(): Promise<Capability[]> {
  return capabilities;
}

export async function getUseCases(): Promise<UseCase[]> {
  return useCases;
}

export async function getWalletBenefits(): Promise<WalletBenefit[]> {
  return walletBenefits;
}

export async function getServices(): Promise<ServiceOption[]> {
  return services;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return siteSettings;
}

export async function getFaqs(): Promise<FaqItem[]> {
  return queryFaqs();
}

/** The audience tabs, from the CMS's FAQ categories rather than a constant. */
export async function getFaqAudiences(): Promise<FaqAudience[]> {
  return queryFaqAudiences();
}

export async function getGlossary(): Promise<GlossaryTerm[]> {
  return queryGlossary();
}

/** One story by slug, for the detail route. */
export async function getNewsBySlug(slug: string): Promise<NewsItem | undefined> {
  return queryNewsBySlug(slug);
}

/**
 * Editorially ranked, for the "Popular" rail. Unranked stories are omitted.
 *
 * Ranked in the CMS rather than measured, because nothing here measures
 * readership — so this is a judgement for the newsroom to make rather than one
 * the code should invent.
 */
export async function getPopularNews(): Promise<NewsItem[]> {
  const news = await queryNews();
  return news
    .filter((item) => item.popularRank !== undefined)
    .sort((a, b) => (a.popularRank ?? 0) - (b.popularRank ?? 0));
}

export async function getWebinars(): Promise<Webinar[]> {
  return queryWebinars();
}

export async function getWebinarBySlug(slug: string): Promise<Webinar | undefined> {
  return queryWebinarBySlug(slug);
}

/**
 * What the "Upcoming session" card shows, resolved.
 *
 * Returns either a session or the empty-state copy — never a stale event. The
 * selection, the fallback rule and the has-it-happened check all resolve
 * server-side, so the component has no decision left to make.
 */
export async function getUpcomingEvent(): Promise<UpcomingEventSlot> {
  return queryUpcomingEvent();
}

export async function getInsights(): Promise<Insight[]> {
  return queryInsights();
}

export async function getInsightBySlug(slug: string): Promise<Insight | undefined> {
  return queryInsightBySlug(slug);
}

export async function getInsightSlugs(): Promise<string[]> {
  return queryInsightSlugs();
}

/** The publication filter tabs, counted from what is actually published. */
export async function getInsightFacets(): Promise<CategoryFacet[]> {
  return insightFacets(await queryInsights());
}

export async function getOrgServices(): Promise<OrgService[]> {
  return orgServices;
}

export async function getWhyPartnerRows(): Promise<WhyPartnerRow[]> {
  return whyPartnerRows;
}

export async function getPipeline(): Promise<PipelineStep[]> {
  return pipeline;
}

export async function getOrgServiceOptions(): Promise<ServiceOption[]> {
  return orgServiceOptions;
}

export async function getUserUseCases(): Promise<UserUseCase[]> {
  return userUseCases;
}

export async function getJourneyChapters(): Promise<JourneyChapter[]> {
  return journeyChapters;
}

export async function getUserBenefits(): Promise<UserBenefit[]> {
  return userBenefits;
}

export async function getUserHeroStats(): Promise<HeroStat[]> {
  return userHeroStats;
}

export async function getStartSteps(): Promise<StartStep[]> {
  return startSteps;
}

export { credentialCards, journeyStrip };
export { walletInHand };

export async function getPress(): Promise<PressItem[]> {
  return queryPress();
}

/** Vacancies currently accepting applications, featured first. */
export async function getJobs(): Promise<Job[]> {
  return queryJobs();
}

/**
 * One vacancy by slug, for the detail route.
 *
 * Returns closed vacancies too: the notice stays readable at its own URL, with
 * a closed message where the form was. Only unpublished ones are withheld.
 */
export async function getJobBySlug(slug: string): Promise<Job | undefined> {
  return queryJobBySlug(slug);
}

export async function getJobSlugs(): Promise<string[]> {
  return queryJobSlugs();
}

export async function getCareerValues(): Promise<CareerValue[]> {
  return careerValues;
}

export async function getTeam(): Promise<TeamMember[]> {
  return queryTeam();
}

export async function getVisionPillars(): Promise<VisionPillar[]> {
  return visionPillars;
}

export async function getMissionStatements(): Promise<MissionStatement[]> {
  return missionStatements;
}

export async function getStory(): Promise<{
  bullets: string[];
  stats: StoryStat[];
  image: typeof storyImage;
  imagePosition: string;
}> {
  return {
    bullets: storyBullets,
    stats: storyStats,
    image: storyImage,
    imagePosition: storyImagePosition,
  };
}

export { organizationColumnDurations };
export * from "./types";

export { orgHeroImage };
