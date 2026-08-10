import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Emphasis, PageSection, SubSectionHeader } from "@/components/layout/PageHero";
import { DechenJourney } from "@/components/pages/DechenJourney";
import { UseCaseCards } from "@/components/pages/UseCaseCards";
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
      <PageSection className="pb-10 pt-[172px] text-center">
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
              className="ndi-credential"
              style={
                {
                  "--card-rotate": `${card.rotate}deg`,
                  "--card-shift": card.translateX,
                  "--card-opacity": card.opacity,
                  "--card-z": card.z,
                } as React.CSSProperties
              }
            >
              <Image
                src={mediaUrl(card.image)}
                alt={card.image.alt}
                width={card.image.width}
                height={card.image.height}
                // The artwork is only 300px wide, so it is already being
                // upscaled on screen; a lossy re-encode on top of that is what
                // tips it from soft into visibly mushy.
                quality={95}
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
      <PageSection id="use-cases" className="py-[72px]">
        <Reveal>
          <SubSectionHeader
            eyebrow="— Use cases"
            title="What you can do today"
            size="clamp(30px,3.6vw,44px)"
            maxWidth={700}
            leadSize={16}
            lead="Five everyday things your wallet handles — each one takes minutes instead of days."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <UseCaseCards useCases={useCases} />
        </Reveal>
      </PageSection>

      {/* ============ NDI IN ACTION ============ */}
      <DechenJourney chapters={chapters} strip={journeyStrip} />

      {/* ============ BENEFITS ============ */}
      <PageSection className="py-[72px]">
        {/* Larger heading than the shared subpage scale — this section's own. */}
        <Reveal className="max-w-[700px]">
          <Eyebrow>— Why it helps</Eyebrow>
          <h2 className="mt-4 font-display text-[clamp(30px,3.6vw,44px)] font-semibold leading-[1.08] tracking-[-0.03em] text-strong">
            Benefits of the NDI Wallet
          </h2>
        </Reveal>

        {/* Five across at desktop, as designed; stepped down so the cards stay
            readable on the widths the design leaves unspecified. */}
        <Reveal
          delay={0.05}
          className="mt-10 grid grid-cols-1 gap-[18px] min-[561px]:grid-cols-2 min-[901px]:grid-cols-3 min-[1101px]:grid-cols-5"
        >
          {benefits.map((benefit) => (
            <SpotlightCard key={benefit.id} className="h-full" gap={0}>
              <span className="inline-flex h-[26px] items-center text-accent">
                <Icon name={benefit.icon} size={24} />
              </span>
              <h3 className="mb-1.5 mt-[18px] font-display text-[18px] font-semibold text-strong">
                {benefit.title}
              </h3>
              <p className="text-[14px] leading-[1.55] text-muted [text-wrap:pretty]">
                {benefit.description}
              </p>
            </SpotlightCard>
          ))}
        </Reveal>
      </PageSection>

      {/* ============ GET STARTED ============ */}
      <PageSection id="get-started" className="pb-[104px] pt-[72px]">
        <Reveal
          className="relative grid grid-cols-1 items-center gap-8 overflow-hidden rounded-3xl border border-grid p-9 min-[901px]:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] min-[901px]:gap-12 min-[901px]:p-14"
          style={{
            background: "linear-gradient(162deg, #103440 0%, #101827 64%)",
            boxShadow: "var(--inset-top), 0 24px 60px rgba(0,0,0,0.34)",
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-[60px] -top-[120px] h-[360px] w-[520px]"
            style={{
              background: "radial-gradient(circle, rgba(90,201,148,0.20), transparent 70%)",
              filter: "blur(14px)",
            }}
          />

          <div className="relative">
            <Eyebrow>— Get started</Eyebrow>
            <h2 className="mt-4 font-display text-[clamp(28px,3.2vw,40px)] font-semibold leading-[1.1] tracking-[-0.03em] text-strong">
              Three steps to your digital identity
            </h2>
            <p className="mt-4 max-w-[460px] text-[15.5px] leading-[1.62] text-muted">
              Registration takes a few minutes and only needs to happen once.
            </p>
            <StoreButtons />
          </div>

          {/* Each step is its own bordered card, then the two help links. */}
          <div className="relative flex flex-col gap-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="flex items-center gap-4 rounded-xl border border-grid px-5 py-[18px]"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <span className="font-mono text-[11px] text-accent">{step.number}</span>
                <span className="text-[15px] text-strong">{step.text}</span>
              </div>
            ))}

            <div className="mt-2 flex flex-wrap gap-3">
              <Link
                href="/faqs"
                className="ndi-outline-link inline-flex items-center gap-2 rounded-xl border border-grid px-[18px] py-3 font-display text-sm font-medium text-strong"
              >
                Read the FAQs
              </Link>
              <Link
                href="/#contact"
                className="ndi-outline-link inline-flex items-center gap-2 rounded-xl border border-grid px-[18px] py-3 font-display text-sm font-medium text-strong"
              >
                Need help? Contact us
              </Link>
            </div>
          </div>
        </Reveal>
      </PageSection>
    </>
  );
}
