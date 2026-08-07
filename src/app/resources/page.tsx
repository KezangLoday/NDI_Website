import type { Metadata } from "next";

import { Emphasis, PageHero, PageSection } from "@/components/layout/PageHero";
import { ResourceTabs } from "@/components/pages/ResourceTabs";
import { Reveal } from "@/components/ui/Reveal";
import { getInsights, getResourceNews, getWebinars } from "@/content";

export const metadata: Metadata = {
  title: "Resources — Bhutan NDI",
  description:
    "Updates from the platform, recorded webinars, and the thinking behind self-sovereign identity in Bhutan.",
};

export default async function ResourcesPage() {
  const [news, webinars, insights] = await Promise.all([
    getResourceNews(),
    getWebinars(),
    getInsights(),
  ]);

  return (
    <>
      <PageSection className="pb-4 pt-44">
        <PageHero
          eyebrow="— Resources"
          title={
            <>
              Announcements, sessions and <Emphasis>research</Emphasis>
            </>
          }
          lead="Everything the ecosystem publishes — updates from the platform, recorded webinars, and the thinking behind self-sovereign identity in Bhutan."
        />
      </PageSection>

      {/* The tab ids double as the deep-link targets used by the nav. */}
      <PageSection id="news" className="pb-[104px] pt-10">
        <span id="webinars" className="sr-only" />
        <span id="insights" className="sr-only" />
        <Reveal>
          <ResourceTabs news={news} webinars={webinars} insights={insights} />
        </Reveal>
      </PageSection>
    </>
  );
}
