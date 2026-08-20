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

/**
 * Revalidate daily as a floor.
 *
 * The real mechanism is on demand: publishing in the CMS calls `revalidatePath`
 * for this route, so an editor sees their change in seconds. This is the
 * backstop for the case that misses — a direct database change, or a hook that
 * threw — so the page cannot serve stale content indefinitely.
 */
export const revalidate = 86_400;


export default async function WebinarsPage() {
  /* The upcoming-event card is resolved on the server — the global's choice,
     the fallback rule and the has-it-happened check all applied — so the panel
     either has a session or has the empty-state copy. */
  const [webinars, upcoming] = await Promise.all([getWebinars(), getUpcomingEvent()]);

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
          <WebinarsPanel webinars={webinars} upcoming={upcoming} />
        </Reveal>
      </PageSection>
    </>
  );
}
