import type { Metadata } from "next";

import { PageHero, PageSection, Emphasis } from "@/components/layout/PageHero";
import { ArticleCard } from "@/components/pages/resources/ArticleCard";
import { Reveal } from "@/components/ui/Reveal";
import { getPress } from "@/content";

export const metadata: Metadata = {
  title: "Media Coverage — Bhutan NDI",
  description:
    "Reporting, interviews and features on Bhutan's national digital identity, at home and internationally.",
};

/**
 * Press coverage, on the newsroom card.
 *
 * Every card leaves the site. There is no detail route here and there should
 * not be: the article belongs to the outlet that published it, and a local page
 * restating someone else's reporting would be both redundant and presumptuous.
 * The card says what was written and hands the reader to the source, which is
 * why the link carries the outbound arrow rather than "read more".
 */
export default async function MediaCoveragePage() {
  const items = await getPress();

  return (
    <>
      <PageSection className="pb-2 pt-44">
        <PageHero
          eyebrow="— Media coverage"
          title={
            <>
              Bhutan NDI in the <Emphasis tight>press</Emphasis>
            </>
          }
          lead="Reporting, interviews and features on Bhutan's national digital identity, at home and internationally."
          leadWidth={600}
        />
      </PageSection>

      <PageSection id="media" className="pb-[104px] pt-8">
        <Reveal className="grid grid-cols-1 gap-5 min-[701px]:grid-cols-2 min-[1101px]:grid-cols-3">
          {items.map((item) => (
            <ArticleCard
              key={item.id}
              href={item.href}
              external
              ctaLabel="View coverage"
              category={item.category}
              title={item.title}
              publishedAt={item.publishedAt}
              excerpt={item.excerpt}
              image={item.image}
            />
          ))}
        </Reveal>

        <div className="mt-8 font-mono text-[10.5px] uppercase tracking-[0.14em] text-faint">
          Media inquiries:{" "}
          <a href="mailto:media@bhutanndi.com" className="ndi-inline-link">
            media@bhutanndi.com
          </a>
        </div>
      </PageSection>
    </>
  );
}
