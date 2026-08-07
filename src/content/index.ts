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

import { capabilities, useCases, walletBenefits } from "./capabilities";
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
import { news } from "./news";
import { press } from "./press";
import { organizationColumnDurations, organizations } from "./organizations";
import { services } from "./services";
import { siteSettings } from "./siteSettings";

import type {
  Capability,
  CareerValue,
  Collaborator,
  CollaboratorGroup,
  Job,
  MissionStatement,
  NewsItem,
  Organization,
  PressItem,
  ServiceOption,
  SiteSettings,
  StoryStat,
  TeamMember,
  UseCase,
  VisionPillar,
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
