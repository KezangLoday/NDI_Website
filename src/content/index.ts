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
import { collaboratorGroups, collaborators } from "./collaborators";
import { news } from "./news";
import { organizationColumnDurations, organizations } from "./organizations";
import { services } from "./services";
import { siteSettings } from "./siteSettings";

import type {
  Capability,
  Collaborator,
  CollaboratorGroup,
  NewsItem,
  Organization,
  ServiceOption,
  SiteSettings,
  UseCase,
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

export { organizationColumnDurations };
export * from "./types";
