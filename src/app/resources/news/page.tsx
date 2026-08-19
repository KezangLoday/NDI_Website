import type { Metadata } from "next";

import { PageHero, PageSection } from "@/components/layout/PageHero";
import { NewsIndex } from "@/components/pages/resources/NewsIndex";
import { getNews, getResourceNews } from "@/content";
import { resourceSections } from "@/content/resourceSections";

const section = resourceSections.find((entry) => entry.id === "news")!;

export const metadata: Metadata = {
  title: `${section.label} — Bhutan NDI`,
  description: section.description,
};

export default async function NewsPage() {
  /* Both collections. The stories carry artwork and a standfirst, the notices
     are a dated line — see NewsIndex for why they stay two groups. */
  const [stories, notices] = await Promise.all([getNews(), getResourceNews()]);

  return (
    <>
      <PageSection className="pb-6 pt-44">
        <PageHero eyebrow={section.eyebrow} title={section.title} lead={section.description} />
      </PageSection>

      <PageSection className="pb-[104px] pt-8">
        <NewsIndex stories={stories} notices={notices} />
      </PageSection>
    </>
  );
}
