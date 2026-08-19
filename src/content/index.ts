/**
 * The Phase 2 seam.
 *
 * Components only ever read content through these accessors. They are async
 * today purely so that swapping their bodies for Payload Local API calls in
 * Phase 2 requires no change to any caller:
 *
 *   export async function getNews() {
 *     const payload = await getPayload({ config })
 *     const { docs } = await payload.find({ collection: 'news', sort: '-publishedAt' })
 *     return docs
 *   }
 */

import { capabilities, useCases, walletBenefits, walletInHand } from "./capabilities";
import { careerValues, jobs } from "./careers";
import {
  missionStatements,
  storyBullets,
  storyImage,
  storyImagePosition,
  storyStats,
  team,
  visionPillars,
} from "./company";
import { collaboratorGroups, collaborators } from "./collaborators";
import { faqs } from "./faqs";
import { glossary } from "./glossary";
import { news } from "./news";
import { press } from "./press";
import { organizationColumnDurations, organizations } from "./organizations";
import {
  orgHeroImage,
  orgServiceOptions,
  orgServices,
  pipeline,
  whyPartnerRows,
} from "./organizationsPage";
import { insights, resourceNews, webinars } from "./resources";
import { services } from "./services";
import { siteSettings } from "./siteSettings";
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
  Collaborator,
  CollaboratorGroup,
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
  ResourceNews,
  ServiceOption,
  SiteSettings,
  StartStep,
  StoryStat,
  TeamMember,
  UserBenefit,
  UserUseCase,
  UseCase,
  VisionPillar,
  Webinar,
  WhyPartnerRow,
  WalletBenefit,
} from "./types";

export async function getNews(): Promise<NewsItem[]> {
  return news;
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
  return faqs;
}

export async function getGlossary(): Promise<GlossaryTerm[]> {
  return glossary;
}

/** One story by slug, for the detail route. */
export async function getNewsBySlug(slug: string): Promise<NewsItem | undefined> {
  return news.find((item) => item.slug === slug);
}

/** Editorially ranked, for the "Popular" tab. Unranked stories are omitted. */
export async function getPopularNews(): Promise<NewsItem[]> {
  return news
    .filter((item) => item.popularRank !== undefined)
    .sort((a, b) => a.popularRank! - b.popularRank!);
}

export async function getResourceNews(): Promise<ResourceNews[]> {
  return resourceNews;
}

export async function getWebinars(): Promise<Webinar[]> {
  return webinars;
}

export async function getInsights(): Promise<Insight[]> {
  return insights;
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
  return press;
}

export async function getJobs(): Promise<Job[]> {
  return jobs;
}

export async function getCareerValues(): Promise<CareerValue[]> {
  return careerValues;
}

export async function getTeam(): Promise<TeamMember[]> {
  return team;
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
