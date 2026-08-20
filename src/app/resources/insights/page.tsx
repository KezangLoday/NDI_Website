import type { Metadata } from "next";

import { PageHero, PageSection } from "@/components/layout/PageHero";
import { InsightsIndex } from "@/components/pages/resources/InsightsIndex";
import { Reveal } from "@/components/ui/Reveal";
import { getInsights } from "@/content";
import { resourceSections } from "@/content/resourceSections";

const section = resourceSections.find((entry) => entry.id === "insights")!;

export const metadata: Metadata = {
  title: `${section.label} — Bhutan NDI`,
  description: section.description,
};

export default async function InsightsPage() {
  const insights = await getInsights();

  return (
    <>
      <PageSection className="pb-6 pt-44">
        <PageHero eyebrow={section.eyebrow} title={section.title} lead={section.description} />
      </PageSection>

      <PageSection className="pb-[104px] pt-4">
        <Reveal>
          <InsightsIndex insights={insights} />
        </Reveal>
      </PageSection>
    </>
  );
}
