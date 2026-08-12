import type { Metadata } from "next";

import { PageHero, PageSection } from "@/components/layout/PageHero";
import { NewsPanel } from "@/components/pages/resources/NewsPanel";
import { Reveal } from "@/components/ui/Reveal";
import { getResourceNews } from "@/content";
import { resourceSections } from "@/content/resourceSections";

const section = resourceSections.find((entry) => entry.id === "news")!;

export const metadata: Metadata = {
  title: `${section.label} — Bhutan NDI`,
  description: section.description,
};

export default async function NewsPage() {
  const news = await getResourceNews();

  return (
    <>
      <PageSection className="pb-6 pt-44">
        <PageHero eyebrow={section.eyebrow} title={section.title} lead={section.description} />
      </PageSection>

      <PageSection className="pb-[104px] pt-4">
        <Reveal>
          <NewsPanel news={news} />
        </Reveal>
      </PageSection>
    </>
  );
}
