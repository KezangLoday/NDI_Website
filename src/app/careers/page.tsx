import type { Metadata } from "next";

import { Emphasis, PageSection } from "@/components/layout/PageHero";
import { Eyebrow } from "@/components/ui/SectionHeader";
import { HeroCollage } from "@/components/pages/careers/HeroCollage";
import { VacancyCard } from "@/components/pages/careers/VacancyCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { Icon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { getCareerValues, getJobs } from "@/content";

export const metadata: Metadata = {
  title: "Careers — Bhutan NDI",
  description:
    "We hire engineers, designers and communicators who want their work in the hands of every citizen in Bhutan.",
};

export default async function CareersPage() {
  const [values, roles] = await Promise.all([getCareerValues(), getJobs()]);

  return (
    <>
      {/* The hero centres, which no other page here does. It earns it: there is
          no product shot to sit beside, and the collage below wants the axis. */}
      <PageSection className="pb-0 pt-40 text-center">
        <div className="mx-auto max-w-[880px]">
          {/* Every other page labels itself before the headline; this one opened
              cold. */}
          <Eyebrow>— Careers</Eyebrow>
          <h1 className="mt-5 font-display text-[clamp(38px,5.6vw,64px)] font-semibold leading-[1.04] tracking-[-0.035em] text-strong [text-wrap:balance]">
            {/* The article and its noun stay on one line: balanced wrapping
                strands "a" at the end of a line on a phone otherwise. */}
            Come and do the work a&nbsp;
            <Emphasis>country&nbsp;remembers</Emphasis>
          </h1>
          <p className="mx-auto mt-6 max-w-[62ch] text-[17px] leading-[1.62] text-muted [text-wrap:pretty]">
            Bhutan NDI is built by a small team in Thimphu whose work ends up in the hands of
            everyone in the country. We hire engineers, designers and communicators who want that
            kind of proximity between what they make and who uses it.
          </p>
          <div className="mt-8 flex justify-center">
            <GradientButton href="#openings">
              See open positions
              <Icon name="arrowRight" size={16} strokeWidth={2} />
            </GradientButton>
          </div>
        </div>
      </PageSection>

      {/* Wider than the 1200px shell every other section sits in, and clipped
          at the window rather than at a gutter: the outermost tiles are meant
          to run off both edges, so the picture continues past the page. */}
      <div className="mt-14 overflow-hidden">
        <div className="mx-auto w-full max-w-[1560px] px-5 min-[761px]:px-0">
          <HeroCollage />
        </div>
      </div>

      <PageSection className="pt-20">
        <Reveal className="grid grid-cols-1 gap-x-10 gap-y-9 min-[641px]:grid-cols-2 min-[1001px]:grid-cols-4">
          {values.map((value) => (
            /* Not cards. Four short statements under a rule reads as a list of
               claims the team is making, which is what these are. */
            <div key={value.id} className="border-t border-grid pt-4">
              <div className="font-display text-[16.5px] font-semibold tracking-[-0.01em] text-strong">
                {value.title}
              </div>
              <p className="mt-2 text-[13.5px] leading-[1.6] text-muted [text-wrap:pretty]">
                {value.description}
              </p>
            </div>
          ))}
        </Reveal>
      </PageSection>

      <PageSection id="openings" className="scroll-mt-24 pb-[104px] pt-24">
        <Reveal className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div className="max-w-[600px]">
            <h2 className="font-display text-[clamp(28px,3.4vw,40px)] font-semibold leading-[1.1] tracking-[-0.03em] text-strong">
              Open positions
            </h2>
            <p className="mt-4 text-[15.5px] leading-[1.62] text-muted">
              Every vacancy carries its full terms of reference and takes its application on the
              same page. Nothing goes to an inbox.
            </p>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
            Thimphu · on site
          </span>
        </Reveal>

        {roles.length ? (
          <Reveal
            delay={0.05}
            className="mt-9 grid grid-cols-1 gap-3.5 min-[641px]:grid-cols-2 min-[1001px]:grid-cols-3"
          >
            {roles.map((role) => (
              <VacancyCard key={role.id} job={role} />
            ))}
          </Reveal>
        ) : (
          <Reveal delay={0.05} className="mt-9 border-t border-grid pt-8">
            <p className="max-w-[54ch] text-[15px] leading-[1.62] text-muted">
              Nothing is open right now. New vacancies are posted here first, and announced on the
              newsroom the same day.
            </p>
          </Reveal>
        )}
      </PageSection>
    </>
  );
}
