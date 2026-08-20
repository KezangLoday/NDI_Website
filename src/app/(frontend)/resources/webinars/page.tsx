import type { Metadata } from "next";

import { HeroTitle } from "@/components/layout/HeroTitle";
import { PageHero, PageSection } from "@/components/layout/PageHero";
import { WebinarsPanel } from "@/components/pages/resources/WebinarsPanel";
import { Reveal } from "@/components/ui/Reveal";
import { getUpcomingEvent, getWebinars } from "@/content";
import { resourceSections } from "@/content/resourceSections";

const section = resourceSections.find((entry) => entry.id === "webinars")!;

export const metadata: Metadata = {
  title: `${section.label} — Bhutan NDI`,
  description: section.description,
};

/** Revalidate daily as a floor. */
export const revalidate = 86_400;


export default async function WebinarsPage() {
  /* The upcoming-event card is resolved on the server. */
  const [webinars, upcoming] = await Promise.all([getWebinars(), getUpcomingEvent()]);

  return (
    <>
      <PageSection className="pb-6 pt-44">
        <PageHero
          eyebrow={section.eyebrow}
          /* The emphasised phrase carries the gradient the other subpage heroes use; these three were plain white while every sibling had it. */
          title={<HeroTitle title={section.title} emphasis={section.emphasis} />}
          lead={section.lead}
        />
      </PageSection>

      <PageSection className="pb-[104px] pt-4">
        <Reveal>
          <WebinarsPanel webinars={webinars} upcoming={upcoming} />
        </Reveal>
      </PageSection>
    </>
  );
}
