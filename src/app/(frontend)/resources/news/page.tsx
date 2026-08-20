import type { Metadata } from "next";

import { HeroTitle } from "@/components/layout/HeroTitle";
import { PageHero, PageSection } from "@/components/layout/PageHero";
import { NewsIndex } from "@/components/pages/resources/NewsIndex";
import { getNews } from "@/content";
import { resourceSections } from "@/content/resourceSections";

const section = resourceSections.find((entry) => entry.id === "news")!;

export const metadata: Metadata = {
  title: `${section.label} — Bhutan NDI`,
  description: section.description,
};

/** Revalidate daily as a floor. */
export const revalidate = 86_400;


export default async function NewsPage() {
  /* One collection now. */
  const items = await getNews();

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

      <PageSection className="pb-[104px] pt-8">
        <NewsIndex items={items} />
      </PageSection>
    </>
  );
}
