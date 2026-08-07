import type { Metadata } from "next";

import { PageHero, PageSection, Emphasis } from "@/components/layout/PageHero";
import { SpotlightCard } from "@/components/ui/Cards";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/icons";
import { getPress } from "@/content";

export const metadata: Metadata = {
  title: "Media Coverage — Bhutan NDI",
  description:
    "Reporting, interviews and features on Bhutan's national digital identity — at home and internationally.",
};

export default async function MediaCoveragePage() {
  const items = await getPress();

  return (
    <>
      <PageSection className="pb-2 pt-44">
        <PageHero
          eyebrow="— Media coverage"
          title={
            <>
              Bhutan NDI in the <Emphasis>press</Emphasis>
            </>
          }
          lead="Reporting, interviews and features on Bhutan's national digital identity — at home and internationally."
        />
      </PageSection>

      <PageSection id="media" className="pb-[104px] pt-8">
        <Reveal className="mt-2 grid grid-cols-1 gap-3.5 min-[901px]:grid-cols-2">
          {items.map((item) => (
            <SpotlightCard key={item.id} as="a" href={item.href} hoverLift>
              <div className="flex w-full items-center justify-between gap-4">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-accent">
                  {item.category}
                </span>
                <span className="text-faint">
                  <Icon name="arrowUpRight" size={16} strokeWidth={2} />
                </span>
              </div>
              <div className="font-display text-[19px] font-semibold leading-[1.24] tracking-[-0.02em] text-strong">
                {item.title}
              </div>
              <div className="font-mono text-[10.5px] tracking-[0.14em] text-faint">
                {item.publishedAt}
              </div>
            </SpotlightCard>
          ))}
        </Reveal>

        <div className="mt-[18px] font-mono text-[10.5px] uppercase tracking-[0.14em] text-faint">
          — Media inquiries:{" "}
          <a href="mailto:media@bhutanndi.com" className="text-accent">
            media@bhutanndi.com
          </a>
        </div>
      </PageSection>
    </>
  );
}
