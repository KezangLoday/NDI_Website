import type { Metadata } from "next";

import { PageHero, PageSection } from "@/components/layout/PageHero";
import { WebinarsPanel } from "@/components/pages/resources/WebinarsPanel";
import { ResourceNav } from "@/components/pages/resources/ResourceNav";
import { Reveal } from "@/components/ui/Reveal";
import { getWebinars } from "@/content";
import { resourceSections } from "@/content/resourceSections";

const section = resourceSections.find((entry) => entry.id === "webinars")!;

export const metadata: Metadata = {
  title: `${section.label} — Bhutan NDI`,
  description: section.description,
};

export default async function WebinarsPage() {
  const webinars = await getWebinars();

  return (
    <>
      <PageSection className="pb-6 pt-44">
        <PageHero eyebrow={section.eyebrow} title={section.title} lead={section.description} />
        <Reveal delay={0.05} className="mt-9">
          <ResourceNav current="webinars" />
        </Reveal>
      </PageSection>

      <PageSection className="pb-[104px] pt-4">
        <Reveal>
          <WebinarsPanel webinars={webinars} />
        </Reveal>
      </PageSection>
    </>
  );
}
