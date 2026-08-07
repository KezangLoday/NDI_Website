import type { Metadata } from "next";

import { Emphasis, PageHero, PageSection, SubSectionHeader } from "@/components/layout/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/icons";
import { getCareerValues, getJobs } from "@/content";

export const metadata: Metadata = {
  title: "Careers — Bhutan NDI",
  description:
    "We hire engineers, designers and communicators who want their work in the hands of every citizen in Bhutan.",
};

const ROLE_CARD_BACKGROUND =
  "radial-gradient(120% 80% at 24% -10%, rgba(111,224,169,0.19) 0%, rgba(90,201,148,0.056) 40%, rgba(90,201,148,0) 66%), " +
  "radial-gradient(90% 60% at 50% 118%, rgba(18,65,67,0.44) 0%, rgba(18,65,67,0) 70%), " +
  "linear-gradient(164deg, #0e2c37 0%, #0d1420 68%)";

export default async function CareersPage() {
  const [values, roles] = await Promise.all([getCareerValues(), getJobs()]);

  return (
    <>
      <PageSection className="pb-6 pt-44">
        <PageHero
          eyebrow="— Careers"
          title={
            <>
              Work on something a whole <Emphasis>country uses</Emphasis>
            </>
          }
          lead="We hire engineers, designers and communicators who want their work in the hands of every citizen in Bhutan."
          leadWidth={600}
        />

        <Reveal className="mt-14 grid grid-cols-1 gap-4 min-[641px]:grid-cols-2 min-[1001px]:grid-cols-4">
          {values.map((value) => (
            <div
              key={value.id}
              className="ndi-spot rounded-2xl border border-grid bg-white/[0.02] p-6"
            >
              <div className="ndi-spot-halo" />
              <div className="ndi-spot-fill" />
              <div className="font-display text-[16.5px] font-semibold text-strong">
                {value.title}
              </div>
              <p className="mt-2 text-[13.5px] leading-[1.6] text-muted">{value.description}</p>
            </div>
          ))}
        </Reveal>
      </PageSection>

      <PageSection id="careers" className="pb-[104px] pt-14">
        <Reveal>
          <SubSectionHeader
            eyebrow="— Careers"
            title="Join the team building trust"
            lead="We hire engineers, designers and communicators who want their work used by a whole country."
          />
        </Reveal>

        <Reveal className="mt-9 grid grid-cols-1 gap-3.5 min-[641px]:grid-cols-2 min-[1001px]:grid-cols-3">
          {roles.map((role) => (
            <a
              key={role.id}
              href={role.href}
              className="ndi-role-card relative flex min-h-[230px] flex-col gap-3.5 overflow-hidden rounded-2xl p-[26px]"
              style={{
                background: ROLE_CARD_BACKGROUND,
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              <span className="relative font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
                — {role.department}
              </span>
              <div className="relative flex flex-1 flex-col gap-2">
                <div className="font-display text-[19px] font-semibold leading-[1.22] tracking-[-0.02em] text-strong [text-wrap:pretty]">
                  {role.title}
                </div>
                <p className="text-[13.5px] leading-[1.6] text-muted [text-wrap:pretty]">
                  {role.summary}
                </p>
              </div>
              <div className="relative flex items-center justify-between gap-3 border-t border-grid pt-3.5">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-faint">
                  {role.location}
                </span>
                <span className="inline-flex text-accent">
                  <Icon name="arrowRightLong" size={18} strokeWidth={2} />
                </span>
              </div>
            </a>
          ))}
        </Reveal>
      </PageSection>
    </>
  );
}
