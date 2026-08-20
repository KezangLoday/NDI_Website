import type { Metadata } from "next";
import Link from "next/link";

import { Emphasis, PageHero, PageSection } from "@/components/layout/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/icons";
import { resourceSections } from "@/content/resourceSections";

export const metadata: Metadata = {
  title: "Resources — Bhutan NDI",
  description:
    "Updates from the platform, recorded webinars, and the thinking behind self-sovereign identity in Bhutan.",
};

export default function ResourcesPage() {
  return (
    <>
      <PageSection className="pb-8 pt-44">
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

      {/* An index rather than a tab strip: each section is its own page now, so
          these are navigation, and a whole-card link is the honest control. */}
      <PageSection className="pb-[104px] pt-6">
        <div data-ndi-3col="1" className="grid grid-cols-1 gap-4 min-[701px]:grid-cols-3">
          {resourceSections.map((section, index) => (
            <Reveal key={section.id} delay={0.06 * (index + 1)} className="h-full">
              <Link
                href={section.href}
                className="ndi-spot ndi-role-card flex h-full flex-col gap-3.5 rounded-2xl border border-grid bg-white/[0.02] p-7"
              >
                <div className="ndi-spot-halo" />
                <div className="ndi-spot-fill" />
                <span className="text-accent">
                  <Icon name={section.icon} size={24} />
                </span>
                <div className="mt-1 font-display text-[19px] font-semibold tracking-[-0.02em] text-strong">
                  {section.label}
                </div>
                <p className="text-[14.5px] leading-[1.6] text-muted">{section.description}</p>
                <span className="ndi-tut mt-auto inline-flex items-center gap-2 pt-3 font-mono text-[10.5px] uppercase tracking-[0.16em] text-accent">
                  Browse
                  <Icon name="arrowRight" size={14} strokeWidth={2} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </PageSection>
    </>
  );
}
