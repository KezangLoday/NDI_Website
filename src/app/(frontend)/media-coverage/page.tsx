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

/** Revalidate daily as a floor; publishing revalidates this route on demand. */
export const revalidate = 86_400;


/** Press coverage, on the newsroom card. */
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
        {items.length ? (
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
        ) : (
          /* Nothing published. */
          <Reveal className="border-t border-grid pt-8">
            <p className="max-w-[54ch] text-[15px] leading-[1.62] text-muted [text-wrap:pretty]">
              Coverage is added here as it is published. For press enquiries, or to tell us about a
              piece we have missed, the media inbox is below.
            </p>
          </Reveal>
        )}

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
