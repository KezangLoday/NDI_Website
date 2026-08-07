import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Emphasis, PageSection, SubSectionHeader } from "@/components/layout/PageHero";
import { DechenJourney } from "@/components/pages/DechenJourney";
import { SpotlightCard } from "@/components/ui/Cards";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeader";
import { StoreButtons } from "@/components/ui/StoreButtons";
import { Icon } from "@/components/ui/icons";
import {
  credentialCards,
  getJourneyChapters,
  getStartSteps,
  getUserBenefits,
  getUserHeroStats,
  getUserUseCases,
  journeyStrip,
} from "@/content";
import { mediaUrl } from "@/lib/media";

export const metadata: Metadata = {
  title: "For Users — Bhutan NDI",
  description:
    "Your citizenship, your degree, your license — issued straight to your phone and shared only when you tap to consent.",
};

export default async function UsersPage() {
  const [stats, useCases, chapters, benefits, steps] = await Promise.all([
    getUserHeroStats(),
    getUserUseCases(),
    getJourneyChapters(),
    getUserBenefits(),
    getStartSteps(),
  ]);

  return (
    <>
      {/* ============ HERO ============ */}
      <PageSection className="pb-10 pt-44 text-center">
        {/* This hero runs a larger, heavier headline than the other subpages. */}
        <Reveal className="flex flex-col items-center">
          <Eyebrow>— For citizens</Eyebrow>
          <h1 className="mt-[26px] max-w-[15ch] font-display text-[clamp(42px,6vw,72px)] font-bold leading-none tracking-[-0.035em] text-strong [text-wrap:balance]">
            Bhutan NDI <Emphasis>for users</Emphasis>
          </h1>
          <p className="mt-[22px] max-w-[600px] text-[17px] leading-[1.62] text-muted [text-wrap:pretty]">
            Your citizenship, your degree, your license — issued straight to your phone and shared
            only when you tap to consent.
          </p>
        </Reveal>

        {/* Credential fan — the real wallet cards */}
        <Reveal delay={0.05} className="relative mt-16 flex items-center justify-center">
          {credentialCards.map((card) => (
            <div
              key={card.id}
              className="relative"
              style={{
                zIndex: card.z,
                opacity: card.opacity,
                transform: `rotate(${card.rotate}deg) translateX(${card.translateX})`,
              }}
            >
              <Image
                src={mediaUrl(card.image)}
                alt={card.image.alt}
                width={card.image.width}
                height={card.image.height}
                priority
                className="block h-auto rounded-xl"
                style={{
                  width: card.width,
                  boxShadow: "0 26px 54px -22px rgba(0,0,0,0.85)",
                }}
              />
            </div>
          ))}
        </Reveal>

        <Reveal
          delay={0.1}
          className="mt-[100px] flex flex-wrap justify-center gap-x-[150px] gap-y-10 text-left"
        >
          {stats.map((stat) => (
            <div key={stat.id}>
              <div className="font-display text-[34px] font-semibold tracking-[-0.02em] text-strong">
                {stat.value}
              </div>
              <div className="mt-2 font-mono text-[11.5px] uppercase tracking-[0.16em] text-faint">
                {stat.label}
              </div>
            </div>
          ))}
        </Reveal>
      </PageSection>

      {/* ============ USE CASES ============ */}
      <PageSection id="use-cases" className="py-16">
        <Reveal>
          <SubSectionHeader
            eyebrow="— Use cases"
            title="What you can do today"
            lead="Five everyday things your wallet handles — each one takes minutes instead of days."
          />
        </Reveal>

        {/* Bento at desktop; a plain stack below, where the grid areas make no sense. */}
        <Reveal delay={0.05} className="mt-9 flex flex-col gap-4 min-[1001px]:grid min-[1001px]:grid-cols-12 min-[1001px]:grid-rows-2">
          {useCases.map((useCase) => (
            <div
              key={useCase.id}
              className="min-[1001px]:[grid-area:var(--area)]"
              style={{ "--area": useCase.gridArea } as React.CSSProperties}
            >
              <SpotlightCard className="h-full">
                <span className="inline-flex h-6 flex-none items-center text-accent">
                  <Icon name={useCase.icon} size={22} />
                </span>
                <h3 className="font-display text-[18px] font-semibold leading-[1.28] text-strong">
                  {useCase.title}
                </h3>
                <p className="text-[14px] leading-[1.6] text-muted [text-wrap:pretty]">
                  {useCase.description}
                </p>
                {useCase.tutorialHref ? (
                  <a
                    href={useCase.tutorialHref}
                    className="ndi-tut mt-auto inline-flex items-center gap-2 pt-2 font-display text-[13.5px] font-semibold text-accent"
                  >
                    Watch tutorial
                    <Icon name="arrowRight" size={14} strokeWidth={1.9} />
                  </a>
                ) : null}
              </SpotlightCard>
            </div>
          ))}
        </Reveal>
      </PageSection>

      {/* ============ NDI IN ACTION ============ */}
      <DechenJourney chapters={chapters} strip={journeyStrip} />

      {/* ============ BENEFITS ============ */}
      <PageSection className="py-16">
        <Reveal>
          <SubSectionHeader eyebrow="— Why it helps" title="Benefits of the NDI Wallet" />
        </Reveal>
        <div className="mt-9 grid grid-cols-1 gap-4 min-[701px]:grid-cols-2 min-[1101px]:grid-cols-3">
          {benefits.map((benefit, index) => (
            <Reveal key={benefit.id} delay={0.05 * (index + 1)} className="h-full">
              <SpotlightCard>
                <span className="inline-flex h-6 flex-none items-center text-accent">
                  <Icon name={benefit.icon} size={22} />
                </span>
                <h3 className="font-display text-[17px] font-semibold text-strong">
                  {benefit.title}
                </h3>
                <p className="text-[14px] leading-[1.6] text-muted [text-wrap:pretty]">
                  {benefit.description}
                </p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </PageSection>

      {/* ============ GET STARTED ============ */}
      <PageSection id="get-started" className="pb-[104px] pt-16">
        <Reveal className="grid grid-cols-1 items-start gap-10 min-[901px]:grid-cols-2 min-[901px]:gap-14">
          <div>
            <SubSectionHeader
              eyebrow="— Get started"
              title="Three steps to your digital identity"
              lead="Registration takes a few minutes and only needs to happen once."
            />
            <StoreButtons />
          </div>

          <div className="flex flex-col">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`flex items-center gap-5 py-5 ${
                  index > 0 ? "border-t border-subtle" : ""
                }`}
              >
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-grid font-mono text-[13px] text-accent">
                  {step.number}
                </span>
                <span className="text-[16px] leading-[1.5] text-body">{step.text}</span>
              </div>
            ))}

            <div className="mt-6 flex flex-wrap gap-4">
              <Link href="/faqs" className="font-display text-sm font-semibold text-accent">
                Read the FAQs →
              </Link>
              <Link href="/#contact" className="font-display text-sm font-semibold text-muted">
                Need help? Contact us →
              </Link>
            </div>
          </div>
        </Reveal>
      </PageSection>
    </>
  );
}
