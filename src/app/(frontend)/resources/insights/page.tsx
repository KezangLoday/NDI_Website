import type { Metadata } from "next";

import { HeroTitle } from "@/components/layout/HeroTitle";
import { PageHero, PageSection } from "@/components/layout/PageHero";
import { InsightsIndex } from "@/components/pages/resources/InsightsIndex";
import { Reveal } from "@/components/ui/Reveal";
import { getInsightFacets, getInsights } from "@/content";
import { resourceSections } from "@/content/resourceSections";

const section = resourceSections.find((entry) => entry.id === "insights")!;

export const metadata: Metadata = {
  title: `${section.label} — Bhutan NDI`,
  description: section.description,
};

/**
 * Revalidate daily as a floor.
 *
 * The real mechanism is on demand: publishing in the CMS calls `revalidatePath`
 * for this route, so an editor sees their change in seconds. This is the
 * backstop for the case that misses — a direct database change, or a hook that
 * threw — so the page cannot serve stale content indefinitely.
 */
export const revalidate = 86_400;


export default async function InsightsPage() {
  /* The tabs come from the categories that actually have something published
     under them, so a new category appears without a code change and an empty
     one does not render a dead end. */
  const [insights, facets] = await Promise.all([getInsights(), getInsightFacets()]);

  return (
    <>
      <PageSection className="pb-6 pt-44">
        <PageHero
          eyebrow={section.eyebrow}
          /* The emphasised phrase carries the gradient the other subpage heroes
             use; these three were plain white while every sibling had it. */
          title={<HeroTitle title={section.title} emphasis={section.emphasis} />}
          lead={section.lead}
        />
      </PageSection>

      <PageSection className="pb-[104px] pt-4">
        <Reveal>
          <InsightsIndex insights={insights} facets={facets} />
        </Reveal>
      </PageSection>
    </>
  );
}
